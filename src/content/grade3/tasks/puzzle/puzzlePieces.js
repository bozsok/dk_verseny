// Puzzle piece classes for classic jigsaw puzzle
// Extracted and adapted from original implementation

import { Point, Segment } from './puzzleGeometry.js';

// Local debug flag for geometry/piece operations
const DEBUG_PIECES = false;
const dlog = (...args) => { if (DEBUG_PIECES) console.log(...args); };

// Side class representing one edge of a puzzle piece
export class Side {
  constructor() {
    this.points = [];
    this.segments = [];
    this.type = "d"; // d=direct, o=outward, i=inward
  }

  drawPath(path, shiftx = 0, shifty = 0, addSeg = true) {
    if (this.segments.length === 0) {
      // Simple straight line
      if (addSeg) {
        path.lineTo(this.points[1].x + shiftx, this.points[1].y + shifty);
      } else {
        path.moveTo(this.points[0].x + shiftx, this.points[0].y + shifty);
        path.lineTo(this.points[1].x + shiftx, this.points[1].y + shifty);
      }
    } else {
      // Complex curved segments
      this.segments.forEach((seg, index) => {
        seg.drawPath(path, shiftx, shifty, addSeg || index > 0);
      });
    }
  }

  reversed() {
    const rev = new Side();
    // FONTOS: Clone-olni kell MIND a points MIND a segments pontjait!
    rev.points = [this.points[1].clone(), this.points[0].clone()];
    rev.type = this.type === "o" ? "i" : (this.type === "i" ? "o" : "d");
    
    if (this.segments && this.segments.length > 0) {
      rev.segments = this.segments.slice().reverse().map(seg => seg.reverse());
    }
    
    return rev;
  }
}

// Piece class representing a single puzzle piece with 4 sides
export class Piece {
  constructor(kx, ky) {
    this.kx = kx; // column index
    this.ky = ky; // row index
    
    // Four sides: top, right, bottom, left
    this.ts = new Side(); // top side
    this.rs = new Side(); // right side
    this.bs = new Side(); // bottom side
    this.ls = new Side(); // left side
  }

  scale(puzzle) {
    // NE scale-eljük többször ugyanazt a piece-t!
    if (this.isScaled) {
      dlog('⚠️ Piece már scale-elve volt!', this.kx, this.ky);
      return;
    }
    
    // Scale piece coordinates to actual pixel dimensions
    this.scalex = puzzle.scalex;
    this.scaley = puzzle.scaley;
    this.isScaled = true;
    
    // Scale all points in all sides
    [this.ts, this.rs, this.bs, this.ls].forEach(side => {
      side.points.forEach(point => {
        point.x *= puzzle.scalex;
        point.y *= puzzle.scaley;
      });
      
      if (side.segments) {
        side.segments.forEach(segment => {
          segment.p0.x *= puzzle.scalex;
          segment.p0.y *= puzzle.scaley;
          segment.p1.x *= puzzle.scalex;
          segment.p1.y *= puzzle.scaley;
          segment.p2.x *= puzzle.scalex;
          segment.p2.y *= puzzle.scaley;
          segment.p3.x *= puzzle.scalex;
          segment.p3.y *= puzzle.scaley;
        });
      }
    });
  }

  getBounds() {
    // Calculate bounding box of the piece
    let minx = Infinity, miny = Infinity;
    let maxx = -Infinity, maxy = -Infinity;
    
    [this.ts, this.rs, this.bs, this.ls].forEach(side => {
      // Check all points
      side.points.forEach(point => {
        minx = Math.min(minx, point.x);
        miny = Math.min(miny, point.y);
        maxx = Math.max(maxx, point.x);
        maxy = Math.max(maxy, point.y);
      });
      
      // CRITICAL: Also check all segment control points (for Bezier curves)
      if (side.segments && side.segments.length > 0) {
        side.segments.forEach(segment => {
          // Check all 4 points of the Bezier curve
          minx = Math.min(minx, segment.p0.x, segment.p1.x, segment.p2.x, segment.p3.x);
          miny = Math.min(miny, segment.p0.y, segment.p1.y, segment.p2.y, segment.p3.y);
          maxx = Math.max(maxx, segment.p0.x, segment.p1.x, segment.p2.x, segment.p3.x);
          maxy = Math.max(maxy, segment.p0.y, segment.p1.y, segment.p2.y, segment.p3.y);
        });
      }
    });
    
    return { minx, miny, maxx, maxy };
  }

  getPath() {
    // Return array of points representing the piece outline
    const path = [];
    
    // Collect all points from all sides
    const addSidePoints = (side) => {
      if (side.segments && side.segments.length > 0) {
        // Use bezier curve control points
        side.segments.forEach(seg => {
          path.push({ x: seg.p0.x, y: seg.p0.y });
          path.push({ x: seg.p1.x, y: seg.p1.y });
          path.push({ x: seg.p2.x, y: seg.p2.y });
          path.push({ x: seg.p3.x, y: seg.p3.y });
        });
      } else if (side.points && side.points.length > 0) {
        // Use straight line points
        side.points.forEach(point => {
          path.push({ x: point.x, y: point.y });
        });
      }
    };
    
    // Add all sides in order: top, right, bottom, left
    addSidePoints(this.ts);
    addSidePoints(this.rs);
    addSidePoints(this.bs);
    addSidePoints(this.ls);
    
    return path;
  }

  drawPath(path, shiftx = 0, shifty = 0) {
    // Draw the complete piece outline
    this.ts.drawPath(path, shiftx, shifty, false); // start with moveTo
    this.rs.drawPath(path, shiftx, shifty, true);
    this.bs.drawPath(path, shiftx, shifty, true);
    this.ls.drawPath(path, shiftx, shifty, true);
    path.closePath();
  }
}