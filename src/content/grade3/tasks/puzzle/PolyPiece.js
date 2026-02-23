import { mmin, mmax } from './puzzleGeometry.js';

export class PolyPiece {
    constructor(container, options) {
        this.container = container;
        this.id = options.id;
        this.pieces = options.pieces || [];
        this.puzzle = options.puzzle;
        this.position = options.position || { x: 0, y: 0 };
        this.viewportOffset = options.viewportOffset || { left: 0, top: 0 };
        this.zIndex = options.zIndex || 10;
        
        // Callbacks
        this.onMove = options.onMove;
        this.onDragStart = options.onDragStart;
        this.onDragEnd = options.onDragEnd;

        this.isDragging = false;
        
        this.element = document.createElement('canvas');
        this.element.className = 'puzzle-piece';
        this.element.style.position = 'fixed';
        this.element.style.pointerEvents = 'auto';
        this.element.style.zIndex = this.zIndex;
        
        this.container.appendChild(this.element);
        
        this.bounds = this.computeBoundsLocal();
        
        this.initEvents();
        this.updatePosition();
        this.drawImage();
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    updateData(newPieces, newPosition, newZIndex, newViewportOffset) {
        let changedBounds = false;
        if (newPieces && newPieces !== this.pieces) {
            this.pieces = newPieces;
            this.bounds = this.computeBoundsLocal();
            changedBounds = true;
        }
        if (newZIndex !== undefined) {
            this.zIndex = newZIndex;
            this.element.style.zIndex = this.zIndex;
        }
        if (newViewportOffset) {
            this.viewportOffset = newViewportOffset;
        }
        if (newPosition) {
            this.position = newPosition;
        }
        
        this.updatePosition();
        if (changedBounds) {
            this.drawImage();
        }
    }

    computeBoundsLocal() {
        if (!this.pieces || this.pieces.length === 0 || !this.puzzle?.scalex || !this.puzzle?.scaley) {
            return { minx: 0, miny: 0, maxx: 1, maxy: 1, pckxmin: 0, pckymin: 0, pckxmax: 1, pckymax: 1 };
        }
        let pckxmin = Infinity, pckymin = Infinity, pckxmax = -Infinity, pckymax = -Infinity;
        this.pieces.forEach(piece => {
            if (!piece) return;
            pckxmin = mmin(pckxmin, piece.kx);
            pckymin = mmin(pckymin, piece.ky);
            pckxmax = mmax(pckxmax, piece.kx + 1);
            pckymax = mmax(pckymax, piece.ky + 1);
        });
        if (!isFinite(pckxmin) || !isFinite(pckymin) || !isFinite(pckxmax) || !isFinite(pckymax)) {
            return { minx: 0, miny: 0, maxx: 1, maxy: 1, pckxmin: 0, pckymin: 0, pckxmax: 1, pckymax: 1 };
        }
        let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
        this.pieces.forEach(piece => {
            const b = piece?.getBounds?.(); 
            if (!b) return;
            minx = mmin(minx, b.minx); miny = mmin(miny, b.miny);
            maxx = mmax(maxx, b.maxx); maxy = mmax(maxy, b.maxy);
        });
        return { minx, miny, maxx, maxy, pckxmin, pckymin, pckxmax, pckymax };
    }

    computeRenderOffset() {
        const sx = this.puzzle?.scalex || 1; 
        const sy = this.puzzle?.scaley || 1;
        const MARGIN_FRAC = 0.25;
        const dx = (0.5 - MARGIN_FRAC) * sx;
        const dy = (0.5 - MARGIN_FRAC) * sy;
        return { dx, dy };
    }

    getCanvasPaddingPx() {
        const sx = this.puzzle?.scalex || 1; 
        const sy = this.puzzle?.scaley || 1;
        const MARGIN_FRAC = 0.25;
        return { left: MARGIN_FRAC * sx, right: MARGIN_FRAC * sx, top: MARGIN_FRAC * sy, bottom: MARGIN_FRAC * sy };
    }

    updatePosition() {
        const { dx, dy } = this.computeRenderOffset();
        this.element.style.left = `${this.position.x + (this.viewportOffset.left || 0) + dx}px`;
        this.element.style.top = `${this.position.y + (this.viewportOffset.top || 0) + dy}px`;
    }

    drawSide(ctx, side, offsx, offsy, isFirst) {
        if (!side?.points?.length) return;
        if (side.segments?.length) {
            side.segments.forEach((seg, idx) => {
                if (isFirst && idx === 0) ctx.moveTo(seg.p0.x + offsx, seg.p0.y + offsy);
                ctx.bezierCurveTo(seg.p1.x + offsx, seg.p1.y + offsy, seg.p2.x + offsx, seg.p2.y + offsy, seg.p3.x + offsx, seg.p3.y + offsy);
            });
        } else {
            const [p0, p1] = side.points; 
            if (isFirst) ctx.moveTo(p0.x + offsx, p0.y + offsy); 
            ctx.lineTo(p1.x + offsx, p1.y + offsy);
        }
    }

    drawImage() {
        const canvas = this.element; 
        if (!canvas || !this.puzzle || !this.pieces?.length) return;
        
        const { scalex, scaley } = this.puzzle; 
        if (!scalex || !scaley) return;
        
        const { pckxmin, pckymin, pckxmax, pckymax } = this.bounds;
        const nx = pckxmax - pckxmin, ny = pckymax - pckymin;
        const MARGIN_FRAC = 0.25; 
        
        const cw = (nx + 2 * MARGIN_FRAC) * scalex;
        const ch = (ny + 2 * MARGIN_FRAC) * scaley;
        const localOffsx = (pckxmin - MARGIN_FRAC) * scalex;
        const localOffsy = (pckymin - MARGIN_FRAC) * scaley;
        
        canvas.width = cw; 
        canvas.height = ch;
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, cw, ch);
        
        this.pieces.forEach(piece => {
            if (!piece) return; 
            ctx.save(); 
            ctx.beginPath();
            const sx = -localOffsx, sy = -localOffsy;
            
            this.drawSide(ctx, piece.ts, sx, sy, true);
            this.drawSide(ctx, piece.rs, sx, sy, false);
            this.drawSide(ctx, piece.bs, sx, sy, false);
            this.drawSide(ctx, piece.ls, sx, sy, false);
            
            ctx.closePath(); 
            ctx.clip();
            
            if (this.puzzle.gameCanvas) {
                const srcx = (pckxmin - MARGIN_FRAC) * scalex + (this.puzzle.offsx || 0);
                const srcy = (pckymin - MARGIN_FRAC) * scaley + (this.puzzle.offsy || 0);
                let srcw = cw, srch = ch;
                srcw = Math.min(srcw, this.puzzle.gameCanvas.width - srcx);
                srch = Math.min(srch, this.puzzle.gameCanvas.height - srcy);
                
                try { 
                    ctx.drawImage(this.puzzle.gameCanvas, srcx, srcy, srcw, srch, 0, 0, srcw, srch); 
                } catch (e) { 
                    console.error('Canvas draw error', e); 
                }
            } else {
                ctx.fillStyle = '#8884'; 
                ctx.fill();
            }
            ctx.restore();
        });
        
        // Outline
        ctx.save();
        let borderColor = '#b8a082';
        try { 
            const css = getComputedStyle(document.documentElement); 
            const v = css.getPropertyValue('--button-border'); 
            if (v && v.trim()) borderColor = v.trim(); 
        } catch { void 0; }
        
        ctx.lineJoin = 'round'; 
        ctx.lineCap = 'round'; 
        ctx.strokeStyle = borderColor; 
        ctx.lineWidth = 2;
        
        this.pieces.forEach(piece => { 
            if (!piece) return; 
            const sx = -localOffsx, sy = -localOffsy; 
            ctx.beginPath(); 
            this.drawSide(ctx, piece.ts, sx, sy, true); 
            this.drawSide(ctx, piece.rs, sx, sy, false); 
            this.drawSide(ctx, piece.bs, sx, sy, false); 
            this.drawSide(ctx, piece.ls, sx, sy, false); 
            ctx.closePath(); 
            ctx.stroke(); 
        });
        ctx.restore();
    }

