const http = require("http");
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const { connection } = require("./database");
const server = http.createServer(app);

connection();

// app.listen(config.PORT || 4000, () =>
// 	logger.info(`Server running on port ${config.PORT}`)
// );
server.listen(config.PORT || 4000, () =>
	logger.info(`Server running on port ${config.PORT}`)
);
