const { config } = require("dotenv");

config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const mongooseUniqueValidator = require("mongoose-unique-validator");

const refundSchema = new Schema(
	{
		charge: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Charge",
		},
		refund_id: {
			type: String,
			required: true,
			unique: true,
		},
		currency: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);
refundSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("Refund", refundSchema);
