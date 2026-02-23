// Essential geometry utilities for classic jigsaw puzzle
// Extracted from original 1464-line puzzle implementation

// Mathematical utilities
export const mabs = Math.abs;
export const mmax = Math.max;
export const mmin = Math.min;
export const msqrt = Math.sqrt;
export const mround = Math.round;
export const intAlea = (max) => Math.floor(Math.random() * max);
export const alea = (mini, maxi) => Math.random() * (maxi - mini) + mini;

// Point class for 2D coordinates
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dist(other) {
    return msqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  plus(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  times(k) {
    return new Point(k * this.x, k * this.y);
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

// Segment class for Bézier curve drawing
export class Segment {
  constructor(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  drawPath(path, shiftx = 0, shifty = 0, addSeg = true) {
    if (addSeg) {
      path.bezierCurveTo(
        this.p1.x + shiftx, this.p1.y + shifty,
        this.p2.x + shiftx, this.p2.y + shifty,
        this.p3.x + shiftx, this.p3.y + shifty
      );
    } else {
      path.moveTo(this.p0.x + shiftx, this.p0.y + shifty);
      path.bezierCurveTo(
        this.p1.x + shiftx, this.p1.y + shifty,
        this.p2.x + shiftx, this.p2.y + shifty,
        this.p3.x + shiftx, this.p3.y + shifty
      );
    }
  }

  reverse() {
    // FONTOS: Clone-olni kell a pontokat, különben megosztottak lesznek
    // és többször scale-elődnek!
    return new Segment(
      this.p3.clone(), 
      this.p2.clone(), 
      this.p1.clone(), 
      this.p0.clone()
    );
  }
}

// Classic jigsaw twist function for generating piece edges
export function twist0(side) {
  const dx = side.points[1].x - side.points[0].x;
  const dy = side.points[1].y - side.points[0].y;
  
  const ux = -dy;
  const uy = dx;
  
  const depth = alea(0.15, 0.25);
  const width = alea(0.4, 0.6);
  
  const signx = intAlea(2) ? 1 : -1;
  
  // FONTOS: Clone-olni kell a pontokat, hogy ne legyenek megosztva!
  const p0 = side.points[0].clone();
  const p3 = side.points[1].clone();
  
  // Create control points for Bézier curve
  const cp1 = new Point(
    p0.x + dx * (0.5 - width/2) + ux * depth * signx * alea(0.8, 1.2),
    p0.y + dy * (0.5 - width/2) + uy * depth * signx * alea(0.8, 1.2)
  );
  
  const cp2 = new Point(
    p0.x + dx * (0.5 + width/2) + ux * depth * signx * alea(0.8, 1.2),
    p0.y + dy * (0.5 + width/2) + uy * depth * signx * alea(0.8, 1.2)
  );
  
  // Create segments for the twist
  side.segments = [];
  
  // First segment (straight to start of twist)
  const mid1 = new Point(
    p0.x + dx * (0.5 - width/2),
    p0.y + dy * (0.5 - width/2)
  );
  
  side.segments.push(new Segment(p0.clone(), p0.clone(), mid1.clone(), mid1.clone()));
  
  // Twist segment (curved)
  side.segments.push(new Segment(mid1.clone(), cp1.clone(), cp2.clone(), 
    new Point(p0.x + dx * (0.5 + width/2), p0.y + dy * (0.5 + width/2))
  ));
  
  // Final segment (straight to end)
  side.segments.push(new Segment(
    new Point(p0.x + dx * (0.5 + width/2), p0.y + dy * (0.5 + width/2)),
    p3.clone(), p3.clone(), p3.clone()
  ));
  
  side.type = signx > 0 ? "o" : "i"; // outward or inward
}