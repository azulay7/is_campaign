import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'API documentation for your application',
  },
  servers: [{ url: 'http://localhost:3000' }], // Update with your server URL
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;