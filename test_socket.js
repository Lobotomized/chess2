const { io } = require('socket.io-client');
const socket = io('http://localhost:8080');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('join', { roomId: 'my-test-game', mode: 'raceChoiceChess' });
  
  setTimeout(() => {
    fetch('http://localhost:8080/allgames').then(r => r.json()).then(console.log).then(() => process.exit(0));
  }, 1000);
});
