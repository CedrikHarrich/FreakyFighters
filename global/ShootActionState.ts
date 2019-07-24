export class ShootActionState{
    private x : number;
    private y : number;
  
    // constructor()
    constructor({x, y} : {x : number, y : number}){
      this.x = x;
      this.y = y;
    }
  
    getX(){
      return this.x;
    }
  
    getY(){
      return this.y;
    }
  }