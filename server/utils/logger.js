const { NODE_ENV } = require("./config");

const info = (...params) => {
	if (NODE_ENV === "development") console.log(...params);
};

const error = (...params) => {
	console.error(...params);
};

module.exports = { info, error };
