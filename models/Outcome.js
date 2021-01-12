const mongoose = require("mongoose");

const OutcomeSchema = mongoose.Schema({
	date: Date,
	year: Number,
	month: Number,
	day: Number,
	amount: Number,
	userName: String,
	description: String,
});

module.exports = mongoose.model("Outcome", OutcomeSchema);
