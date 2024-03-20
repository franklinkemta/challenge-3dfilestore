import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import YAML from 'yaml';

import { FILES_STORE_PATH } from './constants';
import { ensureFolderExists } from "./utils";
import fileRoutes from './routes';

// Read the OpenAPI specification from YAML file
const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use('/api', fileRoutes);

// Serve OpenAPI specification using Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Function to monitor memory usage
function monitorMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    const totalMemoryUsageInMB = (
        memoryUsage.heapTotal +
        memoryUsage.external +
        memoryUsage.arrayBuffers
    ) / (1024 * 1024);
    console.log('Memory Usage:', totalMemoryUsageInMB.toFixed(2), 'MB');
}

// Monitor memory usage periodically every 5 seconds
setInterval(monitorMemoryUsage, 5000);

// Create a folder to mimic file storage for 3D models
ensureFolderExists(FILES_STORE_PATH);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
