/**
 * HEX BASTION - Cinematic 3D Cyber-Chess Edition
 * 
 * Features:
 * 1. Dramatic Board Elevation (High Ground CLIFF stands at +1.9 height with stepped neon fortress pillars)
 * 2. Distinctive 3D Cyber Chess Figurines + Camera-facing 3D Billboard Head Badges + Attack Direction Projectors
 * 3. 360° Free Camera Orbit Controls (Right-click drag to rotate, wheel to zoom, reset button)
 * 4. All 10 Tactical Cards with unique icons + Dedicated Card Archive Modal
 * 5. Integrated How-To-Play Manual on Start Screen & HUD
 */

// ================= Audio Synthesizer =================
class SoundController {
  constructor() {
    this.ctx = null;
    const isMuted = localStorage.getItem('hex_bastion_muted') === 'true';
    this.enabled = !isMuted;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDeploy() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch(e){}
  }

  playStep() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch(e){}
  }

  playLaser() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch(e){}
  }

  playReversal() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.2, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });
    } catch(e){}
  }

  playHit() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch(e){}
  }

  playBuff() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch(e){}
  }

  playAlert() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch(e){}
  }

  playCountdown() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch(e){}
  }

  playStartHorn() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch(e){}
  }
}

const sounds = new SoundController();

// ================= Hex Geometry (Vertical) =================
const HEX_DIRECTIONS = [
  { q: 0,  r: -1, s: 1,  angle: -Math.PI / 2 },       // 0: North
  { q: 1,  r: -1, s: 0,  angle: -Math.PI / 6 },       // 1: North-East
  { q: 1,  r: 0,  s: -1, angle: Math.PI / 6 },        // 2: South-East
  { q: 0,  r: 1,  s: -1, angle: Math.PI / 2 },        // 3: South
  { q: -1, r: 1,  s: 0,  angle: 5 * Math.PI / 6 },    // 4: South-West
  { q: -1, r: 0,  s: 1,  angle: -5 * Math.PI / 6 }    // 5: North-West
];

