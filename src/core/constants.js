/**
 * HEX BASTION - Game Constants & Database
 */

export const HEX_DIRECTIONS = [
  { q: 0,  r: -1, s: 1,  angle: -Math.PI / 2 },       // 0: North
  { q: 1,  r: -1, s: 0,  angle: -Math.PI / 6 },       // 1: North-East
  { q: 1,  r: 0,  s: -1, angle: Math.PI / 6 },        // 2: South-East
  { q: 0,  r: 1,  s: -1, angle: Math.PI / 2 },        // 3: South
  { q: -1, r: 1,  s: 0,  angle: 5 * Math.PI / 6 },    // 4: South-West
  { q: -1, r: 0,  s: 1,  angle: -5 * Math.PI / 6 }    // 5: North-West
];

export const TERRAIN = {
  EMPTY: 'EMPTY',
  HIGH_GROUND: 'HIGH_GROUND',
  OBSTACLE: 'OBSTACLE',
  CORE_BOTTOM: 'CORE_BOTTOM',
  CORE_TOP: 'CORE_TOP'
};

export const UNIT_TYPES = {
  ARROW: {
    id: 'ARROW',
    name: 'アロータワー',
    emoji: '🏹',
    role: '早撃・機動',
    cost: 2,
    power: 1,
    recast: 2.5,
    fireRate: 2.2,
    moveCooldown: 2.2,
    moveType: 'ALL_ADJACENT',
    range: 3,
    hp: 4,
    dirs: [0],
    desc: '標準型。全方向1マス移動。正面3マス早撃ち（威力1）。機動力と扱いやすさが抜群。'
  },
  SPREAD: {
    id: 'SPREAD',
    name: 'スプレッド',
    emoji: '💥',
    role: '扇状近接',
    cost: 3,
    power: 1,
    recast: 3.0,
    fireRate: 2.0,
    moveCooldown: 2.2,
    moveType: 'ALL_ADJACENT',
    range: 1,
    hp: 5,
    dirs: [0, 1, 5],
    desc: '扇状迎撃型。全方向1マス移動。正面3方向の至近マスを一斉制圧（威力1×3方向）。'
  },
  SNIPER: {
    id: 'SNIPER',
    name: 'レールガン',
    emoji: '🎯',
    role: '長距離狙撃',
    cost: 4,
    power: 2,
    recast: 4.5,
    fireRate: 3.2,
    moveCooldown: 3.2,
    moveType: 'ALL_ADJACENT',
    range: 5,
    hp: 3,
    dirs: [0],
    desc: '長距離狙撃砲。直線5マス射程・高威力（威力2）。高台に陣取ると3ダメージの必殺砲に化ける。'
  },
  REFLECTOR: {
    id: 'REFLECTOR',
    name: 'リフレクター',
    emoji: '🪞',
    role: '屈折反射',
    cost: 2,
    power: 0,
    recast: 3.0,
    fireRate: 999,
    moveCooldown: 2.0,
    moveType: 'ALL_ADJACENT',
    range: 0,
    hp: 5,
    dirs: [],
    desc: '反射板。全方向1マス移動。味方レーザーを60度屈折させ、障害物越しの奇襲を作る。'
  },
  TANK: {
    id: 'TANK',
    name: 'アイアンクラッド',
    emoji: '🛡️',
    role: '重装突撃',
    cost: 5,
    power: 1,
    recast: 5.0,
    fireRate: 3.0,
    moveCooldown: 2.5,
    moveType: 'FORWARD_ONLY',
    range: 2,
    hp: 8,
    shield: 1,
    dirs: [0],
    desc: '重装要塞型。【前方3方向のみ移動可能】。高HP8＆シールド1枚。肉壁として敵弾を防ぐ。'
  },
  DISRUPTOR: {
    id: 'DISRUPTOR',
    name: 'ディスラプター',
    emoji: '🌀',
    role: '撹乱妨害',
    cost: 3,
    power: 1,
    recast: 3.5,
    fireRate: 2.6,
    moveCooldown: 2.0,
    moveType: 'ALL_ADJACENT',
    range: 3,
    hp: 4,
    dirs: [0],
    desc: '妨害撹乱型。全方向1マス移動。敵にビームを当てるとダメージに加え向きを狂わせる。'
  }
};

