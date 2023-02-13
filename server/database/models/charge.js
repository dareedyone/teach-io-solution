const { config } = require("dotenv");

config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const mongooseUniqueValidator = require("mongoose-unique-validator");
const { INTENT_SUCCEEDED, CHARGE_SUCCEEDED } = require("../../utils/const");

const chargeSchema = new Schema(
	{
		charge_id: {
			type: String,
			required: true,
			unique: true,
		},
		currency: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		customer: {
			type: String,
		},
		payment_method: {
			type: String,
		},
		amount: {
			type: Number,
			required: true,
		},
		created: {
			type: Number,
			required: true,
		},

		type: {
			type: String,
			enum: [INTENT_SUCCEEDED, CHARGE_SUCCEEDED],
		},
		refunded: {
			type: Boolean,
			default: false,
		},
		refunds: [
			{
				type: Schema.Types.ObjectId,
				ref: "Refund",
			},
		],
	},
	{
		timestamps: true,
	}
);
chargeSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("Charge", chargeSchema);
