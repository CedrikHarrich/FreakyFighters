export class Player {
  private coords: [number, number];
  private character: ImageBitmapSource;
  private life: number;
  private velocity: number;
  private height: number;
  private width: number;
  private hitboxes: Array<any>;
  private color: string;

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


}
