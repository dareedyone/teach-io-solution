const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const { connection } = require("./database");
const base = "/api";
const Charge = require("./database/models/charge");
const Refund = require("./database/models/refund");
const { CHARGE_SUCCEEDED, INTENT_SUCCEEDED } = require("./utils/const");
const { STRIPE_SECRET, STRIPE_ENDPOINT_SECRET } = require("./utils/config");
connection();

app.use(cors());
// app.use(express.static("build"));

const stripe = require("stripe")(STRIPE_SECRET);
const endpointSecret = STRIPE_ENDPOINT_SECRET;

app.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	async (req, res) => {
		let event = req.body;
		const signature = req.headers["stripe-signature"];
		if (!endpointSecret) {
			throw new UnknownError("No endpoint secret provided!");
		}
		if (!signature) {
			throw new UnknownError("No stripe signature found!");
		}

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				endpointSecret
			);

			const handledTypes = [CHARGE_SUCCEEDED, INTENT_SUCCEEDED];
			if (handledTypes.includes(event.type)) {
				const charge = new Charge({
					charge_id: event.data.object.id,
					currency: event.data.object.currency,
					description: event.data.object.description,
					customer: event.data.object.customer,
					payment_method: event.data.object.payment_method,
					amount: event.data.object.amount,
					refunded: event.data.object.refunded,
					created: event.data.object.created,
					type: event.type,
				});
				await charge.save();

				return res.send();
			}
			console.log(`Unhandled event type ${event.type}`);
		} catch (err) {
			console.log(`⚠️  Something went wrong in webhook`, err.message);
			return res.sendStatus(400);
		}

		res.send();
	}
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(`${base}/refund`, async (req, res) => {
	if (!req?.body?.charge_id)
		return res
			.status(400)
			.send({ message: "Invalid id parameter", data: null });
	try {
		const charge = await Charge.findOne({ charge_id: req.body.charge_id });

		if (!charge) {
			return res.status(404).send({
				message: "Charge doesn't exist",
				data: null,
			});
		}

		if (req.body.amount > charge.amount)
			return res.status(400).send({
				message: "Amount specified is greater than charge amount",
				data: null,
			});

		const refundObject = { amount: req.body.amount || charge.amount };

		if (charge.type === CHARGE_SUCCEEDED)
			refundObject.charge = charge.charge_id;

		if (charge.type === CHARGE_SUCCEEDED)
			refundObject.charge = charge.charge_id;
		const result = await stripe.refunds.create(refundObject);
		if (!result) {
			return res.status(404).send({
				message: "Refund can't be processed!",
				data: null,
			});
		}

		const refund = new Refund({
			refund_id: result.id,
			charge: charge._id,
			currency: result.currency,
			amount: result.amount,
			status: result.status,
		});
		await refund.save();
		charge.refunds = [...charge.refunds, refund._id];
		charge.refunded = true;
		await charge.save();
		return res.send({
			message: "Refund processed successfully!",
			data: charge,
		});
	} catch (err) {
		console.log(`⚠️  something went wrong with refund`, err.message);
		return res.status(400).send({
			message: err?.message || "Refund can't be processed",
			data: null,
		});
	}
});
app.get(`${base}/charge`, async (req, res) => {
	try {
		const charges = await Charge.find().populate("refunds");
		return res.send({
			message: "Charge fetched successfully!",
			data: charges,
		});
	} catch (err) {
		console.log(`⚠️  something went wrong with refund`, err.message);
		return res.status(500).send({
			message: err?.message || "Refund can't be processed",
			data: null,
		});
	}
});
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
