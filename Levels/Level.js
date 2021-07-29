class Level {
    constructor(dotType, LevelAreaSize, playersInitialPosition, winArea, goal, safeArea, walls, solids, coins){

        this.dots = []
        this.tiles = []
        this.solids = []
        this.coins = []
        this.playersInitialPosition = playersInitialPosition
        this.dotType = dotType
        this.createTiles(LevelAreaSize)

        this.setWalls(walls)
        this.setGoal(goal)
        this.setSafeArea(safeArea)
        this.setEdges()
        this.setSolids(solids)
        this.setWinArea(winArea)
        this.setCoins(coins)
    }

    setCoins(coins){
        for(var i =0; i < coins.length; i++){
            this.coins.push(new Coin(coins[i][0], coins[i][1]))
        }
    }
    setWinArea(winArea){
        this.winArea = new Solid(this.tiles[winArea['top']][winArea['left']], this.tiles[winArea['bottom']][winArea['right']]);
    }

    createTiles(LevelAreaSize){
        for (var i = 0; i< LevelAreaSize[0]; i++) {
            this.tiles[i] = [];
            for (var j = 0; j< LevelAreaSize[1]; j++) {
              this.tiles[i][j] = new Tile(i, j);
            }
          }
    }

    setWalls(walls){
        for(var i =0; i < walls.length; i++){
            this.tiles[walls[i][0]][walls[i][1]].wall=true
        }
    }

    setGoal(goal){
        for(var i =0; i < goal.length; i++){
            this.tiles[goal[i][0]][goal[i][1]].goal=true
        }
    }

    setSafeArea(safeArea){
        for(var i =0; i < safeArea.length; i++){
            this.tiles[safeArea[i][0]][safeArea[i][1]].safe=true
        }
    }

    setEdges(){
        for (var i = 1; i< this.tiles.length-1; i++) {
            for (var j = 1; j< this.tiles[0].length-1; j++) {
              if (this.tiles[i][j].wall) {
                if (!this.tiles[i+1][j].wall) {
                  this.tiles[i][j].edges.push(1);
                }
                if (!this.tiles[i][j+1].wall) {
                  this.tiles[i][j].edges.push(2);
                }
                if (!this.tiles[i-1][j].wall) {
                  this.tiles[i][j].edges.push(3);
                }
                if (!this.tiles[i][j-1].wall) {
                  this.tiles[i][j].edges.push(4);
                }
              }
            }
          }
    }

    setDots(dots){
        if(this.dotType=='3d'){
            this.setDots3D(dots)
        }else if(this.dotType=='2d'){
            this.setDots2D(dots)
        }else{
            console.log('Tipo de Dot inválido')
        }
    }

    setDots3D(dots){
        for(var i =0; i < dots.length; i++){
            this.dots.push(new Dot3D(this.tiles[dots[i]['t1'][0]][dots[i]['t1'][1]],
                                    this.tiles[dots[i]['t2'][0]][dots[i]['t2'][1]],
                                    this.tiles[dots[i]['t3'][0]][dots[i]['t3'][1]],
                                    this.tiles[dots[i]['t4'][0]][dots[i]['t4'][1]],
                                    this.tiles[dots[i]['startingTile'][0]][dots[i]['startingTile'][1]], dots[i]['velX'],dots[i]['velY']))
        }
    }
    setDots2D(dots){
        for(var i =0; i < dots.length; i++){
            this.dots.push(new Dot2D(this.tiles[dots[i]['t1'][0]][dots[i]['t1'][1]],
                                    this.tiles[dots[i]['t2'][0]][dots[i]['t2'][1]],
                                    dots[i]['velX'],dots[i]['velY']))
        }
    }

    setSolids(solids){
        for(var i =0; i < solids.length; i++){
            this.solids.push(new Solid(this.tiles[solids[i]['top']][solids[i]['left']], this.tiles[solids[i]['bottom']][solids[i]['right']]))
        }
    }

    resetDots(){
        for (var i = 0; i < this.dots.length; i++) {
          this.dots[i].resetDot();
        }
      
    }

    moveAndShowDots(){
        for (var i = 0; i < this.dots.length; i++) {
            this.dots[i].move();
            this.dots[i].show();
          }
    }

    checkCollisions(player) {
        let isCoinTaken
        if(this.coins && this.coins.length > 0){
            if(!player.coinTaken){
                isCoinTaken = this.coins[0].collides(player.pos, createVector(player.pos.x+player.size, player.pos.y+player.size));
                if(isCoinTaken){
                    player.getCoin()
                }
            }
                
        for (var i = 0; i< this.dots.length; i++) {
          if (this.dots[i].collides(player.pos, createVector(player.pos.x+player.size, player.pos.y+player.size))) {
            player.fading = true;
            player.dead = true;
            player.deathByDot = true;
            player.deathAtStep = player.brain.step;
          }
        }
        if (player.coinTaken && this.winArea.collision(player.pos, createVector(player.pos.x+player.size, player.pos.y+player.size))) {
          player.reachedGoal = true;
        }
        }
        for (var i = 0; i< player.nodes.length; i++) {
          player.nodes[i].collision(player.pos, createVector(player.pos.x+player.size, player.pos.y+player.size));
        }
    }

    updatePlayers(players, minStep){
        for (var i = 0; i< players.length; i++) {
            if (players[i].brain.step > minStep) {
                players[i].dead = true;
            }else{
                actual_level.updatePlayer(players[i]);
            }
        }
    }

    updatePlayer(player) {
        if (!player.dead && !player.reachedGoal) {
          player.move(this.solids);
          this.checkCollisions(player);
        } else if (player.fading) {
          if (player.fadeCounter > 0) {
            player.fadeCounter = 0;
          }
        }
    }  

}