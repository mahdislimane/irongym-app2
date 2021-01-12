const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { body, validationResult } = require("express-validator");
const buvette = require("../models/buvette");
const User = require("../models/User");
const db = require("../connexion");

// get all buvette
router.get("/", auth, (req, res) => {
	let query2 = db.query(`SELECT * FROM buvettes `, (err, buvette) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		} else {
			let allBuvette = JSON.parse(JSON.stringify(buvette));
			res.json(allBuvette);
		}
	});
});

// add buvette
router.post("/", [auth, [body("comment").not().isEmpty(), body("price").not().isEmpty()]], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({ errors: errors.array() });
	}
	const { comment, price } = req.body;
	if (req.user.id) {
		let query2 = db.query(`SELECT * FROM users WHERE login='${req.user.id}'`, (err, user) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			let userName = user[0].firstName + " " + user[0].lastName;
			let date = new Date();
			let newBuvette = {
				date: date,
				price: price,
				userName: userName,
				comment: comment,
			};
			let query2 = db.query("INSERT INTO buvettes SET ?", newBuvette, (err, newUser) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				res.json({ msg: "OK" });
			});
		});
	}
});

// delete buvette
router.delete("/:id", auth, (req, res) => {
	let query = db.query(`DELETE FROM buvettes WHERE id=${req.params.id}`, (err, result) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		res.json({ msg: "OK" });
	});
});

module.exports = router;
