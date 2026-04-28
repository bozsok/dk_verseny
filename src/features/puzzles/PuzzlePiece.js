/**
 * PuzzlePiece.js
 * Egyedi HTML/CSS alapú puzzle darabka Glassmorphism effekttel.
 *
 * „Egy fal, sok ablak" koncepció:
 * A teljes kódfalat rendereljük, de eltoljuk a darab (kx, ky) pozíciójára,
 * és jigsaw clip-path-tal vágjuk ki az adott terület.
 */

import { puzzleService } from './PuzzleService.js';

export class PuzzlePiece {
    /**
     * @param {Object} options 
     * @param {number} options.index - A darabka indexe (0-14)
     * @param {boolean} options.isPulsing - Pulzáljon-e a darabka
     */
    constructor(options = {}) {
        this.index = options.index;
        this.isPulsing = options.isPulsing || false;

        this.data = puzzleService.getPiece(this.index);
        this.element = null;
        this._handlers = [];
    }

    /**
     * A komponens DOM elemének létrehozása.
     * A teljes kódfalat rendereli, de clip-path-tal csak a darab területét mutatja.
     */
    render() {
        if (!this.data) return null;

        const w = this.data.pieceW || 400;
        const h = this.data.pieceH || 360;
        const pad = 130; // Ráhagyás a jigsaw fülek/lyukak számára (max fülkinyúlás ~120px)
        const fullW = w + pad * 2;
        const fullH = h + pad * 2;

        const kx = this.data.col;
        const ky = this.data.row;
        const nx = this.data.config.nx;
        const ny = this.data.config.ny;
        const mc = this.data.masterConfig;

        // Teljes fal méretei
        const wallWidth = w * nx;
        const wallHeight = h * ny;

        const pathStr = this.generatePathString(w, h, pad);

        this.element = document.createElement('div');
        this.element.className = 'dkv-puzzle-piece';
        Object.assign(this.element.style, {
            width: `${fullW}px`,
            height: `${fullH}px`,
            position: 'relative'
        });

        // 1. Tartalom réteg – háttérszín + kódfal EGYBEN, egy clip-path alatt
        //    (Két külön div-nél a böngésző eltérő időben rajzolta ki őket → szellemkép)
        const content = document.createElement('div');
        content.className = 'dkv-puzzle-piece__content';
        Object.assign(content.style, {
            position: 'absolute',
            top: '0', left: '0',
            width: `${fullW}px`,
            height: `${fullH}px`,
            overflow: 'hidden',
            zIndex: '2',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // háttérszín a darabnak
            clipPath: `path('${pathStr}')`,
            webkitClipPath: `path('${pathStr}')`
        });

        // 2. SVG réteg – NEM clip-pathelve, így a teljes stroke + glow LÁTHATÓ
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", fullW);
        svg.setAttribute("height", fullH);
        svg.setAttribute("viewBox", `0 0 ${fullW} ${fullH}`);
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = "4";
        svg.style.pointerEvents = "none";

        const defs = document.createElementNS(svgNS, "defs");
        defs.innerHTML = `
            <filter id="glow-${this.data.index}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        `;
        svg.appendChild(defs);

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathStr);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "rgba(255, 255, 255, 0.6)");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("filter", `url(#glow-${this.data.index})`);

        svg.appendChild(path);
        this.element.appendChild(svg);

        // Belső konténer: a teljes kódfal DOM klónja (gyorsítótárból)
        const wallContainer = puzzleService.getWallDOMClone();

        const offsetX = pad - kx * w;
        const offsetY = pad - ky * h;

        Object.assign(wallContainer.style, {
            position: 'absolute',
            left: `${offsetX}px`,
            top: `${offsetY}px`,
            width: `${wallWidth}px`,
            height: `${wallHeight}px`,
            padding: `${mc.padding}px`,
            boxSizing: 'border-box',
            backgroundColor: 'transparent'
        });

        content.appendChild(wallContainer);
        this.element.appendChild(content);

        return this.element;
    }

    /**
     * Nincs szükség külön applyGeometry-re, mert a renderben benne van.
     */
    applyGeometry() { }

    /**
     * Jigsaw útvonal generálása a darabka oldalai alapján.
     */
    generatePathString(w, h, p) {
        const geo = this.data.geometry;
        const kx = geo.kx;
        const ky = geo.ky;

        // Segédfüggvény a grid-pixel konverzióhoz (w/h most már a 400/300)
        const toX = (gridX) => p + (gridX - kx) * w;
        const toY = (gridY) => p + (gridY - ky) * h;

        let path = '';

        // Az oldalak sorrendben: Top, Right, Bottom, Left
        const sides = [geo.ts, geo.rs, geo.bs, geo.ls];

        sides.forEach((side, sIdx) => {
            if (side.segments && side.segments.length > 0) {
                side.segments.forEach((seg, i) => {
                    if (sIdx === 0 && i === 0) {
                        path += `M ${toX(seg.p0.x)},${toY(seg.p0.y)} `;
                    }

                    // Ha a kontrollpontok megegyeznek a végpontokkal, az egy egyenes vonal
                    if (seg.p0.x === seg.p1.x && seg.p0.y === seg.p1.y &&
                        seg.p2.x === seg.p3.x && seg.p2.y === seg.p3.y) {
                        path += `L ${toX(seg.p3.x)},${toY(seg.p3.y)} `;
                    } else {
                        // Köbös Bézier görbe
                        path += `C ${toX(seg.p1.x)},${toY(seg.p1.y)} ${toX(seg.p2.x)},${toY(seg.p2.y)} ${toX(seg.p3.x)},${toY(seg.p3.y)} `;
                    }
                });
            } else {
                // Fallback ha nincsenek szegmensek (egyenes él)
                const p1 = side.points[0];
                const p2 = side.points[1];
                if (sIdx === 0) path += `M ${toX(p1.x)},${toY(p1.y)} `;
                path += `L ${toX(p2.x)},${toY(p2.y)} `;
            }
        });

        return path + ' Z';
    }

    /**
     * Erőforrások felszabadítása.
     */
    destroy() {
        this._handlers.forEach(h => h.target.removeEventListener(h.type, h.handler));
        this._handlers = [];
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
