import mongoose from 'mongoose';
import { MONGO_URI } from '../../config.js';
import { logger } from '../../utils/winston.js';

mongoose
  .connect(MONGO_URI)
  .then(() => logger.info('Database connected'))
  .catch((error) => logger.error(error));
