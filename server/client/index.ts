import * as io from 'socket.io-client';

const socket = io("http://localhost:3000");
var form = document.getElementById("messenger");
var input = document.getElementById("input");

socket.emit("message", "wasweißich");

socket.on("message", function (data:any) {
    console.log(data);
});

document.getElementById("messenger").addEventListener('submit', sendMsg);
