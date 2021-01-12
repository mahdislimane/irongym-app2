const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = "secret";
const auth = require("../middleware/Auth");
const db = require("../connexion");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const User = require("../models/User");

//add user
router.post(
	"/",
	[
		body("firstName", "firstName is required").not().isEmpty(),
		body("lastName", "lastName is required").not().isEmpty(),
		body("email", "please include a valid email!!!").isEmail(),
		body("role", "role is required").not().isEmpty(),
		body("password", "6 character length password required").not().isEmpty().isLength({ min: 6 }),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}

		const { firstName, lastName, email, role, password } = req.body;
		let login = firstName + "." + lastName;
		login = login.toLowerCase();
		let date = new Date();
		user = {
			firstName: firstName.toLowerCase(),
			lastName: lastName.toLowerCase(),
			email: email.toLowerCase(),
			role: role,
			password: password,
			date: date,
			login: login,
		};
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hashedPassword) => {
				user.password = hashedPassword;
				let query2 = db.query("INSERT INTO users SET ?", user, (err, newUser) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					res.json({ msg: "OK" });
				});
			});
		});
	}
);

//delete user

router.delete("/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query4 = db.query(`SELECT * FROM users WHERE id='${req.params.id}'`, (err, userTodel) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				if (userTodel) {
					let userToDelete = JSON.parse(JSON.stringify(userTodel))[0];
					if (userToDelete.role === "SUPERADMIN") {
						res.json({ msg: "Vous ne pouvez pas supprimer ce compte" });
					} else {
						let query = db.query(`DELETE FROM users WHERE id=${req.params.id}`, (err, result) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							let query3 = db.query(`DELETE FROM connexionHistory WHERE userID=${req.params.id}`, (err, result) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								res.json({ msg: "User deleted" });
							});
						});
					}
				}
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//edit user

router.put(
	"/edituser",
	[
		body("firstName", "firstName is required").not().isEmpty(),
		body("lastName", "lastName is required").not().isEmpty(),
		body("email", "please include a valid email!!!").isEmail(),
		body("role", "role is required").not().isEmpty(),
		body("oldPassword", "6 character length password required").not().isEmpty().isLength({ min: 6 }),
		body("password", "6 character length password required").not().isEmpty().isLength({ min: 6 }),
		body("login", "login is required").not().isEmpty(),
	],
	auth,
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { firstName, lastName, email, role, oldPassword, password, login } = req.body;
		let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
				let query = db.query(`SELECT * FROM users WHERE login='${login}'`, (err, user) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					bcrypt.compare(oldPassword, user[0].password, (err, isMatch) => {
						if (err) {
							console.log(err.message);
						} else if (isMatch) {
							updatedUser = {
								firstName: firstName,
								lastName: lastName,
								email: email.toLowerCase(),
								role: role,
								password: password,
								login: login,
							};
							bcrypt.genSalt(10, (err, salt) => {
								bcrypt.hash(updatedUser.password, salt, (err, hashedPassword) => {
									updatedUser.password = hashedPassword;
									let query2 = db.query(`UPDATE users SET ? WHERE login='${login}'`, updatedUser, (err, newData) => {
										if (err) {
											res.json({ msg: err.sqlMessage });
										} else {
											res.json({ msg: `${firstName} ${lastName} updated` });
										}
									});
								});
							});
						} else {
							return res.json({ msg: "old password is wrong" });
						}
					});
				});
			} else {
				res.json({ msg: "your are not authorised" });
			}
		});
	}
);

module.exports = router;
