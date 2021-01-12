const mongoose = require("mongoose");

const AbonneSchema = mongoose.Schema({
	userLogedIn: String,
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	credit: {
		type: Number,
	},
	abonnements: [
		{
			departement: String,
			abType: String,
			price: Number,
			pay: Number,
			date: Date,
			presences: [
				{
					userLogued: String,
					date: Date,
				},
			],
		},
	],
});

module.exports = mongoose.model("Abonne", AbonneSchema);
