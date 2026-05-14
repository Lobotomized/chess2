const request = require('supertest');
const { app, http, io, cleanup } = require('../chessMissions.js');

describe('Endpoint Tests', () => {
  afterAll(async () => {
    // Close any database connections or servers if necessary
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

  const testEndpoints = [
    { url: '/evoltuion', expectedFile: 'evolution.html' },
    { url: '/evolution', expectedFile: 'evolution.html' },
    { url: '/hallOfFame', expectedFile: 'hallOfFame.html' },
    { url: '/', expectedFile: 'mainMenu.html' },
    { url: '/single-player', expectedFile: 'singlePlayerMenu.html' },
    { url: '/lobby', expectedFile: 'lobby.html' },
    { url: '/create-board', expectedFile: 'boardEditorUpgraded.html' },
    { url: '/grandMapEditor.html', expectedFile: 'grandMapEditor.html' },
    { url: '/rpg-menu', expectedFile: 'rpgMenu.html' },
    { url: '/rpg.html', expectedFile: 'rpg.html' },
    { url: '/play', expectedFile: 'chessMissions.html' },
    { url: '/customMaps', expectedFile: 'customMaps.html' },
    { url: '/hotseat-menu', expectedFile: 'hotseat-menu.html' },
    { url: '/hotseat', expectedFile: 'hotseat.html' },
    { url: '/replay.html', expectedFile: 'replay.html' },
  ];

  testEndpoints.forEach(({ url, expectedFile }) => {
    it(`should reach ${url} and return something related to ${expectedFile}`, async () => {
      const response = await request(app).get(url);
      expect(response.status).toBe(200);
      // We check that the response is an HTML file or has expected content type
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });
});
