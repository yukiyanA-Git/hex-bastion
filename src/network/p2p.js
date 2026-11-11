/**
 * HEX BASTION - P2P WebRTC Networking & Matchmaking Module
 */
export const P2PNetworkMethods = {
  // ================= Match Setup Modal & P2P Setup =================
  initSetupModal() {
    this.modeOptCpu.addEventListener('click', () => {
      sounds.init();
      this.modeOptCpu.classList.add('selected');
      this.modeOptPvp.classList.remove('selected');
      this.setupCpuPanel.classList.remove('hidden');
      this.setupPvpPanel.classList.add('hidden');
      this.isPvP = false;
    });

    this.modeOptPvp.addEventListener('click', () => {
      sounds.init();
      this.modeOptPvp.classList.add('selected');
      this.modeOptCpu.classList.remove('selected');
      this.setupPvpPanel.classList.remove('hidden');
      this.setupCpuPanel.classList.add('hidden');
      this.isPvP = true;
    });

    this.cpuScale5.addEventListener('click', () => {
      sounds.init();
      this.gameMode = 'BLITZ';
      this.cpuScale5.classList.add('active');
      this.cpuScale8.classList.remove('active');
    });

    this.cpuScale8.addEventListener('click', () => {
      sounds.init();
      this.gameMode = 'TACTICAL';
      this.cpuScale8.classList.add('active');
      this.cpuScale5.classList.remove('active');
    });

    // CPU Difficulty Selector
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.init();
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.cpuDifficulty = btn.getAttribute('data-diff') || 'NORMAL';
        sounds.playStep();
      });
    });

    this.cpuStartBtn.addEventListener('click', () => {
      sounds.init();
      this.isPvP = false;
      this.badgePvp.textContent = `VS CPU (${this.cpuDifficulty})`;
      this.badgePvp.style.color = 'var(--player-blue)';
      this.startModal.classList.add('hidden');
      this.applyGameModeSettings();
      this.startNewGame(true);
    });

    this.pvpTabHost.addEventListener('click', () => {
      sounds.init();
      this.pvpTabHost.classList.add('active');
      this.pvpTabGuest.classList.remove('active');
      this.pvpTabRandom.classList.remove('active');
      this.pvpHostView.classList.remove('hidden');
      this.pvpGuestView.classList.add('hidden');
      this.pvpRandomView.classList.add('hidden');
    });

    this.pvpTabGuest.addEventListener('click', () => {
      sounds.init();
      this.pvpTabGuest.classList.add('active');
      this.pvpTabHost.classList.remove('active');
      this.pvpTabRandom.classList.remove('active');
      this.pvpGuestView.classList.remove('hidden');
      this.pvpHostView.classList.add('hidden');
      this.pvpRandomView.classList.add('hidden');
    });

    this.pvpTabRandom.addEventListener('click', () => {
      sounds.init();
      this.pvpTabRandom.classList.add('active');
      this.pvpTabHost.classList.remove('active');
      this.pvpTabGuest.classList.remove('active');
      this.pvpRandomView.classList.remove('hidden');
      this.pvpHostView.classList.add('hidden');
      this.pvpGuestView.classList.add('hidden');
    });

    // Random Matchmaking Scale Buttons
    if (this.randomScale5 && this.randomScale8) {
      this.randomScale5.addEventListener('click', () => {
        sounds.init();
        this.randomMatchMode = 'BLITZ';
        this.randomScale5.classList.add('active');
        this.randomScale8.classList.remove('active');
      });

      this.randomScale8.addEventListener('click', () => {
        sounds.init();
        this.randomMatchMode = 'TACTICAL';
        this.randomScale8.classList.add('active');
        this.randomScale5.classList.remove('active');
      });
    }

    if (this.randomMatchBtn) {
      this.randomMatchBtn.addEventListener('click', () => {
        sounds.init();
        this.startRandomMatchmaking();
      });
    }

    if (this.randomCancelBtn) {
      this.randomCancelBtn.addEventListener('click', () => {
        sounds.init();
        this.cancelRandomMatchmaking();
      });
    }

    ['pvp-timer-0', 'pvp-timer-20', 'pvp-timer-40', 'pvp-timer-60'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          sounds.init();
          ['pvp-timer-0', 'pvp-timer-20', 'pvp-timer-40', 'pvp-timer-60'].forEach(bId => {
            document.getElementById(bId)?.classList.remove('active');
          });
          btn.classList.add('active');
          this.draftTimeLimit = parseInt(btn.getAttribute('data-time'), 10);
          sounds.playStep();
        });
      }
    });

    const startMuteBtn = document.getElementById('start-mute-btn');
    if (startMuteBtn) {
      startMuteBtn.addEventListener('click', () => this.toggleMute());
    }

    this.pvpCreateBtn.addEventListener('click', () => {
      sounds.init();
      this.pvpCreateBtn.disabled = true;
      this.pvpCreateBtn.textContent = '合言葉を発行中...';
      const code = 'hb-' + Math.floor(1000 + Math.random() * 9000);
      try {
        this.peer = new Peer(code);
        this.peer.on('open', (id) => {
          this.isHost = true;
          this.myTeam = 'blue';
          this.enemyTeam = 'red';
          this.isFlipped = false;
          this.hostCodeVal.value = id;
          this.hostRoomInfo.classList.remove('hidden');
          this.pvpCreateBtn.textContent = '部屋を作成しました';
        });

        this.peer.on('connection', (connection) => {
          this.conn = connection;
          this.setupP2PConnection();
        });

        this.peer.on('error', (err) => {
          alert('接続エラー: ' + err);
          this.pvpCreateBtn.disabled = false;
          this.pvpCreateBtn.textContent = '部屋を作成し合言葉を発行';
        });
      } catch(e){}
    });

    this.copyHostCodeBtn.addEventListener('click', () => {
      sounds.init();
      this.hostCodeVal.select();
      navigator.clipboard.writeText(this.hostCodeVal.value);
      alert('合言葉をコピーしました！相手に共有してください。');
    });

    this.guestJoinBtn.addEventListener('click', () => {
      sounds.init();
      const code = this.guestCodeVal.value.trim().toLowerCase();
      if (!code) {
        alert('合言葉を入力してください');
        return;
      }

      this.guestJoinBtn.disabled = true;
      this.guestJoinBtn.textContent = '接続中...';

      try {
        this.peer = new Peer();
        this.peer.on('open', () => {
          this.conn = this.peer.connect(code);
          this.isHost = false;
          this.myTeam = 'red';
          this.enemyTeam = 'blue';
          this.isFlipped = true;
          this.setupP2PConnection();
        });

        this.peer.on('error', (err) => {
          alert('接続失敗: ' + err);
          this.guestJoinBtn.disabled = false;
          this.guestJoinBtn.textContent = '参加する';
        });
      } catch(e){}
    });

    // Start Page Quick Manual Buttons
    const startOpenHelpBtn = document.getElementById('start-open-help-btn');
    if (startOpenHelpBtn) {
      startOpenHelpBtn.addEventListener('click', () => {
        sounds.init();
        this.helpModal.classList.remove('hidden');
      });
    }

    const startOpenCardsBtn = document.getElementById('start-open-cards-btn');
    if (startOpenCardsBtn) {
      startOpenCardsBtn.addEventListener('click', () => {
        sounds.init();
        this.cardArchiveModal.classList.remove('hidden');
      });
    }

    const briefingOpenCardsBtn = document.getElementById('briefing-open-cards-btn');
    if (briefingOpenCardsBtn) {
      briefingOpenCardsBtn.addEventListener('click', () => {
        sounds.init();
        this.cardArchiveModal.classList.remove('hidden');
      });
    }
  }

  // ================= Serverless Random Matchmaking (Free Match) =================
  startRandomMatchmaking(slotIndex = 1) {
    if (!this.isRandomMatching && slotIndex === 1) {
      this.isRandomMatching = true;
      this.gameMode = this.randomMatchMode;
      this.draftTimeLimit = 60; // Draft time fixed at 60s for random matches
      if (this.randomMatchBtn) this.randomMatchBtn.classList.add('hidden');
      if (this.randomMatchSearching) this.randomMatchSearching.classList.remove('hidden');
    }

    if (!this.isRandomMatching) return;

    const mode = this.randomMatchMode.toLowerCase();
    const maxSlots = 5;
    const currentSlot = ((slotIndex - 1) % maxSlots) + 1;
    const targetSlotId = `hb-free-${mode}-${currentSlot}`;

    if (this.searchingStatusText) {
      this.searchingStatusText.textContent = `対戦相手を検索中... (Slot ${currentSlot})`;
    }
    if (this.searchingSubText) {
      this.searchingSubText.textContent = `${this.randomMatchMode === 'TACTICAL' ? '8vs8 (TACTICAL)' : '5vs5 (BLITZ)'} の待機プレイヤーを探しています`;
    }

    // Step 1: Probe slot as Guest using a temporary Peer
    try {
      if (this.probePeer) {
        try { this.probePeer.destroy(); } catch(e){}
        this.probePeer = null;
      }
      this.probePeer = new Peer();
      let probeResolved = false;

      const finishProbe = () => {
        if (probeResolved) return;
        probeResolved = true;
        if (this.randomMatchTimeout) {
          clearTimeout(this.randomMatchTimeout);
          this.randomMatchTimeout = null;
        }
        if (this.probePeer) {
          try { this.probePeer.destroy(); } catch(e){}
          this.probePeer = null;
        }
        if (this.isRandomMatching) {
          this.becomeMatchHost(targetSlotId, slotIndex);
        }
      };

      this.randomMatchTimeout = setTimeout(finishProbe, 1400);

      this.probePeer.on('open', () => {
        if (probeResolved || !this.isRandomMatching) return;
        const testConn = this.probePeer.connect(targetSlotId, { reliable: true });

        testConn.on('open', () => {
          if (probeResolved || !this.isRandomMatching) {
            try { testConn.close(); } catch(e){}
            return;
          }
          probeResolved = true;
          if (this.randomMatchTimeout) {
            clearTimeout(this.randomMatchTimeout);
            this.randomMatchTimeout = null;
          }

          // Found an existing host! We become the GUEST.
          this.peer = this.probePeer;
          this.probePeer = null;
          this.conn = testConn;
          this.isHost = false;
          this.myTeam = 'red';
          this.enemyTeam = 'blue';
          this.isFlipped = true;

          this.onMatchFound();
          this.setupP2PConnection();
        });

        testConn.on('error', () => finishProbe());
      });

      this.probePeer.on('error', () => finishProbe());
    } catch(e) {
      this.becomeMatchHost(targetSlotId, slotIndex);
    }
  }

  becomeMatchHost(slotId, slotIndex) {
    if (!this.isRandomMatching) return;
    const currentSlot = ((slotIndex - 1) % 5) + 1;
    if (this.searchingStatusText) this.searchingStatusText.textContent = `対戦待機室を開設中... (Slot ${currentSlot})`;
    if (this.searchingSubText) this.searchingSubText.textContent = '相手の参加を待っています... (検出時に即座に開始)';

    try {
      if (this.peer) {
        try { this.peer.destroy(); } catch(e){}
        this.peer = null;
      }

      this.peer = new Peer(slotId);

      this.peer.on('open', () => {
        if (!this.isRandomMatching) return;
        this.isHost = true;
        this.myTeam = 'blue';
        this.enemyTeam = 'red';
        this.isFlipped = false;
        if (this.searchingStatusText) this.searchingStatusText.textContent = `相手の接続を待機中... (Slot ${currentSlot})`;
      });

      this.peer.on('connection', (connection) => {
        if (!this.isRandomMatching) return;
        this.conn = connection;
        this.onMatchFound();
        this.setupP2PConnection();
      });

      this.peer.on('error', (err) => {
        // If slot ID is already in use / stale, advance to next slot after brief pause
        if (this.isRandomMatching) {
          if (this.peer) {
            try { this.peer.destroy(); } catch(e){}
            this.peer = null;
          }
          setTimeout(() => {
            if (this.isRandomMatching) {
              this.startRandomMatchmaking(slotIndex + 1);
            }
          }, 350);
        }
      });
    } catch(e) {
      if (this.isRandomMatching) {
        setTimeout(() => this.startRandomMatchmaking(slotIndex + 1), 350);
      }
    }
  }

  onMatchFound() {
    this.isRandomMatching = false;
    if (this.randomMatchTimeout) {
      clearTimeout(this.randomMatchTimeout);
      this.randomMatchTimeout = null;
    }
    if (this.probePeer) {
      try { this.probePeer.destroy(); } catch(e){}
      this.probePeer = null;
    }
    this.draftTimeLimit = 60; // Draft time fixed at 60s for random matchmaking
    if (this.randomMatchSearching) this.randomMatchSearching.classList.add('hidden');
    if (this.randomMatchBtn) this.randomMatchBtn.classList.remove('hidden');
    sounds.playAlert();
  }

  cancelRandomMatchmaking() {
    this.isRandomMatching = false;
    if (this.randomMatchTimeout) {
      clearTimeout(this.randomMatchTimeout);
      this.randomMatchTimeout = null;
    }
    if (this.probePeer) {
      try { this.probePeer.destroy(); } catch(e){}
      this.probePeer = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch(e){}
      this.peer = null;
    }
    if (this.conn) {
      try { this.conn.close(); } catch(e){}
      this.conn = null;
    }
    if (this.randomMatchSearching) this.randomMatchSearching.classList.add('hidden');
    if (this.randomMatchBtn) this.randomMatchBtn.classList.remove('hidden');
    sounds.playStep();
  }

  setupP2PConnection() {
    const handleOpen = () => {
      this.isPvP = true;
      this.badgePvp.textContent = 'ONLINE PVP';
      this.badgePvp.style.color = '#34d399';
      this.startModal.classList.add('hidden');

      if (this.isHost) {
        this.applyGameModeSettings();
        this.startNewGame(true);

        this.sendP2P({
          type: 'HANDSHAKE',
          mode: this.gameMode,
          draftTimer: this.draftTimeLimit,
          rate: this.myRate,
          cards: this.myCards.map(c => ({ id: c.id, name: c.name, icon: c.icon, desc: c.desc, tag: c.tag }))
        });
      } else {
        // Guest sends back HANDSHAKE_GUEST with cards & rate
        this.sendP2P({
          type: 'HANDSHAKE_GUEST',
          rate: this.myRate,
          cards: this.myCards.map(c => ({ id: c.id, name: c.name, icon: c.icon, desc: c.desc, tag: c.tag }))
        });
      }
    };

    if (this.conn && this.conn.open) {
      handleOpen();
    } else if (this.conn) {
      this.conn.on('open', handleOpen);
    }

    if (this.conn) {
      this.conn.on('data', (data) => this.handleP2PData(data));
      this.conn.on('close', () => {
        alert('対戦相手が切断しました。');
        this.isPvP = false;
        this.badgePvp.textContent = 'VS CPU';
      });
    }
  }

  applyGameModeSettings() {
    this.badgeMode.textContent = (this.gameMode === 'TACTICAL') ? 'TACTICAL (8体/無制限)' : 'BLITZ (5体)';
    this.briefingRuleBadge.textContent = (this.gameMode === 'TACTICAL') ? 'TACTICAL (8体対戦/時間無制限)' : 'BLITZ (5体対戦/5分戦)';
    this.briefingSubText.textContent = (this.gameMode === 'TACTICAL')
      ? '配給カードを確認し、初期配備する追加ユニット6体を選んでください（未選択時は自動ランダム配置）。'
      : '配給カードを確認し、初期配備する追加ユニット3体を選んでください（未選択時は自動ランダム配置）。';
    this.initCanvas();
    this.updateCameraPosition();
  }

  sendP2P(data) {
    if (this.conn && this.conn.open) this.conn.send(data);
  }

  handleP2PData(data) {
    switch (data.type) {
      case 'HANDSHAKE_GUEST':
        this.enemyRate = data.rate || 100;
        this.enemyCards = data.cards || [];
        this.updateEnemyCardsUI();
        break;
      case 'HANDSHAKE':
        this.startModal.classList.add('hidden'); // Double ensure startModal is closed on guest!
        if (data.draftTimer !== undefined) {
          this.draftTimeLimit = data.draftTimer;
        }
        if (data.mode) {
          this.gameMode = data.mode;
          this.applyGameModeSettings();
          this.startNewGame(true);
        }
        this.enemyRate = data.rate || 100;
        this.enemyCards = data.cards || [];
        this.updateEnemyCardsUI();
        break;
      case 'DRAFT_READY':
        this.enemyDraftReady = true;
        if (data.draftedUnits && Array.isArray(data.draftedUnits)) {
          this.enemyDraftUnitIds = data.draftedUnits;
        }
        if (this.myDraftReady) {
          if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);
          this.startCountdownSequence(true);
        } else {
          if (this.draftTimerBadge) {
            this.draftTimerBadge.textContent = '⏱️ 相手準備完了！(決定で即開始)';
            this.draftTimerBadge.style.color = '#34d399';
          }
        }
        break;
      case 'START_BATTLE':
        this.startCountdownSequence(false);
        break;
      case 'DEPLOY':
        this.spawnUnit(data.q, data.r, data.unitId, data.owner, data.dir);
        break;
      case 'MOVE':
        const unit = this.units.get(data.unitKey);
        if (unit) this.executeUnitMove(unit, data.targetKey, false);
        break;
      case 'ROTATE':
        const rUnit = this.units.get(data.unitKey);
        if (rUnit) {
          rUnit.direction = data.newDir;
          this.checkReversals(rUnit);
          sounds.playDeploy();
        }
        break;
      case 'CARD_USE':
        this.notifyCardUsedByEnemy(data.card);
        this.applyEnemyCardEffect(data.card, data.targetKey);
        break;
      case 'DAMAGE_CORE':
        this.applyDamageToCore(data.target, data.amount, false);
        break;
      case 'DAMAGE_UNIT':
        const dmgUnit = this.units.get(data.unitKey);
        if (dmgUnit) {
          const attacker = data.attackerKey ? this.units.get(data.attackerKey) : null;
          this.applyDamageToUnit(dmgUnit, data.amount, attacker, false);
        }
        break;
      case 'DESTROY_UNIT':
        const destUnit = this.units.get(data.unitKey);
        if (destUnit) {
          this.destroyUnit(destUnit, false);
        }
        break;
    }
  }

  notifyCardUsedByEnemy(card) {
    sounds.playAlert();
    this.cardAlertBannerEl.textContent = `相手が【${card.name}】を発動！`;
    this.cardAlertBannerEl.classList.remove('hidden');
    this.cardAlertBannerEl.style.animation = 'none';
    this.cardAlertBannerEl.offsetHeight;
    this.cardAlertBannerEl.style.animation = null;
  }

  applyEnemyCardEffect(card, targetKey) {
    if (card.id === 'STEALTH') {
      this.enemyStealthTimer = 10;
    } else if (card.id === 'INVINCIBLE') {
      const u = this.units.get(targetKey);
      if (u) u.invincibleTimer = 10;
    } else if (card.id === 'MIND_DISRUPT') {
      this.reshuffleMyUnspentCards();
    } else if (card.id === 'SCAFFOLD') {
      const cell = this.grid.get(targetKey);
      if (cell) {
        cell.terrain = TERRAIN.HIGH_GROUND;
        this.build3DGrid();
      }
    } else if (card.id === 'ENERGY_SURGE') {
      const u = this.units.get(targetKey);
      if (u) {
        const oldMax = u.maxHp;
        u.maxHp = Math.max(oldMax + 1, Math.round(u.maxHp * 1.3));
        const hpGain = u.maxHp - oldMax;
        u.hp = Math.min(u.maxHp, u.hp + hpGain);
        const group = this.unit3DMeshes.get(u.key);
        if (group) this.refreshBillboardBadge(group, u);
      }
    } else if (card.id === 'OVERCHARGE') {
      const u = this.units.get(targetKey);
      if (u) u.range += 2;
    } else if (card.id === 'ANTIHACK') {
      const u = this.units.get(targetKey);
      if (u) u.shield = (u.shield || 0) + 1;
    }
  }

};
