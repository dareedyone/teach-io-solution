const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { JWT_SECRET_KEY } = require("./config");
const errorHandler = (error, request, response, next) => {
	logger.error("from logger", error.message, error.name);
	const errorName = error.name;

	if (errorName === "CastError")
		return response
			.status(400)
			.send({ message: "malformatted id", value: false });

	if (errorName === "ValidationError")
		return response.status(400).json({ message: error.message, value: false });

	if (errorName === "JsonWebTokenError") {
		return response
			.status(401)
			.json({ message: "invalid token", value: false });
	}

	next(error);
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ message: "unknown endpoint", value: false });
};

const requestLogger = (req, res, next) => {
	logger.info("Method:", req.method);
	logger.info("Path:", req.path);
	logger.info("Body:", req.body);
	logger.info("____");
	next();
};

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer "))
		return authorization.substring(7);
	return null;
};

const isAuthenticated = async (req, res, next) => {
	const token = getTokenFrom(req);
	const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
	if (!token || !decodedToken.userId)
		return res.status(401).json({
			message: "token missing or invalid",
			value: false,
		});

	req.app.locals.authenticated = decodedToken;
	next();
};

module.exports = {
	errorHandler,
	unknownEndpoint,
	requestLogger,
	isAuthenticated,
};
