/**
 * HEX BASTION - Main Application Entry Point
 */
import { SoundController, sounds } from './core/audio.js';
import { HEX_DIRECTIONS, TERRAIN, UNIT_TYPES, BUFF_CARDS_DB } from './core/constants.js';
import { cubeAdd, cubeKey, getDirIndexBetween, hexRound, hexToWorld3D, worldToHex3D, hexToPixel, pixelToHex } from './core/hexMath.js';

export {
  SoundController,
  sounds,
  HEX_DIRECTIONS,
  TERRAIN,
  UNIT_TYPES,
  BUFF_CARDS_DB,
  cubeAdd,
  cubeKey,
  getDirIndexBetween,
  hexRound,
  hexToWorld3D,
  worldToHex3D,
  hexToPixel,
  pixelToHex
};

console.log('HEX BASTION ES Modules initialized successfully.');
