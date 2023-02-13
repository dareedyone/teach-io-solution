require("dotenv").config();

const { PORT, MONGODB_URI, STRIPE_ENDPOINT_SECRET, STRIPE_SECRET } =
	process.env;
// if (NODE_ENV === "test" || NODE_ENV === "development")
// 	MONGODB_URI = TEST_MONGODB_URI;
module.exports = { MONGODB_URI, PORT, STRIPE_SECRET, STRIPE_ENDPOINT_SECRET };
