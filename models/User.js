const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	login: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	connexionHistory: [
		{
			LoginDate: Date,
			LogoutDate: Date,
		},
	],
});

module.exports = mongoose.model("user", UserSchema);
