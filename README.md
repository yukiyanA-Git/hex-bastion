# HEX BASTION（ヘックス・バスティオン）
### 将棋式リアルタイム反転防衛戦 (Cyber Tactical Chess & Reversal Game)

六角形（ヘックス）グリッド上で自軍の戦術タワーユニットを指揮し、相手本拠地コアの撃破を目指すリアルタイム戦術シミュレーションゲームです。
将棋のような位置取りと前進攻防、オセロのような「挟み撃ち反転（リバーサル・ハッキング）」、そして刻一刻と変化するリアルタイム射撃戦が融合しています。

---

## 🌐 公開URL (Live Sites)

- **本番環境 (Firebase Hosting)**:  
  [https://hex-bastion-app.web.app/](https://hex-bastion-app.web.app/)  
  *(Firebase Project: `chronos-app-d149d` / Hosting Target: `hex-bastion-app`)*
- **予備ドメイン (Firebase App)**:  
  [https://hex-bastion-app.firebaseapp.com/](https://hex-bastion-app.firebaseapp.com/)
- **ミラー環境 (GitHub Pages)**:  
  [https://yukiyana-git.github.io/hex-bastion/](https://yukiyana-git.github.io/hex-bastion/)

---

## 🎮 ゲーム概要とルール

### 1. 勝利条件
- **敵コアの破壊**: 敵本拠地コア（HP: 20）を射程内に捉え、ビームレーザーでHPをゼロにすれば勝利。
- **タイムアップ判定**: 制限時間終了時にコア残存HPが多い陣営の勝利。

### 2. 核心システム: オセロ反転（リバーサル・ハッキング）
- 直線上で **「味方 ―― 敵 ―― 味方」** と敵駒を挟み込むと、敵タワーが一瞬で自軍色に反転！
- 反転したユニットは寝返って即座に敵コアや敵駒へ攻撃を開始します。
- 駒が移動を完了した瞬間にも反転判定が走るため、敵背後へスライドして一発逆転を狙えます。

### 3. 高台（CLIFF）の絶対優位性
- マップ中央にそびえる高台に陣取ったユニットは、以下の強力な特性を獲得します:
  1. **射程 +1**
  2. **遮蔽物・障害物の完全無視**
  3. **低地からの挟み撃ち反転を完全無効化**

### 4. 駒（タワーユニット）全6種
| 駒名 | 特徴 | 射程 | 移動 |
| :--- | :--- | :---: | :---: |
| **🏹 アロータワー** | 早撃ち・基本制圧型。機動性と射撃速度に優れる | 3 | 全方向1マス |
| **💥 スプレッド** | 扇状近接型。正面3方向を同時射撃。防衛・封鎖に最適 | 1 | 全方向1マス |
| **🎯 レールガン** | 長距離狙撃型。高台に据えると凶悪な超長距離砲台に | 5 | 全方向1マス |
| **🛡️ アイアンクラッド** | 重装甲型。挟み撃ちをシールドで1度防ぐ頑強な盾 | 2 | 前方3方向のみ |
| **🌀 ディスラプター** | 妨害型。射線上の敵の向きをランダムに回転させ隊列を崩す | 3 | 全方向1マス |
| **🪞 リフレクター** | 反射型。味方レーザーを60度屈折させ、死角から挟み撃ちを作る | 特殊 | 全方向1マス |

### 5. 操作方法
- **駒の選択**: 自軍ユニットをクリック
- **駒の移動**: 移動可能マス（緑ヘックス 👣）をクリック
- **駒の向き変更**: 選択中の駒を **左クリックで時計回り(↻)** / **右クリックで反時計回り(↺)**
- **視点切り替え**: 上部HUDの `[🎥 視点切替]` ボタンで「立体3D視点」と「真上俯瞰(2.5D)視点」を瞬時に切り替え
- **カメラ移動**: `W` / `A` / `S` / `D` キー（+ `Shift` で高速スクロール）
- **ズーム**: マウスホイール回転

---

## 🛠 技術構成 (Tech Stack)

- **フロントエンド / UI**:
  - HTML5, CSS3 (Cyberpunk / Dark Slate Design System)
  - Vanilla JavaScript (ES6+ Class Architecture)
- **3Dグラフィックス & 描画**:
  - [Three.js](https://threejs.org/) (r128) - 3Dヘックス立体盤面、プロシージャルタワー造形、レーザー、ダイナミックシャドウ
  - HTML5 2D Canvas - 戦闘パーティクル、ダメージテキスト、クールダウンリングオーバーレイ
- **リアルタイム通信 (PVP)**:
  - [PeerJS](https://peerjs.com/) (1.5.4) - サーバーレスWebRTC P2P通信によるオンライン対戦 ＆ ランダムマッチメイキング
- **オーディオ**:
  - Web Audio API - 外部音声ファイル不要のプロシージャル・シンセサイザー音響（レーザー、反転、爆発、BGM）
- **インフラ / ホスティング**:
  - Firebase Hosting (プロジェクト: `chronos-app-d149d`)
  - GitHub Pages

---

## 📂 プロジェクト構成

```
hex-bastion/
├── README.md           # プロジェクト解説ドキュメント
├── index.html          # ゲームメイン画面・UIモーダル・メタタグ
├── style.css           # サイバースタイル・レスポンシブCSS
├── game.js             # ゲームエンジン統合スクリプト（3D/ロジック/P2P/UI）
├── icon.jpg            # ファビコン・アプリアイコン・ロゴ画像
├── bg_3d_concept.jpg   # アリーナ背景テクスチャ
├── ads.txt             # Google AdSense 認定配信者情報
├── firebase.json       # Firebase Hosting デプロイ設定
└── .firebaserc         # Firebase プロジェクト設定
```

---

## 🚀 デプロイ手順

### Firebase Hosting
```bash
# Firebase CLI ログイン
firebase login

# Hostingへの公開デプロイ
firebase deploy --only hosting
```

### GitHub Pages
`main` ブランチへのプッシュにより、GitHub Pages 側へも自動反映されます。
