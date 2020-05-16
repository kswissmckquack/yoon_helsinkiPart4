const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const app = express();
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const mongoUrl = config.MONGODB_URI;

logger.info('connecting to', config.PORT);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