function cubeAdd(a, b) {
  return { q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
}

function cubeKey(c) {
  return `${c.q},${c.r}`;
}

function getDirIndexBetween(from, to) {
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

// ================= Units & Cards Database =================
const TERRAIN = {
  EMPTY: 'EMPTY',
  HIGH_GROUND: 'HIGH_GROUND',
  OBSTACLE: 'OBSTACLE',
  CORE_BOTTOM: 'CORE_BOTTOM',
  CORE_TOP: 'CORE_TOP'
};

const UNIT_TYPES = {
  ARROW: {
    id: 'ARROW',
    name: 'アロータワー',
    emoji: '🏹',
    role: '早撃・機動',
    cost: 2,
    recast: 2.5,
    fireRate: 2.2,
    moveCooldown: 2.2,
    moveType: 'ALL_ADJACENT',
    range: 3,
    hp: 4,
    dirs: [0],
    desc: '標準型。全方向1マス移動。正面3マス早撃ち。機動力と扱いやすさが抜群。'
  },
  SPREAD: {
    id: 'SPREAD',
    name: 'スプレッド',
    emoji: '💥',
    role: '扇状近接',
    cost: 3,
    recast: 3.0,
    fireRate: 2.0,
    moveCooldown: 2.2,
    moveType: 'ALL_ADJACENT',
    range: 1,
    hp: 5,
    dirs: [0, 1, 5],
    desc: '扇状迎撃型。全方向1マス移動。正面3方向の至近マスを制圧し、防衛線を構築。'
  },
  SNIPER: {
    id: 'SNIPER',
    name: 'レールガン',
    emoji: '🎯',
    role: '長距離狙撃',
    cost: 4,
    recast: 4.5,
    fireRate: 3.2,
    moveCooldown: 3.2,
    moveType: 'ALL_ADJACENT',
    range: 5,
    hp: 3,
    dirs: [0],
    desc: '長距離狙撃型。直線5マス。移動後足止めが重いため、高台に陣取ると凶悪。'
  },
  REFLECTOR: {
    id: 'REFLECTOR',
    name: 'リフレクター',
    emoji: '🪞',
    role: '屈折反射',
    cost: 2,
    recast: 3.0,
    fireRate: 999,
    moveCooldown: 2.0,
    moveType: 'ALL_ADJACENT',
    range: 0,
    hp: 5,
    dirs: [],
    desc: '反射板。全方向1マス移動。味方レーザーを60度屈折させ、奇襲挟み撃ちを作る。'
  },
  TANK: {
    id: 'TANK',
    name: 'アイアンクラッド',
    emoji: '🛡️',
    role: '重装突撃',
    cost: 5,
    recast: 5.0,
    fireRate: 3.0,
    moveCooldown: 2.5,
    moveType: 'FORWARD_ONLY',
    range: 2,
    hp: 8,
    shield: 1,
    dirs: [0],
    desc: '重装要塞型。【前方3方向のみ移動可能】。シールドで挟まれても1回耐える突撃戦車。'
  },
  DISRUPTOR: {
    id: 'DISRUPTOR',
    name: 'ディスラプター',
    emoji: '🌀',
    role: '撹乱妨害',
    cost: 3,
    recast: 3.5,
    fireRate: 2.6,
    moveCooldown: 2.0,
    moveType: 'ALL_ADJACENT',
    range: 3,
    hp: 4,
    dirs: [0],
    desc: '妨害撹乱型。全方向1マス移動。直線上の敵の向きを狂わせ、防衛線を破壊する。'
  }
};

// All 10 Tactical Cards with distinct intuitive Animal Motifs & Face Icons
const BUFF_CARDS_DB = [
  {
    id: 'STEALTH',
    name: 'ステルス【カメレオン】',
    icon: '🦎',
    tag: '光学迷彩',
    duration: '10秒間',
    desc: '【10秒間】相手画面から自軍の全ユニットの姿が見えなくなる。カメレオンの擬態で不意打ちの挟み撃ちに最適。'
  },
  {
    id: 'INVINCIBLE',
    name: 'インビンシブル【ゴリラ】',
    icon: '🦍',
    tag: '絶対無敵',
    duration: '10秒間',
    desc: '指定した味方1体を【10秒間】完全無敵化。ゴリラの如き剛力でダメージ・反転・ディスラプト妨害を一切無効化。'
  },
  {
    id: 'HYPER_BOOST',
    name: 'ハイパーブースト【チーター】',
    icon: '🐆',
    tag: '俊足跳躍',
    duration: '3回分',
    desc: '次の【3回】の移動可能距離が2マス（2ヘックス跳躍）に延長。チーターの爆発的瞬発力で敵警戒網を一気に飛び越える。'
  },
  {
    id: 'QUICK_STEP',
    name: 'クイックステップ【兎】',
    icon: '🐇',
    tag: 'リキャ半減',
    duration: '5回分',
    desc: '次の【5回】の移動リキャスト（足止め時間）が50%短縮。脱兎の跳躍ステップで盤面を駆け巡る。'
  },
  {
    id: 'MIND_DISRUPT',
    name: 'マインドシャッフル【狐】',
    icon: '🦊',
    tag: '手札破壊',
    duration: '即時1回',
    desc: '相手が保持している未消費の戦術カードを全て【強制再抽選】し、妖狐の化かし術で相手の作戦を崩壊させる。'
  },
  {
    id: 'SPY_SATELLITE',
    name: 'スパイサテライト【梟】',
    icon: '🦉',
    tag: '情報看破',
    duration: '試合終了まで',
    desc: '相手の隠された非公開カードを自画面で全て【常時表向きオープン】にする。梟の千里眼で奇襲を完全に見破る。'
  },
  {
    id: 'SCAFFOLD',
    name: 'フォートレス【亀】',
    icon: '🐢',
    tag: '高台要塞',
    duration: '永続',
    desc: '任意の平地ヘックスを1箇所【高台】に隆起させる（射程+1 ＆ 低地からの反転無効要塞化）。大亀の甲羅シェルター。'
  },
  {
    id: 'OVERCHARGE',
    name: 'スナイプレンジ【鷹】',
    icon: '🦅',
    tag: '射程延長',
    duration: '永続',
    desc: '指定した味方ユニット1体の射程を永続的に【+2マス】延長する。鷹の鋭い遠視力で長距離狙撃砲に化ける。'
  },
  {
    id: 'ANTIHACK',
    name: 'ハックシールド【サイ】',
    icon: '🦏',
    tag: '耐性付与',
    duration: '反転1回消費',
    desc: '指定した味方ユニットに剛角シールドを付与し、次の【オセロ反転を1度完全無効化】する。前線防衛の盾。'
  },
  {
    id: 'ENERGY_SURGE',
    name: 'エナジーサージ【象】',
    icon: '🐘',
    tag: 'マナ全快',
    duration: '即時',
    desc: 'エネルギーを即座に【全回復（+10）】する。巨象の雄大な生命力で一気に高コスト駒を展開して前線を押し上げる。'
  }
];

// ================= Main Game Engine =================
class HexBastionGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.playerHpEl = document.getElementById('player-hp');
    this.enemyHpEl = document.getElementById('enemy-hp');
    this.playerHpBar = document.getElementById('player-hp-bar');
    this.enemyHpBar = document.getElementById('enemy-hp-bar');
    this.playerUnitCountEl = document.getElementById('player-unit-count');
    this.enemyUnitCountEl = document.getElementById('enemy-unit-count');
    this.energyValEl = document.getElementById('energy-val');
    this.energyMeterEl = document.getElementById('energy-meter');
    this.gameTimerEl = document.getElementById('game-timer');
    this.combatBannerEl = document.getElementById('combat-banner');
    this.cardAlertBannerEl = document.getElementById('card-alert-banner');
    this.actionTextEl = document.getElementById('active-action-text');
    this.tooltipEl = document.getElementById('custom-tooltip');
    this.playerRateEl = document.getElementById('player-rate-val');

    // Start Setup Modal Elements
    this.startModal = document.getElementById('start-modal');
    this.modeOptCpu = document.getElementById('mode-opt-cpu');
    this.modeOptPvp = document.getElementById('mode-opt-pvp');
    this.setupCpuPanel = document.getElementById('setup-cpu-panel');
    this.setupPvpPanel = document.getElementById('setup-pvp-panel');
    this.cpuScale5 = document.getElementById('cpu-scale-5');
    this.cpuScale8 = document.getElementById('cpu-scale-8');
    this.cpuStartBtn = document.getElementById('cpu-start-btn');
    this.pvpTabHost = document.getElementById('pvp-tab-host');
    this.pvpTabGuest = document.getElementById('pvp-tab-guest');
    this.pvpTabRandom = document.getElementById('pvp-tab-random');
    this.pvpHostView = document.getElementById('pvp-host-view');
    this.pvpGuestView = document.getElementById('pvp-guest-view');
    this.pvpRandomView = document.getElementById('pvp-random-view');
    this.pvpTimer0 = document.getElementById('pvp-timer-0');
    this.pvpTimer20 = document.getElementById('pvp-timer-20');
    this.pvpTimer40 = document.getElementById('pvp-timer-40');
    this.pvpTimer60 = document.getElementById('pvp-timer-60');

    // Random Matchmaking Elements
    this.randomScale5 = document.getElementById('random-scale-5');
    this.randomScale8 = document.getElementById('random-scale-8');
    this.randomMatchBtn = document.getElementById('random-match-btn');
    this.randomMatchSearching = document.getElementById('random-match-searching');
    this.searchingStatusText = document.getElementById('searching-status-text');
    this.searchingSubText = document.getElementById('searching-sub-text');
    this.randomCancelBtn = document.getElementById('random-cancel-btn');

    // Unit Inspector Elements
    this.unitInspectorBar = document.getElementById('unit-inspector-bar');
    this.inspectIcon = document.getElementById('inspect-icon');
    this.inspectName = document.getElementById('inspect-name');
    this.inspectRole = document.getElementById('inspect-role');
    this.inspectSide = document.getElementById('inspect-side');
    this.inspectDesc = document.getElementById('inspect-desc');
    this.inspectStatsRow = document.getElementById('inspect-stats-row');
    this.inspectStatHp = document.getElementById('inspect-stat-hp');
    this.inspectStatRange = document.getElementById('inspect-stat-range');
    this.inspectStatDir = document.getElementById('inspect-stat-dir');
    this.pvpCreateBtn = document.getElementById('pvp-create-btn');
    this.hostRoomInfo = document.getElementById('host-room-info');
    this.hostCodeVal = document.getElementById('host-code-val');
    this.copyHostCodeBtn = document.getElementById('copy-host-code-btn');
    this.guestCodeVal = document.getElementById('guest-code-val');
    this.guestJoinBtn = document.getElementById('guest-join-btn');

    // Briefing Elements
    this.briefingModal = document.getElementById('briefing-modal');
    this.briefingRuleBadge = document.getElementById('briefing-rule-badge');
    this.briefingSubText = document.getElementById('briefing-sub-text');
    this.briefingCardsContainer = document.getElementById('briefing-cards-container');
    this.draftUnitsContainer = document.getElementById('draft-units-container');
    this.draftTimerBadge = document.getElementById('draft-timer-badge');
    this.draftNeedCountEl = document.getElementById('draft-need-count');
    this.startBattleBtn = document.getElementById('start-battle-btn');
    this.briefingReadyStatus = document.getElementById('briefing-ready-status');
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownText = document.getElementById('countdown-text');
    this.badgeMode = document.getElementById('badge-mode');
    this.badgePvp = document.getElementById('badge-pvp');
    this.enemyCardsContainer = document.getElementById('enemy-cards-container');

    // Modals for Manual & Archive
    this.cardArchiveModal = document.getElementById('card-archive-modal');
    this.helpModal = document.getElementById('help-modal');

    // Rates (Floor capped at 100)
    this.myRate = Math.max(100, parseInt(localStorage.getItem('hex_bastion_rate') || '100', 10));
    this.enemyRate = 100;
    this.playerRateEl.textContent = this.myRate;

    // Config
    this.gameMode = 'BLITZ'; // 'BLITZ' (5 units, fast) | 'TACTICAL' (8 units, slow, no timer)
    this.randomMatchMode = 'BLITZ';
    this.isRandomMatching = false;
    this.randomMatchTimeout = null;
    this.myDraftReady = false;
    this.enemyDraftReady = false;
    this.isPvP = false;
    this.isHost = true;
    this.myTeam = 'blue';
    this.enemyTeam = 'red';
    this.isFlipped = false;
    this.isBattleActive = false;

    // Draft State
    this.draftTimerSeconds = 20;
    this.draftTimerInterval = null;
    this.selectedDraftUnitIds = []; // Up to 3 or 6 units

    // Match Status
    this.playerHp = 20;
    this.enemyHp = 20;
    this.maxHp = 20;
    this.matchTime = 300;
    this.isGameOver = false;

    // Energy
    this.playerEnergy = 6;
    this.maxEnergy = 10;

    // Deck Slots
    this.deckSlots = [
      { unitId: 'ARROW', readyAt: 0 },
      { unitId: 'SPREAD', readyAt: 0 },
      { unitId: 'SNIPER', readyAt: 0 },
      { unitId: 'TANK', readyAt: 0 },
      { unitId: 'DISRUPTOR', readyAt: 0 }
    ];
    this.deckCardElements = [];
    this.selectedDeckIndex = null;

    // Cards
    this.myCards = [];
    this.enemyCards = [];
    this.buffCardElements = [];
    this.selectedBuffCard = null;

    // Buff Timers
    this.stealthTimer = 0;
    this.enemyStealthTimer = 0;
    this.hyperBoostCharges = 0;
    this.quickStepCharges = 0;
    this.spySatelliteActive = false;

    // Hex Arena
    this.hexRadius = 30;
    this.grid = new Map();
    this.units = new Map();

    // Selection
    this.selectedBoardUnitKey = null;
    this.validMoveHexes = [];

    // Visuals
    this.laserBeams = [];
    this.particles = [];
    this.floatingTexts = [];
    this.stats = { reversals: 0, damageDealt: 0 };

    // AI
    this.aiEnergy = 5;
    this.aiLastActionTime = 0;

    // Mouse & Camera Controls (Straight perspective aligned with core axis)
    this.hoverHexKey = null;
    this.mouseCanvasPos = { x: 0, y: 0 };
    this.cameraViewMode = 'ISO';              // 'ISO' (Straight 3D) | 'TOPDOWN' (2.5D Shogi/Chess view)
    this.cameraTheta = Math.PI / 6;           // Perfectly aligned with the core-to-core axis (30°)
    this.cameraPhi = Math.PI * 0.20;          // Comfortable commanding angle (~54° from vertical)
    this.cameraRadius = 25.0;                 // Distance from board center
    this.cameraLookAt = new THREE.Vector3(Math.sin(Math.PI / 6) * 0.9, 0.35, Math.cos(Math.PI / 6) * 0.9);
    this.cameraPanOffset = new THREE.Vector2(0, 0); // WASD camera pan offset
    this.keysDown = { w: false, a: false, s: false, d: false, shift: false };

    // CPU Difficulty (EASY: 3.0s interval, NORMAL: 1.6s, HARD: 0.9s)
    this.cpuDifficulty = 'NORMAL';

    // Draft Time Limit (0: none/unlimited, 20, 40, 60 seconds. Default 0 = unlimited)
    this.draftTimeLimit = 0;

    // Recast inspector element
    this.inspectStatRecast = document.getElementById('inspect-stat-recast');

    // P2P
    this.peer = null;
    this.conn = null;

    // ================= Three.js 3D Engine Setup =================
    this.threeCanvas = document.getElementById('three-canvas');
    this.scene = null;
    this.camera = null;
    this.renderer3D = null;
    this.raycaster = null;
    this.mouseNDC = null;
    this.hexPillarMeshes = new Map();         // key -> THREE.Mesh
    this.hexPillarInteractiveList = [];        // array for Raycaster
    this.unit3DMeshes = new Map();             // key -> THREE.Group
    this.crystalCores = { blue: null, red: null };
    this.laserBeams3D = [];
    this.selectedUnitRing3D = null;

    this.initCanvas();
    this.initThree();
    this.initEventListeners();
    this.initSetupModal();
    this.setupDeckDOM();
    this.setupCardArchiveDOM();
    this.generateSymmetricalMap();
    this.updateMuteUI();
    this.updateUnitInspector();
    this.startModal.classList.remove('hidden');
    this.briefingModal.classList.add('hidden');
  }

  getMaxUnits() {
    return this.gameMode === 'TACTICAL' ? 8 : 5;
  }

  getRecastMultiplier() {
    return this.gameMode === 'TACTICAL' ? 2.0 : 1.0;
  }

  getHexRadius3D() {
    return (this.gameMode === 'TACTICAL') ? 1.05 : 1.30;
  }

  hexToWorld3D(q, r) {
    const tq = this.isFlipped ? -q : q;
    const tr = this.isFlipped ? -r : r;
    const size = this.getHexRadius3D();
    const x = size * (Math.sqrt(3) * tq + Math.sqrt(3) / 2 * tr);
    const z = size * (1.5 * tr);
    return { x, z };
  }

  initCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
    this.centerX = rect.width / 2;
    this.centerY = rect.height / 2;

    this.hexRadius = this.gameMode === 'TACTICAL' ? 25 : 30;

    if (this.renderer3D) {
      this.renderer3D.setSize(rect.width, rect.height);
      if (this.camera) {
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.updateCameraPosition();
      }
    }
  }

  // ================= Three.js 3D Engine Initialization =================
  initThree() {
    if (!window.THREE) {
      console.warn("THREE.js is not loaded yet");
      return;
    }

    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 700;

    if (!this.renderer3D) {
      this.renderer3D = new THREE.WebGLRenderer({
        canvas: this.threeCanvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer3D.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer3D.toneMappingExposure = 1.35;
      this.renderer3D.shadowMap.enabled = true;
      this.renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

      this.scene = new THREE.Scene();
      this.raycaster = new THREE.Raycaster();
      this.mouseNDC = new THREE.Vector2(-999, -999);

      // Camera: Quarter-view looking from front-bottom towards back-top
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 120);
      this.updateCameraPosition();

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(15, 30, 20);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      this.scene.add(dirLight);

      // Cyan PointLight for Player half (Bottom, +Z)
      const blueLight = new THREE.PointLight(0x00e5ff, 3.8, 40);
      blueLight.position.set(0, 8, 10);
      this.scene.add(blueLight);

      // Red PointLight for Enemy half (Top, -Z)
      const redLight = new THREE.PointLight(0xff3366, 3.8, 40);
      redLight.position.set(0, 8, -10);
      this.scene.add(redLight);

      // Amber Accent Light for Center High Ground
      const centerLight = new THREE.PointLight(0xfbbf24, 2.6, 30);
      centerLight.position.set(0, 6, 0);
      this.scene.add(centerLight);
    }

    this.renderer3D.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  updateCameraPosition() {
    if (!this.camera) return;
    const baseTheta = this.isFlipped ? (Math.PI / 6 + Math.PI) : (Math.PI / 6);
    this.cameraTheta = baseTheta;
    const x = this.cameraRadius * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const y = this.cameraRadius * Math.cos(this.cameraPhi);
    const z = this.cameraRadius * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);

    // Shift camera target slightly towards the friendly side so bottom player core & spawn hexes have generous margin
    const lookOffset = 0.9;
    const lx = Math.sin(baseTheta) * (this.isFlipped ? -lookOffset : lookOffset);
    const lz = Math.cos(baseTheta) * (this.isFlipped ? -lookOffset : lookOffset);

    // WASD pan offset rotated relative to camera angle
    const panWorldX = Math.cos(this.cameraTheta) * this.cameraPanOffset.x - Math.sin(this.cameraTheta) * this.cameraPanOffset.y;
    const panWorldZ = -Math.sin(this.cameraTheta) * this.cameraPanOffset.x - Math.cos(this.cameraTheta) * this.cameraPanOffset.y;

    this.camera.position.set(x + panWorldX, y, z + panWorldZ);
    this.cameraLookAt.set(lx + panWorldX, 0.35, lz + panWorldZ);
    this.camera.lookAt(this.cameraLookAt);
  }

  toggleCameraView() {
    this.cameraViewMode = (this.cameraViewMode === 'TOPDOWN') ? 'ISO' : 'TOPDOWN';
    if (this.cameraViewMode === 'TOPDOWN') {
      this.cameraPhi = 0.05;
      this.cameraRadius = (this.gameMode === 'TACTICAL') ? 28.0 : 23.5;
      this.showFloatingText("視点: 真上俯瞰 (2.5D)", { x: this.centerX, y: this.centerY - 100 }, '#38bdf8');
    } else {
      this.cameraPhi = Math.PI * 0.20; // ~54° elevated commanding angle, looking straight forward
      this.cameraRadius = (this.gameMode === 'TACTICAL') ? 29.0 : 25.0;
      this.showFloatingText("視点: 正面3D", { x: this.centerX, y: this.centerY - 100 }, '#38bdf8');
    }
    this.updateCameraPosition();
    sounds.playBuff();
  }

  resetCamera() {
    this.cameraPanOffset.set(0, 0);
    this.toggleCameraView();
  }

  toggleMute() {
    sounds.init();
    sounds.enabled = !sounds.enabled;
    localStorage.setItem('hex_bastion_muted', (!sounds.enabled).toString());
    this.updateMuteUI();
    if (sounds.enabled) sounds.playBuff();
  }

  updateMuteUI() {
    const isMuted = !sounds.enabled;
    const soundBtn = document.getElementById('sound-btn');
    const startMuteBtn = document.getElementById('start-mute-btn');
    const text = isMuted ? '🔇 ミュート中' : '🔊 音声: ON';

    if (soundBtn) {
      soundBtn.textContent = text;
      soundBtn.classList.toggle('muted', isMuted);
    }
    if (startMuteBtn) {
      startMuteBtn.textContent = text;
      startMuteBtn.classList.toggle('muted', isMuted);
    }
  }

  updateUnitInspector() {
    if (!this.unitInspectorBar) return;

    // 1. If a board unit is selected:
    if (this.selectedBoardUnitKey && this.units.has(this.selectedBoardUnitKey)) {
      const unit = this.units.get(this.selectedBoardUnitKey);
      const uData = UNIT_TYPES[unit.id] || {};
      const isPlayer = (unit.owner === this.myTeam);

      this.unitInspectorBar.classList.add('active-selection');
      if (this.inspectIcon) this.inspectIcon.textContent = unit.emoji || '⚔️';
      if (this.inspectName) this.inspectName.textContent = unit.name;
      if (this.inspectRole) this.inspectRole.textContent = uData.role || '戦闘ユニット';
      
      if (this.inspectSide) {
        this.inspectSide.textContent = isPlayer ? '自軍 (あなた)' : '敵軍';
        this.inspectSide.className = `inspector-side-tag ${isPlayer ? 'player' : 'enemy'}`;
      }

      if (this.inspectDesc) {
        this.inspectDesc.textContent = uData.desc || '直進および挟みオセロ反転が可能な主力駒';
      }

      const dirNames = ['北 ⬆️ (敵方向)', '北東 ↗️', '南東 ↘️', '南 ⬇️ (自陣方向)', '南西 ↙️', '北西 ↖️'];
      const dirStr = dirNames[unit.direction] || `${unit.direction * 60}°`;

      if (this.inspectStatHp) this.inspectStatHp.textContent = `HP: ${unit.hp}${unit.shield ? ` (防壁+${unit.shield})` : ''}`;
      if (this.inspectStatRange) this.inspectStatRange.textContent = `射程: ${unit.range}マス`;
      if (this.inspectStatDir) this.inspectStatDir.textContent = `向き: ${dirStr}`;
      if (this.inspectStatRecast) {
        if (unit.fireCooldown > 0) {
          this.inspectStatRecast.textContent = `⚔️ 攻撃CD: ${unit.fireCooldown.toFixed(1)}s`;
          this.inspectStatRecast.style.color = '#f59e0b';
        } else {
          this.inspectStatRecast.textContent = `⚔️ 攻撃CD: READY`;
          this.inspectStatRecast.style.color = '#34d399';
        }
      }
      return;
    }

    // 2. If a deck card is selected for deployment:
    if (this.selectedDeckIndex !== null && this.deckSlots[this.selectedDeckIndex]) {
      const slot = this.deckSlots[this.selectedDeckIndex];
      const uData = UNIT_TYPES[slot.unitId] || {};

      this.unitInspectorBar.classList.add('active-selection');
      if (this.inspectIcon) this.inspectIcon.textContent = uData.emoji || '🚀';
      if (this.inspectName) this.inspectName.textContent = `出撃準備: ${uData.name}`;
      if (this.inspectRole) this.inspectRole.textContent = `コスト: ${uData.cost} ⚡`;
      if (this.inspectSide) {
        this.inspectSide.textContent = '配置待機中';
        this.inspectSide.className = 'inspector-side-tag player';
      }
      if (this.inspectDesc) {
        this.inspectDesc.textContent = `自軍手前側の空きマスをクリックして配置してください（${uData.desc}）`;
      }

      if (this.inspectStatHp) this.inspectStatHp.textContent = `HP: ${uData.hp}`;
      if (this.inspectStatRange) this.inspectStatRange.textContent = `射程: ${uData.range}マス`;
      if (this.inspectStatDir) this.inspectStatDir.textContent = `移動CD: ${(uData.moveCooldown * this.getRecastMultiplier()).toFixed(1)}s`;
      if (this.inspectStatRecast) {
        this.inspectStatRecast.textContent = `再出撃CD: ${(uData.recast * this.getRecastMultiplier()).toFixed(1)}s`;
        this.inspectStatRecast.style.color = '#38bdf8';
      }
      return;
    }

    // 3. Default idle status:
    this.unitInspectorBar.classList.remove('active-selection');
    if (this.inspectIcon) this.inspectIcon.textContent = '⚔️';
    if (this.inspectName) this.inspectName.textContent = '駒を選択してください';
    if (this.inspectRole) this.inspectRole.textContent = '待機中';
    if (this.inspectSide) {
      this.inspectSide.textContent = '準備完了';
      this.inspectSide.className = 'inspector-side-tag player';
    }
    if (this.inspectDesc) {
      this.inspectDesc.textContent = '自軍の駒をクリックすると移動・向き変更が可能です（左クリック: ↻順回転 / 右クリック: ↺逆回転）';
    }

    if (this.inspectStatHp) this.inspectStatHp.textContent = `味方駒: ${this.getUnitCount(this.myTeam)}/${this.getMaxUnits()}`;
    if (this.inspectStatRange) this.inspectStatRange.textContent = `エネルギー: ${Math.floor(this.playerEnergy)}/${this.maxEnergy}`;
    if (this.inspectStatDir) this.inspectStatDir.textContent = '視点: 正面3D';
    if (this.inspectStatRecast) {
      this.inspectStatRecast.textContent = `移動: WASD (Shift加速)`;
      this.inspectStatRecast.style.color = '#94a3b8';
    }
  }

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
    }
  }

  // ================= Map Generation =================
  generateSymmetricalMap() {
    this.grid.clear();
    this.units.clear();
    this.selectedBoardUnitKey = null;
    this.validMoveHexes = [];

    const isTactical = (this.gameMode === 'TACTICAL');
    const qBound = isTactical ? 4 : 3;
    const rBound = isTactical ? 7 : 5;

    for (let q = -qBound; q <= qBound; q++) {
      for (let r = -rBound; r <= rBound; r++) {
        const s = -q - r;
        const key = `${q},${r}`;
        let terrain = TERRAIN.EMPTY;

        if (q === 0 && r === rBound) terrain = TERRAIN.CORE_BOTTOM;
        else if (q === 0 && r === -rBound) terrain = TERRAIN.CORE_TOP;

        this.grid.set(key, { q, r, s, terrain, owner: null, topY: 0.5 });
      }
    }

    // High Grounds (CLIFF: Towers high above the field)
    const highGroundCoords = [
      { q: 0, r: 0 },
      { q: -2, r: -2 }, { q: 2, r: 2 },
      { q: 2, r: -2 }, { q: -2, r: 2 }
    ];
    if (isTactical) {
      highGroundCoords.push({ q: -1, r: -4 }, { q: 1, r: 4 });
      highGroundCoords.push({ q: 1, r: -4 }, { q: -1, r: 4 });
    }
    highGroundCoords.forEach(coord => {
      const cell = this.grid.get(cubeKey(coord));
      if (cell && cell.terrain === TERRAIN.EMPTY) cell.terrain = TERRAIN.HIGH_GROUND;
    });

    // Obstacles
    const obstacleCoords = [
      { q: -1, r: 0 }, { q: 1, r: 0 },
      { q: 0, r: -2 }, { q: 0, r: 2 }
    ];
    if (isTactical) {
      obstacleCoords.push({ q: -3, r: -3 }, { q: 3, r: 3 });
      obstacleCoords.push({ q: 3, r: -3 }, { q: -3, r: 3 });
    }
    obstacleCoords.forEach(coord => {
      const cell = this.grid.get(cubeKey(coord));
      if (cell && cell.terrain === TERRAIN.EMPTY) cell.terrain = TERRAIN.OBSTACLE;
    });

    // ================= PATTERN A: EXACTLY 2 FIXED INITIAL UNITS =================
    const botTeam = this.isHost ? 'blue' : 'red';
    const topTeam = this.isHost ? 'red' : 'blue';

    this.spawnUnit(0, rBound - 1, 'ARROW', botTeam, 0, false);
    this.spawnUnit(0, 2, 'TANK', botTeam, 0, false);

    this.spawnUnit(0, -rBound + 1, 'ARROW', topTeam, 3, false);
    this.spawnUnit(0, -2, 'TANK', topTeam, 3, false);

    this.updateUnitCountUI();
    this.build3DGrid();
  }

  // ================= DRAFT DEPLOYMENT =================
  getDraftNeedCount() {
    return this.gameMode === 'TACTICAL' ? 6 : 3;
  }

  deployDraftedUnits() {
    if (this.draftDeployed) return;
    this.draftDeployed = true;

    const botTeam = this.isHost ? 'blue' : 'red';
    const topTeam = this.isHost ? 'red' : 'blue';
    const maxTarget = this.getMaxUnits();
    const allUnitKeys = Object.keys(UNIT_TYPES);

    const needCount = this.getDraftNeedCount();
    while (this.selectedDraftUnitIds.length < needCount) {
      const pick = allUnitKeys[Math.floor(Math.random() * allUnitKeys.length)];
      this.selectedDraftUnitIds.push(pick);
    }

    const ownEligibleHexes = [];
    this.grid.forEach(cell => {
      if (cell.r > 0 && cell.terrain !== TERRAIN.OBSTACLE && cell.terrain !== TERRAIN.CORE_BOTTOM) {
        if (!this.units.has(`${cell.q},${cell.r}`)) {
          ownEligibleHexes.push(cell);
        }
      }
    });
    ownEligibleHexes.sort(() => 0.5 - Math.random());

    for (let i = 0; i < needCount; i++) {
      const uid = this.selectedDraftUnitIds[i];
      if (ownEligibleHexes[i]) {
        this.spawnUnit(ownEligibleHexes[i].q, ownEligibleHexes[i].r, uid, botTeam, 0, false);
      }
    }

    const enemyDraftIds = [];
    for (let i = 0; i < needCount; i++) {
      enemyDraftIds.push(allUnitKeys[Math.floor(Math.random() * allUnitKeys.length)]);
    }

    const enemyEligibleHexes = [];
    this.grid.forEach(cell => {
      if (cell.r < 0 && cell.terrain !== TERRAIN.OBSTACLE && cell.terrain !== TERRAIN.CORE_TOP) {
        if (!this.units.has(`${cell.q},${cell.r}`)) {
          enemyEligibleHexes.push(cell);
        }
      }
    });
    enemyEligibleHexes.sort(() => 0.5 - Math.random());

    for (let i = 0; i < needCount; i++) {
      const uid = enemyDraftIds[i];
      if (enemyEligibleHexes[i]) {
        this.spawnUnit(enemyEligibleHexes[i].q, enemyEligibleHexes[i].r, uid, topTeam, 3, false);
      }
    }

    // Safety fallback
    let pCount = this.getUnitCount(botTeam);
    let pIndex = 0;
    while (pCount < maxTarget && pIndex < ownEligibleHexes.length) {
      const cell = ownEligibleHexes[pIndex++];
      if (cell && !this.units.has(`${cell.q},${cell.r}`)) {
        const uid = allUnitKeys[Math.floor(Math.random() * allUnitKeys.length)];
        this.spawnUnit(cell.q, cell.r, uid, botTeam, 0, false);
        pCount++;
      }
    }

    let eCount = this.getUnitCount(topTeam);
    let eIndex = 0;
    while (eCount < maxTarget && eIndex < enemyEligibleHexes.length) {
      const cell = enemyEligibleHexes[eIndex++];
      if (cell && !this.units.has(`${cell.q},${cell.r}`)) {
        const uid = allUnitKeys[Math.floor(Math.random() * allUnitKeys.length)];
        this.spawnUnit(cell.q, cell.r, uid, topTeam, 3, false);
        eCount++;
      }
    }

    this.updateUnitCountUI();
  }

  getUnitCount(team) {
    let count = 0;
    this.units.forEach(u => {
      if (u.owner === team) count++;
    });
    return count;
  }

  updateUnitCountUI() {
    const max = this.getMaxUnits();
    const pCount = this.getUnitCount(this.myTeam);
    const eCount = this.getUnitCount(this.enemyTeam);
    this.playerUnitCountEl.textContent = `${pCount}/${max}`;
    this.enemyUnitCountEl.textContent = `${eCount}/${max}`;
  }

  // ================= Unit Spawning =================
  spawnUnit(q, r, unitId, owner, dirIndex = null, checkReversal = true) {
    const key = `${q},${r}`;
    const cell = this.grid.get(key);
    if (!cell || cell.terrain === TERRAIN.OBSTACLE) return false;
    if (this.units.has(key)) return false;

    const data = UNIT_TYPES[unitId];
    if (!data) return false;

    const defaultDir = (owner === (this.isHost ? 'blue' : 'red')) ? 0 : 3;
    const direction = dirIndex !== null ? dirIndex : defaultDir;

    const isHighGround = cell.terrain === TERRAIN.HIGH_GROUND;
    const bonusRange = isHighGround ? 1 : 0;
    const pos = this.hexToPixel(q, r);
    const mult = this.getRecastMultiplier();

    const unit = {
      q, r, s: -q - r,
      key,
      id: unitId,
      name: data.name,
      emoji: data.emoji,
      owner,
      direction,
      range: data.range + bonusRange,
      hp: data.hp,
      maxHp: data.hp,
      shield: data.shield || 0,
      invincibleTimer: 0,
      fireCooldown: 0.5 * mult,
      fireRate: data.fireRate * mult,
      moveCooldown: 1.0 * mult,
      moveCooldownMax: data.moveCooldown * mult,
      isHighGround,
      antiHack: isHighGround,
      isMoving: false,
      renderPos: { x: pos.x, y: pos.y },
      targetPos: { x: pos.x, y: pos.y },
      moveProgress: 1.0
    };

    this.units.set(key, unit);
    cell.owner = owner;

    if (checkReversal) {
      this.checkReversals(unit);
    }

    sounds.playDeploy();
    this.createDeployParticles(pos, owner === this.myTeam ? '#00e5ff' : '#ff3366');
    this.updateUnitCountUI();

    if (this.isPvP && owner === this.myTeam) {
      this.sendP2P({ type: 'DEPLOY', q, r, unitId, owner, dir: direction });
    }
    return true;
  }

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
      mesh.castShadow = true;

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
  createBillboardBadge(unit, isPlayer) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    // Background capsule badge
    ctx.fillStyle = isPlayer ? 'rgba(6, 16, 38, 0.94)' : 'rgba(38, 6, 16, 0.94)';
    ctx.strokeStyle = isPlayer ? '#00e5ff' : '#ff3366';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(6, 6, 244, 84, 18);
    else ctx.rect(6, 6, 244, 84);
    ctx.fill();
    ctx.stroke();

    // Icon Emoji
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(unit.emoji || '●', 46, 48);

    // Full Unit Name
    ctx.font = 'bold 22px "Meiryo", "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(unit.name, 90, 36);

    // Unit Role / Range Subtitle
    const uData = UNIT_TYPES[unit.id];
    const roleText = uData ? `[${uData.role} 射程${unit.range}]` : '';
    ctx.font = 'bold 15px "Meiryo", sans-serif';
    ctx.fillStyle = isPlayer ? '#38bdf8' : '#fb7185';
    ctx.fillText(roleText, 90, 66);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.2, 0.82, 1.0);
    return { sprite, texture, canvas, ctx };
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

    group.userData = {
      unitKey: unit.key,
      glowMat,
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

        if (t > 0.45 && group.userData.glowMat) {
          const isPlayerNow = (unit.owner === this.myTeam);
          const newGlow = isPlayerNow ? 0x00e5ff : 0xff3366;
          group.userData.glowMat.color.setHex(newGlow);
          group.userData.glowMat.emissive.setHex(newGlow);

          if (group.userData.badgeObj) {
            group.remove(group.userData.badgeObj.sprite);
            group.userData.badgeObj = this.createBillboardBadge(unit, isPlayerNow);
            group.userData.badgeObj.sprite.position.y = group.userData.headHeight + 0.35;
            group.add(group.userData.badgeObj.sprite);
          }
        }

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
      this.showFloatingText("COOLDOWN", this.hexToPixel(unit.q, unit.r), '#94a3b8');
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

    unit.isHighGround = (targetCell.terrain === TERRAIN.HIGH_GROUND);
    unit.antiHack = unit.isHighGround;
    unit.range = UNIT_TYPES[unit.id].range + (unit.isHighGround ? 1 : 0);

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

    const cooldownMultiplier = (unit.owner === this.myTeam && this.quickStepCharges > 0) ? 0.5 : 1.0;
    unit.moveCooldown = unit.moveCooldownMax * cooldownMultiplier;

    this.checkReversals(unit);
    this.fireUnitWeapon(unit);
    unit.fireCooldown = unit.fireRate;

    this.showFloatingText("ENGAGED!", unit.renderPos, unit.owner === this.myTeam ? '#00e5ff' : '#ff3366');
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

          anyReversed = true;
          if (originOwner === this.myTeam) this.stats.reversals++;

          const pos = this.hexToPixel(target.q, target.r);
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

    this.units.forEach(unit => {
      if (unit.invincibleTimer > 0) unit.invincibleTimer -= dt;

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

            if (unit.id === 'DISRUPTOR' && targetUnit.invincibleTimer <= 0) {
              targetUnit.direction = (targetUnit.direction + Math.floor(Math.random() * 4) + 1) % 6;
              this.showFloatingText("DISRUPTED!", curPixel, "#a855f7");
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
        this.playerEnergy = this.maxEnergy;
        this.showFloatingText("+10 ENERGY!", { x: this.centerX, y: this.centerY + 160 }, '#00e5ff');
        sounds.playBuff();
        success = true;
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

  // ================= AI =================
  updateAI(dt) {
    if (this.isGameOver || this.isPvP) return;

    if (this.aiEnergy < this.maxEnergy) {
      this.aiEnergy = Math.min(this.maxEnergy, this.aiEnergy + dt * 0.75);
    }

    const now = performance.now() / 1000;
    let baseActionDelay = 1.6;
    if (this.cpuDifficulty === 'EASY') baseActionDelay = 3.0;
    else if (this.cpuDifficulty === 'HARD') baseActionDelay = 0.9;

    const actionDelay = baseActionDelay * this.getRecastMultiplier();
    if (now - this.aiLastActionTime < actionDelay) return;

    // AI Card Usage: probability scales with difficulty
    const cardUseProb = (this.cpuDifficulty === 'HARD') ? 0.35 : (this.cpuDifficulty === 'EASY' ? 0.10 : 0.20);
    const unspentAiCards = this.enemyCards.filter(c => !c.used);
    if (unspentAiCards.length > 0 && Math.random() < cardUseProb) {
      const cardToUse = unspentAiCards[0];
      cardToUse.used = true;
      this.notifyCardUsedByEnemy(cardToUse);
      this.applyEnemyCardEffect(cardToUse, null);
      this.updateEnemyCardsUI();
      this.aiLastActionTime = now;
      return;
    }

    const aiUnits = Array.from(this.units.values()).filter(u => u.owner === this.enemyTeam && !u.isMoving && u.moveCooldown <= 0);

    // AI Move: exactly 1 unit per action interval (no simultaneous moves)
    const moveProb = (this.cpuDifficulty === 'HARD') ? 0.85 : (this.cpuDifficulty === 'EASY' ? 0.50 : 0.65);
    if (aiUnits.length > 0 && Math.random() < moveProb) {
      const unitToMove = aiUnits[Math.floor(Math.random() * aiUnits.length)];
      const validMoves = this.getValidMovesForUnit(unitToMove);

      if (validMoves.length > 0) {
        let chosenKey = validMoves[0];

        if (this.cpuDifficulty === 'EASY' && Math.random() < 0.4) {
          // EASY: occasional relaxed/random moves
          chosenKey = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
          // NORMAL / HARD: tactical scoring
          const scoredMoves = validMoves.map(k => {
            const c = this.grid.get(k);
            let score = (c.r - unitToMove.r) * 4;
            if (c.terrain === TERRAIN.HIGH_GROUND) score += (this.cpuDifficulty === 'HARD' ? 10 : 6);
            // On HARD, bonus for moving closer to player core
            if (this.cpuDifficulty === 'HARD') {
              score += (c.r) * 2;
            }
            return { key: k, score };
          });

          scoredMoves.sort((a, b) => b.score - a.score);
          chosenKey = scoredMoves[0].key;
        }

        this.executeUnitMove(unitToMove, chosenKey, false);
        this.aiLastActionTime = now;
        return;
      }
    }

    // AI Deploy (Own half: r < 0)
    const currentEnemyCount = this.getUnitCount(this.enemyTeam);
    if (currentEnemyCount < this.getMaxUnits()) {
      const possibleUnits = ['ARROW', 'SPREAD', 'SNIPER', 'TANK', 'DISRUPTOR'];
      const pickId = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
      const uCost = UNIT_TYPES[pickId].cost;

      if (this.aiEnergy >= uCost) {
        const candidateHexes = [];
        this.grid.forEach(cell => {
          if (cell.terrain === TERRAIN.OBSTACLE || cell.terrain === TERRAIN.CORE_BOTTOM || cell.terrain === TERRAIN.CORE_TOP) return;
          if (this.units.has(`${cell.q},${cell.r}`)) return;
          if (cell.r < 0) {
            let score = -cell.r * 2;
            if (cell.terrain === TERRAIN.HIGH_GROUND) score += 5;
            candidateHexes.push({ cell, score });
          }
        });

        if (candidateHexes.length > 0) {
          candidateHexes.sort((a, b) => b.score - a.score);
          const chosen = candidateHexes[0].cell;
          this.aiEnergy -= uCost;
          this.spawnUnit(chosen.q, chosen.r, pickId, this.enemyTeam, 3);
          this.aiLastActionTime = now;
        }
      }
    }
  }

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
        <span class="card-tag">${card.tag}</span>
      `;

      el.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, card.name, `${card.tag} (${card.duration || ''})`, card.desc);
      });
      el.addEventListener('mouseleave', () => this.hideTooltip());

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();
        if (card.used) return;

        if (['STEALTH', 'HYPER_BOOST', 'QUICK_STEP', 'MIND_DISRUPT', 'SPY_SATELLITE', 'ENERGY_SURGE'].includes(card.id)) {
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
        <span class="briefing-card-tag">${card.tag}</span>
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
        <span class="archive-card-tag">${card.tag}</span>
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
    } else if (this.selectedDeckIndex !== null) {
      const unit = UNIT_TYPES[this.deckSlots[this.selectedDeckIndex].unitId];
      this.actionTextEl.textContent = `【${unit.name}】自陣手前側の空きマスをクリックして配置`;
      this.actionTextEl.style.color = '#00e5ff';
    } else if (this.selectedBuffCard !== null) {
      this.actionTextEl.textContent = `【${this.selectedBuffCard.name}】対象マス/ユニットをクリック`;
      this.actionTextEl.style.color = '#fbbf24';
    } else {
      this.actionTextEl.textContent = '味方駒クリックで移動・回転 / 右ドラッグで視点360°回転 / ホイールでズーム';
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
      }
    }, 850);
  }

  // ================= Rendering Loop =================
  render(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000 || 0;
    this.lastTime = currentTime;

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

  // Draw white circular line arc around units to clearly visualize recast progress
  drawUnitCooldownGauges() {
    this.units.forEach(unit => {
      if (!unit.renderPos) return;
      const isEnemy = (unit.owner === this.enemyTeam);
      const isStealth = (isEnemy && this.enemyStealthTimer > 0) || (!isEnemy && this.stealthTimer > 0);
      if (isStealth) return;

      const px = unit.renderPos.x;
      const py = unit.renderPos.y;

      // Base faint track
      this.ctx.beginPath();
      this.ctx.arc(px, py, 16, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Attack Recast (Bright White Line Arc, as remembered from original version)
      if (unit.fireCooldown > 0) {
        const progress = Math.max(0, Math.min(1, 1 - (unit.fireCooldown / unit.fireRate)));
        this.ctx.beginPath();
        this.ctx.arc(px, py, 16, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
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
        this.ctx.arc(px, py, 16, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      // Move Recast (Emerald Green Line on slightly larger circle)
      if (unit.moveCooldown > 0) {
        const mProgress = Math.max(0, Math.min(1, 1 - (unit.moveCooldown / unit.moveCooldownMax)));
        this.ctx.beginPath();
        this.ctx.arc(px, py, 21, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * mProgress));
        this.ctx.strokeStyle = '#34d399';
        this.ctx.shadowColor = '#34d399';
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

  // ================= Event Listeners =================
  initEventListeners() {
    window.addEventListener('resize', () => this.initCanvas());

    // Prevent default right-click context menu on arena canvas so right-drag orbit works cleanly
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // WASD Keyboard Pan Navigation + Shift Sprint (1.5x) + Space Reset
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.code === 'KeyW') this.keysDown.w = true;
      if (key === 'a' || e.code === 'KeyA') this.keysDown.a = true;
      if (key === 's' || e.code === 'KeyS') this.keysDown.s = true;
      if (key === 'd' || e.code === 'KeyD') this.keysDown.d = true;
      if (e.shiftKey || e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keysDown.shift = true;
      if (e.code === 'Space') {
        this.cameraPanOffset.set(0, 0);
        this.updateCameraPosition();
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.code === 'KeyW') this.keysDown.w = false;
      if (key === 'a' || e.code === 'KeyA') this.keysDown.a = false;
      if (key === 's' || e.code === 'KeyS') this.keysDown.s = false;
      if (key === 'd' || e.code === 'KeyD') this.keysDown.d = false;
      if (!e.shiftKey) this.keysDown.shift = false;
    });

    const updateMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      this.mouseCanvasPos = { x: clientX, y: clientY };

      let foundKey = null;

      // 1. Precise 3D Raycast on Hex Pillars
      if (this.raycaster && this.camera && this.hexPillarInteractiveList.length > 0) {
        this.mouseNDC.x = (clientX / rect.width) * 2 - 1;
        this.mouseNDC.y = -(clientY / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const intersects = this.raycaster.intersectObjects(this.hexPillarInteractiveList, false);
        if (intersects.length > 0 && intersects[0].object.userData) {
          foundKey = intersects[0].object.userData.key;
        }
      }

      // 2. Fallback to 2D math if raycaster missed
      if (!foundKey) {
        const hex = this.pixelToHex(clientX, clientY);
        const key = `${hex.q},${hex.r}`;
        if (this.grid.has(key)) foundKey = key;
      }

      this.hoverHexKey = foundKey;
    };

    // Mouse Move (Hover detection)
    this.canvas.addEventListener('mousemove', (e) => {
      updateMousePos(e);
    });

    // Mouse Wheel for Camera Zoom (Gentle Zoom)
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.02;
      const minRadius = 15;
      const maxRadius = (this.gameMode === 'TACTICAL') ? 36 : 30;
      this.cameraRadius = Math.max(minRadius, Math.min(maxRadius, this.cameraRadius + e.deltaY * zoomSpeed));
      this.updateCameraPosition();
    }, { passive: false });

    // Right-Click for Reverse Unit Rotation (逆回転) & Deselection
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      updateMousePos(e);
      sounds.init();

      if (!this.hoverHexKey || this.isGameOver || !this.isBattleActive) return;

      // 1. If clicking a friendly piece: rotate counter-clockwise (逆回転)
      const clickedUnit = this.units.get(this.hoverHexKey);
      if (clickedUnit && clickedUnit.owner === this.myTeam) {
        if (this.selectedBoardUnitKey !== clickedUnit.key) {
          this.selectUnitForMovement(clickedUnit.key);
        }
        this.rotateUnit(clickedUnit, -1);
        return;
      }

      // 2. If clicking elsewhere: cancel selection
      if (this.selectedBoardUnitKey || this.selectedDeckIndex !== null || this.selectedBuffCard) {
        this.selectedBoardUnitKey = null;
        this.selectedDeckIndex = null;
        this.selectedBuffCard = null;
        this.validMoveHexes = [];
        this.updateDeckSelectionStyles();
        this.updateBuffCardStyles();
        this.updateActionStatus();
        this.updateUnitInspector();
        sounds.playStep();
      }
    });

    // Left Click for Gameplay Actions
    this.canvas.addEventListener('click', (e) => {
      if (e.button !== 0) return;
      updateMousePos(e);
      sounds.init();

      if (!this.hoverHexKey || this.isGameOver || !this.isBattleActive) return;
      const cell = this.grid.get(this.hoverHexKey);
      if (!cell) return;

      // 1. Buff Card
      if (this.selectedBuffCard) {
        this.useBuffCard(this.selectedBuffCard, this.hoverHexKey);
        return;
      }

      // 2. Unit Deployment (STRICTLY OWN HALF: r > 0, or r < 0 if flipped)
      if (this.selectedDeckIndex !== null) {
        const isOwnHalf = this.isFlipped ? (cell.r < 0) : (cell.r > 0);

        if (!isOwnHalf) {
          this.showFloatingText("自軍手前側にしか配置できません！", this.mouseCanvasPos, '#fbbf24');
          return;
        }

        if (this.getUnitCount(this.myTeam) >= this.getMaxUnits()) {
          this.showFloatingText(`駒数上限（${this.getMaxUnits()}体）です！`, this.mouseCanvasPos, '#fbbf24');
          return;
        }

        const slot = this.deckSlots[this.selectedDeckIndex];
        const data = UNIT_TYPES[slot.unitId];

        if (this.playerEnergy >= data.cost) {
          if (cell.terrain !== TERRAIN.OBSTACLE && cell.terrain !== TERRAIN.CORE_BOTTOM && cell.terrain !== TERRAIN.CORE_TOP) {
            if (!this.units.has(this.hoverHexKey)) {
              this.playerEnergy -= data.cost;
              this.spawnUnit(cell.q, cell.r, slot.unitId, this.myTeam);

              slot.readyAt = (performance.now() / 1000) + (data.recast * this.getRecastMultiplier());
              this.selectedDeckIndex = null;
              this.updateDeckSelectionStyles();
              this.updateActionStatus();
              this.updateUnitInspector();
              return;
            } else {
              this.showFloatingText("マスが埋まっています", this.mouseCanvasPos, '#ff3366');
            }
          }
        } else {
          this.showFloatingText("エネルギー不足！", this.mouseCanvasPos, '#ff3366');
        }
        return;
      }

      // 3. Move Piece
      if (this.selectedBoardUnitKey) {
        const unit = this.units.get(this.selectedBoardUnitKey);
        if (unit) {
          if (this.validMoveHexes.includes(this.hoverHexKey)) {
            this.executeUnitMove(unit, this.hoverHexKey, true);
            return;
          }

          // Rotate in place (Left Click: Clockwise / 順回転)
          if (this.hoverHexKey === this.selectedBoardUnitKey) {
            this.rotateUnit(unit, 1);
            return;
          }
        }
      }

      // 4. Select friendly piece
      const clickedUnit = this.units.get(this.hoverHexKey);
      if (clickedUnit && clickedUnit.owner === this.myTeam) {
        this.selectUnitForMovement(this.hoverHexKey);
        sounds.playStep();
        return;
      }

      this.selectedBoardUnitKey = null;
      this.validMoveHexes = [];
      this.updateActionStatus();
      this.updateUnitInspector();
    });

    // Top Controls
    document.getElementById('help-btn').addEventListener('click', () => {
      this.helpModal.classList.remove('hidden');
    });
    document.getElementById('close-help-btn').addEventListener('click', () => {
      this.helpModal.classList.add('hidden');
    });
    document.getElementById('card-archive-btn').addEventListener('click', () => {
      this.cardArchiveModal.classList.remove('hidden');
    });
    document.getElementById('close-card-archive-btn').addEventListener('click', () => {
      this.cardArchiveModal.classList.add('hidden');
    });
    document.getElementById('camera-reset-btn').addEventListener('click', () => {
      this.resetCamera();
    });

    document.getElementById('pvp-connect-btn').addEventListener('click', () => {
      this.startModal.classList.remove('hidden');
      this.modeOptPvp.click();
    });

    document.getElementById('sound-btn').addEventListener('click', () => {
      this.toggleMute();
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.startModal.classList.remove('hidden');
      this.briefingModal.classList.add('hidden');
      this.isBattleActive = false;
      if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.add('hidden');
      this.startModal.classList.remove('hidden');
      this.briefingModal.classList.add('hidden');
      this.isBattleActive = false;
      if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);
    });

    // Briefing Controls
    document.getElementById('start-battle-btn').addEventListener('click', () => {
      sounds.init();
      if (this.isPvP) {
        if (this.myDraftReady) return;
        this.myDraftReady = true;
        if (this.startBattleBtn) {
          this.startBattleBtn.disabled = true;
          this.startBattleBtn.textContent = '準備完了（相手待機中...）';
        }
        if (this.briefingReadyStatus) {
          this.briefingReadyStatus.classList.remove('hidden');
        }
        this.sendP2P({ type: 'DRAFT_READY', draftedUnits: this.selectedDraftUnitIds });
        if (this.enemyDraftReady) {
          if (this.draftTimerInterval) clearInterval(this.draftTimerInterval);
          this.startCountdownSequence(true);
        }
      } else {
        this.startCountdownSequence(true);
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.probePeer) { try { this.probePeer.destroy(); } catch(e){} }
      if (this.peer) { try { this.peer.destroy(); } catch(e){} }
      if (this.conn) { try { this.conn.close(); } catch(e){} }
    });
  }

  showTooltip(e, title, stats, desc) {
    this.tooltipEl.innerHTML = `
      <h4>${title}</h4>
      <div class="tt-stats">${stats}</div>
      <div>${desc}</div>
    `;
    this.tooltipEl.classList.remove('hidden');
    const x = Math.min(window.innerWidth - 260, e.clientX + 15);
    const y = Math.max(10, e.clientY - 80);
    this.tooltipEl.style.left = `${x}px`;
    this.tooltipEl.style.top = `${y}px`;
  }

  hideTooltip() {
    this.tooltipEl.classList.add('hidden');
  }

  // ================= Game Initialization =================
  startNewGame(showBriefing = true) {
    this.isGameOver = false;
    this.isBattleActive = !showBriefing;
    this.isCountingDown = false;
    this.draftDeployed = false;
    this.myDraftReady = false;
    this.enemyDraftReady = false;
    if (this.startBattleBtn) {
      this.startBattleBtn.disabled = false;
      this.startBattleBtn.textContent = '作戦決定・出撃準備完了 (ENGAGE)';
    }
    if (this.briefingReadyStatus) {
      this.briefingReadyStatus.classList.add('hidden');
    }
    if (this.draftTimerBadge) {
      this.draftTimerBadge.style.color = '#fbbf24';
    }
    this.playerHp = this.maxHp;
    this.enemyHp = this.maxHp;
    this.matchTime = (this.gameMode === 'TACTICAL') ? Infinity : 300;
    this.playerEnergy = 6;
    this.aiEnergy = 5;
    this.stats = { reversals: 0, damageDealt: 0 };
    this.selectedDeckIndex = null;
    this.selectedBuffCard = null;
    this.selectedBoardUnitKey = null;
    this.validMoveHexes = [];

    this.stealthTimer = 0;
    this.enemyStealthTimer = 0;
    this.hyperBoostCharges = 0;
    this.quickStepCharges = 0;
    this.spySatelliteActive = false;

    this.playerHpEl.textContent = this.playerHp;
    this.enemyHpEl.textContent = this.enemyHp;
    this.playerHpBar.style.width = '100%';
    this.enemyHpBar.style.width = '100%';

    const shuffled = [...BUFF_CARDS_DB].sort(() => 0.5 - Math.random());
    this.myCards = shuffled.slice(0, 3).map(c => ({ ...c, used: false }));

    if (!this.isPvP) {
      const cpuShuffled = [...BUFF_CARDS_DB].sort(() => 0.5 - Math.random());
      this.enemyCards = cpuShuffled.slice(0, 3).map(c => ({ ...c, used: false }));
    }

    const now = performance.now() / 1000;
    this.deckSlots.forEach(s => s.readyAt = now);

    this.initCanvas();
    this.generateSymmetricalMap();
    this.setupBuffCardsDOM();
    this.setupBriefingCardsDOM();
    this.setupDraftUnitsDOM();
    this.updateEnemyCardsUI();
    this.updateDeckSelectionStyles();
    this.updateActionStatus();

    if (showBriefing) {
      this.briefingModal.classList.remove('hidden');
      this.countdownOverlay.classList.add('hidden');
      this.startDraftCountdown();
    }

    this.lastTime = performance.now();
    if (!this.loopStarted) {
      this.loopStarted = true;
      requestAnimationFrame((t) => this.render(t));
    }
  }
}

// Start Game
window.addEventListener('DOMContentLoaded', () => {
  new HexBastionGame();
});
