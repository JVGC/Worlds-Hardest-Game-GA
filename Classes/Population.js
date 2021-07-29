class Population {

  constructor(size, playersInitialPosition, nodes, coins, naturalSelectionMethod, needsCoin, mutationType='static', randomPredationUse=false) {
    // Variaveis de SETUP da população
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
    // Inicia a primeira gerçaão
    for (var i = 0; i< size; i++) {
        
      this.players[i] = new Player(playersInitialPosition, nodes, coins, needsCoin);
    }
    this.randomPredationUse = randomPredationUse
  }
  // Seta os nós para cada jogador daquele geração
  setNodes(nodes, coins, tiles){
    for (var i = 0; i< this.players.length; i++) {
        
        this.players[i].setNodes(nodes, coins, tiles)
      }
  }

  // Mostra os players da geração ou somente o melhor
   show() {
    if (!showBest) {
        for (var i = 1; i< this.players.length; i++) {
          this.players[i].show();
        }
      }
      this.players[0].show();
    
  }

  // Calcula o Fitness para cada player
  calculateFitnessPlayer(i){

    // Se o jogador já chegou, o fitness dele é um valor bem alto
    if (this.players[i].reachedGoal) {
        this.players[i].fitness = 10000.0
      } else {

        // A distância é calculada baseada na distância entre os o player e a moeda e a área de WIN.
        // Prioridade do jogador é conseguir a moeda e depois ir para a área final.
        // Portanto o fitness é baseado nisso
        var estimatedDistance = 0.0;

        for (var j = this.players[i].nodes.length-1; j>=0; j--) {
          if (!this.players[i].nodes[j].reached) {
            estimatedDistance = this.players[i].nodes[j].distToFinish;
            estimatedDistance += dist(this.players[i].pos.x, this.players[i].pos.y, this.players[i].nodes[j].pos.x, this.players[i].nodes[j].pos.y);
          }
        }
        // Se o player morreu por um Dot, então seu fitness é diminuido
        if (this.players[i].deathByDot) {
          estimatedDistance *= 0.9;
        }
        // O fitness é o inverso da distância ao quadrado para a moeda ou o final.
        // Portando quando menor a distancia, maior o fitness do jogador
        this.players[i].fitness = 1.0/(estimatedDistance * estimatedDistance);

      }

      this.players[i].fitness*=this.players[i].fitness;
      // Se o player já pegou a moeda, quer dizer que está indo bem portanto o seu fitness é aumentado
      if(this.players[i].coinTaken){
        this.players[i].fitness *=1.5;
      }
  }

  calculateFitness() {
    for (var i = 0; i< this.players.length; i++) {
        this.calculateFitnessPlayer(i)
    }
  }

  // Verificada se todos os players ja morreram
   allPlayersDead() {
    for (var i = 0; i< this.players.length; i++) {
      if (!this.players[i].dead && !this.players[i].reachedGoal) {
        return false;
      }
    }
    return true;
  }

   naturalSelection() {

    // Seleção Natural
    // Cria uma nova geração de jogadores
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
    // Deixa marcado o último melhor jogador
    // E seleciona um novo melhor jogador e um pior jogador
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
    // Se o tipo de mutação escolhida é a variavel
    // Então se verificada se o fitness do melhor jogador se manteve para ai alterar o mutation rate
    if(this.mutationType == 'variable'){
        if(abs(this.lastBest - this.players[this.bestPlayer].fitness) < 0.000000000000000001){
            this.mutationRate *=2
        }else{
            // Se nao, só volta para o inicial
            this.mutationRate = mutationRate
        }
    }
    
    // Soma o fitness de tood mundo
    this.calculateFitnessSum();

    // Clona o melhor jogador para a próxima geração
    newPlayers[0] = this.players[this.bestPlayer].gimmeBaby();
    newPlayers[0].isBest = true;
    // E gera uma nova geração, com reprodução assexuada
    for (var i = 1; i< populationSize; i++) {
      var parent = this.selectParent();

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

    // Seleciona um pai para aquele jogador novo
    for (var i = 0; i< this.players.length; i++) {
      runningSum+= this.players[i].fitness;
      if (runningSum > rand) {
        return this.players[i];
      }
    }

    return null;
  }


   // Faz a mutação em si 
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
    this.players[this.worstPlayer].brain = new Brain(this.players[this.worstPlayer].brain.directions.length)
  }



   // Seleciona o melhor jogador
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


    if (this.players[this.bestPlayer].reachedGoal) {
      this.minStep = this.players[this.bestPlayer].brain.step;
      this.solutionFound = true;
    }
  }

  // Seleciona o pior jogador
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

    if (this.players[this.worstPlayer].reachedGoal) {
      this.minStep = this.players[this.worstPlayer].brain.step;
      this.solutionFound = true;
    }
  }


// Aumenta o número de moves permitidos para aquela geração
 increaseMoves() {
    if (this.players[0].brain.directions.length < 120 && !this.solutionFound) {
      for (var i = 0; i< this.players.length; i++) {
        this.players[i].brain.increaseMoves();
      }
    }
  }
}
