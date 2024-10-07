///////////////////////入力処理//////////////////////////////


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
  if ((e.keyCode === 38 || e.keyCode === 32) && !isJump && !Highjump) {
    jump1SE.load();
    jump1SE.play();
    isJump = true;  // ジャンプ開始フラグ
    vy = -10;  // 初期ジャンプ速度
  }else if((e.keyCode === 38 || e.keyCode === 32)&& !isJump && Highjump){
    jump1SE.load();
    jump1SE.play();
    isJump = true;  // ジャンプ開始フラグ
    Highjump = false;
    vy = -20;  // 初期ジャンプ速度
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

///////////////////////変数群//////////////////////////////

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
var Highjump = false;

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
  { x: blocksize * 3, y: under_ground - blocksize * 19, w: blocksize, h: blocksize, r: 4, btype: "needle"},


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

  { x: blocksize * 1, y: under_ground - blocksize * 5, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
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


  { x: blocksize * 11, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 14, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 20.5, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 21, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 21.5, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},


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
  { x: blocksize * 1, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "walkway"},
  { x: blocksize * 2, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "walkway"},
  { x: blocksize * 3, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "walkway"},
  { x: blocksize * 4, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "walkway"},
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


  { x: blocksize * 5, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 6, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 7, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 8, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 9, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 10, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 11, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 12, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 13, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 14, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 15, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 16, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 17, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 18, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 19, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 20, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 21, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 22, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 23, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 24, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 25, y: under_ground - blocksize * 17, w: blocksize, h: blocksize, r: 1, btype: "Nground"},

  { x: blocksize * 5, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 6, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 7, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 8, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 9, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 10, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 11, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 12, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 13, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 14, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 16, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 6, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 7, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 8, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 9, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 10, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 11, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 12, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 13, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 14, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 16, y: under_ground - blocksize * 23, w: blocksize, h: blocksize, r: 3, btype: "needle"},

  { x: blocksize * 7, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},
  { x: blocksize * 10, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},
  { x: blocksize * 13, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},
  { x: blocksize * 16, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},
  { x: blocksize * 19, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},
  { x: blocksize * 22, y: under_ground - blocksize * 20, w: blocksize/4, h: blocksize/4, r: 1, btype: "step"},

  { x: blocksize * 17, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 18, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 19, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 20, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 21, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 22, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 23, y: under_ground - blocksize * 18, w: blocksize, h: blocksize, r: 1, btype: "needle"},

  { x: blocksize * 4, y: under_ground - blocksize * 22, w: blocksize, h: blocksize, r: 1, btype: "save"},
  { x: blocksize * 4, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 2, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
  { x: blocksize * 3, y: under_ground - blocksize * 24, w: blocksize, h: blocksize, r: 1, btype: "Nground"},
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
  { x: blocksize * 27, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "jump"},
];

drawBackground(blocks);
// ロード時に画面描画の処理が実行されるようにする
window.addEventListener("load", update);

///////////////////////背景描画//////////////////////////////

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
    // 画像を使用する場合
    if (struct.btype == 'Nground') {
      src = './image/ground/Grasslands.png';
    } else if (struct.btype == 'needle') {
      src = `./image/ground/Needle-00${struct.r}.png`;
    } else if (struct.btype == 'save') {
      src = './image/ground/Save1.png';
    } else if (struct.btype == 'jump') {
      src = './image/ground/Accele-001.png';
    } else if (struct.btype == 'walkway') {
      src = './image/ground/Accele-002.png';
    } else if (struct.btype == 'step') {
      // 画像を使わない場合の分岐: ここでPromiseを返して描画後にnullで処理する
      return Promise.resolve(null);
    } else {
      console.error(`Unknown btype: ${struct.btype}`);
      return Promise.resolve(null); // 無効なタイプの場合はnullを返す
    }
    return loadImage(src);
  });

  const images = await Promise.all(promises);

  images.forEach((image, index) => {
    const struct = structs[index];
    if (image) {
      // 画像を使って描画
      offscreenCtx.drawImage(image, struct.x, struct.y, struct.w, struct.h);
    } else if (struct.btype == 'step') {
      // fillRectを使って矩形を描画
      offscreenCtx.fillStyle = struct.color || 'black'; // 色の指定がない場合は黒
      const Stepsize = 8; 
      offscreenCtx.fillRect(struct.x,struct.y, Stepsize, Stepsize);
    }
  });
}



