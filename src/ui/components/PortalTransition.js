import * as THREE from 'three';

export class PortalTransition {
    constructor(options) {
        this.portalVideoSrc = options.portalVideoSrc; // Már nem használjuk, de API compatibilitás miatt marad
        this.newSlideHtml = options.newSlideHtml;
        this.animationConfig = options.animationConfig || {
            duration: 2500,
            keyframes: [
                { time: 0, maskRadius: 0 },
                { time: 0.2, maskRadius: 5 },
                { time: 0.6, maskRadius: 30 },
                { time: 0.8, maskRadius: 80 },
                { time: 1.0, maskRadius: 150 } // CSS sugarak
            ]
        };
        this.onComplete = options.onComplete || (() => { });

        this.clickBlocker = null;
        this.maskContainer = null;
        this.animationFrameId = null;

        // Three.js elemek
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.material = null;
        this.plane = null;

        // Részecske rendszer
        this.particleScene = null;
        this.particleMaterial = null;
        this.particleGeometry = null;
        this.particles = null;
        this.particleData = []; // Egyedi pálya-paraméterek

        this._handleResize = this._handleResize.bind(this);
    }

    createElement() {
        const fragment = document.createDocumentFragment();

        // 1. Kattintási események blokkolása a tranzíció alatt
        this.clickBlocker = document.createElement('div');
        this.clickBlocker.className = 'dkv-portal-click-blocker';
        fragment.appendChild(this.clickBlocker);

        // 2. Háttér/Maszk konténer (Ebben van az új dia, ami fokozatosan láthatóvá válik)
        this.maskContainer = document.createElement('div');
        this.maskContainer.className = 'dkv-portal-mask-container';

        if (this.newSlideHtml) {
            this.maskContainer.appendChild(this.newSlideHtml);
        }
        fragment.appendChild(this.maskContainer);

        // 3. Three.js WebGL vászon
        this.initThreeJs();
        if (this.renderer) {
            this.renderer.domElement.className = 'dkv-portal-canvas';
            fragment.appendChild(this.renderer.domElement);
        }

        window.addEventListener('resize', this._handleResize);

        return fragment;
    }

    // === RADIÁLIS GRADIENS TEXTÚRA RÉSZECSKÉKHEZ ===
    _createGlowTexture() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Radiális gradiens: fehér közép → átlátszó szél
        const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0,
            size / 2, size / 2, size / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(200, 220, 255, 0.3)');
        gradient.addColorStop(0.7, 'rgba(150, 180, 255, 0.05)');
        gradient.addColorStop(1.0, 'rgba(100, 150, 255, 0.0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // === RÉSZECSKE RENDSZER INICIALIZÁLÁSA ===
    _initParticles() {
        this.particleScene = new THREE.Scene();

        const PARTICLE_COUNT = 4;
        this.particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);

        // Egyedi pálya-paraméterek generálása minden részecskéhez
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const h1 = Math.sin(i * 127.1) * 311.7 % 1;
            const h2 = Math.sin(i * 269.5) * 183.3 % 1;
            const h3 = Math.sin(i * 419.2) * 547.9 % 1;
            const h4 = Math.sin(i * 631.3) * 729.1 % 1;

            this.particleData.push({
                speed: 1.2 + Math.abs(h1) * 2.0,           // Keringési sebesség
                radius: 0.03 + Math.abs(h2) * 0.04,        // Pályasugár (szoros!)
                tiltAngle: (Math.abs(h3) - 0.5) * 1.4,     // Pályasík döntése
                phaseOffset: Math.abs(h4) * Math.PI * 2,    // Kezdő fázis
                baseSize: 15 + Math.abs(h3) * 20            // Pont méret pixelben
            });

            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            sizes[i] = 0;
        }

        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const glowTexture = this._createGlowTexture();

