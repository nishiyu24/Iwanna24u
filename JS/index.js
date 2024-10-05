// キーボードの入力状態を記録する配列の定義
var input_key_buffer = new Array();

// キーボードの入力イベントをトリガーに配列のフラグ値を更新させる
window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
  e.preventDefault();
  input_key_buffer[e.keyCode] = true;

  // 攻撃ボタンが押された時
  if (e.keyCode === 70 && !isGameOver) {
    for (const Bullet of Bulletlocations){
      if(!Bullet.valid){
        Bullet.valid = true;
        Bullet.bulletX = x;
        Bullet.bulletY = y + 5;
        Bullet.Isright = toRight;
        Bullet.aliveTime = performance.now();;
        shotCount += 1;
        if(shotCount == 1){
          fireSE1.play();
        }else if(shotCount == 2){
          fireSE2.play();
        }else if(shotCount == 3){
          fireSE3.play();
        }else if(shotCount == 4){
          fireSE4.play();
          shotCount = 0;
        }
        break;
      }
    }
  }

  // ジャンプボタン(38:上矢印, 32:スペース)が押された時
  if ((e.keyCode === 38 || e.keyCode === 32) && !isJump) {
    jump1SE.play();
    isJump = true;  // ジャンプ開始フラグ
    vy = -10;  // 初期ジャンプ速度
  }else if((e.keyCode === 38 || e.keyCode === 32) && isJump && CanSecondJump && Jumping){
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
    if(vy <= -1.6){
      vy = -1.6;
    }
  }
}

// canvas要素の取得
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

// 死亡BGMの読み込み
const deadBGM = new Audio('./sound/dead.wav');
// ジャンプSEの読み込み
const jump1SE = new Audio('./sound/jump1.wav');
const jump2SE = new Audio('./sound/jump2.wav');
// ジャンプSEの読み込み
const fireSE1 = new Audio('./sound/fire.wav');
const fireSE2 = new Audio('./sound/fire.wav');
const fireSE3 = new Audio('./sound/fire.wav');
const fireSE4 = new Audio('./sound/fire.wav');

let frameCount = 0;
let fps = 0;
const targetFPS = 60;
let fpsInterval = 1000 / targetFPS; // 1フレームの間隔（60FPSの場合約16.67ms）
let lastFrameTime = performance.now(); // 最後のフレームのタイムスタンプ
let startTime = lastFrameTime; // 最初のフレーム時間

// 画像を表示する座標の定義 & 初期化
var x = 0;
var y = 300;
var characterSizeX = 10;
var characterSizeY = 17;
var RestartX = 0;
var RestartY = 300;
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

const blocks = [
  { x: blocksize * 0, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 1, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 2, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 3, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 4, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 2, y: under_ground - blocksize * 3, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 3, y: under_ground - blocksize * 3, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 4, y: under_ground - blocksize * 3, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 4, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 5, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 6, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 7, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 8, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 9, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 10, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 11, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 12, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 13, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 14, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 15, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 16, y: under_ground - blocksize * 4, w: blocksize, h: blocksize, r: 3, btype: "needle"},
  { x: blocksize * 17, y: under_ground - blocksize * 2, w: blocksize, h: blocksize, r: 1, btype: "needle"},
  { x: blocksize * 15, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 16, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 17, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 18, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 19, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 20, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 21, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 22, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 23, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 24, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},
  { x: blocksize * 25, y: under_ground - blocksize * 1, w: blocksize, h: blocksize, r: 1, btype: "static"},

];

