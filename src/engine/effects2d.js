/**
 * HEX BASTION - 2D Canvas Effects, Particles & Render Loop Module
 */
import { UNIT_TYPES } from '../core/constants.js';

export const Effects2DMethods = {
  // ================= Rendering Loop =================
  render(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000 || 0;
    this.lastTime = currentTime;

    // Throttle 3D background rendering when full-screen modal overlays are active to eliminate UI stutter on low-spec laptops
    const isModalActive = (this.startModal && !this.startModal.classList.contains('hidden')) ||
      (this.briefingModal && !this.briefingModal.classList.contains('hidden')) ||
      (this.helpModal && !this.helpModal.classList.contains('hidden')) ||
      (this.cardArchiveModal && !this.cardArchiveModal.classList.contains('hidden'));

    if (isModalActive) {
      this.modalFrameCount = (this.modalFrameCount || 0) + 1;
      if (this.modalFrameCount % 4 !== 0) {
        requestAnimationFrame((t) => this.render(t));
        return;
      }
    }

    // WASD Camera Pan Movement (+ Shift for 1.5x Sprint Speed)
    if (this.keysDown.w || this.keysDown.s || this.keysDown.a || this.keysDown.d) {
      const speedMult = this.keysDown.shift ? 1.5 : 1.0;
      const speed = 12.0 * dt * speedMult;
      if (this.keysDown.w) this.cameraPanOffset.y += speed;
      if (this.keysDown.s) this.cameraPanOffset.y -= speed;
      if (this.keysDown.a) this.cameraPanOffset.x -= speed;
      if (this.keysDown.d) this.cameraPanOffset.x += speed;

      // Safe bounds within arena
      this.cameraPanOffset.x = Math.max(-14, Math.min(14, this.cameraPanOffset.x));
      this.cameraPanOffset.y = Math.max(-16, Math.min(16, this.cameraPanOffset.y));
      this.updateCameraPosition();
    }

    if (this.isBattleActive && !this.isGameOver) {
      if (this.playerEnergy < this.maxEnergy) {
        this.playerEnergy = Math.min(this.maxEnergy, this.playerEnergy + dt * 0.8);
        this.energyValEl.textContent = `${Math.floor(this.playerEnergy)} / ${this.maxEnergy}`;
        this.energyMeterEl.style.width = `${(this.playerEnergy / this.maxEnergy) * 100}%`;
      }

      if (this.gameMode === 'TACTICAL') {
        this.gameTimerEl.textContent = '∞';
      } else {
        this.matchTime = Math.max(0, this.matchTime - dt);
        const mins = Math.floor(this.matchTime / 60);
        const secs = Math.floor(this.matchTime % 60);
        this.gameTimerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (this.matchTime <= 0) {
          this.resolveMatchVictory(this.playerHp >= this.enemyHp);
        }
      }

      this.updateUnits(dt);
      this.updateAI(dt);
      this.updateDeckCooldowns();

      // Realtime recast pill countdown in inspector
      if (this.selectedBoardUnitKey && this.units.has(this.selectedBoardUnitKey) && this.inspectStatRecast) {
        const u = this.units.get(this.selectedBoardUnitKey);
        if (u.fireCooldown > 0) {
          this.inspectStatRecast.textContent = `⚔️ 攻撃CD: ${u.fireCooldown.toFixed(1)}s`;
          this.inspectStatRecast.style.color = '#f59e0b';
        } else {
          this.inspectStatRecast.textContent = `⚔️ 攻撃CD: READY`;
          this.inspectStatRecast.style.color = '#34d399';
        }
      }
    }

    // ================= 3D Scene Update & Rendering =================
    if (this.renderer3D && this.scene && this.camera) {
      this.syncUnits3D(dt);
      this.update3DCores(dt);
      this.update3DPillarsHighlight();
      this.update3DLaserBeams(dt);
      this.renderer3D.render(this.scene, this.camera);
    }

    // ================= 2D HUD & Effects Overlay =================
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    // 2D Unit Cooldown Gauges (Prominent white circular line arc around unit)
    this.drawUnitCooldownGauges();

    // 2D Laser beam sparks & effects
    this.drawLaserBeams(dt);

    // Particles and Floating Combat Texts
    this.drawParticles(dt);
    this.drawFloatingTexts(dt);

    requestAnimationFrame((t) => this.render(t));
  }

  // Project 3D unit mesh position directly onto screen canvas so gauges track WASD/orbit flawlessly
  getUnitScreenPos(unit) {
    if (this.camera && this.renderer3D) {
      const group = this.unit3DMeshes ? this.unit3DMeshes.get(unit.key) : null;
      if (group) {
        const v = new THREE.Vector3();
        group.getWorldPosition(v);
        v.project(this.camera);
        if (v.z <= 1) {
          return {
            x: (v.x * 0.5 + 0.5) * this.displayWidth,
            y: (-v.y * 0.5 + 0.5) * this.displayHeight
          };
        }
      }
    }
    return unit.renderPos || this.hexToPixel(unit.q, unit.r);
  }

  // Draw white circular line arc around units to clearly visualize recast progress (tracks 3D mesh via WASD)
  drawUnitCooldownGauges() {
    this.units.forEach(unit => {
      const isEnemy = (unit.owner === this.enemyTeam);
      const isStealth = (isEnemy && this.enemyStealthTimer > 0) || (!isEnemy && this.stealthTimer > 0);
      if (isStealth) return;

      const pos = this.getUnitScreenPos(unit);
      if (!pos) return;
      const px = pos.x;
      const py = pos.y;

      // Base faint track
      this.ctx.beginPath();
      this.ctx.arc(px, py, 18, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Attack Recast (Bright White Line Arc, as remembered from original version)
      if (unit.fireCooldown > 0) {
        const progress = Math.max(0, Math.min(1, 1 - (unit.fireCooldown / unit.fireRate)));
        this.ctx.beginPath();
        this.ctx.arc(px, py, 18, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 8;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      } else {
        // Ready pulse
        const pulse = 0.5 + 0.4 * Math.sin(performance.now() * 0.007);
        this.ctx.beginPath();
        this.ctx.arc(px, py, 18, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      // Move Recast (Emerald Green Line on slightly larger circle, or Amber if fatigued)
      if (unit.moveCooldown > 0) {
        const mProgress = Math.max(0, Math.min(1, 1 - (unit.moveCooldown / unit.moveCooldownMax)));
        const moveColor = unit.highGroundFatigueTimer > 0 ? '#f59e0b' : '#34d399';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 23, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * mProgress));
        this.ctx.strokeStyle = moveColor;
        this.ctx.shadowColor = moveColor;
        this.ctx.shadowBlur = 6;
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }
    });
  }

  // ================= Drawing Coordinates & Flip =================
  hexToPixel(q, r) {
    const tq = this.isFlipped ? -q : q;
    const tr = this.isFlipped ? -r : r;
    const size = this.hexRadius;
    const x = this.centerX + size * (Math.sqrt(3) * tq + Math.sqrt(3) / 2 * tr);
    const y = this.centerY + size * (3 / 2 * tr);
    return { x, y };
  }

  pixelToHex(px, py) {
    const size = this.hexRadius;
    const x = px - this.centerX;
    const y = py - this.centerY;
    let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size;
    let r = (2 / 3 * y) / size;
    const rounded = this.hexRound(q, r, -q - r);
    if (this.isFlipped) {
      rounded.q = -rounded.q;
      rounded.r = -rounded.r;
      rounded.s = -rounded.s;
    }
    return rounded;
  }

  hexRound(q, r, s) {
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

  drawUnitIcon(ctx, unitId, cx, cy, color) {
    ctx.clearRect(0, 0, 36, 36);
    const u = UNIT_TYPES[unitId];
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(u ? u.emoji : '●', cx, cy);
  }

  // ================= Particles =================
  drawLaserBeams(dt) {
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const beam = this.laserBeams[i];
      beam.timer -= dt;

      if (beam.timer <= 0) {
        this.laserBeams.splice(i, 1);
        continue;
      }

      const alpha = beam.timer / beam.maxTimer;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(beam.from.x, beam.from.y);
      this.ctx.lineTo(beam.to.x, beam.to.y);
      this.ctx.strokeStyle = beam.color;
      this.ctx.lineWidth = 3 * alpha;
      this.ctx.shadowColor = beam.color;
      this.ctx.shadowBlur = 12;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  createHitSparks(pos, color) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 80 + 30;
      this.particles.push({
        x: pos.x, y: pos.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color, life: 0.35, maxLife: 0.35, size: 3
      });
    }
  }

  createDeployParticles(pos, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      this.particles.push({
        x: pos.x, y: pos.y,
        vx: Math.cos(angle) * 50, vy: Math.sin(angle) * 50,
        color, life: 0.4, maxLife: 0.4, size: 3
      });
    }
  }

  createReversalParticles(pos, color) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 40;
      this.particles.push({
        x: pos.x, y: pos.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color, life: 0.6, maxLife: 0.6, size: 4
      });
    }
  }

  drawParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const alpha = p.life / p.maxLife;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  showFloatingText(text, pos, color) {
    this.floatingTexts.push({
      text, x: pos.x, y: pos.y - 10,
      color, life: 0.8, maxLife: 0.8
    });
  }

  drawFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y -= 25 * dt;
      const alpha = ft.life / ft.maxLife;

      this.ctx.save();
      this.ctx.font = 'bold 12px Orbitron';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }
  }

  triggerBanner(text) {
    this.combatBannerEl.textContent = text;
    this.combatBannerEl.classList.remove('hidden');
    this.combatBannerEl.style.animation = 'none';
    this.combatBannerEl.offsetHeight;
    this.combatBannerEl.style.animation = null;
  }

};
