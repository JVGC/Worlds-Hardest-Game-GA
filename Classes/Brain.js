class Brain {
  constructor(size){
    this.directions = [];
    this.step =0;
    this.randomize(size);

  }

  randomize(size) {
    for (var i = 0; i< size; i++) {
      this.directions[i] = this.getRandomDirection();
    }
  }

  // Pega uma direção aleatória para seguir
  getRandomDirection() {
    var randomNumber = floor(random(9));
    switch(randomNumber) {
    case 0:
      return createVector(0, 1);
    case 1:
      return createVector(1, 1);
    case 2:
      return createVector(1, 0);
    case 3:
      return createVector(1, -1);
    case 4:
      return createVector(0, -1);
    case 5:
      return createVector(-1, -1);
    case 6:
      return createVector(-1, 0);
    case 7:
      return createVector(-1, 1);
    case 8:
      return createVector(0, 0);
    }

    return createVector();
  }

  clone() {
    var clone = new Brain(this.directions.length);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i].copy();
    }
    return clone;
  }

  // Mutação propriamente dita
  // A ideia é mudar apenas algumas direções feitas pelo player
  mutate(died, deathStep, mutationRate) {
    for (var i =0; i< this.directions.length; i++) {
      var rand = random(5);
      // Se ele morreu, não quero mudar as primeiras direções dele
      if (died && i > deathStep - 10) {
        rand = random(0.2);
      }

      if (rand < mutationRate) {
        this.directions[i] = this.getRandomDirection();
      }
    }
  }

 increaseMoves() {
   for(var i = 0 ; i< increaseMovesBy ;i++){
     this.directions.push(this.getRandomDirection());
   }
  }
}
