const request = require('supertest');
const app = require('../app');

describe('Integration tests', () => {
  describe('/last-metro', () => {
    test('200 with known station (case-insensitive)', async () => {
      const res = await request(app).get('/last-metro?station=nation');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('station', 'nation');
      expect(res.body).toHaveProperty('lastMetro');
      expect(res.body).toHaveProperty('line');
      expect(res.body).toHaveProperty('tz');
    });

    test('404 with unknown station', async () => {
      const res = await request(app).get('/last-metro?station=unknownville');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Station not found');
    });

    test('400 without station', async () => {
      const res = await request(app).get('/last-metro');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Station is required');
    });
  });

  describe('/next-metro', () => {
    test('200 with station and nextArrival in HH:MM format', async () => {
      const res = await request(app).get('/next-metro?station=nation');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('station', 'nation');
      expect(res.body).toHaveProperty('nextArrival');
      expect(res.body.nextArrival).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});