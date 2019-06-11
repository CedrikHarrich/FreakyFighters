export class Player {
  private coords: {'x':number, 'y':number}; // todo coords.x instead of coords.0
  private velocity: {'x':number, 'y':number};
  private character: ImageBitmapSource;
  private life: number;
  private velocity: number;
  private height: number = 120;
  private width: number = 120;
  private hitboxes: Array<any>;
  private color: string;
  private jumping: boolean = false;
  private up: string; // todo: implement enum for direction
  private left: string;
  private right: string;

  constructor(color:string, coords: [number, number]){
    this.color = color;
    this.coords = coords;
  }

  getColor(){
    return this.color;
  }

  getCoords(){
    return this.coords;
  }

  setCoords(coords:{'x':number, 'y':number}){
    this.coords = coords;
  }

  addCoordsX(x:number){
    this.coords.x += x;
  }

  addCoordsY(y:number){
    this.coords.y += y;
  }

  getVelocity(){
    return this.velocity;
  }

  setVelocity(velocity:{'x':number, 'y':number}){
    this.velocity = velocity;
  }

  addVelocityX(x:number){
    this.velocity.x += x;
  }

  addVelocityY(y:number){
    this.velocity.y += y;
  }

  getVelocityX(x:number){
    return this.velocity.x;
  }

  getVelocityY(y:number){
    return this.velocity.y;
  }

  getJumping(){
    return this.jumping;
  }

  setJumping(jumping:boolean){
      this.jumping = jumping;
  }

  getUp(){
    return this.up;
  }

  setUp(up:string){
      this.up = up;
  }

  getLeft(){
    return this.left;
  }

  setLeft(left:string){
      this.left = left;
  }

  getRight(){
    return this.right;
  }

  setRight(right:string){
      this.right = right;
  }
}
