const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { body, validationResult } = require("express-validator");

const income = require("../models/Income");
const outcome = require("../models/Outcome");
const User = require("../models/User");
const db = require("../connexion");

//get income
router.get("/income", auth, (req, res) => {
	let query2 = db.query(`SELECT * FROM incomes `, (err, income) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		} else {
			let allincome = JSON.parse(JSON.stringify(income));
			res.json(allincome);
		}
	});
});

//add income
router.post("/income", auth, (req, res) => {
	const { date, year, month, day, amount, abonnementId, abonneName } = req.body;
	if (req.user.id) {
		let query = db.query(`SELECT * FROM users WHERE login='${req.user.id}'`, (err, user) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			if (user[0]) {
				let userName = user[0].firstName + " " + user[0].lastName;
				let newIncome = {
					date: date,
					year: year,
					month: month,
					day: day,
					amount: amount,
					userName: userName,
					abonnementId: abonnementId,
					abonneName: abonneName,
				};
				let query2 = db.query("INSERT INTO incomes SET ?", newIncome, (err, newUser) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					res.json({ msg: "OK" });
				});
			}
		});
	}
});

//delete income
router.delete("/income/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query = db.query(`DELETE FROM incomes WHERE id=${req.params.id}`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				res.json({ msg: "Income deleted" });
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//////////////
//get outcome
router.get("/outcome", auth, (req, res) => {
	let query2 = db.query(`SELECT * FROM outcomes `, (err, outcome) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		} else {
			let alloutcome = JSON.parse(JSON.stringify(outcome));
			res.json(alloutcome);
		}
	});
});

//add outcome
router.post("/outcome", auth, (req, res) => {
	const { employee, year, month, day, amount, description, avanceId } = req.body;
	if (req.user.id) {
		let query = db.query(`SELECT * FROM users WHERE login='${req.user.id}'`, (err, user) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			if (user[0]) {
				let userName = user[0].firstName + " " + user[0].lastName;
				let date = new Date();
				let newoutcome = {
					date: date,
					year: year,
					month: month,
					day: day,
					amount: amount,
					userName: userName,
					description: description,
					employee: employee,
					avancesId: avanceId,
				};
				let query2 = db.query("INSERT INTO outcomes SET ?", newoutcome, (err, newUser) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					res.json({ msg: "OK" });
				});
			}
		});
	}
});

//delete outcome
router.delete("/outcome/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query = db.query(`DELETE FROM outcomes WHERE id=${req.params.id}`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				res.json({ msg: "outcome deleted" });
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

module.exports = router;
