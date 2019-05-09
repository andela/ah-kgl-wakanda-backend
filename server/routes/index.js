import express from 'express';
import swaggerUi from 'swagger-ui-express';
import api from './api';
import swaggerDocument from '../config/swagger';

const router = express.Router();

// convert the json doc into a styled UI and serve it
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/api', api);

export default router;
