import { __dirname } from './utils/utils.js';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'API Documentation',
      description:
        'This documentation will help you get familiar with the resources and show you how to make different queries',
      version: '1.0.0',
    },
  },
  apis: [__dirname + '/docs/**/*.yaml'],
};

export const swaggerSetup = swaggerJSDoc(swaggerOptions);
