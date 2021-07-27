class Population {

  constructor(size, playersInitialPosition, nodes, coins, naturalSelectionMethod, needsCoin, mutationType='static', randomPredationUse=false) {
    this.players = [];
    this.fitnessSum = 0.0;
    this.gen = 1;
    this.bestPlayer = 0;
    this.worstPlayer = 0
    this.lastBest=0;
    this.minStep = 10000;
    this.genPlayers = [];
    this.bestFitness = 0;
    this.worstFitness = 0
    this.solutionFound = false;
    this.mutationRate = mutationRate
    this.naturalSelectionMethod = naturalSelectionMethod
    this.mutationType = mutationType
    for (var i = 0; i< size; i++) {
        
      this.players[i] = new Player(playersInitialPosition, nodes, coins, needsCoin);
    }
    this.randomPredationUse = randomPredationUse
  }

  setNodes(nodes, coins, tiles){
    for (var i = 0; i< this.players.length; i++) {
        
        this.players[i].setNodes(nodes, coins, tiles)
      }
  }

  //------------------------------------------------------------------------------------------------------------------------------
  //show all players
   show() {
    if (!showBest) {
        for (var i = 1; i< this.players.length; i++) {
          this.players[i].show();
        }
      }
      this.players[0].show();
    
  }

  calculateFitnessPlayer(i){
    if (this.players[i].reachedGoal) {//if the dot reached the goal then the fitness is based on the amount of steps it took to get there
        this.players[i].fitness = 1.0/16.0 + 10000.0/(this.players[i].brain.step * this.players[i].brain.step);
      } else {//if the dot didn't reach the goal then the fitness is based on how close it is to the goal
        var estimatedDistance = 0.0;//the estimated distance of the path from the this.players[i] to the goal
        for (var j = this.players[i].nodes.length-1; j>=0; j--) {
          if (!this.players[i].nodes[j].reached) {
            estimatedDistance = this.players[i].nodes[j].distToFinish;
            estimatedDistance += dist(this.players[i].pos.x, this.players[i].pos.y, this.players[i].nodes[j].pos.x, this.players[i].nodes[j].pos.y);
          }
        }
        if (this.players[i].deathByDot) {
          estimatedDistance *= 0.9;
        }
        
        this.players[i].fitness = 1.0/(estimatedDistance * estimatedDistance);

      }
      this.players[i].fitness*=this.players[i].fitness;
      if(this.players[i].coinTaken){
        this.players[i].fitness *=1.5;
      }
  }

  calculateFitness() {
    for (var i = 0; i< this.players.length; i++) {
        this.calculateFitnessPlayer(i)
    }
  }

  //returns whether all the players are either dead or have reached the goal
   allPlayersDead() {
    for (var i = 0; i< this.players.length; i++) {
      if (!this.players[i].dead && !this.players[i].reachedGoal) {
        return false;
      }
    }
    return true;
  }

  //gets the next generation of players
   naturalSelection() {

    var newPlayers= [];
    if(this.naturalSelectionMethod == 'cloneBest'){
        newPlayers = this.naturalSelectionCloneBest()
    }

    this.players = [];
    for(var i = 0 ; i< newPlayers.length;i++){
      this.players[i] = newPlayers[i];
    }
    this.gen++;
  }

  naturalSelectionCloneBest(){
    var newPlayers= [];
    this.lastBest = this.players[this.bestPlayer].fitness;
    this.setBestPlayer();
    this.setWorstPlayer();

    // Predação Aleatória
    if(this.randomPredationUse){
        if(this.gen%randomPredationStep == 0){
            this.randomPredation();
        }
    }
    
    // Mutação Variavel
    if(this.mutationType == 'variable'){
        if(abs(this.lastBest - this.players[this.bestPlayer].fitness) < 0.000000000000000001){
            if(this.mutationRate < 0.08)
                this.mutationRate *=2
        }else{
            this.mutationRate = mutationRate
        }
    }
    

    this.calculateFitnessSum();

    //the champion lives on
    newPlayers[0] = this.players[this.bestPlayer].gimmeBaby();
    newPlayers[0].isBest = true;
    for (var i = 1; i< populationSize; i++) {
      //select parent based on fitness
      var parent = this.selectParent();

      //get baby from them
      newPlayers[i] = parent.gimmeBaby();
    }

    return newPlayers
    
  }

   calculateFitnessSum() {
    
    this.fitnessSum = 0;
    for (var i = 0; i< this.players.length; i++) {
      this.fitnessSum += this.players[i].fitness;
    }
  }

   selectParent() {
    var runningSum = 0;

    var rand = random(this.fitnessSum);

    for (var i = 0; i< this.players.length; i++) {
      runningSum+= this.players[i].fitness;
      if (runningSum > rand) {
        return this.players[i];
      }
    }

    return null;
  }

   mutateDemBabies() {
    for (var i = 1; i< this.players.length; i++) {
      this.players[i].brain.mutate(this.players[i].deathByDot, this.players[i].deathAtStep, this.mutationRate);
      this.players[i].deathByDot = false;
      this.players[i].gen = this.gen;
    }
    this.players[0].deathByDot = false;
    this.players[0].gen = this.gen;
  }

  
  randomPredation(){
    this.players[this.worstPlayer].brain = new Brain(numberOfSteps)
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  //finds the player with the highest fitness and sets it as the best player
   setBestPlayer() {
    var max = 0;
    var maxIndex = 0;
    for (var i = 0; i< this.players.length; i++) {
      if (this.players[i].fitness > max) {
        max = this.players[i].fitness;
        maxIndex = i;
      }
    }

    this.bestPlayer = maxIndex;

    if (max > this.bestFitness) {
      this.bestFitness = max;
      this.genPlayers.push(this.players[this.bestPlayer].gimmeBaby());
    }

    //if this player reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.players[this.bestPlayer].reachedGoal) {
      this.minStep = this.players[this.bestPlayer].brain.step;
      this.solutionFound = true;
    }
  }

  setWorstPlayer(){
    var min = this.players[this.bestPlayer].fitness
    var minIndex = this.bestPlayer;

    for (var i = 0; i< this.players.length; i++) {
      if (this.players[i].fitness < min) {
        min = this.players[i].fitness;
        minIndex = i;
      }
    }

    this.worstPlayer = minIndex;

    if (min < this.worstFitness) {
      this.worstFitness = min;
      this.genPlayers.push(this.players[this.worstPlayer].gimmeBaby());
    }

    //if this player reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.players[this.worstPlayer].reachedGoal) {
      this.minStep = this.players[this.worstPlayer].brain.step;
      this.solutionFound = true;
    }
  }



 increaseMoves() {
    if (this.players[0].brain.directions.length < 120 && !this.solutionFound) {
      for (var i = 0; i< this.players.length; i++) {
        this.players[i].brain.increaseMoves();
      }
    }
  }
}
