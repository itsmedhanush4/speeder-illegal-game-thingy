class Game {
  constructor() {
   this.resetButton=createButton("")
   this.resetTitle = createElement("h2")
   this.leaderboardTitle=createElement("h2")
   this.leader1=createElement("h2")
   this.leader2=createElement("h2")
   this.playerMoving=false;
   this.leftKeyActive = false
   
    this.blast = false;

  }

  
  getGameState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", data => {
      gameState= data.val()
    })
  }

  updateGameState(state){
    database.ref("/").update({
      gameState:state
    })
  }

  handleElements(){
    form.hide();
    form.titleImg.position(50,50)
    form.titleImg.class("gameTitleAfterEffect");
    
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100)
    
    this.resetTitle.html("Reset Game")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width / 2 + 200, 40);

    this.leaderboardTitle.html("Leaderboard")
    this.leaderboardTitle.class("resetText")
    this.leaderboardTitle.position(width/3-60, 40)

    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getPlayerCount();

    car1=createSprite(width/2-50, height-100)
    car2=createSprite(width/2+100, height-100)
    car1.scale=0.07
    car2.scale=0.07
    
    
    car1.addImage("car1",car1Img)
    car2.addImage("car2",car2Img)
    
    cars=[car1,car2]

    coinGroup= new Group()
    fuelGroup= new Group()
    obsGroup=new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obs1Img },
      { x: width / 2 - 150, y: height - 1300, image: obs1Img },
      { x: width / 2 + 250, y: height - 1800, image: obs1Img },
      { x: width / 2 - 180, y: height - 2300, image: obs2Img },
      { x: width / 2, y: height - 2800, image: obs2Img },
      { x: width / 2 - 180, y: height - 3300, image: obs1Img },
      { x: width / 2 + 180, y: height - 3300, image: obs2Img },
      { x: width / 2 + 250, y: height - 3800, image: obs2Img },
      { x: width / 2 - 150, y: height - 4300, image: obs1Img },
      { x: width / 2 + 250, y: height - 4800, image: obs2Img },
      { x: width / 2, y: height - 5300, image: obs1Img },
      { x: width / 2 - 180, y: height - 5500, image: obs2Img }
    ];

    this.addSprite(fuelGroup,4,fuelImg,0.02)
    this.addSprite(coinGroup,18,coinImg,0.09)
    this.addSprite(obsGroup,obstaclesPositions.length,obs1Img,0.04, obstaclesPositions)
  }

  play(){

    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo();


    if(allPlayers !== undefined){
      image(trackImg,0,-height*5,width,height*6 );
      this.showLeaderBoard()

      var index= 0;
      for (var plr in allPlayers){
        index=index+1
        var x= allPlayers[plr].positionX;
        var y= height-allPlayers[plr].positionY;
        cars[index-1].position.x=x
        cars[index-1].position.y=y;

        if(index==player.index){
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          
          camera.position.y=cars[index-1].position.y;

          this.handleFuel(index)
          this.handleCoins(index)
          this.handleCarACollisionWithCarB(index);
          this.handleObstacleCollision(index);

          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

        }
        
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }
      this.handlePlayerControl()

      const Finishline= height * 6 - 100;
      if(player.positionY>Finishline){
        gameState=2
        player.rank+=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites()
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuelGroup,function(collector,collected){
      player.fuel=185
      collected.remove()
    })

    if(player.fuel>0 && this.playerMoving){
      player.fuel -= 0.5 ;
    }

   
    if(player.fuel<=0){
      gameState=2;
      this.gameOver()
    }

    
  }

  
 
 
  handleCoins(index){
   cars[index-1].overlap(coinGroup,function(collector,collected){
    player.score=player.score+20;
    player.update()
    collected.remove()
   })
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obsGroup)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reducing Player Life
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver(){
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }


  handlePlayerControl(){
    if(keyIsDown(UP_ARROW)){
      this.playerMoving=true
      player.positionY=player.positionY+10;
      player.update()
    }
    
    if(keyIsDown(RIGHT_ARROW)){
      player.positionX=player.positionX+10;
      player.update()
      this.leftKeyActive = false;
    }
    if(keyIsDown(LEFT_ARROW)){
      player.positionX=player.positionX-10;
      player.update()
      this.leftKeyActive = true;
    }
  }

  showLeaderBoard(){
    var leader1,leader2
    var players = Object.values(allPlayers);
    if(players[0].rank == 0 && players[1].rank == 0 || players[0].rank==1){
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score + "&emsp;";
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score + "&emsp;";
    }
    if(players[1].rank == 1){
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score + "&emsp;";
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score + "&emsp;";
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }


  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players: {},
        carsAtEnd: 0
      })
        window.location.reload()
      
    })
  }

  
  addSprite(spriteGroup, numberOfSprites,spriteImage, scale, positions=[]){
      for(var i=0 ; i<numberOfSprites; i=i+1){
        var x,y;
        if(positions.length>0){
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        }


        else{
          x = random(width / 2 + 150, width / 2 - 150);
          y = random(-height * 4.5, height - 400);
        }
       
        var sprite=createSprite(x,y)
        sprite.addImage("sprite", spriteImage)
        sprite.scale=scale
        spriteGroup.add(sprite)
     }
  }



}