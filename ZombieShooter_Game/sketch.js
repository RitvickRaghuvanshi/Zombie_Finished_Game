var player, playerImg, playerShootingImg;
var bgImg;
var zombie, zombieImg, zombieGroup;
var bullet, bulletGroup, bulletSound;
var score = 0;
var gameState = "play";
var life = 3;
var winSound, loseSound;
var restart, restartImg;


function preload() {
  playerImg = loadAnimation("assets/shooter_1.png", "assets/shooter_2.png");
  bgImg = loadImage("assets/bg.jpeg");

  zombieImg = loadImage("assets/zombie.png");

  playerShootingImg = loadImage("assets/shooter_3.png");

  Heart_3 = loadAnimation("assets/heart_3.png");
  Heart_2 = loadAnimation("assets/heart_2.png");
  Heart_1 = loadAnimation("assets/heart_1.png");

  bulletSound = loadSound("assets/explosion.mp3");
  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");

  restartImg = loadImage("assets/restart.jpg");

}

function setup() {
  createCanvas(1300, 755);
  player = createSprite(200, 250, 20, 20);
  player.addAnimation("player", playerImg);
  player.addImage("shooter", playerShootingImg);
  player.scale = 0.4;

  zombieGroup = createGroup();
  bulletGroup = createGroup();

  hearts = createSprite(100, 40, 20, 20);
  
  hearts.addAnimation("hearts3", Heart_3);
  hearts.addAnimation("hearts2", Heart_2);
  hearts.addAnimation("hearts1", Heart_1);
  hearts.scale = 0.3;

  restart = createSprite(610,325, 100, 60);
  restart.addImage("restart", restartImg);
  restart.scale = 0.2;

}

function draw() {
  background(bgImg);
  
  fill("red");
  textSize(35);
  text("Score: " + score, 1000, 50);

  if (gameState == "play") {
    restart.visible = false;
    zombieHit();
    shooterMovement();
    spawnZombies();
    for (var i = 0; i < zombieGroup.length; i++) {
      if (zombieGroup.get(i).isTouching(player) || zombieGroup.get(i).x < player.x) {
        zombieGroup.get(i).remove();
        loseSound.play();
        end();
      }
    }
  }
  else if (gameState == "end") {
    restart.visible = true;
    fill("red");
    textSize(75);
    text("Game Over!", 410, 250);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
}

function shooterMovement() {

  if (keyIsDown(38)) {
    player.y = player.y - 5;
  }
  if (keyIsDown(40)) {
    player.y = player.y + 5;
  }
  if (keyIsDown(39)) {
    player.x = player.x + 5;
  }
  if (keyIsDown(37)) {
    player.x = player.x - 5;
  }
}

function spawnZombies() {
  if (frameCount % 100 === 0) {
    zombie = createSprite(1200, Math.round(random(0, 755)));
    //zombie.debug = true;
    zombie.setCollider("rectangle", 0, 0, 500, 1000)
    zombie.addImage("zombieImg", zombieImg);
    zombie.scale = 0.2;
    zombie.velocityX = -3;
    zombieGroup.add(zombie);
  }
}

function keyPressed() {
  if (keyIsDown(32)) {
    player.changeAnimation("shooter", playerShootingImg);
    bulletShot();
  }
}

function keyReleased() {
  player.changeAnimation("player", playerImg);
}

function bulletShot() {
  bullet = createSprite(player.x + 80, player.y - 33, 40, 5);
  //bullet.debug = true;
  bullet.shapeColor = "red";
  bullet.velocityX = 20;
  bulletGroup.add(bullet);
  bulletSound.play();
}

function zombieHit() {
  for (var i = 0; i < zombieGroup.length; i++) {
    //for (var j = 0; j < bulletGroup.length; j++) {
    if (zombieGroup.get(i).isTouching(bulletGroup)) {
      zombieGroup.get(i).remove();
      bulletGroup.destroyEach();
      score = score + 10;
      winSound.play();
    }
  }
  //}
}

function end() {
  life = life - 1;

  if (life > 0) {
   
   if(life == 2){
     hearts.changeAnimation("hearts2", Heart_2);
   }
   else if(life == 1){
     hearts.changeAnimation ("hearts1", Heart_1);
   }
  }
  else if(life < 1){
    gameState = "end";
    
  }
}

function reset(){
  gameState = "play";
  score = 0;
  life = 3;
  hearts.changeAnimation ("hearts3", Heart_3);
}
