// Tamanho de um tile
var tileSize = 50;
var xoff = 80;
var yoff = 100;


var showBest = false; // Indica se deve mostrar somente o melhor ou não
var numberOfSteps = 10; // 

var testPopulation; // população
var  populationSize = 500; // tamanho da população

var mutationRate = 0.01; // mutation rate inicial
var randomPredationStep = 10; // numero de gerações ao qual a predação aleatória deve ser feita

var evolutionSpeed =1; // velocidade de volução

var increaseMovesBy =5; // numero de movimentos possíveis que é somado a cada 5 gerações (increaseEvery)

var increaseEvery =5;

var actual_level; // level em si
var selectedLevel; // string do level selecionado
var levels = {
    '1': level1,
    '2': level2,
    '3': level3
}
// Tipos de mutações
var selectedMutationType;
var mutationType = {
    'constante': 'static',
    'variavel': 'variable'
}
var randomPredationSelected = false;

var started = false
function setup(){
    
    // Faz o setup inicial antes do jogo começar
    levelSelector = createDiv("Selecione o Nível: ");
    sel = createSelect();
    sel.option('1');
    sel.option('2');
    sel.option('3');
    sel.selected('1');

    drawInitialSettings();
    startDiv = createDiv("")
    startGame = createButton("Start Game");
    startGame.mousePressed(createLevel);

    noLoop()
}

function createLevel() {
    // Cria o Canvas Azul
    var canvas = createCanvas(1280,720);
    // Inicia o nível selecionado
    selectedLevel = sel.value()
    selectedMutationType = selMutation.value()
    started = true
  
    actual_level =  new Level(
      levels[selectedLevel]['dotType'], levels[selectedLevel]['levelAreaSize'], levels[selectedLevel]['playersInitialPosition'], levels[selectedLevel]['winArea'],
      levels[selectedLevel]['goal'], levels[selectedLevel]['safeArea'], levels[selectedLevel]['walls'], levels[selectedLevel]['solids'], levels[selectedLevel]['coins']
    )
    actual_level.setDots(levels[selectedLevel]['dots'])
    testPopulation =  new Population(populationSize, actual_level['playersInitialPosition'], levels[selectedLevel]['nodes'], levels[selectedLevel]['coins'], 'cloneBest', true, mutationType[selectedMutationType], randomPredationSelected)
    testPopulation.setNodes( levels[selectedLevel]['nodes'], actual_level.coins, actual_level.tiles)
    startGame.html("Restart Game")
    loop();
}

function draw(){
    // Se o jogo começou, o nível selecionado é desenhado, e o jogo começa
    // Essa função é chamada varias vezes pelo próprio framework P5
    if(started){
        background(180, 181, 254);
        drawTiles();
        DrawInformation();
        // Enquanto não foi achada uma solução
        if(!testPopulation.solutionFound){
            // Quando todos os players da geração morrerem, calcula o fitness, a mutação e gera a próxima geração
            if (testPopulation.allPlayersDead()) {
                testPopulation.calculateFitness()
                testPopulation.naturalSelection();
                testPopulation.mutateDemBabies();
                testPopulation.setNodes(levels[selectedLevel]['nodes'], actual_level.coins, actual_level.tiles)
                actual_level.resetDots();
                
                // Se possível, aumenta o número de movimento possíveis
                if (testPopulation.gen % increaseEvery ==0) {
                    testPopulation.increaseMoves();
                }
        
            } else {
                // For que movimenta os jogadores e simula a velocidade de evolução
                for(var j = 0 ; j< evolutionSpeed; j++){
                    for (var i = 0; i < actual_level.dots.length; i++) {
                        actual_level.dots[i].move();
                    }
                    actual_level.updatePlayers(testPopulation.players, testPopulation.minStep);
                }
                for (var i = 0; i < actual_level.dots.length; i++) {
                    actual_level.dots[i].show();
                }
                testPopulation.show();
                
            }
        }

        
    }

}

// Desenha a fase em si
function drawTiles(){
    for (var i = 0; i< actual_level.tiles.length; i++) {
        for (var j = 0; j< actual_level.tiles[0].length; j++) {
            actual_level.tiles[i][j].show();
        }
    }
    for (var i = 0; i< actual_level.tiles.length; i++) {
        for (var j = 0; j< actual_level.tiles[0].length; j++) {
            actual_level.tiles[i][j].showEdges();
        }
    }
    for (var i = 0; i< actual_level.coins.length; i++) {
        actual_level.coins[i].show();
    }
}

// Informações sobre as as gerações
function DrawInformation(){

    fill(247, 247, 255);
    textSize(20);
    noStroke();
    if(!showBest)
        text("Pressione ESPAÇO para mostrar somente o melhor jogador", 450,680);
    else
    text("Pressione ESPAÇO para mostrar toda a geração", 450,680);
    textSize(36);
    text("Generation: " + testPopulation.gen, 200, 50);
    text("Mutation Rate: " + testPopulation.mutationRate, 200, 90)
    text("Best Player: "+ testPopulation.bestPlayer, 700, 50)
    if(testPopulation.solutionFound){
        text("Wins in " + testPopulation.minStep + " moves",700, 90);
    }else{
        text("Number of moves: " + testPopulation.players[0].brain.directions.length, 700, 90);
    }
  }

function keyPressed(){
    switch(key) {
        // se foi clicado o espaço, alterna entre mostra somente o melhor jogador ou todos
        case ' ':
          showBest = !showBest;
          break;
    }
}

