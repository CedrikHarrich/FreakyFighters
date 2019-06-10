//import { Game } from "./Game";


//grid : Block[][], playerOne : Player, playerTwo : Player, background : File, 
//initialPositionOne: [number, number], initialPositionTwo: [number, number]
var character1 = new Image();
var character2 = new Image();
var background = new Image();
var block = new Image();
background.src = "./assets/background/testBackground.jpg";
character1.src = "./assets/blocks/blobLeft.png";
character2.src = "./assets/blocks/blobRight.png";
block.src ="./assets/blocks/dirtBlock.png";

var canvas1  = <HTMLCanvasElement> document.getElementById("layer1"); 
var context1 = canvas1.getContext('2d');

var canvas2  = <HTMLCanvasElement> document.getElementById("layer2"); 
var context2 = canvas2.getContext('2d');

var canvas3  = <HTMLCanvasElement> document.getElementById("layer3"); 
var context3 = canvas3.getContext('2d');
       

//draw the background
background.onload = function() {
    context1.drawImage(background,0,0);
}

//draw the blocks
var grid = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //1
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //2 
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //3
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //4
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //5
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //6
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //7
    [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //8
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0], //9
    [0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0], //10
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0], //11
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //12
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //13
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //14
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //15
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //16
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //17
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //18
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //19
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //20
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //21
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //22
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //23
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //24
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //25
];

const x : number = 32;

function blockDrawer(grid : number[][]) : void{
    console.log(grid.length);
    
    for (let i : number = 0; i < grid.length; i++){
        for (let j : number = 0; j < grid.length; j++){
             if (grid[i][j] === 1){
                
                context2.drawImage(block, x * j, x * i);
             }
        }
    }
}



//draw the initial characters
character1.onload = function() {
    context3.drawImage(character1, 10 * x, 10 * x); 
};
character2.onload = function() {
    context3.drawImage(character2, 14 * x, 10 * x); 
};

block.onload = function() {
    blockDrawer(grid);
}

var positionX = 14 * x;
var positionY = 10 * x;
document.addEventListener("keydown", e =>{
    console.log(e.key);
    if (e.key === "ArrowLeft"){
        console.log("du");
        //context.clearRect(0,0,canvas.width, canvas.height);
        positionX -=5;
        context3.clearRect(0,0, 800,800);
        context3.drawImage(character1, positionX, positionY); 
      
    } 
    if (e.key === "ArrowRight"){
        positionX +=5
        context3.clearRect(0,0, 800,800);
        context3.drawImage(character2, positionX, positionY); 
    } 
    if (e.key === "ArrowDown"){
        positionY += 5;
        context3.clearRect(0,0, 800,800);
        context3.drawImage(character2, positionX, positionY); 
    } 
    if (e.key === "ArrowUp"){
        positionY -= 5;
        context3.clearRect(0,0, 800,800);
        context3.drawImage(character2, positionX, positionY); 
    } 
});

//var game = new Game();