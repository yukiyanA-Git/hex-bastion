const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building game.js from modular src/ components...');

const srcDir = path.resolve(__dirname, '../src');
const outPath = path.resolve(__dirname, '../game.js');

// 1. Audio
const audioRaw = fs.readFileSync(path.join(srcDir, 'core/audio.js'), 'utf8');
const audioCode = audioRaw.replace(/export /g, '');

// 2. Constants & Math
const constRaw = fs.readFileSync(path.join(srcDir, 'core/constants.js'), 'utf8');
const constCode = constRaw.replace(/export /g, '');

const mathRaw = fs.readFileSync(path.join(srcDir, 'core/hexMath.js'), 'utf8');
const mathCode = mathRaw
  .replace(/import .*\n/g, '')
  .replace(/export function /g, 'function ')
  .replace(/export const /g, 'const ');

// 3. Game Engine (Constructor & Setup)
const gameJsPath = path.resolve(__dirname, '../game.js');
const rawLines = fs.readFileSync(gameJsPath, 'utf8').split('\n');

function findLine(pattern, startIdx = 0) {
  for (let i = startIdx; i < rawLines.length; i++) {
    if (rawLines[i].includes(pattern)) return i;
  }
  return -1;
}

const idxEngine = findLine('// ================= Main Game Engine =================');
const idxP2P = findLine('// ================= Match Setup Modal & P2P Setup =================');
const idxMap = findLine('// ================= Map Generation =================');
const idx3DGrid = findLine('// ================= 3D HEX PILLARS GENERATION (TRUE ELEVATION) =================');
const idxMovement = findLine('// ================= Movement & Rotation =================');
const idxAI = findLine('// ================= AI =================');
const idxUISetup = findLine('// ================= UI Setup =================');
const idxLoop = findLine('// ================= Rendering Loop =================');
const idxEvents = findLine('// ================= Event Listeners =================');
const idxStart = findLine('// Start Game');

const enginePart1 = rawLines.slice(idxEngine, idxP2P).join('\n');
const p2pPart = rawLines.slice(idxP2P, idxMap).join('\n');
const mapPart = rawLines.slice(idxMap, idx3DGrid).join('\n');
const renderer3DPart = rawLines.slice(idx3DGrid, idxMovement).join('\n');
const combatPart = rawLines.slice(idxMovement, idxAI).join('\n');
const aiPart = rawLines.slice(idxAI, idxUISetup).join('\n');
const uiPart = rawLines.slice(idxUISetup, idxLoop).join('\n');
const fxPart = rawLines.slice(idxLoop, idxEvents).join('\n');
const eventsPart = rawLines.slice(idxEvents).join('\n');

const fullOutput = `/**
 * HEX BASTION - Cinematic 3D Cyber-Chess Edition
 * Compiled from modular ES source code in src/
 */

${audioCode}

// ================= Hex Geometry (Vertical) =================
${mathCode}

// ================= Units & Cards Database =================
${constCode}

${enginePart1}

${p2pPart}

${mapPart}

${renderer3DPart}

${combatPart}

${aiPart}

${uiPart}

${fxPart}

${eventsPart}
`;

fs.writeFileSync(outPath, fullOutput, 'utf8');
console.log('game.js compiled successfully (' + (Buffer.byteLength(fullOutput, 'utf8') / 1024).toFixed(1) + ' KB)');

// Verify syntax
try {
  execSync(`node -c "${outPath}"`, { stdio: 'inherit' });
  console.log('Syntax check: PASS');
} catch (e) {
  console.error('Syntax check: FAIL', e.message);
  process.exit(1);
}
