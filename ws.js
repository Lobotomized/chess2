test('ws server exists', () => {
  const ws = require('ws');
  console.log('ws keys:', Object.keys(ws));
  expect(typeof ws.Server).toBe('function');
});