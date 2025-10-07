// Create Express app, register middlewares, and auto-load module routes
import express from 'express';
import cors from 'cors';
import logger from '@/middlewares/logger.js';
import errorHandler from '@/middlewares/errorHandler.js';
import apiRoutes from '@/routes/api.js';

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

const initRoutes = async () => {
  const routes = await apiRoutes();
  routes.forEach(({ router, basePath }) => {
    if (router) {
      app.use(basePath, router);
    }
  });
};

await initRoutes();
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