        // Vertex shader: egyedi méret gl_PointSize-nak
        const particleVS = `
            attribute float size;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Fragment shader: textúra alapú fénypont
        const particleFS = `
            uniform sampler2D uTexture;
            void main() {
                vec4 texColor = texture2D(uTexture, gl_PointCoord);
                gl_FragColor = texColor;
            }
        `;

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: glowTexture }
            },
            vertexShader: particleVS,
            fragmentShader: particleFS,
            transparent: true,
            blending: THREE.AdditiveBlending,   // !!! ADDITÍV = igazi ragyogás
            depthWrite: false,
            depthTest: false
        });

        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.particleScene.add(this.particles);
    }

    // === RÉSZECSKE POZÍCIÓK FRISSÍTÉSE ===
    _updateParticles(time, phase) {
        if (!this.particleGeometry) return;

        const positions = this.particleGeometry.attributes.position.array;
        const sizes = this.particleGeometry.attributes.size.array;
        const aspect = window.innerWidth / window.innerHeight;

        for (let i = 0; i < this.particleData.length; i++) {
            const pd = this.particleData[i];

            // Sugár animáció: fokozatos megjelenés, stabil pálya
            const orbitRadius = Math.min(phase / 0.2, 1.0) * pd.radius;

            // Alfa / méret animáció: fade-in 0–0.1, fade-out 0.75–0.95
            let alpha = Math.min(phase / 0.1, 1.0);
            if (phase > 0.75) alpha *= Math.max(1.0 - (phase - 0.75) / 0.2, 0.0);

            // 3D pozíció számítás döntött pályasíkkal
            const angle = time * pd.speed + pd.phaseOffset;
            const x3d = Math.cos(angle) * orbitRadius;
            const yFlat = Math.sin(angle) * orbitRadius;
            const y3d = yFlat * Math.cos(pd.tiltAngle);

            // Ortografikus kamera -1..1 tartomány, aspect ratio korrekció
            positions[i * 3] = x3d / aspect * 2.0;  // X: aspect-kompenzált
            positions[i * 3 + 1] = y3d * 2.0;       // Y
            positions[i * 3 + 2] = 0;

            // Méret: pixelben, alfa-skálázott
            sizes[i] = pd.baseSize * alpha * Math.min(window.devicePixelRatio, 2);
        }

        this.particleGeometry.attributes.position.needsUpdate = true;
        this.particleGeometry.attributes.size.needsUpdate = true;
    }

    initThreeJs() {
        this.scene = new THREE.Scene();

        // Fullscreen orthographic camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.autoClear = false; // !!! Két pass rendereléshez kell

        // --- 1. ZAJ TEXTÚRA GENERÁLÁSA iChannel0 SZÁMÁRA ---
        const size = 256;
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size * size * 4; i += 4) {
            const val = Math.floor(Math.random() * 255);
            data[i] = val;     // R
            data[i + 1] = val; // G
            data[i + 2] = val; // B
            data[i + 3] = 255; // A
        }
        const noiseTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        noiseTexture.wrapS = THREE.RepeatWrapping;
        noiseTexture.wrapT = THREE.RepeatWrapping;
        noiseTexture.magFilter = THREE.LinearFilter;
        noiseTexture.minFilter = THREE.LinearMipMapLinearFilter;
        noiseTexture.generateMipmaps = true;
        noiseTexture.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry(2, 2);

        // GLSL Shader összerakása
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec2 iResolution;
            uniform float iTime;
            uniform sampler2D iChannel0;
            uniform float uOpen;  // 0.0-1.0: portál nyitás (ease-out)
            
            varying vec2 vUv;

            #define time iTime*0.15
            #define tau 6.2831853

            mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
            
            float noise( in vec2 x ){return texture2D(iChannel0, x*.01).x;}

            float fbm(in vec2 p)
            {	
                vec4 tt=fract(vec4(time*2.)+vec4(0.0,0.25,0.5,0.75));
                vec2 p1=p-normalize(p)*tt.x;
                vec2 p2=vec2(1.0)+p-normalize(p)*tt.y;
                vec2 p3=vec2(2.0)+p-normalize(p)*tt.z;
                vec2 p4=vec2(3.0)+p-normalize(p)*tt.w;
                vec4 tr=vec4(1.0)-abs(tt-vec4(0.5))*2.0;
                float z=2.;
                vec4 rz = vec4(0.);
            for (int i = 1; i < 4; i++)
            {
                rz += abs((vec4(noise(p1), noise(p2), noise(p3), noise(p4)) - vec4(0.5)) * 2.0) / z;
                z = z * 2.0;
                p1 = p1 * 2.0;
                p2 = p2 * 2.0;
                p3 = p3 * 2.0;
                p4 = p4 * 2.0;
            }
            return dot(rz, tr) * 0.25;
        }

            float dualfbm(in vec2 p)
        {
                vec2 p2 = p * .7;
                vec2 basis = vec2(fbm(p2 - time * 1.6), fbm(p2 + time * 1.7));
            basis = (basis - .5) * .2;
            p += basis;
            return fbm(p);
        }

            float circ(vec2 p)
        {
                float r = length(p);
            r = log(sqrt(r));
            return abs(mod(r * 2., tau) - 4.54) * 3. + .5;
        }

        void main() {
                vec2 fragCoord = vUv * iResolution;
                vec2 p_raw = fragCoord.xy / iResolution.xy - 0.5;
            p_raw.x *= iResolution.x / iResolution.y;

                // === PORTÁL – mindig végleges méretben, körkörös maszk szabályozza a láthatóságot ===
                vec2 p = p_raw;
                p *= 3.077; // Fix végleges méret (nincs kinagyítás!)
                
                float rz = dualfbm(p);

                rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
                rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
                rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
                
                vec3 col = vec3(.1, 0.1, 0.4) / rz;
                col = pow(abs(col), vec3(.99));

                // ALFA az eredeti portálszínből
                float luma = dot(col, vec3(0.299, 0.587, 0.114));
                float alphaOuter = smoothstep(0.02, 0.25, luma);

                // Belső lyuk (fánk közepe átlátszó)
                vec2 hole_p = p;
                hole_p.y /= 1.666; 
                float dist = length(hole_p);
                float alphaInner = smoothstep(0.09, 0.20, dist);

                // CORE GLOW (belső perem izzás)
                float glowZone = smoothstep(0.20, 0.09, dist) * smoothstep(0.02, 0.09, dist);
                col += vec3(0.3, 0.5, 1.0) * glowZone * 0.5 * uOpen;

                // KÖRKÖRÖS MASZK: uOpen szabályozza a látható terület sugarát
                // uOpen=0 → pont (0.001), uOpen=1 → teljes portál (0.5)
                float maskRadius = mix(0.001, 0.5, uOpen);
                float maskDist = length(p_raw);
                float mask = smoothstep(maskRadius, maskRadius * 0.7, maskDist);

                float finalAlpha = alphaOuter * alphaInner * mask;

                gl_FragColor = vec4(col, finalAlpha);
        }
        `;

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                iTime: { value: 0.0 },
                iChannel0: { value: noiseTexture },
                uOpen: { value: 0.0 }
            },
            transparent: true,
            blending: THREE.NormalBlending
        });

        this.plane = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.plane);

        // === RÉSZECSKE RENDSZER INICIALIZÁLÁSA ===
        this._initParticles();
    }

    _handleResize() {
        if (this.renderer && this.material) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
        }
    }

    start() {
        if (!this.maskContainer || !this.renderer) return;

        let startTime = null;

        const updateAnimation = (timestamp) => {
            if (startTime === null) startTime = timestamp;

            const elapsed = timestamp - startTime;

            // === FÁZISLOGIKA ===
            let phase = 0, uFlash = 0, uOpen = 0;

            if (elapsed <= 4000) {
                // 1. FÁZIS: Anticipáció (0–4 mp) – részecskék keringenek
                phase = elapsed / 4000.0;
            } else {
                // 2. FÁZIS: Portál tágulás (4.0 mp+)
                phase = 1.0;
                const rawOpen = Math.min((elapsed - 4000) / 1000.0, 1.0);
                uOpen = 1 - Math.pow(1 - rawOpen, 3);
            }

            // Részecske pozíciók frissítése
            this._updateParticles(elapsed / 1000.0, phase);

            if (this.material) {
                this.material.uniforms.iTime.value = elapsed / 1000.0;
                this.material.uniforms.uOpen.value = uOpen;
            }

            // === KÉT PASS RENDERELÉS ===
            this.renderer.clear();

            // 1. PASS: Részecskék (ADDITÍV blending)
            if (elapsed <= 4000) {
                this.renderer.render(this.particleScene, this.camera);
            }

            // 2. PASS: Portál shader (csak 4mp után!)
            if (elapsed > 4000) {
                this.renderer.render(this.scene, this.camera);

                // MaskContainer clip-path: a portál belső lyukjával szinkronban
                // A shader-ben a lyuk: smoothstep(0.09, 0.20, dist) ahol dist = length(hole_p)
                // hole_p.y /= 1.666, és p = p_raw * 3.077
                // Tehát a belső átlátszó zóna p_raw-ban ≈ 0.029 sugár → ~2.9vw / ~4.8vh
                if (this.maskContainer) {
                    // Ovális: 4000ms-től indul, 0.5mp fade-in
                    const ovalProgress = Math.min(Math.max((elapsed - 4200) / 700, 0), 1);
                    this.maskContainer.style.opacity = ovalProgress;
                    this.maskContainer.style.clipPath = `ellipse(20vh 35vh at 50% 50%)`;
                }
            }

            this.animationFrameId = requestAnimationFrame(updateAnimation);
        };

        this.animationFrameId = requestAnimationFrame(updateAnimation);
    }

    /**
     * Lineáris interpoláció a keyfram-ek között a megadott időpillanatig
     */
    _calculateRadiusAtTime(progressTime) {
        const keyframes = this.animationConfig.keyframes;
        if (!keyframes || keyframes.length === 0) return 150;

        if (progressTime <= keyframes[0].time) return keyframes[0].maskRadius;
        if (progressTime >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].maskRadius;

        for (let i = 0; i < keyframes.length - 1; i++) {
            const startKf = keyframes[i];
            const endKf = keyframes[i + 1];

            if (progressTime >= startKf.time && progressTime <= endKf.time) {
                const t = (progressTime - startKf.time) / (endKf.time - startKf.time);
                return startKf.maskRadius + t * (endKf.maskRadius - startKf.maskRadius);
            }
        }
        return 150;
    }

    finish() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        window.removeEventListener('resize', this._handleResize);

        // Three.js cleanup
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.material) {
            this.material.dispose();
        }
        if (this.particleMaterial) {
            this.particleMaterial.dispose();
        }
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }

        if (this.maskContainer && this.maskContainer.parentNode) {
            this.maskContainer.parentNode.removeChild(this.maskContainer);
        }
        if (this.renderer && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        if (this.clickBlocker && this.clickBlocker.parentNode) {
            this.clickBlocker.parentNode.removeChild(this.clickBlocker);
        }

        // Befejeztük a teljes animációt
        this.onComplete();
    }
}
