class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementsPosition(){
    this.titleImg.position(140,100);
    this.input.position(width/2-123, height/2-123);
    this.playButton.position(width/2-103, height/2-20);
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyles(){
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton")
    this.greeting.class("greeting")
  }

  handleMousePressed(){
    this.playButton.mousePressed(()=>{
      this.input.hide();
      this.playButton.hide();
      var message = `Hello ${this.input.value()} 
      <br> Wait for another player to join...`;
      this.greeting.html(message)
      playerCount=playerCount+1
      player.name=this.input.value()
      player.index=playerCount
      player.addPlayer()
      player.updatePlayerCount(playerCount)
    })
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyles();
    this.handleMousePressed()
  }

}
