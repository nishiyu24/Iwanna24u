// キーボードの入力状態を記録する配列の定義
var input_key_buffer = new Array();

// キーボードの入力イベントをトリガーに配列のフラグ値を更新させる
window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
  e.preventDefault();
  input_key_buffer[e.keyCode] = true;

  // 攻撃ボタンが押された時
  if ((e.keyCode === 90 || e.keyCode === 86) && !isGameOver) {
    for (const Bullet of Bulletlocations){
      if(!Bullet.valid){
        Bullet.valid = true;
        Bullet.bulletX = x;
        Bullet.bulletY = y + 5;
        Bullet.Isright = toRight;
        Bullet.aliveTime = performance.now();;
        if(shotCount == 0){
          fireSE1.load();
          fireSE1.play();
          shotCount = 1;
        }else if(shotCount == 1){
          fireSE2.load();
          fireSE2.play();
          shotCount = 0;
        }
        break;
      }
    }
  }

  // ジャンプボタン(38:上矢印, 32:スペース)が押された時
  if ((e.keyCode === 38 || e.keyCode === 32) && !isJump) {
    jump1SE.load();
    jump1SE.play();
    isJump = true;  // ジャンプ開始フラグ
    vy = -10;  // 初期ジャンプ速度
  }else if((e.keyCode === 38 || e.keyCode === 32) && isJump && CanSecondJump && Jumping){
    jump2SE.load();
    jump2SE.play();
    Jumping = false;
    CanSecondJump = false;  // 2段ジャンプ停止フラグ
    vy = -8 ;  // 2段ジャンプ速度
  }
}

window.addEventListener("keyup", handleKeyup);
function handleKeyup(e) {
  e.preventDefault();
  input_key_buffer[e.keyCode] = false;

  // ジャンプボタンが離された時
  if ((e.keyCode === 38 || e.keyCode === 32) && isJump) {
    Jumping = true;
    if(vy <= -1){
      vy = -1;
    }
  }
}

// canvas要素の取得
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");
//背景用offcanvas
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');
//ギミックoffcanvas
const GimmickscreenCanvas = document.createElement('canvas');
GimmickscreenCanvas.width = canvas.width;
GimmickscreenCanvas.height = canvas.height;
const GimmickscreenCtx = GimmickscreenCanvas.getContext('2d');
var IsGimmick = false;
let GimmickTime = 0;
let GimmickEnd = 0;

// 死亡BGMの読み込み
const deadBGM = new Audio('./sound/dead.wav');
deadBGM.currentTime =0.35;
// 死亡SEの読み込み
const deadSE = new Audio('./sound/splatter.wav');
// 通常BGMの読み込み
const stage1BGM = new Audio('./sound/normal.ogg');
stage1BGM.loop = true;
stage1BGM.volume =0.2;
stage1BGM.load();
// ジャンプSEの読み込み
const jump1SE = new Audio('./sound/jump1.wav');
const jump2SE = new Audio('./sound/jump2.wav');
// 射撃SEの読み込み
const fireSE1 = new Audio('./sound/fire.wav');
const fireSE2 = new Audio('./sound/fire.wav');

let frameCount = 0;
let fps = 0;
const targetFPS = 60;
let fpsInterval = 1000 / targetFPS; // 1フレームの間隔（60FPSの場合約16.67ms）
let lastFrameTime = performance.now(); // 最後のフレームのタイムスタンプ
let startTime = lastFrameTime; // 最初のフレーム時間

// 画像を表示する座標の定義 & 初期化
var x = 50;
var y = 700;
var characterSizeX = 10;
var characterSizeY = 17;
var RestartX = 50;
var RestartY = 700;
var under_ground = 800;
var blocksize = 32;

// 上下方向の速度
var vy = 0;
// ジャンプしたか否かのフラグ値
var isJump = false;
var Jumping = false;
var CanSecondJump = true;

// ゲームオーバーか否かのフラグ値
var isGameOver = false;

