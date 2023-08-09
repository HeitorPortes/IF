var PLAY = 1;
var END = 0;
var GameState = PLAY;

var tucano, tucano_voando, tucano_collided;
var ground, groundGif;

var sol, solImg;

var nuvemGroup, nuvemGif, nuvemGif2, nuvemGif3;
var obstaculosGroup, carcara, coruja, bemTV, gaviP, maritaca;

var invisibleBlock, invisibleBlock2;

var score;

var jumpSound, dieSound, checkPointSound;

var restartGif, gameOverPng, gameOver, restart;

function preload(){
    tucano_voando = loadImage("Tucano.gif");
    tucano_collided = loadImage("tucano2.png");

    solImg = loadImage("Sol.png");

    groundGif = loadImage("Ground.gif");

    nuvemGif = loadImage("nuvem.png");
    nuvemGif2 = loadImage("nuvem2.png");
    nuvemGif3 = loadImage("Nuvem3.png");

    carcara = loadImage("carcara1.png");
    coruja = loadImage("Coruja.png");
    bemTV = loadImage("BemTv.png");
    gaviP = loadImage("gaviP.png");
    maritaca = loadImage("Maritaca.png");

    restartGif = loadImage("restart.png");
    gameOverPng = loadImage("gameOver.png");

    jumpSound = loadSound("jump.mp3");
    dieSound = loadSound("tucanoDead.mp3");
    checkPointSound = loadSound("checkpoint.mp3");
}

function setup() {
    createCanvas(600, 250);

    sol = createSprite(50,50,20,20);
    sol.addImage(solImg);
    sol.scale = 3;
    
    ground = createSprite(200,180,400,20);
  ground.addImage(groundGif);
  ground.x = ground.width /2;
  ground.scale=1000000000000;
    
    tucano = createSprite(55,100,20,20);
    tucano.addImage(tucano_voando);
    tucano.scale = 2;

    invisibleBlock=createSprite(300,270,1000,10);
    invisibleBlock.visible = false;

   invisibleBlock2=createSprite(300,0.0001,1000,1);
   invisibleBlock2.visible = false;

  gameOver = createSprite(300,100,20,20);
  gameOver.addImage(gameOverPng);
  gameOver.scale = 100;

  restart = createSprite(300,140,20,20);
  restart.addImage(restartGif);
  restart.scale = 3;

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  obstaculosGroup = createGroup();
  nuvemGroup = createGroup();

  score = 0;

  tucano.setCollider("circle",0,0,7);
  tucano.debug = false;
}

function draw() {
    background("lightblue");
  
  text("Score: "+ score, 500,50);
  
  if(GameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    
    ground.velocityX = -(6
      +score/1000);
    
    score = score + Math.round(frameCount/60);

    if (score >0 && score%1000==0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(keyDown("SPACE") || touches.length > 0){
      tucano.velocityY = -8;
      jumpSound.play();
      touches = [];
    }
    
    tucano.velocityY = tucano.velocityY + 0.8
  
    spawnClouds();
    spawnObstacles();
    
    if(obstaculosGroup.isTouching(tucano)){
        GameState = END;
        dieSound.play();
    }

    if(invisibleBlock.isTouching(tucano) || invisibleBlock2.isTouching(tucano)){
      GameState = END;
      dieSound.play();
    }
  
  }
   else if (GameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0
     
      tucano.velocityY = 0
     
      tucano.addImage(tucano_collided);
     
    obstaculosGroup.setLifetimeEach(-1);
    nuvemGroup.setLifetimeEach(-1);
     
     obstaculosGroup.setVelocityXEach(0);
     nuvemGroup.setVelocityXEach(0);
   }

   if(mousePressedOver(restart) || touches.length > 0){
    reset();
    touches = [];
   }

    drawSprites();
}

function reset(){
    GameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
  
    tucano.addImage(tucano_voando);
    tucano.y = 100;

    obstaculosGroup.destroyEach();
    nuvemGroup.destroyEach();
    score = 0;
  
    tucano.changeImage(tucano_voando);
  }

  function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(600,150,10,40);
      obstacle.y = Math.round(random(50,200));
      obstacle.velocityX = -(6+score/1000);
      
       var rand = Math.round(random(1,5));
       switch(rand) {
         case 1: obstacle.addImage(bemTV);
                 break;
         case 2: obstacle.addImage(carcara);
                 break;
         case 3: obstacle.addImage(coruja);
                 break;
         case 4: obstacle.addImage(gaviP);
                 break;
         case 5: obstacle.addImage(maritaca);
                 break;
         default: break;
       }

       obstacle.scale = 2;
       obstacle.lifetime = 300;

       obstacle.setCollider("circle",0,0,6);
       obstacle.debug = false;
      
       obstaculosGroup.add(obstacle);
    }
   }

   function spawnClouds() {
    if (frameCount % 60 === 0) {
       var nuvem = createSprite(600,50,10,40);
      nuvem.y = Math.round(random(50,75));

      var rand = Math.round(random(1,3));
       switch(rand) {
         case 1: nuvem.addImage(nuvemGif);
                 break;
         case 2: nuvem.addImage(nuvemGif2);
                 break;
         case 3: nuvem.addImage(nuvemGif3);
                 break;
       }
      
      nuvem.scale = 3;
      nuvem.velocityX = -3;
      
      nuvem.lifetime = 300;

      nuvem.depth = tucano.depth;
      tucano.depth = tucano.depth + 1;
      
     nuvemGroup.add(nuvem);
      }
  }