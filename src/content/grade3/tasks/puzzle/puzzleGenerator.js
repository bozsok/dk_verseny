// Puzzle generation logic for classic jigsaw puzzle
// Extracted and adapted from original implementation

import { Point, alea, intAlea, mabs, mround, msqrt, twist0 } from './puzzleGeometry.js';
import { Side, Piece } from './puzzlePieces.js';

export class PuzzleGenerator {
  static computeGridSize(imageWidth, imageHeight, numPieces) {
    // Calculate optimal grid dimensions for square-ish pieces
    let errmin = 1e9;
    let bestNx = 1, bestNy = 1;
    
    let nHPieces = mround(msqrt(numPieces * imageWidth / imageHeight));
    let nVPieces = mround(numPieces / nHPieces);
    
    // Try variations around the estimated values
    for (let ky = 0; ky < 5; ky++) {
      let ncv = nVPieces + ky - 2;
      if (ncv <= 0) continue;
      
      for (let kx = 0; kx < 5; kx++) {
        let nch = nHPieces + kx - 2;
        if (nch <= 0) continue;
        
        let err = nch * imageHeight / ncv / imageWidth;
        err = (err + 1 / err) - 2; // Error on piece dimension ratio
        err += mabs(1 - nch * ncv / numPieces); // Error on number of pieces
        
        if (err < errmin) {
          errmin = err;
          bestNx = nch;
          bestNy = ncv;
        }
      }
    }
    
    return { nx: bestNx, ny: bestNy };
  }

  static generatePieces(nx, ny, coeffDecentr = 0.12) {
    // Create corner points with some randomization
    const corners = [];
    
    for (let ky = 0; ky <= ny; ++ky) {
      corners[ky] = [];
      for (let kx = 0; kx <= nx; ++kx) {
        corners[ky][kx] = new Point(
          kx + alea(-coeffDecentr, coeffDecentr),
          ky + alea(-coeffDecentr, coeffDecentr)
        );
        
        // Keep edges straight
        if (kx === 0) corners[ky][kx].x = 0;
        if (kx === nx) corners[ky][kx].x = nx;
        if (ky === 0) corners[ky][kx].y = 0;
        if (ky === ny) corners[ky][kx].y = ny;
      }
    }

    // Create pieces array
    const pieces = [];
    for (let ky = 0; ky < ny; ++ky) {
      pieces[ky] = [];
      for (let kx = 0; kx < nx; ++kx) {
        const piece = new Piece(kx, ky);
        pieces[ky][kx] = piece;

        // Top side
        if (ky === 0) {
          // Edge piece - straight top
          // FONTOS: Clone-olni kell a pontokat, különben megosztottak!
          piece.ts.points = [corners[ky][kx].clone(), corners[ky][kx + 1].clone()];
          piece.ts.type = "d";
        } else {
          // Share with piece above (reversed)
          piece.ts = pieces[ky - 1][kx].bs.reversed();
        }

        // Right side
        // FONTOS: Clone-olni kell a pontokat!
        piece.rs.points = [corners[ky][kx + 1].clone(), corners[ky + 1][kx + 1].clone()];
        piece.rs.type = "d";
        if (kx < nx - 1) {
          // Add jigsaw twist if not edge
          if (intAlea(2)) {
            twist0(piece.rs, corners[ky][kx], corners[ky + 1][kx]);
          } else {
            twist0(piece.rs, corners[ky][kx + 2], corners[ky + 1][kx + 2]);
          }
        }

        // Left side
        if (kx === 0) {
          // Edge piece - straight left
          // FONTOS: Clone-olni kell a pontokat!
          piece.ls.points = [corners[ky + 1][kx].clone(), corners[ky][kx].clone()];
          piece.ls.type = "d";
        } else {
          // Share with piece to the left (reversed)
          piece.ls = pieces[ky][kx - 1].rs.reversed();
        }

        // Bottom side
        // FONTOS: Clone-olni kell a pontokat!
        piece.bs.points = [corners[ky + 1][kx + 1].clone(), corners[ky + 1][kx].clone()];
        piece.bs.type = "d";
        if (ky < ny - 1) {
          // Add jigsaw twist if not edge
          if (intAlea(2)) {
            twist0(piece.bs, corners[ky][kx + 1], corners[ky][kx]);
          } else {
            twist0(piece.bs, corners[ky + 2][kx + 1], corners[ky + 2][kx]);
          }
        }
      }
    }

    return pieces;
  }

  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static calculateScaling(imageWidth, imageHeight, containerWidth, containerHeight, nx, ny) {
    // Calculate scaling to fit puzzle exactly in container (100% of available area)
    const maxWidth = containerWidth;
    const maxHeight = containerHeight;

    let gameHeight = maxHeight;
    let gameWidth = gameHeight * imageWidth / imageHeight;

    if (gameWidth > maxWidth) {
      gameWidth = maxWidth;
      gameHeight = gameWidth * imageHeight / imageWidth;
    }

    const scalex = gameWidth / nx;
    const scaley = gameHeight / ny;

  const offsx = (containerWidth - gameWidth) / 2;
  const offsy = (containerHeight - gameHeight) / 2;

    return {
      gameWidth,
      gameHeight,
      scalex,
      scaley,
      offsx,
      offsy
    };
  }
}