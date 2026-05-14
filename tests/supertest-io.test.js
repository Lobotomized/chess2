const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const request = require('supertest');

describe('Supertest with Socket.io', () => {
    let app, server, io;

    beforeAll((done) => {
        app = express();
        server = http.createServer(app);
        io = socketIo(server);

        app.get('/', (req, res) => res.send('ok'));
        server.listen(done);
    });

    afterAll((done) => {
        io.close(done);
    });

    it('should successfully get /', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('ok');
    });
});