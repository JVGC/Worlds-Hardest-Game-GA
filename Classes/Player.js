class Player{
  constructor(initialPosition, nodes, needsCoin){
    this.initialPosition = initialPosition
    this.pos = createVector(this.initialPosition[0], this.initialPosition[1])
    this.vel = createVector(0,0);
    this.size = tileSize/2.0;
    this.playerSpeed = tileSize/15.0;
    this.dead = false;
    this.reachedGoal = false;
    this.fadeCounter = 255;
    this.isBest = false;
    this.deathByDot = false;
    this.deathAtStep = 0;
    this.moveCount = 0;
    this.gen =1;
    this.fitness = 0;
    this.nodes = [];
    this.fading = false;
    this.brain = new Brain(numberOfSteps);
    this.needsCoin = needsCoin
    this.coinTaken = false
    // this.setNodes(nodes)
  }

  setNodes(nodes, coins, tiles) {
    this.nodes[1] = new Node(tiles[nodes[0]][nodes[1]],true,false);
    this.nodes[0] = new Node(coins[0],false,true);
    this.nodes[0].setDistanceToFinish(this.nodes[1]);
  }

  show(){
    fill(255, 0, 0, this.fadeCounter);
    if (this.isBest) {
        fill(0, 255, 0, this.fadeCounter);
      }
    stroke(0, 0, 0, this.fadeCounter);
    strokeWeight(4);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    stroke(0);
  }
  getCoin(){
      if(this.needsCoin){
          this.coinTaken = true
      }
  }

  move(solids){
    if (this.moveCount == 0) {//move in the direction for 6 frames
        if (this.brain.directions.length > this.brain.step) {//if there are still directions left then set the velocity as the next PVector in the direcitons array
          this.vel = this.brain.directions[this.brain.step];
          this.brain.step++;
        } else {//if at the end of the directions array then the player is dead
          this.dead = true;
          this.fading = true;
        }
        this.moveCount =6;
      } else {
        this.moveCount--;

    }
    var temp = createVector(this.vel.x, this.vel.y);
    temp.normalize();
    temp.mult(this.playerSpeed);
    for (var i = 0; i< solids.length; i++) {
      temp = solids[i].restrictMovement(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size), temp);
    }
    this.pos.add(temp);
  }

// //----------------------------------------------------------------------------------------------------------------------------------------------------------
 gimmeBaby() {
  var baby = new Player(this.initialPosition, this.nodes, this.needsCoin);
  baby.brain = this.brain.clone();//babies have the same brain as their parents
  baby.deathByDot = this.deathByDot;
  baby.deathAtStep = this.deathAtStep;
  baby.gen = this.gen;
  return baby;
}
}
