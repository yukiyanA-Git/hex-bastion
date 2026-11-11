/**
 * HEX BASTION - 3D Renderer & Procedural Meshes Module
 */
import { HEX_DIRECTIONS, TERRAIN, UNIT_TYPES } from '../core/constants.js';

export const Renderer3DMethods = {
  // ================= 3D HEX PILLARS GENERATION (TRUE ELEVATION) =================
  build3DGrid() {
    if (!this.scene || !window.THREE) return;

    this.hexPillarMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
    });
    this.hexPillarMeshes.clear();
    this.hexPillarInteractiveList = [];

    if (this.crystalCores.blue) {
      this.scene.remove(this.crystalCores.blue);
      this.crystalCores.blue = null;
    }
    if (this.crystalCores.red) {
      this.scene.remove(this.crystalCores.red);
      this.crystalCores.red = null;
    }

    const hexR = this.getHexRadius3D();

    this.grid.forEach(cell => {
      const { x, z } = this.hexToWorld3D(cell.q, cell.r);
      let topY = 0.3;      // Normal ground top level
      let height = 0.6;
      let topColor = 0x0f1c38;
      let emissiveColor = 0x002244;
      let edgeColor = 0x1e3a8a;
      let isInteractive = true;

      if (cell.terrain === TERRAIN.HIGH_GROUND) {
        topY = 0.85;        // Elevated High Ground: +0.55 higher than ground, clear step without blocking view
        height = 1.15;
        topColor = 0x054875;
        emissiveColor = 0x0284c7;
        edgeColor = 0x38bdf8;
      } else if (cell.terrain === TERRAIN.OBSTACLE) {
        topY = 1.25;        // Compact Barrier Monolith: +0.95 higher, clearly distinct obstacle without obscuring behind
        height = 1.55;
        topColor = 0x221338;
        emissiveColor = 0x4a044e;
        edgeColor = 0xa855f7;
        isInteractive = false;
      } else if (cell.terrain === TERRAIN.CORE_BOTTOM) {
        topY = 0.45;
        height = 0.75;
        topColor = 0x023059;
        emissiveColor = 0x00e5ff;
        edgeColor = 0x00e5ff;
      } else if (cell.terrain === TERRAIN.CORE_TOP) {
        topY = 0.45;
        height = 0.75;
        topColor = 0x4a0a1a;
        emissiveColor = 0xff3366;
        edgeColor = 0xff3366;
      }

      cell.topY = topY;

      // Hex cylinder geometry (edges perfectly aligned with neighbor directions for seamless edge-to-edge contact)
      const geom = new THREE.CylinderGeometry(hexR * 0.96, hexR * 0.94, height, 6);

      const mat = new THREE.MeshStandardMaterial({
        color: topColor,
        emissive: emissiveColor,
        emissiveIntensity: 0.4,
        metalness: 0.85,
        roughness: 0.25,
        flatShading: true
      });

      const mesh = new THREE.Mesh(geom, mat);
      // Correct mathematical positioning: mesh center Y = topY - height/2
      const baseCenterY = topY - (height / 2);
      mesh.position.set(x, baseCenterY, z);
      mesh.receiveShadow = true;
      mesh.castShadow = false;

      // Glowing cyber edges
      const edgeGeom = new THREE.EdgesGeometry(geom);
      const edgeMat = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 });
      const edgeLine = new THREE.LineSegments(edgeGeom, edgeMat);
      mesh.add(edgeLine);

      // High Ground Extra Visual: Tiered step indicator rings on sides
      if (cell.terrain === TERRAIN.HIGH_GROUND) {
        const stepGeom = new THREE.RingGeometry(hexR * 0.85, hexR * 0.98, 6);
        stepGeom.rotateX(-Math.PI / 2);
        stepGeom.rotateY(Math.PI / 6);
        const stepMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide });
        const stepMesh = new THREE.Mesh(stepGeom, stepMat);
        stepMesh.position.y = (height / 2) - 0.02;
        mesh.add(stepMesh);
      }

      mesh.userData = {
        q: cell.q,
        r: cell.r,
        key: `${cell.q},${cell.r}`,
        baseCenterY,
        topY,
        height,
        terrain: cell.terrain,
        defaultEmissive: emissiveColor,
        defaultColor: topColor,
        edgeMat
      };

      this.scene.add(mesh);
      this.hexPillarMeshes.set(mesh.userData.key, mesh);
      if (isInteractive) {
        this.hexPillarInteractiveList.push(mesh);
      }

      // Giant Rotating Crystal on Base
      if (cell.terrain === TERRAIN.CORE_BOTTOM) {
        const crystalGeom = new THREE.OctahedronGeometry(0.8, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.95,
          roughness: 0.1,
          metalness: 0.9
        });
        const crystal = new THREE.Mesh(crystalGeom, crystalMat);
        crystal.position.set(x, topY + 0.65, z);
        crystal.castShadow = true;
        this.scene.add(crystal);
        this.crystalCores.blue = crystal;
      } else if (cell.terrain === TERRAIN.CORE_TOP) {
        const crystalGeom = new THREE.OctahedronGeometry(0.8, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xff3366,
          emissive: 0xff3366,
          emissiveIntensity: 0.95,
          roughness: 0.1,
          metalness: 0.9
        });
        const crystal = new THREE.Mesh(crystalGeom, crystalMat);
        crystal.position.set(x, topY + 0.65, z);
        crystal.castShadow = true;
        this.scene.add(crystal);
        this.crystalCores.red = crystal;
      }
    });

    // Territory line indicator in 3D: A glowing horizontal divider beam across middle (z = 0)
    if (this.dividerBeam) this.scene.remove(this.dividerBeam);
    const divGeom = new THREE.BoxGeometry(hexR * 8.8, 0.08, 0.12);
    const divMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    this.dividerBeam = new THREE.Mesh(divGeom, divMat);
    this.dividerBeam.position.set(0, 0.35, 0);
    this.scene.add(this.dividerBeam);
  }

  // ================= 3D PIECE GENERATION (DISTINCTIVE CHESS FIGURES + HEAD BILLBOARD) =================
  drawBillboardContent(badge, unit, isPlayer) {
    const { ctx, canvas } = badge;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background capsule badge
    ctx.fillStyle = isPlayer ? 'rgba(6, 16, 38, 0.94)' : 'rgba(38, 6, 16, 0.94)';
    ctx.strokeStyle = isPlayer ? '#00e5ff' : '#ff3366';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(6, 6, 268, 88, 16);
    else ctx.rect(6, 6, 268, 88);
    ctx.fill();
    ctx.stroke();

    // Icon Emoji
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(unit.emoji || '●', 42, 50);

    // Full Unit Name
    ctx.font = 'bold 20px "Meiryo", "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(unit.name, 78, 30);

    // HP Bar
    const maxHp = unit.maxHp || UNIT_TYPES[unit.id]?.hp || 4;
    const curHp = Math.max(0, unit.hp !== undefined ? unit.hp : maxHp);
    const hpRatio = Math.max(0, Math.min(1, curHp / maxHp));
    const barX = 78;
    const barY = 40;
    const barW = 115;
    const barH = 14;

    // HP background track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(barX, barY, barW, barH, 4);
    else ctx.rect(barX, barY, barW, barH);
    ctx.fill();
    ctx.stroke();

    // HP filled bar (green -> yellow -> red)
    let barColor = '#22c55e';
    if (hpRatio <= 0.3) barColor = '#ef4444';
    else if (hpRatio <= 0.6) barColor = '#eab308';
    ctx.fillStyle = barColor;
    const fillW = Math.max(0, barW * hpRatio);
    if (fillW > 0) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(barX, barY, fillW, barH, 4);
      else ctx.rect(barX, barY, fillW, barH);
      ctx.fill();
    }

    // HP Text
    ctx.font = 'bold 12px "Orbitron", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(`HP ${curHp}/${maxHp}`, 200, 52);

    // Subtitle: Fatigue or Role & Range
    ctx.font = 'bold 13px "Meiryo", sans-serif';
    if (unit.highGroundFatigueTimer > 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`⚠️ 疲労鈍足 (${unit.highGroundFatigueTimer.toFixed(0)}s)`, 78, 77);
    } else {
      const uData = UNIT_TYPES[unit.id];
      const roleText = uData ? `[${uData.role} 射程${unit.range}]` : '';
      ctx.fillStyle = isPlayer ? '#38bdf8' : '#fb7185';
      ctx.fillText(roleText, 78, 77);
    }

    if (badge.texture) badge.texture.needsUpdate = true;
  }

  createBillboardBadge(unit, isPlayer) {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.5, 0.89, 1.0);

    const badge = { sprite, texture, canvas, ctx };
    sprite.userData = { isBadge: true, unitKey: unit.key };
    this.drawBillboardContent(badge, unit, isPlayer);
    return badge;
  }

  refreshBillboardBadge(group, unit) {
    if (!group || !group.userData || !group.userData.badgeObj) return;
    const isPlayer = (unit.owner === this.myTeam);
    this.drawBillboardContent(group.userData.badgeObj, unit, isPlayer);
  }

  updateUnitMeshColor(group, newOwner) {
    if (!group || !group.userData) return;
    const isPlayer = (newOwner === this.myTeam);
    const teamColor = isPlayer ? 0x0284c7 : 0xbe123c;
    const glowColor = isPlayer ? 0x00e5ff : 0xff3366;

    if (group.userData.baseMat) {
      group.userData.baseMat.emissive.setHex(teamColor);
    }
    if (group.userData.glowMat) {
      group.userData.glowMat.color.setHex(glowColor);
      group.userData.glowMat.emissive.setHex(glowColor);
    }
    if (group.userData.ringMat) {
      group.userData.ringMat.color.setHex(glowColor);
    }
    if (group.userData.arrowMat) {
      group.userData.arrowMat.color.setHex(glowColor);
    }
    group.userData.isPlayer = isPlayer;

    const unit = this.units.get(group.userData.unitKey);
    if (unit && group.userData.badgeObj) {
      this.drawBillboardContent(group.userData.badgeObj, unit, isPlayer);
    }
  }

  createUnitMesh3D(unit) {
    const group = new THREE.Group();
    const isPlayer = (unit.owner === this.myTeam);
    const teamColor = isPlayer ? 0x0284c7 : 0xbe123c;
    const glowColor = isPlayer ? 0x00e5ff : 0xff3366;

    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      emissive: teamColor,
      emissiveIntensity: 0.45,
      metalness: 0.9,
      roughness: 0.2
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: glowColor,
      emissive: glowColor,
      emissiveIntensity: 0.95,
      metalness: 0.5,
      roughness: 0.1
    });

    // 1. Base Pedestal (Hexagonal disc, larger size 0.75)
    const baseGeom = new THREE.CylinderGeometry(0.68, 0.78, 0.22, 6);
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = 0.11;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Glowing Neon Ring around Base
    const ringGeom = new THREE.RingGeometry(0.8, 0.92, 16);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: glowColor, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.y = 0.05;
    group.add(ringMesh);

    // Dynamic 3D Recast/Cooldown Gauge Disc (Bright White Arc on unit base)
    const cdCanvas = document.createElement('canvas');
    cdCanvas.width = 128;
    cdCanvas.height = 128;
    const cdCtx = cdCanvas.getContext('2d');
    const cdTexture = new THREE.CanvasTexture(cdCanvas);
    cdTexture.minFilter = THREE.LinearFilter;
    const cdGeom = new THREE.PlaneGeometry(1.85, 1.85);
    cdGeom.rotateX(-Math.PI / 2);
    const cdMat = new THREE.MeshBasicMaterial({
      map: cdTexture,
      transparent: true,
      depthWrite: false
    });
    const cdMesh = new THREE.Mesh(cdGeom, cdMat);
    cdMesh.position.y = 0.055;
    group.add(cdMesh);

    group.userData.cooldownCanvas = cdCanvas;
    group.userData.cooldownCtx = cdCtx;
    group.userData.cooldownTexture = cdTexture;

    // Attack Direction Arrow Floor Projector (Points in unit's direction)
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.8);
    arrowShape.lineTo(-0.28, 0.1);
    arrowShape.lineTo(-0.1, 0.1);
    arrowShape.lineTo(-0.1, -0.6);
    arrowShape.lineTo(0.1, -0.6);
    arrowShape.lineTo(0.1, 0.1);
    arrowShape.lineTo(0.28, 0.1);
    arrowShape.closePath();
    const arrowGeom = new THREE.ShapeGeometry(arrowShape);
    arrowGeom.rotateX(-Math.PI / 2);
    const arrowMat = new THREE.MeshBasicMaterial({ color: glowColor, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const dirArrowMesh = new THREE.Mesh(arrowGeom, arrowMat);
    dirArrowMesh.position.set(0, 0.06, -0.3);
    group.add(dirArrowMesh);

    let headHeight = 1.6;

    // 2. Unit-Specific Cyber Chess Piece Figurines
    switch (unit.id) {
      case 'ARROW': {
        // Double Hex Spire + Sleek Needles
        headHeight = 1.9;
        const towerGeom = new THREE.ConeGeometry(0.46, 1.5, 6);
        const towerMesh = new THREE.Mesh(towerGeom, glowMat);
        towerMesh.position.y = 0.85;
        towerMesh.castShadow = true;
        group.add(towerMesh);

        // Sweeping Sonic Wings
        const wingGeom = new THREE.BoxGeometry(0.9, 0.08, 0.4);
        wingGeom.rotateX(Math.PI / 6);
        const wingMesh = new THREE.Mesh(wingGeom, baseMat);
        wingMesh.position.set(0, 0.65, 0.1);
        group.add(wingMesh);
        break;
      }
      case 'TANK': {
        // Heavy Hex-Shield Fortress + Armored Core
        headHeight = 1.7;
        const coreGeom = new THREE.BoxGeometry(0.85, 0.9, 0.85);
        const coreMesh = new THREE.Mesh(coreGeom, baseMat);
        coreMesh.position.y = 0.55;
        coreMesh.castShadow = true;
        group.add(coreMesh);

        // Massive Curved Shield Plate in Front
        const shieldGeom = new THREE.CylinderGeometry(0.65, 0.65, 1.05, 6, 1, false, 0, Math.PI);
        const shieldMesh = new THREE.Mesh(shieldGeom, glowMat);
        shieldMesh.position.set(0, 0.6, -0.35);
        shieldMesh.rotation.y = Math.PI;
        shieldMesh.castShadow = true;
        group.add(shieldMesh);
        break;
      }
      case 'SNIPER': {
        // Dual Magnetic Railgun Cannons + Tripod Mount + Long Scope
        headHeight = 1.8;
        const podGeom = new THREE.CylinderGeometry(0.42, 0.48, 0.65, 6);
        const podMesh = new THREE.Mesh(podGeom, baseMat);
        podMesh.position.y = 0.45;
        podMesh.castShadow = true;
        group.add(podMesh);

        // Long Rail Barrel (extends 1.6 units forward)
        const bGeom1 = new THREE.CylinderGeometry(0.11, 0.11, 1.75, 6);
        bGeom1.rotateX(Math.PI / 2);
        const barrel1 = new THREE.Mesh(bGeom1, glowMat);
        barrel1.position.set(0, 0.58, -0.75);
        group.add(barrel1);

        // Accelerator Coils
        [-0.3, -0.6, -0.9, -1.2].forEach(zOffset => {
          const cGeom = new THREE.TorusGeometry(0.18, 0.04, 6, 12);
          const coil = new THREE.Mesh(cGeom, glowMat);
          coil.position.set(0, 0.58, zOffset);
          group.add(coil);
        });
        break;
      }
      case 'SPREAD': {
        // 3-Barrel Heavy Artillery Turret (-30°, 0°, +30°)
        headHeight = 1.65;
        const bodyGeom = new THREE.CylinderGeometry(0.5, 0.55, 0.55, 6);
        const bodyMesh = new THREE.Mesh(bodyGeom, baseMat);
        bodyMesh.position.y = 0.4;
        bodyMesh.castShadow = true;
        group.add(bodyMesh);

        [-0.52, 0, 0.52].forEach(ang => {
          const bGeom = new THREE.CylinderGeometry(0.11, 0.11, 1.0, 6);
          bGeom.rotateX(Math.PI / 2);
          const bMesh = new THREE.Mesh(bGeom, glowMat);
          bMesh.rotation.y = ang;
          bMesh.position.set(Math.sin(ang) * 0.28, 0.52, -Math.cos(ang) * 0.55);
          group.add(bMesh);
        });
        break;
      }
      case 'REFLECTOR': {
        // 60-degree Angled Holographic Mirror Prism
        headHeight = 1.7;
        const baseBox = new THREE.CylinderGeometry(0.45, 0.5, 0.35, 6);
        const bMesh = new THREE.Mesh(baseBox, baseMat);
        bMesh.position.y = 0.3;
        group.add(bMesh);

        const mirrorGeom = new THREE.BoxGeometry(1.05, 0.9, 0.1);
        mirrorGeom.rotateY(Math.PI / 6);
        const mirrorMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: glowColor,
          emissiveIntensity: 0.95,
          metalness: 0.98,
          roughness: 0.02
        });
        const mirrorMesh = new THREE.Mesh(mirrorGeom, mirrorMat);
        mirrorMesh.position.set(0, 0.75, 0);
        mirrorMesh.castShadow = true;
        group.add(mirrorMesh);
        break;
      }
      case 'DISRUPTOR': {
        // Floating Plasma Sphere + Dual Counter-Rotating Gyro Cyber-Rings
        headHeight = 1.8;
        const coreSphGeom = new THREE.SphereGeometry(0.36, 16, 16);
        const coreSph = new THREE.Mesh(coreSphGeom, glowMat);
        coreSph.position.y = 0.8;
        group.add(coreSph);

        const ring1Geom = new THREE.TorusGeometry(0.62, 0.06, 8, 20);
        const ring1 = new THREE.Mesh(ring1Geom, glowMat);
        ring1.position.y = 0.8;
        group.add(ring1);

        const ring2Geom = new THREE.TorusGeometry(0.72, 0.05, 8, 20);
        const ring2 = new THREE.Mesh(ring2Geom, baseMat);
        ring2.position.y = 0.8;
        ring2.rotation.x = Math.PI / 3;
        group.add(ring2);

        group.userData.gyroRing1 = ring1;
        group.userData.gyroRing2 = ring2;
        break;
      }
      default: {
        const dGeom = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 6);
        const dMesh = new THREE.Mesh(dGeom, glowMat);
        dMesh.position.y = 0.55;
        group.add(dMesh);
      }
    }

    // 3. Floating 3D Billboard Head Badge (Always faces camera with unit symbol & name)
    const badgeObj = this.createBillboardBadge(unit, isPlayer);
    badgeObj.sprite.position.y = headHeight + 0.35;
    group.add(badgeObj.sprite);

    // 4. Transparent 3D Unit Hitbox Collider (tightly bounds figurine without protruding into neighbor tiles)
    const hitBoxGeom = new THREE.CylinderGeometry(0.48, 0.48, headHeight + 0.1, 8);
    const hitBoxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const hitBoxMesh = new THREE.Mesh(hitBoxGeom, hitBoxMat);
    hitBoxMesh.position.y = (headHeight + 0.1) / 2;
    hitBoxMesh.userData = { isUnitHitBox: true, unitKey: unit.key };
    group.add(hitBoxMesh);

    group.userData = {
      unitKey: unit.key,
      glowMat,
      baseMat,
      ringMat,
      arrowMat,
      hitBoxMesh,
      teamColor,
      glowColor,
      isPlayer,
      headHeight,
      badgeObj
    };

    return group;
  }

  // ================= 3D UPDATES & ANIMATIONS =================
  syncUnits3D(dt) {
    if (!this.scene) return;
    const activeKeys = new Set();

    this.units.forEach(unit => {
      activeKeys.add(unit.key);
      let group = this.unit3DMeshes.get(unit.key);

      if (!group) {
        group = this.createUnitMesh3D(unit);
        this.unit3DMeshes.set(unit.key, group);
        this.scene.add(group);
      }

      const cell = this.grid.get(unit.key);
      const targetBaseY = cell ? (cell.topY || 0.3) : 0.3;

      // Handle Flip Animation (Epic Reversal Flip!)
      if (unit.flipAnim) {
        unit.flipAnim.progress += dt;
        const dur = unit.flipAnim.duration || 0.65;
        const t = Math.min(1.0, unit.flipAnim.progress / dur);

        // Parabolic jump arc
        const jumpY = targetBaseY + Math.sin(t * Math.PI) * 2.4;
        group.position.y = jumpY;
        group.rotation.x = t * Math.PI;

        if (t >= 1.0) {
          unit.flipAnim = null;
          group.rotation.x = 0;
          group.position.y = targetBaseY;
        }
      } else if (unit.isMoving) {
        const targetWorld = this.hexToWorld3D(unit.q, unit.r);
        group.position.x += (targetWorld.x - group.position.x) * 0.35;
        group.position.z += (targetWorld.z - group.position.z) * 0.35;
        group.position.y = targetBaseY + Math.sin(unit.moveProgress * Math.PI) * 0.4;
      } else {
        const worldPos = this.hexToWorld3D(unit.q, unit.r);
        group.position.x = worldPos.x;
        group.position.z = worldPos.z;
        group.position.y = targetBaseY;
      }

      // Direction Rotation with shortest angular arc (aligned with 3D hex grid)
      const baseAngle = Math.PI / 6 - (unit.direction * Math.PI / 3);
      const targetAngle = this.isFlipped ? (baseAngle + Math.PI) : baseAngle;
      let diff = (targetAngle - group.rotation.y) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      group.rotation.y += diff * 0.35;

      if (group.userData.gyroRing1) {
        group.userData.gyroRing1.rotation.x += dt * 3.5;
        group.userData.gyroRing1.rotation.y += dt * 2.8;
      }
      if (group.userData.gyroRing2) {
        group.userData.gyroRing2.rotation.x -= dt * 2.5;
        group.userData.gyroRing2.rotation.z += dt * 3.2;
      }

      // Update Cooldown / Recast Gauge Disc (White arc for attack recast, green arc for move recast)
      if (group.userData.cooldownCtx) {
        const cCtx = group.userData.cooldownCtx;
        cCtx.clearRect(0, 0, 128, 128);

        // Faint background guide circle
        cCtx.beginPath();
        cCtx.arc(64, 64, 48, 0, Math.PI * 2);
        cCtx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        cCtx.lineWidth = 3;
        cCtx.stroke();

        // 1. Attack Cooldown Arc (Bright White Line)
        if (unit.fireCooldown > 0) {
          const progress = Math.max(0, Math.min(1, 1 - (unit.fireCooldown / unit.fireRate)));
          cCtx.beginPath();
          cCtx.arc(64, 64, 48, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
          cCtx.strokeStyle = '#ffffff';
          cCtx.shadowColor = '#ffffff';
          cCtx.shadowBlur = 10;
          cCtx.lineWidth = 6;
          cCtx.stroke();
          cCtx.shadowBlur = 0;
        } else {
          // Ready State: Solid bright white glow with gentle breathing pulse
          const pulse = 0.65 + 0.35 * Math.sin(performance.now() * 0.007);
          cCtx.beginPath();
          cCtx.arc(64, 64, 48, 0, Math.PI * 2);
          cCtx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
          cCtx.shadowColor = '#ffffff';
          cCtx.shadowBlur = 12;
          cCtx.lineWidth = 5;
          cCtx.stroke();
          cCtx.shadowBlur = 0;
        }

        // 2. Move Cooldown Arc (Emerald Green Line on outer radius)
        if (unit.moveCooldown > 0) {
          const mProgress = Math.max(0, Math.min(1, 1 - (unit.moveCooldown / unit.moveCooldownMax)));
          cCtx.beginPath();
          cCtx.arc(64, 64, 57, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * mProgress));
          cCtx.strokeStyle = '#34d399';
          cCtx.shadowColor = '#34d399';
          cCtx.shadowBlur = 8;
          cCtx.lineWidth = 4;
          cCtx.stroke();
          cCtx.shadowBlur = 0;
        }

        group.userData.cooldownTexture.needsUpdate = true;
      }

      const isEnemy = (unit.owner === this.enemyTeam);
      const isStealth = (isEnemy && this.enemyStealthTimer > 0) || (!isEnemy && this.stealthTimer > 0);
      group.visible = !isStealth;
    });

    // Clean up dead unit meshes
    this.unit3DMeshes.forEach((mesh, key) => {
      if (!activeKeys.has(key)) {
        this.scene.remove(mesh);
        this.unit3DMeshes.delete(key);
      }
    });

    // Rebuild active unit interactive targets for Raycaster (only physical figurine hitboxes, never wide billboard badges)
    this.unitInteractiveList = [];
    this.unit3DMeshes.forEach((meshGroup) => {
      if (meshGroup.visible && meshGroup.userData?.hitBoxMesh) {
        this.unitInteractiveList.push(meshGroup.userData.hitBoxMesh);
      }
    });

    // Update 3D Selection Ring on currently selected unit
    if (this.selectedBoardUnitKey && this.units.has(this.selectedBoardUnitKey)) {
      const selUnit = this.units.get(this.selectedBoardUnitKey);
      const wPos = this.hexToWorld3D(selUnit.q, selUnit.r);
      const cell = this.grid.get(this.selectedBoardUnitKey);
      const sBaseY = cell ? (cell.topY || 0.3) : 0.3;

      if (!this.selectedUnitRing3D) {
        const ringG = new THREE.RingGeometry(0.85, 1.05, 32);
        ringG.rotateX(-Math.PI / 2);
        const ringM = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92
        });
        this.selectedUnitRing3D = new THREE.Mesh(ringG, ringM);
        this.scene.add(this.selectedUnitRing3D);
      }
      this.selectedUnitRing3D.visible = true;
      this.selectedUnitRing3D.position.set(wPos.x, sBaseY + 0.05, wPos.z);
      this.selectedUnitRing3D.rotation.y += dt * 2.2;
      const pulse = 1.0 + Math.sin(performance.now() * 0.006) * 0.08;
      this.selectedUnitRing3D.scale.set(pulse, pulse, pulse);
    } else if (this.selectedUnitRing3D) {
      this.selectedUnitRing3D.visible = false;
    }
  }

  update3DCores(dt) {
    const time = performance.now() / 1000;
    if (this.crystalCores.blue) {
      this.crystalCores.blue.rotation.y += dt * 1.2;
      this.crystalCores.blue.rotation.z = Math.sin(time * 2.0) * 0.12;
      this.crystalCores.blue.position.y = 1.05 + Math.sin(time * 2.5) * 0.12;
    }
    if (this.crystalCores.red) {
      this.crystalCores.red.rotation.y -= dt * 1.2;
      this.crystalCores.red.rotation.x = Math.cos(time * 2.0) * 0.12;
      this.crystalCores.red.position.y = 1.05 + Math.cos(time * 2.5) * 0.12;
    }
  }

  update3DPillarsHighlight() {
    const time = performance.now() / 1000;

    this.hexPillarMeshes.forEach(mesh => {
      const key = mesh.userData.key;
      const isHover = (this.hoverHexKey === key);
      const isMoveTarget = this.validMoveHexes.includes(key);
      const isDeployTarget = (this.selectedDeckIndex !== null && mesh.userData.terrain !== TERRAIN.OBSTACLE && (this.isFlipped ? mesh.userData.r < 0 : mesh.userData.r > 0));

      let targetLift = 0.0;
      let targetEmissive = mesh.userData.defaultEmissive;

      if (isHover) {
        targetLift = 0.22; // Tactile lift on hover
        targetEmissive = 0x38bdf8;
      } else if (isMoveTarget) {
        targetLift = 0.12 + Math.sin(time * 6.0) * 0.06;
        targetEmissive = 0x22c55e;
      } else if (isDeployTarget) {
        targetEmissive = 0x0284c7;
      }

      mesh.position.y += (mesh.userData.baseCenterY + targetLift - mesh.position.y) * 0.3;
      if (mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setHex(targetEmissive);
      }
    });
  }

  createLaser3D(fromWorld, toWorld, owner) {
    if (!this.scene || !window.THREE) return;
    const isPlayer = (owner === this.myTeam);
    const color = isPlayer ? 0x00e5ff : 0xff3366;

    const dx = toWorld.x - fromWorld.x;
    const dz = toWorld.z - fromWorld.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 0.1) return;

    const geom = new THREE.CylinderGeometry(0.1, 0.1, dist, 6);
    geom.rotateX(Math.PI / 2);

    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95
    });

    const mesh = new THREE.Mesh(geom, mat);
    const midX = (fromWorld.x + toWorld.x) / 2;
    const midZ = (fromWorld.z + toWorld.z) / 2;
    mesh.position.set(midX, 1.2, midZ);
    mesh.lookAt(toWorld.x, 1.2, toWorld.z);

    this.scene.add(mesh);
    this.laserBeams3D.push({ mesh, timer: 0.2, maxTimer: 0.2 });
  }

  update3DLaserBeams(dt) {
    for (let i = this.laserBeams3D.length - 1; i >= 0; i--) {
      const beam = this.laserBeams3D[i];
      beam.timer -= dt;
      if (beam.timer <= 0) {
        this.scene.remove(beam.mesh);
        if (beam.mesh.geometry) beam.mesh.geometry.dispose();
        this.laserBeams3D.splice(i, 1);
      } else {
        beam.mesh.material.opacity = beam.timer / beam.maxTimer;
      }
    }
  }

};