    getViewportMetrics() {
        try {
            const vv = window.visualViewport;
            if (vv && typeof vv.width === 'number' && typeof vv.height === 'number') {
                return { left: vv.offsetLeft || 0, top: vv.offsetTop || 0, width: vv.width, height: vv.height };
            }
        } catch { /* no-op */ }
        try {
            const de = document.documentElement;
            const r = de.getBoundingClientRect();
            return { left: r.left || 0, top: r.top || 0, width: de.clientWidth, height: de.clientHeight };
        } catch { /* no-op */ }
        return { left: 0, top: 0, width: window.innerWidth || 0, height: window.innerHeight || 0 };
    }

    initEvents() {
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        
        this.element.addEventListener('mousemove', (e) => {
            if (this.isDragging) return;
            try { 
                const rect = this.element.getBoundingClientRect(); 
                const lx = Math.floor(e.clientX - rect.left); 
                const ly = Math.floor(e.clientY - rect.top); 
                const ctx = this.element.getContext('2d', { willReadFrequently: true }); 
                const alpha = ctx.getImageData(lx, ly, 1, 1).data[3]; 
                this.element.style.cursor = alpha ? 'grab' : 'default'; 
            } catch { 
                this.element.style.cursor = 'grab'; 
            }
        });

        this.element.addEventListener('mouseleave', () => { 
            if (!this.isDragging) { 
                this.element.style.cursor = 'default'; 
            } 
        });
        
        // Bind for window events
        this._windowMouseMove = this.handleWindowMouseMove.bind(this);
        this._windowMouseUp = this.handleWindowMouseUp.bind(this);
    }

