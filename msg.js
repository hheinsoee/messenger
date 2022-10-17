const { io } = require("socket.io-client");

const socket = io("wss://live.heinsoe.com");
var name = 'hein soe';
var id = 'theId';
var signed = false;

var data = { "id": "9", "name": "Zin Mar Hlaing", "message": "hello" }

socket.emit('message', data, (response) => {
    if (response.status == 'ok') {
        console.log('message sent');
    }
})

socket.on("reconnect_failed", () => {
    console.log('fail');
});

socket.on('message', function (msg) {
    console.log(msg)
});