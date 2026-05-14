const io = require('socket.io');
const http = require('http');

describe('Socket.io Initialization', () => {
    let server;
    let httpServer;

    beforeAll((done) => {
        httpServer = http.createServer();
        server = io(httpServer);
        done();
    });

    afterAll((done) => {
        if (server) {
            server.close();
        }
        if (httpServer) {
            httpServer.close();
        }
        done();
    });

    it('should initialize socket.io successfully', () => {
        expect(server).toBeDefined();
        expect(server.engine).toBeDefined();
    });
});