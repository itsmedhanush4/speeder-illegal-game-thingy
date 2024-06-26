class Player {
  constructor() {
    this.name=null;
    this.index=null;
    this.positionX=0;
    this.positionY=0;
    this.rank=0
    this.score=0
    this.fuel=185
    this.coin=0
  }

  addPlayer(){
    var playerIndex="players/player"+this.index
    if(this.index==1){
      this.positionX=width/2-100
    }
    else{
      this.positionX=width/2+100
    }
    database.ref(playerIndex).set({
      name:this.name,
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
    })
  }

  getPlayerCount(){
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount= data.val()
    })
  }

  updatePlayerCount(count){
    database.ref("/").update({
      playerCount:count
    })
  }

  static getPlayersInfo(){
    var playerInfoRef = database.ref("players")
    playerInfoRef.on("value",data =>{
      allPlayers=data.val();
    })
  }

  update(){
    var playerIndex="players/player"+this.index;
    database.ref(playerIndex).update({
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
    })
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }
}