//射撃用構造体
var shotCount = 0;
var Bulletlocations = [
  {valid : false, bulletX : 0, bulletY : 0, Isright : true, aliveTime : 0},
  {valid : false, bulletX : 0, bulletY : 0, Isright : true, aliveTime : 0},
  {valid : false, bulletX : 0, bulletY : 0, Isright : true, aliveTime : 0},
  {valid : false, bulletX : 0, bulletY : 0, Isright : true, aliveTime : 0},             
  ];

// 移動中の場合にカウントする
var walkingCount = 0;
// 画像を切り替えるフレーム
const walkRange = 3;
var isFall = false
// 右向きか否か
var toRight = true;

//ステージ配置用構造体配列
const blocks = [
  { x: blocksize * 0, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 3, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},

  { x: blocksize * 0, y: under_ground - blocksize * 6, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 7, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 8, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 9, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 1, y: under_ground - blocksize * 9, w: blocksize, h: blocksize, r: 2, btype: "needle"},
  { x: blocksize * 0, y: under_ground - blocksize * 10, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 11, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 12, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 13, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 14, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 15, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 16, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 1, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 2, btype: "needle"},
  { x: blocksize * 0, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 19, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 21, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 22, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 1, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 13, w: blocksize, h: blocksize, r: 4, btype: "needle"},
  { x: blocksize * 3, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 4, btype: "needle"},


  { x: blocksize * 4, y: under_ground - blocksize * 8, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 9, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 10, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 11, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 12, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 13, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 14, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 15, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 16, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 19, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},

  { x: blocksize * 1, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 2, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 1, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 5, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 5, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 6, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 7, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 9, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 10, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 8, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 7, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 7, y: under_ground - blocksize * 21, w: blocksize, h: blocksize, r: 3, btype: "needle"},

  { x: blocksize * 11, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 14, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 13, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 14, y: under_ground - blocksize * 21, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 20.5, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 21, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 21.5, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},

  { x: blocksize * 20.5, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 21, y: under_ground - blocksize * 21, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 21.5, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},

  { x: blocksize * 15, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 16, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 17, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 18, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 19, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 20, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 21, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 22, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 23, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 0, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 1, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 2, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 2, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 5, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 6, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 7, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 9, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 10, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 11, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 15, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 16, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 17, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 18, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 19, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 20, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 21, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 22, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 23, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 7, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 25, y: under_ground - blocksize * 8, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 10, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 25, y: under_ground - blocksize * 11, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 13, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 25, y: under_ground - blocksize * 14, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 16, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 25, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 19, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 25, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 6, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 7, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 8, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 9, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 10, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 11, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 12, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 13, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 14, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 15, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 16, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 19, w: blocksize, h: blocksize, r: 3, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},


  { x: blocksize * 5, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 5, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 6, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 7, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 9, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 10, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 11, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 15, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 16, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 17, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 18, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 19, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 20, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 21, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 22, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 23, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 20, w: blocksize, h: blocksize, r: 1, btype: "Nground"},

  { x: blocksize * 4, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "save"},
  { x: blocksize * 2, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 4, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 5, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 6, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 7, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 9, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 10, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 11, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 15, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 16, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 17, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 18, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 19, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 20, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 21, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 22, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 23, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 1, btype: "save"},

  { x: blocksize * 26, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 1, btype: "save"},
];

drawBackground(blocks);
// ロード時に画面描画の処理が実行されるようにする
window.addEventListener("load", update);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
}

async function drawBackground(structs) {
  const promises = structs.map(struct => {
    let src;
    if (struct.btype == 'Nground') {
      src = './image/ground/Grasslands.png';
    } else if (struct.btype == 'needle') {
      src = `./image/ground/Needle-00${struct.r}.png`;
    } else if (struct.btype == 'save') {
      src = './image/ground/Save1.png'; // 新しいソース
    } else {
      console.error(`Unknown btype: ${struct.btype}`);
      return Promise.resolve(null); // 無効なタイプの場合はnullを返す
    }
    return loadImage(src);
  });

  const images = await Promise.all(promises);

  images.forEach((image, index) => {
    if (image) {
      offscreenCtx.drawImage(image, structs[index].x, structs[index].y, structs[index].w, structs[index].h);
    }
  });
}


