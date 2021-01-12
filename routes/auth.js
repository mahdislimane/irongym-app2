const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = "secret";
const db = require("../connexion");

const auth = require("../middleware/Auth");
const User = require("../models/User");

//login the user
router.post(
	"/",
	[body("login", "login is required").not().isEmpty(), body("password", "password is required").not().isEmpty()],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { login, password } = req.body;
		let query = db.query(`SELECT * FROM users WHERE login='${login.toLowerCase()}'`, (err, user) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			} else if (!user[0]) {
				res.json({ msg: "user dont existe" });
			} else {
				bcrypt.compare(password, user[0].password, (err, isMatch) => {
					if (err) {
						console.log(err.message);
					}
					let query2 = db.query(`SELECT * FROM connexionhistory  WHERE userID=${user[0].id}`, (err, newUserHist) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						let thisUserHist = JSON.parse(JSON.stringify(newUserHist));
						if (isMatch) {
							if (thisUserHist[thisUserHist.length - 1].essai < 4) {
								const payload = {
									user: {
										id: user[0].login,
										date: new Date(),
									},
								};
								jwt.sign(payload, jwtsecret, { expiresIn: 3600000 }, (err, token) => {
									if (err) {
										res.json(err);
									}
									let dat = {
										LoginDate: new Date(),
										userID: user[0].id,
									};
									if (thisUserHist[thisUserHist.length - 1].LogoutDate == null) {
										res.json(token);
									} else {
										let query2 = db.query("INSERT INTO connexionhistory SET ?", dat, (err, newUser) => {
											if (err) {
												res.json({ msg: err.sqlMessage });
											}
											res.json(token);
										});
									}
								});
							} else if (
								new Date(thisUserHist[thisUserHist.length - 1].LoginDate).getTime() + 3600000 < new Date().getTime() &&
								thisUserHist[thisUserHist.length - 1].essai > 3
							) {
								const payload = {
									user: {
										id: user[0].login,
										date: new Date(),
									},
								};
								jwt.sign(payload, jwtsecret, { expiresIn: 3600000 }, (err, token) => {
									if (err) {
										res.json(err);
									}
									let dat = {
										LoginDate: new Date(),
										userID: user[0].id,
									};
									if (thisUserHist[thisUserHist.length - 1].LogoutDate == null) {
										res.json(token);
									} else {
										let query2 = db.query("INSERT INTO connexionhistory SET ?", dat, (err, newUser) => {
											if (err) {
												res.json({ msg: err.sqlMessage });
											}
											res.json(token);
										});
									}
								});
							} else {
								res.json({ msg: "wrong password" });
							}
						} else {
							if (thisUserHist[thisUserHist.length - 1].LogoutDate != null) {
								let dat = {
									LoginDate: new Date(),
									userID: user[0].id,
								};
								let query2 = db.query("INSERT INTO connexionhistory SET ?", dat, (err, newUser) => {
									if (err) {
										res.json({ msg: err.sqlMessage });
									}
									res.json({ msg: "wrong password" });
								});
							} else {
								let n = thisUserHist[thisUserHist.length - 1].essai + 1;
								let query2 = db.query(
									`UPDATE connexionhistory SET ? WHERE id=${thisUserHist[thisUserHist.length - 1].id}`,
									{ essai: n },
									(err, newUser) => {
										if (err) {
											res.json({ msg: err.sqlMessage });
										}
										res.json({ msg: "wrong password" });
									}
								);
							}
						}
					});
				});
			}
		});
	}
);

//logout user
router.put("/:id", (req, res) => {
	let query2 = db.query(`SELECT id FROM users WHERE login='${req.params.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		} else {
			let query3 = db.query(`SELECT * FROM connexionhistory WHERE userID=${result2[0].id}`, (err, data) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let alldata = JSON.parse(JSON.stringify(data));
				let newData = [];
				alldata.map((el) => {
					if (el.LogoutDate == null) {
						let dat = {
							LogoutDate: new Date(),
						};
						let query4 = db.query(`UPDATE connexionhistory SET ? WHERE id=${el.id}`, dat, (err, newDat) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							res.json({ msg: "Goodbye" });
						});
					}
				});
			});
		}
	});
});

//get the logged in user
router.get("/", auth, (req, res) => {
	if (req.user.id) {
		let query2 = db.query(`SELECT * FROM users WHERE login='${req.user.id}'`, (err, user) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			if (user[0]) {
				if (new Date(req.user.date).getTime() + 25200000 > new Date().getTime()) {
					let query2 = db.query(`SELECT * FROM connexionhistory WHERE userID=${user[0].id}`, (err, hist) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						if (hist[0]) {
							let allHist = JSON.parse(JSON.stringify(hist));
							let newUser = { ...user[0], connexionHistory: allHist };
							res.json(newUser);
						}
					});
				} else {
					res.json({ msg: "disconnected", login: req.user.id });
				}
			}
		});
	}
});

//get all user
router.get("/allusers", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query = db.query(`SELECT * FROM users`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let allusers = JSON.parse(JSON.stringify(result));
				let query3 = db.query(`SELECT * FROM connexionhistory`, (err, histo) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					let allHisto = JSON.parse(JSON.stringify(histo));
					let users = [];
					allusers.map((el, i) => {
						users.push(el);
						users[i].connexionHistory = [];
						allHisto.map((ele) => {
							if (el.id === ele.userID) {
								users[i].connexionHistory.push(ele);
							}
						});
					});
					res.json(users);
				});
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//get user
router.get("/user/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query = db.query(`SELECT * FROM users WHERE id=${req.params.id}`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let user = JSON.parse(JSON.stringify(result));
				res.json(user[0]);
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

module.exports = router;
