/**
 * HEX BASTION - UI Controller & Modal Setup Module
 */
import { UNIT_TYPES, BUFF_CARDS_DB } from '../core/constants.js';
import { sounds } from '../core/audio.js';

export const UIMethods = {
  // ================= UI Setup =================
  setupDeckDOM() {
    const container = document.getElementById('unit-deck-container');
    container.innerHTML = '';
    this.deckCardElements = [];

    this.deckSlots.forEach((slot, index) => {
      const data = UNIT_TYPES[slot.unitId];
      const card = document.createElement('div');
      card.className = 'unit-card';

      card.innerHTML = `
        <span class="cost-badge">${data.cost}</span>
        <canvas class="unit-icon-canvas" width="36" height="36"></canvas>
        <div class="unit-name">${data.name}</div>
        <div class="recast-overlay hidden">
          <span class="recast-time">0.0s</span>
        </div>
      `;

      const iconCanvas = card.querySelector('.unit-icon-canvas');
      this.drawUnitIcon(iconCanvas.getContext('2d'), slot.unitId, 18, 18, '#00e5ff');

      card.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, data.name, `コスト: ${data.cost} | 射程: ${data.range} | 移動CD: ${(data.moveCooldown * this.getRecastMultiplier()).toFixed(1)}s`, data.desc);
      });
      card.addEventListener('mouseleave', () => this.hideTooltip());

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();

        const now = performance.now() / 1000;
        if (slot.readyAt > now) return;

        if (this.getUnitCount(this.myTeam) >= this.getMaxUnits()) {
          this.showFloatingText(`駒数上限（${this.getMaxUnits()}体）です！`, this.mouseCanvasPos, '#fbbf24');
          return;
        }

        if (this.selectedDeckIndex === index) {
          this.selectedDeckIndex = null;
        } else {
          this.selectedDeckIndex = index;
          this.selectedBuffCard = null;
          this.selectedBoardUnitKey = null;
          this.validMoveHexes = [];
        }
        this.updateDeckSelectionStyles();
        this.updateBuffCardStyles();
        this.updateActionStatus();
        this.updateUnitInspector();
      });

      container.appendChild(card);
      this.deckCardElements.push(card);
    });
  }

  setupBuffCardsDOM() {
    const container = document.getElementById('buff-cards-container');
    container.innerHTML = '';
    this.buffCardElements = [];

    this.myCards.forEach((card) => {
      const el = document.createElement('div');
      el.className = 'tactical-card';
      el.innerHTML = `
        <span class="card-icon">${card.icon}</span>
        <div class="card-name">${card.name}</div>
        <div style="display: flex; gap: 3px; justify-content: center; align-items: center; margin-top: 2px;">
          <span class="card-tag">${card.tag}</span>
          ${card.scopeLabel ? `<span class="card-scope-badge">${card.scopeLabel}</span>` : ''}
        </div>
      `;

      el.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, card.name, `${card.tag} (${card.duration || ''}) ${card.scopeLabel ? '[' + card.scopeLabel + ']' : ''}`, card.desc);
      });
      el.addEventListener('mouseleave', () => this.hideTooltip());

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();
        if (card.used) return;

        if (['STEALTH', 'HYPER_BOOST', 'QUICK_STEP', 'MIND_DISRUPT', 'SPY_SATELLITE'].includes(card.id)) {
          this.useBuffCard(card);
          return;
        }

        if (this.selectedBuffCard === card) {
          this.selectedBuffCard = null;
        } else {
          this.selectedBuffCard = card;
          this.selectedDeckIndex = null;
          this.selectedBoardUnitKey = null;
          this.validMoveHexes = [];
        }
        this.updateBuffCardStyles();
        this.updateDeckSelectionStyles();
        this.updateActionStatus();
      });

      container.appendChild(el);
      this.buffCardElements.push(el);
    });
  }

  setupBriefingCardsDOM() {
    this.briefingCardsContainer.innerHTML = '';
    this.myCards.forEach(card => {
      const item = document.createElement('div');
      item.className = 'briefing-card-item';
      item.innerHTML = `
        <span class="briefing-card-icon">${card.icon}</span>
        <div class="briefing-card-name">${card.name}</div>
        <div style="display: flex; gap: 6px; justify-content: center; align-items: center; margin-top: 4px; margin-bottom: 4px;">
          <span class="briefing-card-tag">${card.tag}</span>
          ${card.scopeLabel ? `<span class="briefing-card-scope-badge">${card.scopeLabel}</span>` : ''}
        </div>
        <div class="briefing-card-desc">${card.desc}</div>
      `;
      this.briefingCardsContainer.appendChild(item);
    });
  }

  // ================= ALL 10 CARDS ARCHIVE DOM =================
  setupCardArchiveDOM() {
    const grid = document.getElementById('all-cards-archive-grid');
    if (!grid) return;
    grid.innerHTML = '';

    BUFF_CARDS_DB.forEach(card => {
      const item = document.createElement('div');
      item.className = 'archive-card-item';
      item.innerHTML = `
        <span class="archive-card-icon">${card.icon}</span>
        <div class="archive-card-name">${card.name}</div>
        <div style="display: flex; gap: 6px; justify-content: center; align-items: center; margin-top: 4px; margin-bottom: 4px;">
          <span class="archive-card-tag">${card.tag}</span>
          ${card.scopeLabel ? `<span class="archive-card-scope-badge">${card.scopeLabel}</span>` : ''}
        </div>
        <div class="archive-card-desc">${card.desc}</div>
      `;
      grid.appendChild(item);
    });
  }

  // ================= UNIT DRAFT SELECTOR UI =================
  setupDraftUnitsDOM() {
    this.draftUnitsContainer.innerHTML = '';
    this.selectedDraftUnitIds = [];
    this.updateDraftNeedCounter();

    Object.values(UNIT_TYPES).forEach(u => {
      const item = document.createElement('div');
      item.className = 'draft-unit-item';
      item.innerHTML = `
        <span class="check-badge">✓</span>
        <canvas class="unit-icon-canvas" width="32" height="32"></canvas>
        <div class="draft-unit-name">${u.name}</div>
        <div class="draft-unit-role">${u.role}</div>
      `;

      const iconCanvas = item.querySelector('.unit-icon-canvas');
      this.drawUnitIcon(iconCanvas.getContext('2d'), u.id, 16, 16, '#00e5ff');

      item.addEventListener('click', () => {
        sounds.init();
        const maxPick = this.getDraftNeedCount();
        const existingIdx = this.selectedDraftUnitIds.indexOf(u.id);

        if (existingIdx >= 0) {
          this.selectedDraftUnitIds.splice(existingIdx, 1);
          item.classList.remove('selected');
        } else {
          if (this.selectedDraftUnitIds.length < maxPick) {
            this.selectedDraftUnitIds.push(u.id);
            item.classList.add('selected');
          } else {
            this.showFloatingText(`最大${maxPick}体まで選択可能です`, { x: this.centerX, y: this.centerY }, '#fbbf24');
          }
        }
        this.updateDraftNeedCounter();
      });

      this.draftUnitsContainer.appendChild(item);
    });
  }

  updateDraftNeedCounter() {
    const need = this.getDraftNeedCount();
    const remain = Math.max(0, need - this.selectedDraftUnitIds.length);
    this.draftNeedCountEl.textContent = remain;
  }

  startDraftCountdown() {
    if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);
    // CPU match or draftTimeLimit <= 0: completely abolish timer (100% unlimited time)
    if (!this.isPvP || this.draftTimeLimit <= 0) {
      if (this.draftTimerBadge) {
        this.draftTimerBadge.textContent = '⏱️ 時間無制限 (作戦決定で開始)';
      }
      return;
    }
    this.draftTimerSeconds = this.draftTimeLimit;
    this.draftTimerBadge.textContent = `作戦決定まで: ${this.draftTimerSeconds}s`;

    this.draftTimerInterval = setInterval(() => {
      this.draftTimerSeconds--;
      this.draftTimerBadge.textContent = `作戦決定まで: ${this.draftTimerSeconds}s`;

      if (this.draftTimerSeconds <= 0) {
        clearInterval(this.draftTimerInterval);
        this.startCountdownSequence(true);
      }
    }, 1000);
  }

  updateEnemyCardsUI() {
    this.enemyCardsContainer.innerHTML = '';
    const isOpen = (!this.isPvP) || this.spySatelliteActive;

    this.enemyCards.forEach(card => {
      const el = document.createElement('div');
      if (isOpen) {
        el.className = `enemy-mini-card revealed ${card.used ? 'used' : ''}`;
        el.innerHTML = `
          <span>${card.icon}</span>
          <span class="enemy-card-name">${card.name}</span>
        `;
        el.addEventListener('mouseenter', (e) => this.showTooltip(e, `[敵手札] ${card.name}`, `${card.tag} (${card.duration || ''})`, card.desc));
        el.addEventListener('mouseleave', () => this.hideTooltip());
      } else {
        el.className = `enemy-mini-card hidden-card ${card.used ? 'used' : ''}`;
        el.innerHTML = `<span>?</span>`;
      }
      this.enemyCardsContainer.appendChild(el);
    });
  }

  updateDeckSelectionStyles() {
    this.deckCardElements.forEach((el, idx) => {
      if (this.selectedDeckIndex === idx) el.classList.add('selected');
      else el.classList.remove('selected');
    });
  }

  updateBuffCardStyles() {
    this.buffCardElements.forEach((el, idx) => {
      const card = this.myCards[idx];
      if (card.used) {
        el.classList.add('used');
        el.classList.remove('selected');
      } else if (this.selectedBuffCard === card) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
  }

  updateDeckCooldowns() {
    const now = performance.now() / 1000;
    this.deckSlots.forEach((slot, index) => {
      const el = this.deckCardElements[index];
      if (!el) return;

      const remaining = Math.max(0, slot.readyAt - now);
      const overlay = el.querySelector('.recast-overlay');
      const timeSpan = el.querySelector('.recast-time');

      if (remaining > 0) {
        el.classList.add('on-cooldown');
        overlay.classList.remove('hidden');
        timeSpan.textContent = `${remaining.toFixed(1)}s`;
      } else {
        el.classList.remove('on-cooldown');
        overlay.classList.add('hidden');
      }
    });
  }

  updateActionStatus() {
    if (this.selectedBoardUnitKey) {
      const unit = this.units.get(this.selectedBoardUnitKey);
      this.actionTextEl.textContent = `【${unit.name}】緑マスで移動 / 駒自身をクリックで回転`;
      this.actionTextEl.style.color = '#34d399';
    } else if (this.selectedBuffCard !== null) {
      this.actionTextEl.textContent = `【${this.selectedBuffCard.name}】対象マス/ユニットをクリック`;
      this.actionTextEl.style.color = '#fbbf24';
    } else {
      this.actionTextEl.textContent = '味方駒クリックで選択・移動 / 右クリックで逆回転・解除 / WASDでカメラ移動 / ホイールでズーム';
      this.actionTextEl.style.color = '#94a3b8';
    }
  }

  startCountdownSequence(broadcast = true) {
    if (this.isCountingDown) return;
    this.isCountingDown = true;
    if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);

    this.deployDraftedUnits();

    this.briefingModal.classList.add('hidden');
    this.countdownOverlay.classList.remove('hidden');

    if (this.isPvP && broadcast) {
      this.sendP2P({ type: 'START_BATTLE' });
    }

    let count = 3;
    this.countdownText.textContent = count;
    sounds.playCountdown();

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownText.textContent = count;
        sounds.playCountdown();
      } else if (count === 0) {
        this.countdownText.textContent = 'ENGAGE!';
        sounds.playStartHorn();
      } else {
        clearInterval(timer);
        this.countdownOverlay.classList.add('hidden');
        this.isBattleActive = true;
        this.isCountingDown = false;
        this.lastTime = performance.now();
        const startSec = performance.now() / 1000;
        this.aiLastActionTime = startSec + 2.0; // Grace period for player opening move
        this.aiLastCardTime = startSec + 6.0;   // Grace period before CPU uses cards
      }
    }, 850);
  }

};
