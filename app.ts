import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
const campaignRoute = require('./src/routes/campaignRoute');
const app = express();

// Other middleware and route setups
app.use(express.json());
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/campaign', campaignRoute);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});