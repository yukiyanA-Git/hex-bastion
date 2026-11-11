/**
 * HEX BASTION - Hex Coordinate & Math Utilities
 */

import { HEX_DIRECTIONS } from './constants.js';

export function cubeAdd(a, b) {
  return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
}

export function cubeKey(c) {
  return `${c.q},${c.r}`;
}

export function getDirIndexBetween(from, to) {
  const dq = to.q - from.q;
  const dr = to.r - from.r;
  const ds = to.s - from.s;
  for (let i = 0; i < 6; i++) {
    if (HEX_DIRECTIONS[i].q === dq && HEX_DIRECTIONS[i].r === dr && HEX_DIRECTIONS[i].s === ds) {
      return i;
    }
  }
  return null;
}

export function hexRound(q, r, s) {
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);
  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);
  if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs;
  else if (rDiff > sDiff) rr = -rq - rs;
  else rs = -rq - rr;
  return { q: rq, r: rr, s: rs };
}

export function hexToWorld3D(q, r, size, isFlipped = false) {
  const tq = isFlipped ? -q : q;
  const tr = isFlipped ? -r : r;
  const x = size * (Math.sqrt(3) * tq + Math.sqrt(3) / 2 * tr);
  const z = size * (1.5 * tr);
  return { x, z };
}

export function worldToHex3D(x, z, size, isFlipped = false) {
  const tr = z / (1.5 * size);
  const tq = (x / (Math.sqrt(3) * size)) - (tr / 2);
  const rounded = hexRound(tq, tr, -tq - tr);
  let q = rounded.q;
  let r = rounded.r;
  if (isFlipped) {
    q = -q;
    r = -r;
  }
  return `${q},${r}`;
}

export function hexToPixel(q, r, size, centerX, centerY, isFlipped = false) {
  const tq = isFlipped ? -q : q;
  const tr = isFlipped ? -r : r;
  const x = centerX + size * (Math.sqrt(3) * tq + Math.sqrt(3) / 2 * tr);
  const y = centerY + size * (3 / 2 * tr);
  return { x, y };
}

export function pixelToHex(px, py, size, centerX, centerY, isFlipped = false) {
  const x = px - centerX;
  const y = py - centerY;
  let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size;
  let r = (2 / 3 * y) / size;
  const rounded = hexRound(q, r, -q - r);
  if (isFlipped) {
    rounded.q = -rounded.q;
    rounded.r = -rounded.r;
    rounded.s = -rounded.s;
  }
  return rounded;
}
