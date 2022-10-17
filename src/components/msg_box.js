var scan = require('prompt-sync')();
const { io } = require("socket.io-client");

const socket = io("wss://live.heinsoe.com");
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.connected  // true
        ? console.log("conected")
        : false;
});

socket.io.on("reconnect_failed", () => {
    console.log('fail');
});
socket.on('message', function (msg) {
    console.log(`${msg.name} : ${msg.msg}`)
    // console.log(msg)
});