///////////////////////////////////////////////////////////
/*/////////////////  メイン繰り返し部分  /////////////////*/
///////////////////////////////////////////////////////////
function update() {
  let debug = document.getElementById("test");
  // 現在の時間を取得
  let now = performance.now();
  // 経過時間を計算
  let elapsed = now - lastFrameTime;

  // 経過時間が設定したFPS間隔を超えた場合のみ、描画処理を実行する
  if (elapsed > fpsInterval) {
    // 経過時間がFPS間隔よりも多い分を調整
    lastFrameTime = now - (elapsed % fpsInterval);

    // 画面全体をクリア
    ctx.clearRect(0, 0, 960, 800);
    ctx.drawImage(offscreenCanvas, 0, 0);

    if(now - GimmickTime < GimmickEnd){
      ctx.drawImage(GimmickscreenCanvas, 0, 0);
    }


    // 更新後の座標
    var updatedX = x;
    var updatedY = y;

    if (isGameOver) {
      if (input_key_buffer[82]) {  // 'R'キーでリセット
        deadBGM.load();
        deadBGM.currentTime =0.35;
        stage1BGM.play();
        isGameOver = false;
        isJump = false;
        updatedX = RestartX;
        updatedY = RestartY;
        vy = 0;
      }
    } else {

      if(!stage1BGM.play()){
        stage1BGM.play();
      }

      if (input_key_buffer[37] || input_key_buffer[39] || input_key_buffer[68] || input_key_buffer[65]) {
        walkingCount = (walkingCount + 1) % (walkRange * 6);
      } else {
        walkingCount = 0;
      }

      if (input_key_buffer[37] || input_key_buffer[65]) {
        toRight = false;
        updatedX = x - 2.7;
      }

      if (input_key_buffer[39] || input_key_buffer[68]) {
        toRight = true;
        updatedX = x + 2.7;
      }

      if (isJump) {
        updatedY = y + vy;

        if(vy < 12){
          vy += 0.4;
        }

        const blockTargetIsOn = getBlockTargetIsOn(x, y, updatedX, updatedY);
        if (blockTargetIsOn !== null) {
          if(blockTargetIsOn.btype == "needle"){
            getNeedleMarkPoint(updatedX, updatedY, blockTargetIsOn.x, blockTargetIsOn.y, blockTargetIsOn.h, blockTargetIsOn.w, blockTargetIsOn.r);
          }else{
            updatedY = blockTargetIsOn.y - characterSizeY;
            isJump = false; // ジャンプ状態を解除
            Jumping = false;
            CanSecondJump = true;
          }

        }
      } else {
        if (getBlockTargetIsOn(x, y, updatedX, updatedY) == null || getBlockTargetIsOn(x, y, updatedX, updatedY).btype == "needle") {
          isJump = true;
          CanSecondJump = true;
          vy = 0;
        }
      }

      const blockTargetIsTouch = getBlockTargetIsTouch(updatedX, updatedY,characterSizeX,characterSizeY);
      if (blockTargetIsTouch) {
        if(blockTargetIsTouch.btype == "Nground"){
          const result = rollBackPosition(blockTargetIsTouch.x, blockTargetIsTouch.y, blockTargetIsTouch.h, blockTargetIsTouch.w, x, y, updatedX, updatedY);
          updatedX = result.chatacter_updatedX;
          updatedY = result.chatacter_updatedY;
        }else if(blockTargetIsTouch.btype == "needle"){
          getNeedleMarkPoint(updatedX, updatedY, blockTargetIsTouch.x, blockTargetIsTouch.y, blockTargetIsTouch.h, blockTargetIsTouch.w, blockTargetIsTouch.r);
        }else{}
      }

      if (y > 820 || 14 > y) {
        isGameOver = true;
      }

      if(isGameOver){
        stage1BGM.load();
        deadBGM.play();
      }
    }

    //debug.innerHTML = `${updatedX} : ${updatedY}`;

    if (input_key_buffer[82]) {
      isJump = false;
      updatedX = RestartX;
      updatedY = RestartY;
      vy = 0;
    }


    x = updatedX;
    y = updatedY;

    for (const Bullet of Bulletlocations){
      if(Bullet.valid == false) continue;
      if(Bullet.Isright){
        Bullet.bulletX += 15;
      }else{
        Bullet.bulletX -= 15;
      }

      const Bulletblock = getBlockTargetIsTouch(Bullet.bulletX, Bullet.bulletY, 3, 3);
      if (Bulletblock && Bulletblock.btype == "Nground") {
        Bullet.valid = false;
      } else if (Bulletblock && Bulletblock.btype == "save") {
        RestartX = x;
        RestartY = y;
        Bullet.valid = false;
        SetGimmicks(Bulletblock,1);
      }
      
      if(performance.now() - Bullet.aliveTime > 2000 || !Bullet.valid){
        Bullet.valid = false;
      }else{
        ctx.fillStyle = 'black';
        ctx.fillRect(Bullet.bulletX, Bullet.bulletY, 3, 3);
      }
    }

    // 主人公の画像を表示
    var image = new Image();
    if (isGameOver) {
      image.src = "./image/GameOver.png";
      ctx.drawImage(image, (960 - image.width) / 2, (800 - image.height) / 2);
    } else if (isJump) {
      image.src = `./image/character/jump/Kid-jump-${toRight ? "right" : "left"}-${vy <= 0 ? "up" : "fall"}.png`;
      ctx.drawImage(image, x - 12, y - 14, 32, 32);
    } else {
     image.src = `./image/character/walk/Kid-walk-${toRight ? "right" : "left"}-${"00" + Math.floor(walkingCount / walkRange)}.png`;
      ctx.drawImage(image, x - 12, y - 14, 32, 32);
    }

    //ctx.fillStyle = 'red';
    //ctx.fillRect(x, y, characterSizeX, characterSizeY);

    // FPSの計算
    frameCount++;
    if (now - startTime >= 1000) { // 1秒経過ごとにFPSを更新
      fps = frameCount;
      frameCount = 0;
      startTime = performance.now(); // 1秒ごとにリセット
    }

    window.requestAnimationFrame(update);

    let animationFPS = document.getElementById("fps");
    animationFPS.innerHTML = fps;

    // fpsが55以下なら赤文字、それ以上なら黒文字に変更
    if (fps <= targetFPS-5) {
      animationFPS.style.color = 'red';
    } else {
      animationFPS.style.color = 'black';
    }

  } else {
    // FPSの間隔内に収まらない場合、次のフレームのリクエストだけを行う
    window.requestAnimationFrame(update);
  }
}

