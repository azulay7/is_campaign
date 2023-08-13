import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import campaignsRouter from './src/routes/campaignRoutes';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Campaign Management API',
      version: '1.0.0',
    },
  },
  apis: [
    path.join(__dirname, 'routes', '*.ts'), // Load all route files
  ],
};

// Load the Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml');
const swaggerSpec = swaggerJSDoc(swaggerOptions);
// Serve the Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerSpec));


app.use(express.json()); // Add JSON body parsing middleware

app.use(campaignsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'campaign API',
    version: '1.0.0',
    description: 'API documentation for campaign application',
  },
  servers: [{ url: 'http://localhost:3000' }], // Update with your server URL
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, 'routes', '*.ts')], // Load all route files
};


// Load the Swagger YAML file
const swaggerDocument = YAML.load('./swagger.yaml');
const swaggerSpec = swaggerJSDoc(options);
// Serve the Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/