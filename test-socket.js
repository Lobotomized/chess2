const io = require('socket.io');
const http = require('http').createServer();
const server = io(http);
console.log('Socket.io initialized successfully');
process.exit(0);