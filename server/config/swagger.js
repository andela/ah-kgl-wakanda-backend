import swaggerJSDoc from 'swagger-jsdoc';
import { LOCAL_PORT } from './constant';

const host = `localhost:${LOCAL_PORT}`;

const swaggerDefinition = {
  info: {
    title: 'REST API for my App',
    version: '1.0.0',
    description: 'This is the REST API for my product',
  },
  host,
  basePath: '/api',
  schemes: [
    'http', 'https'
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'The authorization header must contain a Bearer token',
      in: 'header'
    }
  },
};

// options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['**/*.yaml'],
};

// initialize swagger-jsdoc
export default swaggerJSDoc(options);