    handleMouseDown(e) {
        if (e.button !== 0) return; // Only left click

        const rect = this.element.getBoundingClientRect();
        this.startXCanvas = e.clientX - rect.left; 
        this.startYCanvas = e.clientY - rect.top;
        
        // Transparent hit rejection
        try { 
            const ctx = this.element.getContext('2d', { willReadFrequently: true }); 
            if (!ctx.getImageData(Math.floor(this.startXCanvas), Math.floor(this.startYCanvas), 1, 1).data[3]) { 
                const pe = this.element.style.pointerEvents; 
                this.element.style.pointerEvents = 'none'; 
                const below = document.elementFromPoint(e.clientX, e.clientY); 
                if (below) below.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY })); 
                this.element.style.pointerEvents = pe; 
                return; 
            } 
        } catch { void 0; }
        
        this.isDragging = true;
        this.element.classList.add('dragging');
        this.element.style.cursor = 'grabbing';
        
        this.prevBodyOverflow = document.body.style.overflow; 
        this.prevHtmlOverflow = document.documentElement.style.overflow; 
        this.prevOverscroll = document.documentElement.style.overscrollBehavior;
        
        document.body.style.overflow = 'hidden'; 
        document.documentElement.style.overflow = 'hidden'; 
        document.documentElement.style.overscrollBehavior = 'none';
        
        if (this.onDragStart) this.onDragStart(this.id);

        window.addEventListener('mousemove', this._windowMouseMove);
        window.addEventListener('mouseup', this._windowMouseUp);
    }

    handleWindowMouseMove(ev) {
        if (!this.isDragging) return;
        try { ev.preventDefault(); } catch { void 0; }
        
        const { dx, dy } = this.computeRenderOffset();
        const canvas = this.element;
        
        let targetCanvasLeft = ev.clientX - this.startXCanvas; 
        let targetCanvasTop = ev.clientY - this.startYCanvas;
        
        try {
            const vp = this.getViewportMetrics();
            const pieceW = canvas.width || 0; 
            const pieceH = canvas.height || 0;
            const pad = this.getCanvasPaddingPx();
            
            const minCanvasLeft = vp.left - pad.left;
            const minCanvasTop = vp.top - pad.top;
            const maxCanvasLeft = vp.left + vp.width - (pieceW - pad.right);
            const maxCanvasTop = vp.top + vp.height - (pieceH - pad.bottom);
            
            targetCanvasLeft = Math.min(Math.max(targetCanvasLeft, minCanvasLeft), Math.max(minCanvasLeft, maxCanvasLeft));
            targetCanvasTop = Math.min(Math.max(targetCanvasTop, minCanvasTop), Math.max(minCanvasTop, maxCanvasTop));
        } catch { void 0; }
        
        const newLogicalX = targetCanvasLeft - (this.viewportOffset.left || 0) - dx;
        const newLogicalY = targetCanvasTop - (this.viewportOffset.top || 0) - dy;
        const np = { x: newLogicalX, y: newLogicalY };
        
        this.position = np;
        this.updatePosition();
        
        if (this.onMove) this.onMove(this.id, np);
    }

    handleWindowMouseUp(ev) {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.element.classList.remove('dragging');
        this.element.style.cursor = 'grab';
        
        window.removeEventListener('mousemove', this._windowMouseMove); 
        window.removeEventListener('mouseup', this._windowMouseUp);
        
        try {
            const { dx, dy } = this.computeRenderOffset();
            const canvas = this.element; 
            const vp = this.getViewportMetrics();
            const pieceW = canvas.width || 0; 
            const pieceH = canvas.height || 0;
            const pad = this.getCanvasPaddingPx();
            
            const minCanvasLeft = vp.left - pad.left;
            const minCanvasTop = vp.top - pad.top;
            const maxCanvasLeft = vp.left + vp.width - (pieceW - pad.right);
            const maxCanvasTop = vp.top + vp.height - (pieceH - pad.bottom);
            
            let canvasLeft = this.position.x + (this.viewportOffset.left || 0) + dx;
            let canvasTop = this.position.y + (this.viewportOffset.top || 0) + dy;
            
            canvasLeft = Math.min(Math.max(canvasLeft, minCanvasLeft), Math.max(minCanvasLeft, maxCanvasLeft));
            canvasTop = Math.min(Math.max(canvasTop, minCanvasTop), Math.max(minCanvasTop, maxCanvasTop));
            
            const fx = canvasLeft - (this.viewportOffset.left || 0) - dx;
            const fy = canvasTop - (this.viewportOffset.top || 0) - dy;
            
            this.position = { x: fx, y: fy };
            this.updatePosition();
            
            if (this.onDragEnd) this.onDragEnd(this.id, { x: fx, y: fy });
        } catch (err) { 
            console.warn('onDragEnd error', err); 
        }
        
        document.body.style.overflow = this.prevBodyOverflow; 
        document.documentElement.style.overflow = this.prevHtmlOverflow; 
        document.documentElement.style.overscrollBehavior = this.prevOverscroll;
    }
}
