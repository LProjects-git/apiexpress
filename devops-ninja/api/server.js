"use strict";
// Express
const express = require("express");
const app = express();

// CORS
const cors = require('cors');
app.use(cors());

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDoc = yaml.load('./openapi/openapi.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Fonctions utilitaires
const { nextTimeFromNow } = require('./time');
const PORT = process.env.PORT || 5000;

// DB pool minimal (env avec valeurs par défaut pour Compose)
const { Pool } = require("pg");
const dbPool = new Pool({
	user: process.env.PGUSER || "app",
	password: process.env.PGPASSWORD || "app",
	database: process.env.PGDATABASE || "dernier_metro",
	host: process.env.PGHOST || "postgres",
	port: Number(process.env.PGPORT || 5432),
	max: 5,
	idleTimeoutMillis: 10000
});

// Logger minimal: méthode, chemin, status, durée
app.use((req, res, next) => {
	const t0 = Date.now();
	res.on('finish', () => {
		const dt = Date.now() - t0;
		console.log(`${req.method} ${req.path} -> ${res.statusCode} ${dt}ms`);
	});
	next();
});

// Santé
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'dernier-metro-api' }));

// Santé DB minimale (select 1)
app.get('/db-health', async (_req, res) => {
	try {
		const result = await dbPool.query('select 1 as ok');
		return res.status(200).json({ db: 'ok', result: result.rows[0] });
	} catch (err) {
		console.error('db-health error:', err);
		return res.status(500).json({ db: 'error', error: err.message });
	}
});


// Endpoint métier minimal
app.get('/next-metro', (req, res) => {
  const { station } = req.query;
  if (!station) {
    return res.status(400).json({ error: 'Station is required' });
  }  try {
    const line = 'M1';
    const headwayMin = 3;
    const nextArrival = nextTimeFromNow(headwayMin);
    return res.status(200).json({
      station: station.toLowerCase(),line,headwayMin,nextArrival});
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
});

app.get('/last-metro', async (req, res) => {
  const { station } = req.query;
  if (!station) {
    return res.status(400).json({ error: 'Station is required' });
  }

  try {
    const defaultsRes = await dbPool.query(
      'SELECT value FROM config WHERE key = $1',
      ['metro.defaults']
    );
    const lastRes = await dbPool.query(
      'SELECT value FROM config WHERE key = $1',
      ['metro.last']
    );

    const defaults = JSON.parse(defaultsRes.rows[0]?.value);
    const lastMap = JSON.parse(lastRes.rows[0]?.value);

    if (!defaults || !lastMap) {
      return res.status(500).json({ error: 'Missing config data' });
    }

    const normalizedStation = station.toLowerCase();
    const lastMetro = lastMap[normalizedStation];

    if (!lastMetro) {
      return res.status(404).json({ error: 'Station not found' });
    }

    return res.status(200).json({
      station: normalizedStation,
      lastMetro,
      line: defaults.line,
      tz: defaults.tz
    });
  } catch (error) {
    console.error('last-metro error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
});

// 404 JSON
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