// All 10 Tactical Cards with distinct intuitive Animal Motifs & Scope Badges
export const BUFF_CARDS_DB = [
  {
    id: 'STEALTH',
    name: 'ステルス【カメレオン】',
    icon: '🦎',
    tag: '光学迷彩',
    scope: 'ALL',
    scopeLabel: '🌐 自軍全体',
    duration: '10秒間',
    desc: '【10秒間】相手画面から自軍の全ユニットの姿が見えなくなる。カメレオンの擬態で不意打ちの挟み撃ちに最適。'
  },
  {
    id: 'INVINCIBLE',
    name: 'インビンシブル【ゴリラ】',
    icon: '🦍',
    tag: '絶対無敵',
    scope: 'SINGLE',
    scopeLabel: '🎯 味方単体',
    duration: '10秒間',
    desc: '指定した味方1体を【10秒間】完全無敵化。ゴリラの如き剛力でダメージ・反転・ディスラプト妨害を一切無効化。'
  },
  {
    id: 'HYPER_BOOST',
    name: 'ハイパーブースト【チーター】',
    icon: '🐆',
    tag: '俊足跳躍',
    scope: 'ALL',
    scopeLabel: '🌐 自軍全体',
    duration: '3回分',
    desc: '次の【3回】の移動可能距離が2マス（2ヘックス跳躍）に延長。チーターの爆発的瞬発力で敵警戒網を一気に飛び越える。'
  },
  {
    id: 'QUICK_STEP',
    name: 'クイックステップ【兎】',
    icon: '🐇',
    tag: 'リキャ半減',
    scope: 'ALL',
    scopeLabel: '🌐 自軍全体',
    duration: '5回分',
    desc: '次の【5回】の移動リキャスト（足止め時間）が50%短縮。脱兎の跳躍ステップで盤面を駆け巡る。'
  },
  {
    id: 'MIND_DISRUPT',
    name: 'マインドシャッフル【狐】',
    icon: '🦊',
    tag: '手札破壊',
    scope: 'ENEMY',
    scopeLabel: '⚡ 敵全体',
    duration: '即時1回',
    desc: '相手が保持している未消費の戦術カードを全て【強制再抽選】し、妖狐の化かし術で相手の作戦を崩壊させる。'
  },
  {
    id: 'SPY_SATELLITE',
    name: 'スパイサテライト【梟】',
    icon: '🦉',
    tag: '情報看破',
    scope: 'ALL',
    scopeLabel: '🌐 看破',
    duration: '試合終了まで',
    desc: '相手の隠された非公開カードを自画面で全て【常時表向きオープン】にする。梟の千里眼で奇襲を完全に見破る。'
  },
  {
    id: 'SCAFFOLD',
    name: 'フォートレス【亀】',
    icon: '🐢',
    tag: '高台要塞',
    scope: 'TILE',
    scopeLabel: '🗺️ 平地マス',
    duration: '永続',
    desc: '任意の平地ヘックスを1箇所【高台】に隆起させる（射程+1 ＆ 低地からの反転無効要塞化）。大亀の甲羅シェルター。'
  },
  {
    id: 'OVERCHARGE',
    name: 'スナイプレンジ【鷹】',
    icon: '🦅',
    tag: '射程延長',
    scope: 'SINGLE',
    scopeLabel: '🎯 味方単体',
    duration: '永続',
    desc: '指定した味方ユニット1体の射程を永続的に【+2マス】延長する。鷹の鋭い遠視力で長距離狙撃砲に化ける。'
  },
  {
    id: 'ANTIHACK',
    name: 'ハックシールド【サイ】',
    icon: '🦏',
    tag: '耐性付与',
    scope: 'SINGLE',
    scopeLabel: '🎯 味方単体',
    duration: '反転1回消費',
    desc: '指定した味方ユニットに剛角シールドを付与し、次の【オセロ反転を1度完全無効化】する。前線防衛の盾。'
  },
  {
    id: 'ENERGY_SURGE',
    name: 'ギガントサージ【象】',
    icon: '🐘',
    tag: 'HP1.3倍',
    scope: 'SINGLE',
    scopeLabel: '🎯 味方単体',
    duration: '永続',
    desc: '指定した味方ユニット1体の最大HPと現在HPを永続的に【1.3倍】に強化する。巨象の強靭な生命力で前線の要塞と化す。'
  }
];
