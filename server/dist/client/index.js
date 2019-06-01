import * as io from 'socket.io-client';
var socket = io("http://localhost:3000");
var form = document.getElementById("messenger");
var input = document.getElementById("input");
socket.emit("message", "wasweißich");
socket.on("message", function (data) {
    console.log(data);
});
document.getElementById("messenger").addEventListener('submit', sendMsg);
