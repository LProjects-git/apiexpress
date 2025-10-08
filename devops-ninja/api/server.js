"use strict";

const app = require('./app')
const PORT = process.env.PORT || 5000;

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDoc = yaml.load('./openapi/openapi.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
