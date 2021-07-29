var mrPara;
var mrPlus;
var mrMinus;
var div1;
var p1;
var movesH3;
var speedPara;
var speedPlus;
var speedMinus;
var popPara;
var popPlus;
var popMinus;

var movesPara;
var movesPlus;
var movesMinus;
var everyPara;
var everyPlus;
var everyMinus;

function drawInitialSettings(){
    div1 = createElement("h2", "Configurações Iniciais")
    p1 = createP("Algumas configurações para o jogo")
    popPara =  createDiv("Tamanho da População: " + populationSize);
    popMinus = createButton("-");
    popPlus = createButton('+');
  
    popPlus.mousePressed(plusPopSize);
    popMinus.mousePressed(minusPopSize);
  
    checkRandomPredation = createCheckbox('Utilizar Predação Aleatória')
    checkRandomPredation.changed(handleCheckRandomPredation)
  
  
    mutationSelector = createDiv("Tipo de Mutação: ");
      selMutation = createSelect();
      selMutation.option('constante');
      selMutation.option('variavel');
      selMutation.selected('constante');
  
    mrPara =  createDiv("Mutation Rate inicial: " + mutationRate);
    mrMinus = createButton("1/2");
    mrPlus = createButton('x2');
    mrPlus.mousePressed(plusmr);
    mrMinus.mousePressed(minusmr);
  
    speedPara =  createDiv("Velocidade de evolução: " + evolutionSpeed);
    speedMinus = createButton("-");
    speedPlus = createButton('+');
    speedPlus.mousePressed(plusSpeed);
    speedMinus.mousePressed(minusSpeed);
   
}


function removeInitialSettings(){
    popPara.remove()
    popPlus.remove()
    popMinus.remove()
    mrPara.remove()
    mrMinus.remove()
    mrPlus.remove()
    speedPara.remove()
    speedPlus.remove()
    speedMinus.remove()
    movesH3.remove()
    movesPara.remove()
    movesMinus.remove()
    movesPlus.remove()
    everyMinus.remove()
    everyPara.remove()
    everyPlus.remove()
    div1.remove()
    p1.remove()
    mutationSelector.remove()
    selMutation.remove()
    checkRandomPredation.remove()
}

function handleCheckRandomPredation(){
    if(this.checked()){
        randomPredationSelected =true
    }else{
        randomPredationSelected = false
    }
}

function minusPopSize(){
  if(populationSize > 100){
    populationSize -=100;
    popPara.html("Tamanho da População: " + populationSize);
  }
}
function plusPopSize(){
  if(populationSize < 10000){
    populationSize +=100;
    popPara.html("Tamanho da População: " + populationSize);

  }
}

function minusmr(){
  if(mutationRate > 0.0001){
    mutationRate /= 2.0;
    mrPara.html("Mutation Rate inicial: " + mutationRate);
  }
}
function plusmr(){
  if(mutationRate <= 0.5){
    mutationRate *= 2.0;
    mrPara.html("Mutation Rate inicial: " + mutationRate);

  }
}

function minusSpeed(){
  if(evolutionSpeed > 1){
    evolutionSpeed -= 1;
    speedPara.html("Velocidade de evolução: " + evolutionSpeed);
  }
}
function plusSpeed(){
  if(evolutionSpeed <= 5){
    evolutionSpeed += 1;
    speedPara.html("Velocidade de evolução: " + evolutionSpeed);

  }
}


function minusMoves(){
  if(increaseMovesBy >= 1){
    increaseMovesBy -= 1;
    movesPara.html("Increase moves by: " + increaseMovesBy);
    movesH3.html("Increase number of player moves by " + increaseMovesBy + " every " + increaseEvery + " generations");
  }
}
function plusMoves(){
  if(increaseMovesBy <= 500){
    increaseMovesBy += 1;
    movesPara.html("Increase moves by: " + increaseMovesBy);
    movesH3.html("Increase number of player moves by " + increaseMovesBy + " every " + increaseEvery + " generations");
  }
}

function minusEvery(){
  if(increaseEvery > 1){
    increaseEvery -= 1;
    everyPara.html("Increase every " + increaseEvery + " generations");
    movesH3.html("Increase number of player moves by " + increaseMovesBy + " every " + increaseEvery + " generations");
  }
}
function plusEvery(){
  if(increaseEvery <= 100){
    increaseEvery += 1;
    everyPara.html("Increase every " + increaseEvery + " generations");
    movesH3.html("Increase number of player moves by " + increaseMovesBy + " every " + increaseEvery + " generations");
  }
}