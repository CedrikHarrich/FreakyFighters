class PlatformBlock implements Block{
    height : number;
    width : number;
    image : File;

    constructor(height : number, width : number, image : File){
        this.height = height;
        this.width = width;
        this.image = image;
    }
}