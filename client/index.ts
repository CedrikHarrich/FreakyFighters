import * as io from "socket.io-client";
import { Game } from "./Game";

const socket = io("http://localhost:3000");
const form = document.getElementById("messenger");
const input = <HTMLInputElement>document.getElementById("input");
const textContainer = document.getElementById("textContainer");
const game = new Game();

function sendMsg(e:any) {
    e.preventDefault();
    socket.emit("message", input.value);
    logMsg(input.value);
    input.value = null;
}

function logMsg(text:any){
  let textNode = document.createElement("p");
  textNode.innerHTML = text;
  textContainer.appendChild(textNode);
}


function keyupHandler(event:any){
  console.log(event.key);
  socket.emit("keyup", event.key);
}

socket.on("message", function (data:any) {
  logMsg(data);
});

form.addEventListener('submit', sendMsg);
document.addEventListener('keyup', keyupHandler);

export{};