///////////////////////////////////////////////////////////
/*/////////////////  メイン繰り返し部分  /////////////////*/
///////////////////////////////////////////////////////////
function update() {
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
    }else{
      GimmickscreenCtx.clearRect(0, 0, 960, 800);
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

        if(vy < 8){
          vy += 0.4;
        }

        const blockTargetIsOn = getBlockTargetIsOn(x, y, updatedX, updatedY);
        if (blockTargetIsOn !== null) {
          let debug = document.getElementById("test");
          debug.innerHTML = blockTargetIsOn.btype;
          
          if(blockTargetIsOn.btype == "needle"){
            getNeedleMarkPoint(updatedX, updatedY, blockTargetIsOn.x, blockTargetIsOn.y, blockTargetIsOn.h, blockTargetIsOn.w, blockTargetIsOn.r);
          }else if (blockTargetIsOn.btype == "step" || blockTargetIsOn.btype == "save"){
            //透過ブロック
          }else if (blockTargetIsOn.btype == "jump"){
            updatedY = blockTargetIsOn.y - characterSizeY;
            isJump = false; // ジャンプ状態を解除
            Jumping = false;
            CanSecondJump = true;
            Highjump =true;
          }else{
            updatedY = blockTargetIsOn.y - characterSizeY;
            isJump = false; // ジャンプ状態を解除
            Jumping = false;
            CanSecondJump = true;
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
          }else if(blockTargetIsTouch.btype == "save"){
            RestartX = x;
            RestartY = y;
            SetGimmicks(blockTargetIsTouch,1);
          }else if(blockTargetIsTouch.btype == "step"){
            CanSecondJump = true;
          }else{
            
          }
  
        }

        
      } else {
        if (getBlockTargetIsOn(x, y, updatedX, updatedY).btype == null) {
          isJump = true;
          CanSecondJump = true;
          Highjump = false;
          vy = 0;
        }else if(getBlockTargetIsOn(x, y, updatedX, updatedY).btype == "needle"){
          getNeedleMarkPoint(updatedX, updatedY, blockTargetIsTouch.x, blockTargetIsTouch.y, blockTargetIsTouch.h, blockTargetIsTouch.w, blockTargetIsTouch.r);
          Highjump = false;
        }else if (getBlockTargetIsOn(x, y, updatedX, updatedY).btype == "jump"){
          Highjump =true;
        }else if (getBlockTargetIsOn(x, y, updatedX, updatedY).btype == "walkway"){
          updatedX = updatedX + 2;
          Highjump = false;
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
        }else if(blockTargetIsTouch.btype == "save"){
          RestartX = x;
          RestartY = y;
          SetGimmicks(blockTargetIsTouch,1);
        }else if(blockTargetIsTouch.btype == "step"){
          CanSecondJump = true;
        }

      }else{
      }


      if (y > 820) {
        isGameOver = true;
      }

      if(isGameOver){
        stage1BGM.load();
        deadBGM.play();
      }
    }


    if (input_key_buffer[82]) {
      isJump = false;
      CanSecondJump = true;
      updatedX = RestartX;
      updatedY = RestartY;
      vy = 0;
    }


    x = updatedX;
    y = updatedY;

    for (const Bullet of Bulletlocations){
      if(Bullet.valid == false) continue;
      if(Bullet.Isright){
        Bullet.bulletX += 32;
      }else{
        Bullet.bulletX -= 32;
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


/////////////////////////////接触ブロックの判定/////////////////////////////////

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

/////////////////////////棘の接触判定/////////////////////////////////

// 2つの点の中点を計算する関数
function calcMidPoint(p1, p2) {
  return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}

// 線分が交差しているかどうかを判定する関数
function isLineIntersect(p1, p2, q1, q2) {
  const orientation = (p, q, r) => {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counter-clockwise
  };

  const o1 = orientation(p1, p2, q1);
  const o2 = orientation(p1, p2, q2);
  const o3 = orientation(q1, q2, p1);
  const o4 = orientation(q1, q2, p2);

  // 一般的なケース
  if (o1 !== o2 && o3 !== o4) return true;

  // 特殊ケース（線分がコリニアの場合の処理は省略）
  return false;
}

// 矩形の各辺を取得する関数
function getRectangleEdges(rectX, rectY, rectW, rectH) {
  return [
    [[rectX, rectY], [rectX + rectW, rectY]], // 上辺
    [[rectX + rectW, rectY], [rectX + rectW, rectY + rectH]], // 右辺
    [[rectX + rectW, rectY + rectH], [rectX, rectY + rectH]], // 下辺
    [[rectX, rectY + rectH], [rectX, rectY]] // 左辺
  ];
}

// 針とキャラクターの接触判定を行う関数
function getNeedleMarkPoint(chatacter_updatedX, chatacter_updatedY, blockx, blocky, blockh, blockw, blockr) {
  // 針の向きに応じた三角形の頂点を取得
  const [p1, p2, p3] = calculateNeedlePoints(blockx, blocky, blockh, blockw, blockr);
  
  // 矩形の各辺を取得
  const rectangleEdges = getRectangleEdges(chatacter_updatedX, chatacter_updatedY, characterSizeX, characterSizeY);
  
  // 三角形の辺を取得
  const triangleEdges = [
    [p1, p2],
    [p2, p3],
    [p3, p1]
  ];

  // 各三角形の辺と矩形の辺が交差しているかチェック
  for (const triangleEdge of triangleEdges) {
    for (const rectangleEdge of rectangleEdges) {
      if (isLineIntersect(triangleEdge[0], triangleEdge[1], rectangleEdge[0], rectangleEdge[1])) {
        // 衝突が確認された場合はゲームオーバー
        isGameOver = true;
        return; // 衝突が見つかったら早期に戻る
      }
    }
  }
}

// 針の向きに応じた点の計算を行う関数
function calculateNeedlePoints(blockx, blocky, blockh, blockw, blockr) {
  let p1, p2, p3;

  // 針の向きに応じて三角形の頂点を設定
  if (blockr == 1) {
    p1 = [blockx, blocky + blockh]; // 右下
    p2 = [blockx + blockw, blocky + blockh]; // 左下
    p3 = [blockx + blockw / 2, blocky]; // 上の中心
  } else if (blockr == 2) {
    p1 = [blockx, blocky]; // 左上
    p2 = [blockx, blocky + blockh]; // 左下
    p3 = [blockx + blockw, blocky + blockh / 2]; // 右の中心
  } else if (blockr == 3) {
    p1 = [blockx, blocky]; // 左上
    p2 = [blockx + blockw, blocky]; // 右上
    p3 = [blockx + blockw / 2, blocky + blockh]; // 下の中心
  } else if (blockr == 4) {
    p1 = [blockx + blockw, blocky]; // 右上
    p2 = [blockx + blockw, blocky + blockh]; // 右下
    p3 = [blockx, blocky + blockh / 2]; // 左の中心
  }

  return [p1, p2, p3]; // 計算した点を返す
}

///////////////////////壁のすり抜け防止//////////////////////////////

function rollBackPosition(blockx, blocky, blockh, blockw, chatacter_x, chatacter_y, chatacter_updatedX, chatacter_updatedY) {
  // キャラクターのサイズを定義
  const characterBottom = chatacter_y + characterSizeY;
  const characterTop = chatacter_y;
  const characterLeft = chatacter_x;
  const characterRight = chatacter_x + characterSizeX;

  const updatedBottom = chatacter_updatedY + characterSizeY;
  const updatedTop = chatacter_updatedY;
  const updatedLeft = chatacter_updatedX;
  const updatedRight = chatacter_updatedX + characterSizeX;

  // 左右の衝突判定
  if (characterRight <= blockx && updatedRight > blockx) {
    chatacter_updatedX = blockx - characterSizeX;  // ブロックの左にキャラクターを配置
    walkingCount = 0;
    return { chatacter_updatedX: chatacter_updatedX, chatacter_updatedY: chatacter_updatedY };
  } else if (characterLeft >= blockx + blockw && updatedLeft < blockx + blockw) {
    chatacter_updatedX = blockx + blockw;  // ブロックの右にキャラクターを配置
    walkingCount = 0;
    return { chatacter_updatedX: chatacter_updatedX, chatacter_updatedY: chatacter_updatedY };
  }

  // 上下の衝突判定
  if (characterBottom <= blocky && updatedBottom > blocky) {
    chatacter_updatedY = blocky - characterSizeY;  // ブロックの上にキャラクターを配置
    return { chatacter_updatedX: chatacter_updatedX, chatacter_updatedY: chatacter_updatedY };
  } else if (characterTop >= blocky + blockh && updatedTop < blocky + blockh) {
    chatacter_updatedY = blocky + blockh;  // ブロックの下にキャラクターを配置
    vy = 0;
    return { chatacter_updatedX: chatacter_updatedX, chatacter_updatedY: chatacter_updatedY };
  }
}


///////////////////////ギミックのアニメーション設定用//////////////////////////////

function SetGimmicks(Gimmickblock,GimmickAliveTime){
  GimmickTime = performance.now();
  GimmickEnd = GimmickAliveTime * 1000;
  var GimmickImage = new Image();
  GimmickImage.src = './image/ground/Save2.png';
  GimmickscreenCtx.drawImage(GimmickImage, Gimmickblock.x, Gimmickblock.y, Gimmickblock.w, Gimmickblock.h);
}
