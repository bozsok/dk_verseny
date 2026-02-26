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

    initThreeJs() {
        this.scene = new THREE.Scene();

        // Fullscreen orthographic camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimalizáció

        // --- 1. ZAJ TEXTÚRA GENERÁLÁSA iChannel0 SZÁMÁRA ---
        // A Shadertoy textúra (iChannel0) hiánya matematikai hash-t igényelt korábban, ami rángatott.
        // Visszatérünk az eredeti ShaderToy módszerhez egy DataTexture zajjal.
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
            
            varying vec2 vUv;

            #define time iTime*0.15
            #define tau 6.2831853

            mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
            
            // AZ EREDETI TEXTÚRA ALAPÚ ZAJ (Ez adja az eredeti lágy pulzálást!)
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
                vec2 p = fragCoord.xy / iResolution.xy - 0.5;
            p.x *= iResolution.x / iResolution.y;
                // Fix eredeti ShaderToy méret (A forráskódban a lencse kintrébb is helyezkedik el a "p *= 4" miatt)
                p *= 4.0;
                vec2 p_scaled = p;
                
                float rz = dualfbm(p_scaled);

                rz *= abs((-circ(vec2(p_scaled.x / 4.2, p_scaled.y / 7.0))));
                rz *= abs((-circ(vec2(p_scaled.x / 4.2, p_scaled.y / 7.0))));
                rz *= abs((-circ(vec2(p_scaled.x / 4.2, p_scaled.y / 7.0))));
                
                vec3 col = vec3(.1, 0.1, 0.4) / rz;
                col = pow(abs(col), vec3(.99));

                // ALPHA KISZÁMÍTÁSA A LÁTHATÓSÁGHOZ (Ettől még az eredeti shadertoy algoritmus fut!)
                float luma = dot(col, vec3(0.299, 0.587, 0.114));
                float alphaOuter = smoothstep(0.02, 0.25, luma);

                // 2. Belső lyuk kialakítása (A "fánk" közepe maradjon átlátszó)
                vec2 unscaled_p = p_scaled;
                // ÁLLÓ ELLIPSZIS LÉTREHOZÁSA (A y-t torzítjuk az 1.666 arányszámmal)
                unscaled_p.y /= 1.666; 
                float dist = length(unscaled_p);
                
                // Mivel Y osztva lett, X-en a sugár 0.09, Y-on 0.15 marad (álló)
                float alphaInner = smoothstep(0.09, 0.20, dist);

                float finalAlpha = alphaOuter * alphaInner;

                gl_FragColor = vec4(col, finalAlpha);
        }
        `;

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                iTime: { value: 0.0 },
                iChannel0: { value: noiseTexture }
            },
            transparent: true,
            blending: THREE.NormalBlending
        });

        this.plane = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.plane);
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

            // Nincs CSS maszk tágulás!
            // Nincs Shader lencsetágulás!

            // Csak sima WebGL renderelés, kizárólag az idő telik (zajpulzálás)
            if (this.material) {
                this.material.uniforms.iTime.value = elapsed / 1000.0;
            }

            this.renderer.render(this.scene, this.camera);

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