///////////////////////////////////////////////////////////
/*//////////////  メイン繰り返し部分終わり  ///////////////*/
///////////////////////////////////////////////////////////

// 変更前後のxy座標を受け取って、ブロックの上に存在していればそのブロックの情報を返す
function getBlockTargetIsOn(chatacter_x, chatacter_y, chatacter_updatedX, chatacter_updatedY) {
  for (const block of blocks) {
    if (chatacter_y + characterSizeY <= block.y && chatacter_updatedY + characterSizeY >= block.y) {
      if (!(chatacter_x + characterSizeX <= block.x || chatacter_x >= block.x + block.w) && !(chatacter_updatedX + characterSizeX <= block.x || chatacter_updatedX >= block.x + block.w)) {
        return block;
      }
    }
  }
  return null;
}

// 変更前後のxy座標を受け取って、ブロックに接触していればそのブロックの情報を返す
function getBlockTargetIsTouch(chatacter_updatedX, chatacter_updatedY,SizeX,SizeY) {
  for (const block of blocks) {
    if (!(chatacter_updatedY + SizeY <= block.y || chatacter_updatedY >= block.y + block.h)) {
      if (!(chatacter_updatedX + SizeX <= block.x || chatacter_updatedX >= block.x + block.w)) {
        return block;
      }
    }
  }
  return null;
}

