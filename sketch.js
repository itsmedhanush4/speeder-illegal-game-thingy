var canvas;
var backgroundImage, bgImg, car1Img, car2Img, trackImg;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2,track;
var cars = [];
var allPlayers
var fuelGroup, coinGroup,obsGroup
var fuelImg,coinImg
var obs1Img,obs2Img

function preload() {
  backgroundImage = loadImage("assets/background.png");
  car1Img = loadImage("assets/car1.png");
  car2Img = loadImage("assets/car2.png");
  trackImg = loadImage("assets/track.jpg");
  fuelImg = loadImage("assets/fuel.png");
  coinImg= loadImage("assets/goldCoin.png")
  obs1Img= loadImage("assets/obstacle1.png")
  obs2Img= loadImage("assets/obstacle2.png")
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getGameState();
  game.start();
 
}


function draw() {
  background(backgroundImage);
  if (playerCount == 2) {
    game.updateGameState(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}