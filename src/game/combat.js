/**
 * HEX BASTION - Movement, Reversal & Combat System Module
 */
import { HEX_DIRECTIONS, TERRAIN, UNIT_TYPES, BUFF_CARDS_DB } from '../core/constants.js';
import { sounds } from '../core/audio.js';

export const CombatMethods = {
  // ================= Movement & Rotation =================
  rotateUnit(unit, delta) {
    if (!unit) return;
    // delta: +1 for clockwise (順回転), -1 for counter-clockwise (逆回転)
    unit.direction = (unit.direction + delta + 6) % 6;
    this.checkReversals(unit);
    sounds.playDeploy();

    const label = (delta > 0) ? "↻ 順回転" : "↺ 逆回転";
    this.showFloatingText(label, this.hexToPixel(unit.q, unit.r), '#00e5ff');
    this.validMoveHexes = this.getValidMovesForUnit(unit);
    this.updateActionStatus();
    this.updateUnitInspector();

    if (this.isPvP) {
      this.sendP2P({ type: 'ROTATE', unitKey: unit.key, newDir: unit.direction });
    }
  }

  selectUnitForMovement(unitKey) {
    const unit = this.units.get(unitKey);
    if (!unit || unit.owner !== this.myTeam) {
      this.selectedBoardUnitKey = null;
      this.validMoveHexes = [];
      this.updateActionStatus();
      this.updateUnitInspector();
      return;
    }

    this.selectedBoardUnitKey = unitKey;
    this.selectedDeckIndex = null;
    this.selectedBuffCard = null;
    this.updateDeckSelectionStyles();
    this.updateBuffCardStyles();

    this.validMoveHexes = this.getValidMovesForUnit(unit);
    this.updateActionStatus();
    this.updateUnitInspector();
  }

  getValidMovesForUnit(unit) {
    const valid = [];
    const uData = UNIT_TYPES[unit.id];
    const maxDist = this.hyperBoostCharges > 0 ? 2 : 1;

    for (let d = 0; d < 6; d++) {
      if (uData.moveType === 'FORWARD_ONLY') {
        const relDir = (d - unit.direction + 6) % 6;
        if (relDir !== 0 && relDir !== 1 && relDir !== 5) continue;
      }

      const dirVec = HEX_DIRECTIONS[d];
      for (let dist = 1; dist <= maxDist; dist++) {
        const targetCoord = {
          q: unit.q + dirVec.q * dist,
          r: unit.r + dirVec.r * dist,
          s: unit.s + dirVec.s * dist
        };
        const k = cubeKey(targetCoord);
        const cell = this.grid.get(k);

        if (cell && cell.terrain !== TERRAIN.OBSTACLE && cell.terrain !== TERRAIN.CORE_BOTTOM && cell.terrain !== TERRAIN.CORE_TOP) {
          if (!this.units.has(k)) {
            valid.push(k);
          }
        }
      }
    }
    return valid;
  }

  executeUnitMove(unit, targetKey, isLocalAction = true) {
    if (unit.moveCooldown > 0 || unit.isMoving) {
      this.showFloatingText("COOLDOWN", this.getUnitScreenPos(unit), '#94a3b8');
      return;
    }

    const targetCell = this.grid.get(targetKey);
    if (!targetCell) return;

    if (isLocalAction) {
      if (this.hyperBoostCharges > 0) this.hyperBoostCharges--;
      if (this.quickStepCharges > 0) this.quickStepCharges--;
    }

    const newDir = getDirIndexBetween(unit, targetCell);
    if (newDir !== null) unit.direction = newDir;

    const oldKey = unit.key;
    const oldPos = this.hexToPixel(unit.q, unit.r);
    const newPos = this.hexToPixel(targetCell.q, targetCell.r);

    this.units.delete(oldKey);
    const oldCell = this.grid.get(oldKey);
    if (oldCell) oldCell.owner = null;

    unit.q = targetCell.q;
    unit.r = targetCell.r;
    unit.s = targetCell.s;
    unit.key = targetKey;
    this.units.set(targetKey, unit);
    targetCell.owner = unit.owner;

    const wasHighGround = unit.isHighGround;
    unit.isHighGround = (targetCell.terrain === TERRAIN.HIGH_GROUND);
    unit.antiHack = unit.isHighGround;
    unit.range = UNIT_TYPES[unit.id].range + (unit.isHighGround ? 1 : 0);

    // High Ground Descent Penalty: Moving down from high ground causes 10 seconds fatigue (2x move CD)
    if (wasHighGround && !unit.isHighGround) {
      unit.highGroundFatigueTimer = 10.0;
      this.showFloatingText("⚠️ 高台疲労 (10s 鈍足)", newPos, '#f59e0b');
    }

    unit.isMoving = true;
    unit.renderPos = { x: oldPos.x, y: oldPos.y };
    unit.targetPos = { x: newPos.x, y: newPos.y };
    unit.moveProgress = 0.0;

    this.selectedBoardUnitKey = null;
    this.validMoveHexes = [];
    this.updateActionStatus();

    sounds.playStep();
    this.createDeployParticles(newPos, unit.owner === this.myTeam ? '#00e5ff' : '#ff3366');

    if (this.isPvP && isLocalAction) {
      this.sendP2P({ type: 'MOVE', unitKey: oldKey, targetKey, newDir: unit.direction });
    }
  }

  onMoveComplete(unit) {
    unit.isMoving = false;
    unit.moveProgress = 1.0;
    unit.renderPos = { ...unit.targetPos };

    let cooldownMultiplier = (unit.owner === this.myTeam && this.quickStepCharges > 0) ? 0.5 : 1.0;
    // High ground penalty: 2x move cooldown while on high ground (harder to move/descend)
    if (unit.isHighGround) {
      cooldownMultiplier *= 2.0;
    }
    // Descent fatigue penalty: 2x move cooldown for 10s after descending
    if (unit.highGroundFatigueTimer > 0) {
      cooldownMultiplier *= 2.0;
    }
    unit.moveCooldown = unit.moveCooldownMax * cooldownMultiplier;

    const group = this.unit3DMeshes.get(unit.key);
    if (group) {
      this.refreshBillboardBadge(group, unit);
    }

    this.checkReversals(unit);
    this.fireUnitWeapon(unit);
    unit.fireCooldown = unit.fireRate;

    const screenPos = this.getUnitScreenPos(unit);
    this.showFloatingText("ENGAGED!", screenPos, unit.owner === this.myTeam ? '#00e5ff' : '#ff3366');
  }

  // ================= Reversals =================
  checkReversals(originUnit) {
    let anyReversed = false;
    const originOwner = originUnit.owner;

    for (let d = 0; d < 6; d++) {
      const dir = HEX_DIRECTIONS[d];
      let cur = { q: originUnit.q, r: originUnit.r, s: -originUnit.q - originUnit.r };
      const enemyUnitsInLine = [];
      let lineFlanked = false;

      for (let step = 1; step <= 8; step++) {
        cur = cubeAdd(cur, dir);
        const k = cubeKey(cur);
        const cell = this.grid.get(k);

        if (!cell || cell.terrain === TERRAIN.OBSTACLE) break;

        const target = this.units.get(k);
        if (!target) break;

        if (target.owner !== originOwner) {
          enemyUnitsInLine.push(target);
        } else {
          if (enemyUnitsInLine.length > 0) lineFlanked = true;
          break;
        }
      }

      if (lineFlanked && enemyUnitsInLine.length > 0) {
        enemyUnitsInLine.forEach(target => {
          if (target.invincibleTimer > 0) {
            this.showFloatingText("INVINCIBLE!", this.hexToPixel(target.q, target.r), "#f59e0b");
            return;
          }

          if (target.isHighGround && !originUnit.isHighGround) {
            this.showFloatingText("GUARDED!", this.hexToPixel(target.q, target.r), "#fbbf24");
            return;
          }

          if (target.shield > 0) {
            target.shield--;
            this.showFloatingText("SHIELD BROKE!", this.hexToPixel(target.q, target.r), "#38bdf8");
            sounds.playHit();
            return;
          }

          target.owner = originOwner;
          target.direction = (originOwner === (this.isHost ? 'blue' : 'red')) ? 0 : 3;
          target.flipAnim = { progress: 0.0, duration: 0.65 };

          const c = this.grid.get(target.key);
          if (c) c.owner = originOwner;

          // Instant color and billboard update at frame 0 of reversal
          const targetMesh = this.unit3DMeshes.get(target.key);
          if (targetMesh) {
            this.updateUnitMeshColor(targetMesh, originOwner);
          }

          anyReversed = true;
          if (originOwner === this.myTeam) this.stats.reversals++;

          const pos = this.getUnitScreenPos(target);
          this.createReversalParticles(pos, originOwner === this.myTeam ? '#00e5ff' : '#ff3366');
          this.showFloatingText("REVERSAL!", pos, originOwner === this.myTeam ? '#00e5ff' : '#ff3366');
        });
      }
    }

    if (anyReversed) {
      sounds.playReversal();
      this.triggerBanner("TACTICAL REVERSAL!");
      this.updateUnitCountUI();
    }
  }

  // ================= Combat =================
  updateUnits(dt) {
    if (this.stealthTimer > 0) this.stealthTimer -= dt;
    if (this.enemyStealthTimer > 0) this.enemyStealthTimer -= dt;

    const unitList = Array.from(this.units.values());
    unitList.forEach(unit => {
      if (!this.units.has(unit.key)) return;

      if (unit.invincibleTimer > 0) unit.invincibleTimer -= dt;

      // High Ground Fatigue countdown (after descending from high ground)
      if (unit.highGroundFatigueTimer > 0) {
        const prevSec = Math.ceil(unit.highGroundFatigueTimer);
        unit.highGroundFatigueTimer = Math.max(0, unit.highGroundFatigueTimer - dt);
        if (Math.ceil(unit.highGroundFatigueTimer) !== prevSec) {
          const group = this.unit3DMeshes.get(unit.key);
          if (group) this.refreshBillboardBadge(group, unit);
        }
      }

      if (unit.isMoving) {
        unit.moveProgress += dt * 4.0;
        if (unit.moveProgress >= 1.0) {
          this.onMoveComplete(unit);
        } else {
          unit.renderPos.x += (unit.targetPos.x - unit.renderPos.x) * 0.35;
          unit.renderPos.y += (unit.targetPos.y - unit.renderPos.y) * 0.35;
        }
      } else {
        unit.renderPos = this.hexToPixel(unit.q, unit.r);
      }

      if (unit.fireCooldown > 0) unit.fireCooldown -= dt;
      if (unit.moveCooldown > 0) unit.moveCooldown -= dt;

      if (!unit.isMoving && unit.fireCooldown <= 0 && unit.range > 0) {
        this.fireUnitWeapon(unit);
        unit.fireCooldown = unit.fireRate;
      }
    });
  }

  fireUnitWeapon(unit) {
    const uData = UNIT_TYPES[unit.id];
    if (!uData || uData.range <= 0) return;

    const fromPixel = this.hexToPixel(unit.q, unit.r);

    uData.dirs.forEach(relDir => {
      const actualDirIdx = (unit.direction + relDir) % 6;
      const dirVec = HEX_DIRECTIONS[actualDirIdx];

      let cur = { q: unit.q, r: unit.r, s: -unit.q - unit.r };
      let lastPixel = fromPixel;

      for (let dist = 1; dist <= unit.range; dist++) {
        cur = cubeAdd(cur, dirVec);
        const k = cubeKey(cur);
        const cell = this.grid.get(k);

        if (!cell) break;

        const curPixel = this.hexToPixel(cur.q, cur.r);
        lastPixel = curPixel;

        if (cell.terrain === TERRAIN.OBSTACLE && !unit.isHighGround) {
          this.createLaserBeam(fromPixel, curPixel, unit.owner);
          break;
        }

        if (unit.owner === this.myTeam && cell.terrain === TERRAIN.CORE_TOP) {
          this.damageCore('enemy', 1);
          this.createLaserBeam(fromPixel, curPixel, unit.owner);
          this.createHitSparks(curPixel, '#ff3366');
          break;
        } else if (unit.owner === this.enemyTeam && cell.terrain === TERRAIN.CORE_BOTTOM) {
          this.damageCore('player', 1);
          this.createLaserBeam(fromPixel, curPixel, unit.owner);
          this.createHitSparks(curPixel, '#00e5ff');
          break;
        }

        const targetUnit = this.units.get(k);
        if (targetUnit) {
          if (targetUnit.id === 'REFLECTOR' && targetUnit.owner === unit.owner) {
            this.createLaserBeam(fromPixel, curPixel, unit.owner);
            const reflectedDir = (actualDirIdx + 1) % 6;
            this.fireReflectedBeam(cur, reflectedDir, unit.owner, unit.range - dist);
            break;
          }

          if (targetUnit.owner !== unit.owner) {
            this.createLaserBeam(fromPixel, curPixel, unit.owner);
            this.createHitSparks(curPixel, unit.owner === this.myTeam ? '#00e5ff' : '#ff3366');

            // High Ground Combat Dynamics:
            // 1. Firing down from high ground grants +1 damage bonus!
            // 2. Firing up from low ground against high ground reduces damage by 1 (minimum 1).
            let dmg = uData.power || 1;
            if (unit.isHighGround && !targetUnit.isHighGround) {
              dmg += 1; // High ground firepower bonus!
            } else if (!unit.isHighGround && targetUnit.isHighGround) {
              dmg = Math.max(1, dmg - 1); // Fortified high ground resistance
            }

            this.applyDamageToUnit(targetUnit, dmg, unit, true);

            if (unit.id === 'DISRUPTOR' && targetUnit.hp > 0 && targetUnit.invincibleTimer <= 0) {
              targetUnit.direction = (targetUnit.direction + Math.floor(Math.random() * 4) + 1) % 6;
              const screenPos = this.getUnitScreenPos(targetUnit);
              this.showFloatingText("DISRUPTED!", screenPos, "#a855f7");
            }
            break;
          }
        }
      }

      this.createLaserBeam(fromPixel, lastPixel, unit.owner);
    });

    sounds.playLaser();
  }

  fireReflectedBeam(originCoord, dirIdx, owner, remainingRange) {
    const dirVec = HEX_DIRECTIONS[dirIdx];
    let cur = { ...originCoord };
    const fromPixel = this.hexToPixel(originCoord.q, originCoord.r);
    let lastPixel = fromPixel;

    for (let dist = 1; dist <= remainingRange; dist++) {
      cur = cubeAdd(cur, dirVec);
      const k = cubeKey(cur);
      const cell = this.grid.get(k);
      if (!cell || cell.terrain === TERRAIN.OBSTACLE) break;

      const curPixel = this.hexToPixel(cur.q, cur.r);
      lastPixel = curPixel;

      if (owner === this.myTeam && cell.terrain === TERRAIN.CORE_TOP) {
        this.damageCore('enemy', 1);
        break;
      } else if (owner === this.enemyTeam && cell.terrain === TERRAIN.CORE_BOTTOM) {
        this.damageCore('player', 1);
        break;
      }

      const targetUnit = this.units.get(k);
      if (targetUnit && targetUnit.owner !== owner) {
        this.applyDamageToUnit(targetUnit, 1, null, true);
        break;
      }
    }
    this.createLaserBeam(fromPixel, lastPixel, owner);
  }

  createLaserBeam(from, to, owner) {
    this.laserBeams.push({
      from, to,
      color: owner === this.myTeam ? '#00e5ff' : '#ff3366',
      timer: 0.15,
      maxTimer: 0.15
    });

    const h1 = this.pixelToHex(from.x, from.y);
    const h2 = this.pixelToHex(to.x, to.y);
    const wFrom = this.hexToWorld3D(h1.q, h1.r);
    const wTo = this.hexToWorld3D(h2.q, h2.r);
    this.createLaser3D(wFrom, wTo, owner);
  }

  damageCore(target, amount) {
    this.applyDamageToCore(target, amount, true);
  }

  applyDamageToCore(target, amount, broadcast = true) {
    sounds.playHit();
    if (target === 'enemy') {
      this.enemyHp = Math.max(0, this.enemyHp - amount);
      this.stats.damageDealt += amount;
      this.enemyHpEl.textContent = this.enemyHp;
      this.enemyHpBar.style.width = `${(this.enemyHp / this.maxHp) * 100}%`;
      if (this.enemyHp <= 0) this.resolveMatchVictory(true);
    } else {
      this.playerHp = Math.max(0, this.playerHp - amount);
      this.playerHpEl.textContent = this.playerHp;
      this.playerHpBar.style.width = `${(this.playerHp / this.maxHp) * 100}%`;
      if (this.playerHp <= 0) this.resolveMatchVictory(false);
    }

    if (this.isPvP && broadcast) {
      this.sendP2P({ type: 'DAMAGE_CORE', target, amount });
    }
  }

  // ================= UNIT DAMAGE & DESTRUCTION SYSTEM =================
  applyDamageToUnit(targetUnit, amount, attackerUnit = null, broadcast = true) {
    if (!targetUnit || targetUnit.hp <= 0) return;

    if (targetUnit.invincibleTimer > 0) {
      const pos = this.getUnitScreenPos(targetUnit);
      this.showFloatingText("INVINCIBLE!", pos, "#f59e0b");
      return;
    }

    sounds.playHit();
    targetUnit.hp = Math.max(0, targetUnit.hp - amount);

    const pos = this.getUnitScreenPos(targetUnit);
    this.createHitSparks(pos, targetUnit.owner === this.myTeam ? '#ff3366' : '#00e5ff');
    this.showFloatingText(`-${amount} HP`, pos, '#ef4444');

    if (attackerUnit && attackerUnit.owner === this.myTeam) {
      this.stats.damageDealt += amount;
    }

    // Refresh billboard badge to show real-time remaining HP
    const group = this.unit3DMeshes.get(targetUnit.key);
    if (group) {
      this.refreshBillboardBadge(group, targetUnit);
    }

    if (this.isPvP && broadcast) {
      this.sendP2P({
        type: 'DAMAGE_UNIT',
        unitKey: targetUnit.key,
        amount: amount,
        attackerKey: attackerUnit ? attackerUnit.key : null
      });
    }

    // Unit destroyed if HP reaches 0: removed from board
    if (targetUnit.hp <= 0) {
      this.destroyUnit(targetUnit, broadcast);
    }
  }

  destroyUnit(unit, broadcast = true) {
    const key = unit.key;
    if (!this.units.has(key)) return;

    sounds.playHit();
    const pos = this.getUnitScreenPos(unit);
    this.createReversalParticles(pos, '#ef4444');
    this.showFloatingText("💥 DESTROYED!", pos, '#ef4444');

    // Remove 3D Mesh
    const group = this.unit3DMeshes.get(key);
    if (group) {
      this.scene.remove(group);
      this.unit3DMeshes.delete(key);
    }

    // Clear board occupancy
    const cell = this.grid.get(key);
    if (cell) {
      cell.owner = null;
    }

    // Remove from unit registry
    this.units.delete(key);
    this.updateUnitCountUI();

    if (this.selectedBoardUnitKey === key) {
      this.selectedBoardUnitKey = null;
      this.validMoveHexes = [];
      this.updateActionStatus();
    }

    if (this.isPvP && broadcast) {
      this.sendP2P({
        type: 'DESTROY_UNIT',
        unitKey: key
      });
    }
  }

  // ================= Rating System =================
  resolveMatchVictory(isPlayerWin) {
    this.isGameOver = true;
    let oldRate = this.myRate;
    let diff = 0;

    if (isPlayerWin) {
      diff = Math.max(1, Math.round(this.enemyRate * 0.25));
      this.myRate += diff;
    } else {
      diff = -Math.max(1, Math.round(this.myRate * 0.10));
      this.myRate = Math.max(100, this.myRate + diff);
    }

    localStorage.setItem('hex_bastion_rate', this.myRate.toString());
    this.playerRateEl.textContent = this.myRate;

    const modal = document.getElementById('gameover-modal');
    const title = document.getElementById('gameover-title');
    const descEl = document.getElementById('gameover-desc');
    const rateDisplay = document.getElementById('rate-change-display');

    title.textContent = isPlayerWin ? 'VICTORY!' : 'DEFEAT...';
    title.className = isPlayerWin ? 'win-title' : 'lose-title';
    descEl.textContent = isPlayerWin ? '敵の本拠地コアを陥落させました！' : '自軍コアが陥落しました...';

    const sign = diff >= 0 ? `+${diff}` : `${diff}`;
    rateDisplay.textContent = `${oldRate} ➔ ${this.myRate} (${sign})`;
    rateDisplay.style.color = isPlayerWin ? '#34d399' : '#ff3366';

    document.getElementById('stat-reversals').textContent = this.stats.reversals;
    document.getElementById('stat-damage').textContent = this.stats.damageDealt;
    modal.classList.remove('hidden');
  }

  // ================= Buff Cards =================
  useBuffCard(card, targetHexKey = null) {
    if (card.used) return;
    let success = false;

    switch (card.id) {
      case 'STEALTH':
        this.stealthTimer = 10;
        this.showFloatingText("STEALTH ACTIVE (10s)!", { x: this.centerX, y: this.centerY + 160 }, '#a855f7');
        sounds.playBuff();
        success = true;
        break;

      case 'INVINCIBLE':
        if (!targetHexKey) return;
        const targetUnit = this.units.get(targetHexKey);
        if (targetUnit && targetUnit.owner === this.myTeam) {
          targetUnit.invincibleTimer = 10;
          sounds.playBuff();
          this.showFloatingText("INVINCIBLE (10s)!", this.hexToPixel(targetUnit.q, targetUnit.r), '#f59e0b');
          success = true;
        }
        break;

      case 'HYPER_BOOST':
        this.hyperBoostCharges = 3;
        this.showFloatingText("JUMP RANGE x2 (3 MOVES)!", { x: this.centerX, y: this.centerY + 160 }, '#38bdf8');
        sounds.playBuff();
        success = true;
        break;

      case 'QUICK_STEP':
        this.quickStepCharges = 5;
        this.showFloatingText("MOVE CD -50% (5 MOVES)!", { x: this.centerX, y: this.centerY + 160 }, '#34d399');
        sounds.playBuff();
        success = true;
        break;

      case 'MIND_DISRUPT':
        sounds.playBuff();
        this.showFloatingText("MIND SHUFFLE SENT!", { x: this.centerX, y: this.centerY + 160 }, '#ec4899');
        success = true;
        break;

      case 'SPY_SATELLITE':
        this.spySatelliteActive = true;
        this.updateEnemyCardsUI();
        this.showFloatingText("SPY SATELLITE ONLINE!", { x: this.centerX, y: this.centerY + 160 }, '#fbbf24');
        sounds.playBuff();
        success = true;
        break;

      case 'ENERGY_SURGE':
        if (!targetHexKey) return;
        const targetUnitEle = this.units.get(targetHexKey);
        if (targetUnitEle && targetUnitEle.owner === this.myTeam) {
          const oldMax = targetUnitEle.maxHp;
          targetUnitEle.maxHp = Math.max(oldMax + 1, Math.round(targetUnitEle.maxHp * 1.3));
          const hpGain = targetUnitEle.maxHp - oldMax;
          targetUnitEle.hp = Math.min(targetUnitEle.maxHp, targetUnitEle.hp + hpGain);

          const group = this.unit3DMeshes.get(targetUnitEle.key);
          if (group) {
            this.refreshBillboardBadge(group, targetUnitEle);
          }

          sounds.playBuff();
          const screenPos = this.getUnitScreenPos(targetUnitEle);
          this.showFloatingText(`HP x1.3! (${targetUnitEle.hp}/${targetUnitEle.maxHp})`, screenPos, '#22c55e');
          success = true;
        }
        break;

      case 'SCAFFOLD':
        if (!targetHexKey) return;
        const cell = this.grid.get(targetHexKey);
        if (cell && cell.terrain === TERRAIN.EMPTY) {
          cell.terrain = TERRAIN.HIGH_GROUND;
          this.build3DGrid();
          sounds.playBuff();
          this.showFloatingText("HIGH GROUND ERECTED!", this.hexToPixel(cell.q, cell.r), '#fbbf24');
          success = true;
        }
        break;

      case 'OVERCHARGE':
        if (!targetHexKey) return;
        const u = this.units.get(targetHexKey);
        if (u && u.owner === this.myTeam) {
          u.range += 2;
          sounds.playBuff();
          this.showFloatingText("RANGE +2!", this.hexToPixel(u.q, u.r), '#00e5ff');
          success = true;
        }
        break;

      case 'ANTIHACK':
        if (!targetHexKey) return;
        const u2 = this.units.get(targetHexKey);
        if (u2 && u2.owner === this.myTeam) {
          u2.shield = (u2.shield || 0) + 1;
          sounds.playBuff();
          this.showFloatingText("SHIELD +1!", this.hexToPixel(u2.q, u2.r), '#38bdf8');
          success = true;
        }
        break;
    }

    if (success) {
      card.used = true;
      this.selectedBuffCard = null;
      this.updateBuffCardStyles();
      this.updateActionStatus();

      if (this.isPvP) {
        this.sendP2P({ type: 'CARD_USE', card: { id: card.id, name: card.name }, targetKey: targetHexKey });
      }
    }
  }

  reshuffleMyUnspentCards() {
    let unspentCount = 0;
    this.myCards.forEach(c => { if (!c.used) unspentCount++; });

    if (unspentCount > 0) {
      const unusedIds = this.myCards.map(c => c.id);
      const available = BUFF_CARDS_DB.filter(c => !unusedIds.includes(c.id));
      const newShuffled = [...available].sort(() => 0.5 - Math.random());

      let replaceIdx = 0;
      this.myCards.forEach(c => {
        if (!c.used && newShuffled[replaceIdx]) {
          Object.assign(c, newShuffled[replaceIdx]);
          replaceIdx++;
        }
      });

      this.setupBuffCardsDOM();
      this.showFloatingText("CARDS SHUFFLED!", { x: this.centerX, y: this.centerY + 140 }, '#ec4899');
    }
  }

};
