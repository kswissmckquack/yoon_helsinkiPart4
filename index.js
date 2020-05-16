const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

const { PORT } = config;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// need to come back to 4.6/4.7 when finish the material!!!
