// import io from 'socket.io-client';

const socket = io("http://localhost:3000");
const form = document.getElementById("messenger");
const input = document.getElementById("input");
const textContainer = document.getElementById("textContainer");

function sendMsg(e) {
    e.preventDefault();
    socket.emit("message", input.value);
    logMsg(input.value);
    input.value = null;
}

function logMsg(text){
  let textNode = document.createElement("p");
  textNode.innerHTML = text;
  textContainer.appendChild(textNode);
}

function keyupHandler(event){
  console.log(event.key);
  socket.emit("keyup", event.key);
}

socket.on("message", function (data) {
  logMsg(data);
});

form.addEventListener('submit', sendMsg);

document.addEventListener('keyup', keyupHandler);
