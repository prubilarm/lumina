const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATM System API (Serverless)',
      version: '1.0.0',
      description: 'API documentation for the ATM System on Vercel',
    },
    servers: [
      {
        url: '/api',
        description: 'Vercel Deployment',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./api/routes/*.js'], // Path relative to root for Vercel
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
