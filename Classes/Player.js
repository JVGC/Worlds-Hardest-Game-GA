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
  }
  // Seta os nós
  // São setados em ordem de prioridade para o jogador, sendo o 0 o nó a ser alcançado primeiro, e o último o nó a ser alcançado por ultimo
  // Nesse jogo, o nó 0 é a moeda, e o nó 1 é o objetivo final
  setNodes(nodes, coins, tiles) {
    this.nodes[1] = new Node(tiles[nodes[0]][nodes[1]],true,false);
    this.nodes[0] = new Node(coins[0],false,true);
    this.nodes[0].setDistanceToFinish(this.nodes[1]);
  }

  // Desenha o jogador
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
  // Pega a moeda
  getCoin(){
      if(this.needsCoin){
          this.coinTaken = true
      }
  }


  // Movimenta o jogador
  move(solids){
    if (this.moveCount == 0) {
        if (this.brain.directions.length > this.brain.step) {
          this.vel = this.brain.directions[this.brain.step];
          this.brain.step++;
        } else {
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
    // O movimento é restringido  pelas bordas da fase
    for (var i = 0; i< solids.length; i++) {
      temp = solids[i].restrictMovement(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size), temp);
    }
    this.pos.add(temp);
  }
  // Clona um player igual ao this

 gimmeBaby() {
  var baby = new Player(this.initialPosition, this.nodes, this.needsCoin);
  baby.brain = this.brain.clone();
  baby.deathByDot = this.deathByDot;
  baby.deathAtStep = this.deathAtStep;
  baby.gen = this.gen;
  return baby;
}
}
