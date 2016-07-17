# linkpin


Link pin... delicious!!


#### Sails, pm2, and socket.io

client error:
>Connection closed before receiving a handshake response

Had to reverse the order in socket.io.js and in socket.js to be:
```
["websocket", "pulling"]
```
