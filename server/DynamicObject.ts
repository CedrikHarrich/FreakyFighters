import { BlockObject } from "./BlockObject";

export abstract class DynamicObject extends BlockObject{
  protected velocityX: number = 0;
  protected velocityY: number = 0;
}
