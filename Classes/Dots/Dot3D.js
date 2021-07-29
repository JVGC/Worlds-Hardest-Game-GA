class Dot3D extends Dot{

  constructor( t1, t2, t3, t4,startingTile,velX,velY) {
    super()
    this.position = createVector(startingTile.pixelPos.x + tileSize/2, startingTile.pixelPos.y + tileSize/2);
    this.startingPos = createVector(startingTile.pixelPos.x + tileSize/2, startingTile.pixelPos.y + tileSize/2);
    this.speed = tileSize/15.0;
    this.velocity = createVector(velX*this.speed, velY*this.speed);
    this.startingVel = createVector(velX*this.speed, velY*this.speed);

    this.startingTile = startingTile;

    this.bouncers = [];
    this.bouncers[0] = t1;
    this.bouncers[1] = t2;
    this.bouncers[2] = t3;
    this.bouncers[3] = t4;

    this.diameter = tileSize/2.0;
    this.bounceWait = -1;
    this.bounceTimer = -1;
  }


   move() {

    for (var i = 0; i < this.bouncers.length; i++) {
      if (this.bounceTimer<0 && dist(this.position.x, this.position.y, this.bouncers[i].pixelPos.x + tileSize/2, this.bouncers[i].pixelPos.y + tileSize/2) < 0.01) {
        this.bounceTimer = 5;
        this.turnDotRight();
        break;
      }
    }

    this.position.add(this.velocity);
    this.bounceTimer --;
    this.bounceWait --;
  }
  turnDotRight(){
    if(this.velocity.x > 0 && this.velocity.y == 0){
      this.velocity = createVector(0,1.0*this.speed);
    }else if(this.velocity.x ==0 && this.velocity.y >0){
      this.velocity = createVector(-1.0*this.speed,0);
    }else if(this.velocity.x <0  && this.velocity.y ==0){
      this.velocity = createVector(0,-1.0*this.speed);
    }else if(this.velocity.x ==0 && this.velocity.y < 0){
      this.velocity = createVector(1.0*this.speed,0);
    }

  }

  show() {
    fill(0, 0, 255);
    stroke(0);
    strokeWeight(4);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
  }


  collides(ptl, pbr) {

    var topLeft = createVector(this.position.x - this.diameter/2, this.position.y-this.diameter/2);
    var bottomRight = createVector(this.position.x + this.diameter/2, this.position.y + this.diameter/2);
    var playerSize = bottomRight.x - topLeft.x;
    if ((ptl.x <bottomRight.x && pbr.x > topLeft.x) &&( ptl.y < bottomRight.y && pbr.y > topLeft.y)) {

      if (dist(this.position.x, this.position.y, (ptl.x + pbr.x) /2.0, (ptl.y + pbr.y) /2.0)< this.diameter/2 + sqrt(playerSize*playerSize *2)/2) {
        return true;
      }
    }
    return false;
  }

  resetDot() {
    this.position = this.startingPos.copy();
    this.velocity = this.startingVel.copy();
    this.bounceTimer = -1;
    this.bounceWait = -1;
  }

  clone() {
    var clone = new Dot(this.bouncers[0], this.bouncers[1],this.bouncers[2], this.bouncers[3], this.startingTile, floor(this.velocity.x), floor(this.velocity.y));
    clone.velocity = this.velocity.copy();
    clone.position = this.position.copy();
    clone.startingVel = this.startingVel.copy();
    clone.bounceTimer = this.bounceTimer;
    clone.bounceWait = this.bounceWait;
    return clone;
  }
}
