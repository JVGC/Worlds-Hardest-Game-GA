class Solid {

  constructor(topL,botR){
    var lineWidth = 1;
    this.pos = createVector(topL.pixelPos.x-lineWidth, topL.pixelPos.y-lineWidth);
    this.w = botR.pixelPos.x + tileSize - this.pos.x + lineWidth;
    this.h =  botR.pixelPos.y + tileSize - this.pos.y + lineWidth;
    this.bottomRight = createVector(this.pos.x + this.w, this.pos.y + this.h);

  }


   restrictMovement(tl, br, movement) {

    var x = movement.x;
    var y = movement.y;
    var ptl = createVector(tl.x+movement.x, tl.y);
    var pbr = createVector(br.x+movement.x, br.y);

    if ((ptl.x <this.bottomRight.x && pbr.x > this.pos.x) &&( ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {

      x=0;
    }

    ptl = createVector(tl.x, tl.y +movement.y);
    pbr = createVector(br.x, br.y + movement.y);
    if ((ptl.x <this.bottomRight.x && pbr.x > this.pos.x) &&( ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {
      y=0;
    }

    return createVector(x, y);
  }

  collision(ptl, pbr) {


    if ((ptl.x <this.bottomRight.x && pbr.x > this.pos.x) &&( ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {
      return true;
    }
    return false;
  }
}
