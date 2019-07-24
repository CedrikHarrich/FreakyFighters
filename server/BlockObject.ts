export class BlockObject {
  protected x: number = 0;
  protected y: number = 0;

  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x
  };

  getY(): number {
    return this.y
  };

}
