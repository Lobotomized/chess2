const request = require('supertest');
const { app, http, io, cleanup } = require('./chessMissions.js');

describe('Endpoint Tests', () => {
  afterAll(async () => {
    cleanup();
    if (io) {
      io.close();
    }
    if (http && http.listening) {
      http.close();
    }
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should reach /evoltuion', async () => {
    const response = await request(app).get('/evoltuion');
    expect(response.status).toBe(200);
  });
});
