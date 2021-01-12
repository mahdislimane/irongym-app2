const mongoose = require("mongoose");

const BuvetteSchema = mongoose.Schema({
	date: Date,
	price: Number,
	userName: String,
	comment: String,
});

module.exports = mongoose.model("Buvette", BuvetteSchema);