// ロード時に画面描画の処理が実行されるようにする
window.addEventListener("load", update);


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

    // 更新後の座標
    var updatedX = x;
    var updatedY = y;

    if (isGameOver) {
      updatedY = y + vy;
      vy += 1.5;

      if (input_key_buffer[82]) {  // 'R'キーでリセット
        deadBGM.pause();
        deadBGM.currentTime = 0.35;
        isGameOver = false;
        isJump = false;
        updatedX = 0;
        updatedY = 300;
        vy = 0;
      }
    } else {

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
        if (getBlockTargetIsOn(x, y, updatedX, updatedY) === null) {
          isJump = true;
          CanSecondJump = true;
          vy = 0;
        }
      }

      const blockTargetIsTouch = getBlockTargetIsTouch(updatedX, updatedY,characterSizeX,characterSizeY);
      if (blockTargetIsTouch) {
        if(blockTargetIsTouch.btype == "needle"){
          getNeedleMarkPoint(updatedX, updatedY, blockTargetIsTouch.x, blockTargetIsTouch.y, blockTargetIsTouch.h, blockTargetIsTouch.w, blockTargetIsTouch.r);
        }else{
          const result = rollBackPosition(blockTargetIsTouch.x, blockTargetIsTouch.y, blockTargetIsTouch.h, blockTargetIsTouch.w, x, y, updatedX, updatedY);
          updatedX = result.chatacter_updatedX;
          updatedY = result.chatacter_updatedY;
        }
      }

      if (y > 820) {
        isGameOver = true;
      }

      if(isGameOver){
        deadBGM.currentTime = 0.35;
        deadBGM.play();
      }
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
      if(performance.now() - Bullet.aliveTime > 2000){
        Bullet.valid = false;
      }else{
        ctx.fillStyle = 'red';
        ctx.fillRect(Bullet.bulletX, Bullet.bulletY, 4, 4);
      }
    }

    // 地面の画像を表示
    for (const block of blocks) {
      var groundImage = new Image();
      if(block.btype == "static"){
        groundImage.src = `./image/ground/Grasslands.png`;
      }else if(block.btype == "needle"){
        groundImage.src = `./image/ground/Needle-00${block.r}.png`;
      }
      ctx.drawImage(groundImage, block.x, block.y, block.w, block.h);
    }

    // 主人公の画像を表示
    var image = new Image();
    if (isGameOver) {
      image.src = "./image/GameOver.png";
      ctx.drawImage(image, (960 - image.width) / 2, (800 - image.height) / 2);
    } else if (isJump) {
      // `https://github.com/nishiyu24/24u/blob/main/image/character/jump/kid-jump-${toRight ? "right" : "left"}-${vy <= 0 ? "up" : "fall"}.png?raw=true`;
      image.src ="https://github.com/nishiyu24/24u/blob/main/image/character/walk/Kid-walk-right-000.png?raw=true";
      ctx.drawImage(image, x - 12, y - 14, 32, 32);
    } else {
      image.src = `https://github.com/nishiyu24/24u/blob/main/image/character/walk/kid-walk-${toRight ? "right" : "left"}-${"00" + Math.floor(walkingCount / walkRange)}.png?raw=true`;
      alert(image.src);
      ctx.drawImage(image, x - 12, y - 14, 32, 32);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, characterSizeX, characterSizeY);

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
    if (fps <= 55) {
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

function getNeedleMarkPoint(chatacter_updatedX, chatacter_updatedY, blockx, blocky, blockh, blockw, blockr) {
  
  var points = [];
  var safeMode = 5;
  
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

function calcPotionArray(array1,array2){
  // 1. 2つの配列を足す
  const summedArray = array1.map((value, index) => value + array2[index]);
  // 2. 合計した配列をnumで割る
  return summedArray.map(value => value / 2);
}

function isPointInRect(chatacter_x,chatacter_y,chatacter_updatedX, chatacter_updatedY) {
  // 矩形の情報
  const rectLeft = chatacter_updatedX;
  const rectRight = chatacter_updatedX + characterSizeX;
  const rectTop = chatacter_updatedY;
  const rectBottom = chatacter_updatedY + characterSizeY;

  // 座標が矩形内にあるかどうかを確認
  return chatacter_x >= rectLeft && chatacter_x <= rectRight && chatacter_y >= rectTop && chatacter_y <= rectBottom;
}

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