//針の当たり判定を検証し、接触していればゲームオーバーとする
function getNeedleMarkPoint(chatacter_updatedX, chatacter_updatedY, blockx, blocky, blockh, blockw, blockr) {
  
  var points = [];
  var safeMode = 0;
  
  if(blockr ==1){
    p1 = [blockx, blocky + blockh];
    p2 = [blockx + blockw, blocky + blockh];
    p3 = [blockx + blockw/2 + 0.5, blocky + safeMode];
  }else if(blockr == 2){
    p1 = [blockx, blocky];
    p2 = [blockx, blocky + blockh];
    p3 = [blockx + blockw - safeMode, blocky + blockh/2 + 0.5];
  }else if(blockr == 3){
    p1 = [blockx, blocky];
    p2 = [blockx + blockw, blocky];
    p3 = [blockx + blockw/2 + 0.5, blocky + blockh - safeMode];
  }else if(blockr == 4){
    p1 = [blockx + blockw, blocky];
    p2 = [blockx + blockw, blocky + blockh];
    p3 = [blockx + safeMode, blocky + blockh/2 + 0.5];
  }
  points.push(p1);
  points.push(p2);
  points.push(p3);
  points.push(calcPotionArray(p1,p2));
  points.push(calcPotionArray(p1,p3));
  points.push(calcPotionArray(p2,p3));

  for (const point of points) {
    if(isPointInRect(point[0],point[1],chatacter_updatedX, chatacter_updatedY)){
      isGameOver = true;
      break;
    }
  }
}

//針の中点検出用
function calcPotionArray(array1,array2){
  // 1. 2つの配列を足す
  const summedArray = array1.map((value, index) => value + array2[index]);
  // 2. 合計した配列をnumで割る
  return summedArray.map(value => value / 2);
}

//針の特徴点がキャラクターの当たり判定に接触しているか
function isPointInRect(chatacter_x,chatacter_y,chatacter_updatedX, chatacter_updatedY) {
  // 矩形の情報
  const rectLeft = chatacter_updatedX;
  const rectRight = chatacter_updatedX + characterSizeX;
  const rectTop = chatacter_updatedY;
  const rectBottom = chatacter_updatedY + characterSizeY;

  // 座標が矩形内にあるかどうかを確認
  return chatacter_x >= rectLeft && chatacter_x <= rectRight && chatacter_y >= rectTop && chatacter_y <= rectBottom;
}

//地面のめり込み防止
function rollBackPosition(blockx, blocky, blockh, blockw, chatacter_x, chatacter_y, chatacter_updatedX, chatacter_updatedY) {
  // キャラクターの上下左右に関する判定を行う
  const characterBottom = chatacter_y + characterSizeY;
  const characterTop = chatacter_y;
  const characterLeft = chatacter_x;
  const characterRight = chatacter_x + characterSizeX;

  const updatedBottom = chatacter_updatedY + characterSizeY;
  const updatedTop = chatacter_updatedY;
  const updatedLeft = chatacter_updatedX;
  const updatedRight = chatacter_updatedX + characterSizeX;

  // 上下の衝突判定
  if (characterBottom <= blocky && updatedBottom > blocky) {
    chatacter_updatedY = blocky - characterSizeY;  // ブロックの上にキャラクターを配置
  } else if (characterTop >= blocky + blockh && updatedTop < blocky + blockh) {
    chatacter_updatedY = blocky + blockh;  // ブロックの下にキャラクターを配置
    vy = 0;
  }

  // 左右の衝突判定
  if (characterRight <= blockx && updatedRight > blockx) {
    chatacter_updatedX = blockx - characterSizeX;  // ブロックの左にキャラクターを配置
    walkingCount = 0;
  } else if (characterLeft >= blockx + blockw && updatedLeft < blockx + blockw) {
    chatacter_updatedX = blockx + blockw;  // ブロックの右にキャラクターを配置
    walkingCount = 0;
  }

  return { chatacter_updatedX: chatacter_updatedX, chatacter_updatedY: chatacter_updatedY };
}

function SetGimmicks(Gimmickblock,GimmickAliveTime){
  GimmickTime = performance.now();
  GimmickEnd = GimmickAliveTime * 1000;
  var GimmickImage = new Image();
  GimmickImage.src = './image/ground/Save2.png';
  GimmickscreenCtx.drawImage(GimmickImage, Gimmickblock.x, Gimmickblock.y, Gimmickblock.w, Gimmickblock.h);
}
