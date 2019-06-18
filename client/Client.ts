
export class Client{
    private socket:any;
    private canvas:any;
    private context:any;
    private character:any;
    private background:any;
    
    constructor(){
        console.log("A Client has started.");

        //Server Connection Variables
        this.socket = io();

        //HTML Variables
        this.canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //Initially draw your field.
        this.character = new Image();
        //Randomizer for the character representation.
        if (Math.random() > 0.5){
            this.character.src = 'character.png';
        } else {
            this.character.src = 'noCookiesForFangli.png';
        }
        
        this.background = new Image();
        this.background.src = 'background.png';
        this.background.onload = () => {
            this.context.drawImage(this.background,0,0);
        };
        
        //Event: Update with the new GameState
        this.socket.on('update', (data:any) =>{
            //console.log("Updates received.");
            this.context.clearRect(0,0,960,640);
            this.context.drawImage(this.background,0,0,960,640);
            for (var i = 0; i < data.length; i++){
                console.log(data[i].x);
                this.context.drawImage(this.character, data[i].x, data[i].y, 120, 120);
            }
        });

        //Event: Signal the server that a key has been pressed.
        window.addEventListener("keydown", (event : any) =>{
            console.log(event.key);
            switch (event.key){
                case "ArrowUp":
                   this.socket.emit('keyPressed', {inputId: 'ArrowUp', state : true});
                   break;
                case "ArrowLeft":
                    this.socket.emit('keyPressed', {inputId: 'ArrowLeft', state : true});
                    break;
                case "ArrowDown":
                    this.socket.emit('keyPressed', {inputId: 'ArrowDown', state : true});
                    break;
                case "ArrowRight":
                   this.socket.emit('keyPressed', {inputId: 'ArrowRight', state : true});
                   break;
                default: 
                    return;
           }
        }, true);

        //Event: Stop moving when key is not pressed.
        window.addEventListener("keyup", (event : any) =>{
            switch (event.key){
                case "ArrowUp":
                  this.socket.emit('keyPressed', {inputId: 'ArrowUp', state : false});
                  break;
                case "ArrowLeft":
                    this.socket.emit('keyPressed', {inputId: 'ArrowLeft', state : false});
                    break;
                case "ArrowDown":
                    this.socket.emit('keyPressed', {inputId: 'ArrowDown', state : false});
                    break;
                case "ArrowRight":
                   this.socket.emit('keyPressed', {inputId: 'ArrowRight', state : false});
                   break;
                default: 
                    return;
           }
        }, true);

    }
}
