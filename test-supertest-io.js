const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('supertest');

app.get('/', (req, res) => res.send('ok'));

request(http).get('/').end((err, res) => {
  if (err) console.error(err);
  console.log('Done');
  process.exit(0);
});