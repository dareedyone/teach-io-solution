const mongoose = require("mongoose");
const { config } = require("dotenv");
const { MONGODB_URI } = require("../utils/config");

config();

mongoose.Promise = global.Promise;
const connection = () => {
	try {
		mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		mongoose.connection.on("connected", () => {
			console.log(`Connected to database ${MONGODB_URI}`);
		});

		mongoose.connection.on("error", (err) => {
			throw err;
		});

		// mongoose.set("useFindAndModify", false);
		// mongoose.set("useCreateIndex", true);
		mongoose.set("strictQuery", false);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const isValidObjectId = (id) => {
	return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
	connection,
	isValidObjectId,
};
