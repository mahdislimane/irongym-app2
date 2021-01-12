const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { body, validationResult } = require("express-validator");

const employee = require("../models/Employee");
const User = require("../models/User");
const db = require("../connexion");

const mongoose = require("mongoose");
const { deleteOne } = require("../models/Employee");
mongoose.set("useFindAndModify", false);

//get all employees
router.get("/", auth, (req, res) => {
	let query = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN" || result2[0].role == "USER") {
			let query1 = db.query(`SELECT * FROM employees `, (err, employee) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				} else {
					let allemployee = JSON.parse(JSON.stringify(employee));
					let newAllEmployees = [];
					let query2 = db.query(`SELECT * FROM salarys`, (err, sal) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						let allSalarys = JSON.parse(JSON.stringify(sal));
						let query3 = db.query(`SELECT * FROM avances`, (err, av) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							let query4 = db.query(`SELECT * FROM entryhistory`, (err, ent) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								allemployee.map((elemen) => {
									let allAvances = JSON.parse(JSON.stringify(av));
									let allEntryhistory = JSON.parse(JSON.stringify(ent));
									let newAllSalarys = [];
									allSalarys.map((ele, i) => {
										if (ele.employeeID == elemen.id) {
											let avances = [];
											let entryhistory = [];
											allAvances.map((el) => {
												if (el.salaryID == ele.id) {
													avances.push(el);
												}
											});
											allEntryhistory.map((el) => {
												if (el.salaryID == ele.id) {
													entryhistory.push(el);
												}
											});
											ele = { ...ele, avances: avances, entryHistory: entryhistory };
											newAllSalarys.push(ele);
										}
									});
									elemen = { ...elemen, salarys: newAllSalarys };
									newAllEmployees.push(elemen);
								});
								res.json(newAllEmployees);
							});
						});
					});
				}
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//get employee
router.get("/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN" || result2[0].role == "USER") {
			let query = db.query(`SELECT * FROM employees WHERE id=${req.params.id}`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let user = JSON.parse(JSON.stringify(result));
				let query1 = db.query(`SELECT * FROM salarys WHERE employeeID=${req.params.id}`, (err, sal) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					let allSalarys = JSON.parse(JSON.stringify(sal));
					let query3 = db.query(`SELECT * FROM avances WHERE employeeID=${req.params.id}`, (err, av) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						let query4 = db.query(`SELECT * FROM entryhistory WHERE employeeID=${req.params.id}`, (err, ent) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							let allAvances = JSON.parse(JSON.stringify(av));
							let allEntryhistory = JSON.parse(JSON.stringify(ent));
							if (av) {
								let newAllSalarys = [];
								allSalarys.map((ele, i) => {
									let avances = [];
									let entryhistory = [];
									allAvances.map((el) => {
										if (el.salaryID == ele.id) {
											avances.push(el);
										}
									});
									allEntryhistory.map((el) => {
										if (el.salaryID == ele.id) {
											entryhistory.push(el);
										}
									});
									ele = { ...ele, avances: avances, entryHistory: entryhistory };
									newAllSalarys.push(ele);
								});
								user[0] = { ...user[0], salarys: newAllSalarys };
								res.json(user[0]);
							} else {
								res.json(user[0]);
							}
						});
					});
				});
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//add employees
router.post(
	"/",
	[
		auth,
		[
			body("fullName").not().isEmpty(),
			body("jobTitle").not().isEmpty(),
			body("phoneNumber").not().isEmpty(),
			body("cin").not().isEmpty(),
			body("part").not().isEmpty(),
			body("startDate").not().isEmpty(),
		],
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { fullName, jobTitle, phoneNumber, cin, startDate, cardNumber, cardNumber2, part } = req.body;
		let query = db.query(`SELECT * FROM employees `, (err, employee) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			} else {
				let allemployee = JSON.parse(JSON.stringify(employee));
				let firstdata = false;
				allemployee.map((el) => {
					if (el.fullName === fullName) {
						firstdata = true;
					}
				});
				if (firstdata) {
					return res.json({ msg: "l'employee existe déjà" });
				} else {
					const newemployee = {
						fullName: fullName,
						jobTitle: jobTitle,
						phoneNumber: phoneNumber,
						cin: cin,
						part: part,
						startDate: startDate,
						cardNumber1: cardNumber,
						cardNumber2: cardNumber2,
					};
					let query2 = db.query("INSERT INTO employees SET ?", newemployee, (err, newUser) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						res.json({ msg: "OK" });
					});
				}
			}
		});
	}
);

//delete employees
router.delete("/:id", auth, (req, res) => {
	let query2 = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query = db.query(`DELETE FROM employees WHERE id=${req.params.id}`, (err, result) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				res.json({ msg: "Employee deleted" });
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//edit employee
router.put(
	"/:id",
	auth,
	[
		body("fullName").not().isEmpty(),
		body("jobTitle").not().isEmpty(),
		body("phoneNumber").not().isEmpty(),
		body("cin").not().isEmpty(),
		body("id").not().isEmpty(),
		body("part").not().isEmpty(),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { cin, fullName, phoneNumber, jobTitle, endDate, cardNumber, cardNumber2, id, part } = req.body;

		let employeePut = {};
		if (fullName) employeePut.fullName = fullName;
		if (jobTitle) employeePut.jobTitle = jobTitle;
		if (phoneNumber) employeePut.phoneNumber = phoneNumber;
		if (cardNumber) employeePut.cardNumber1 = cardNumber;
		if (cardNumber2) employeePut.cardNumber2 = cardNumber2;
		if (cin) employeePut.cin = cin;
		if (part) employeePut.part = part;
		if (endDate) employeePut.endDate = endDate;
		let query2 = db.query(`UPDATE employees SET ? WHERE id='${id}'`, employeePut, (err, newData) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			} else {
				res.json({ msg: `employee updated` });
			}
		});
	}
);

//add salary
router.put(
	"/:id/salary",
	auth,
	[body("salary").not().isEmpty(), body("year").not().isEmpty(), body("month").not().isEmpty(), body("dayCoast").not().isEmpty()],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { salary, year, month, dayCoast } = req.body;
		let salaryPut = {};
		if (salary) salaryPut.salary = salary;
		if (year) salaryPut.year = year;
		if (month) salaryPut.month = month;
		if (dayCoast) salaryPut.dayCoast = dayCoast;
		salaryPut.employeeID = req.params.id;
		let query5 = db.query("INSERT INTO salarys SET ?", salaryPut, (err, newUser) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			let query2 = db.query(`SELECT amount FROM avances WHERE employeeID=${req.params.id}`, (err, avance) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				} else {
					let allAvances = JSON.parse(JSON.stringify(avance));
					let allAvancesValue = 0;
					allAvances.map((el) => {
						allAvancesValue += el.amount;
					});
					let query4 = db.query(`SELECT salary FROM salarys WHERE employeeID=${req.params.id}`, (err, sal) => {
						let allSalarys = JSON.parse(JSON.stringify(sal));
						let allSalarysValue = 0;
						allSalarys.map((el) => {
							allSalarysValue += el.salary;
						});
						let newRest = allSalarysValue - allAvancesValue;
						let query3 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { rest: newRest }, (err, newUser) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							res.json({ msg: "OK" });
						});
					});
				}
			});
		});
	}
);

//delete salary
router.delete("/:id/salary/:ids", auth, (req, res) => {
	let query = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query5 = db.query(`DELETE FROM salarys WHERE id=${req.params.ids}`, (err, newUser) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let query2 = db.query(`SELECT amount FROM avances WHERE employeeID=${req.params.id}`, (err, avance) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					} else {
						let allAvances = JSON.parse(JSON.stringify(avance));
						let allAvancesValue = 0;
						allAvances.map((el) => {
							allAvancesValue += el.amount;
						});
						let query4 = db.query(`SELECT salary FROM salarys WHERE employeeID=${req.params.id}`, (err, sal) => {
							let allSalarys = JSON.parse(JSON.stringify(sal));
							let allSalarysValue = 0;
							allSalarys.map((el) => {
								allSalarysValue += el.salary;
							});
							let newRest = allSalarysValue - allAvancesValue;
							let query3 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { rest: newRest }, (err, newUser) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								res.json({ msg: "salary deleted" });
							});
						});
					}
				});
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//add avance
router.put(
	"/:id/avance/:ids",
	auth,
	[body("date").not().isEmpty(), body("year").not().isEmpty(), body("month").not().isEmpty(), body("amount").not().isEmpty()],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.json({ errors: errors.array() });
		}
		const { date, amount, year, month } = req.body;
		let avancePut = {};
		if (date) avancePut.date = date;
		if (amount) avancePut.amount = amount;
		if (month) avancePut.month = month;
		if (year) avancePut.year = year;
		if (req.params.id) avancePut.employeeID = req.params.id;
		if (req.params.ids != "") avancePut.salaryID = req.params.ids;
		avancePut.avancesId =
			req.params.ids +
			"" +
			new Date(date).getFullYear() +
			"" +
			new Date(date).getMonth() +
			"" +
			new Date(date).getDay() +
			"" +
			new Date(date).getHours() +
			"" +
			new Date(date).getMinutes() +
			"" +
			new Date(date).getSeconds() +
			"" +
			new Date(date).getMilliseconds();
		let AvanceId = avancePut.avancesId;

		let query = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
			if (err) {
				res.json({ msg: err.sqlMessage });
			}
			if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN" || result2[0].role == "USER") {
				let query5 = db.query(`INSERT INTO avances SET ?`, avancePut, (err, newUser) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					let query2 = db.query(`SELECT amount FROM avances WHERE employeeID=${req.params.id}`, (err, avance) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						} else {
							let allAvances = JSON.parse(JSON.stringify(avance));
							let allAvancesValue = 0;
							allAvances.map((el) => {
								allAvancesValue += el.amount;
							});
							let query4 = db.query(`SELECT salary FROM salarys WHERE employeeID=${req.params.id}`, (err, sal) => {
								let allSalarys = JSON.parse(JSON.stringify(sal));
								let allSalarysValue = 0;
								allSalarys.map((el) => {
									allSalarysValue += el.salary;
								});
								let newRest = allSalarysValue - allAvancesValue;
								let query3 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { rest: newRest }, (err, newUser1) => {
									if (err) {
										res.json({ msg: err.sqlMessage });
									}
									res.json({ msg: "OK", avanceId: AvanceId });
								});
							});
						}
					});
				});
			} else {
				res.json({ msg: "your are not authorised" });
			}
		});
	}
);

//delete avance
router.delete("/:id/avance/:ida", auth, (req, res) => {
	let query = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query1 = db.query(`SELECT avancesId FROM avances WHERE id=${req.params.ida}`, (err, AvanceId) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let AvancesIds = JSON.parse(JSON.stringify(AvanceId))[0].avancesId;
				let query5 = db.query(`DELETE FROM avances WHERE id=${req.params.ida}`, (err, newUser1) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					let query2 = db.query(`SELECT amount FROM avances WHERE employeeID=${req.params.id}`, (err, avance) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						} else {
							let allAvances = JSON.parse(JSON.stringify(avance));
							let allAvancesValue = 0;
							allAvances.map((el) => {
								allAvancesValue += el.amount;
							});
							let query4 = db.query(`SELECT salary FROM salarys WHERE employeeID=${req.params.id}`, (err, sal) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								let allSalarys = JSON.parse(JSON.stringify(sal));
								let allSalarysValue = 0;
								allSalarys.map((el) => {
									allSalarysValue += el.salary;
								});
								let newRest = allSalarysValue - allAvancesValue;
								let query3 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { rest: newRest }, (err, newUser2) => {
									if (err) {
										res.json({ msg: err.sqlMessage });
									}
									let query6 = db.query(`DELETE FROM outcomes WHERE avancesId=${AvancesIds}`, (err, newUser3) => {
										if (err) {
											res.json({ msg: err.sqlMessage });
										}

										res.json({ msg: "Avance deleted" });
									});
								});
							});
						}
					});
				});
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//add day for employee
router.put("/:id/dayoff/:ida", auth, [body("dayState").not().isEmpty()], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({ errors: errors.array() });
	}
	const { dayState } = req.body;
	let query = db.query(`SELECT role FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
			let query1 = db.query(`SELECT * FROM salarys WHERE id=${req.params.ida}`, (err, SalaireA) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let Salaire = JSON.parse(JSON.stringify(SalaireA))[0];
				let sal = Salaire.salary;
				let note = "";
				let nowDate = new Date();
				let query5 = db.query(`SELECT rest FROM employees WHERE id=${req.params.id}`, (err, Rest) => {
					if (err) {
						res.json({ msg: err.sqlMessage });
					}
					let OldRest = JSON.parse(JSON.stringify(Rest))[0].rest;
					if (dayState == "plus") {
						sal += Salaire.dayCoast;
						OldRest += Salaire.dayCoast;
						note = "1 jour double";
					} else {
						sal -= Salaire.dayCoast;
						OldRest -= Salaire.dayCoast;
						note = "1 jour de congé";
					}
					let avancePut = {
						date: nowDate,
						note: note,
						employeeID: req.params.id,
						salaryID: req.params.ida,
						month: nowDate.getMonth() + 1,
						year: nowDate.getFullYear(),
						amount: 0,
					};
					let query2 = db.query("INSERT INTO avances SET ?", avancePut, (err, new1) => {
						if (err) {
							res.json({ msg: err.sqlMessage });
						}
						let query3 = db.query(`UPDATE salarys SET ? WHERE id=${req.params.ida}`, { salary: sal }, (err, new2) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							let query4 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { rest: OldRest }, (err, new3) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								res.json({ msg: "OK" });
							});
						});
					});
				});
			});
		} else if (result2[0].role == "SUPERADMIN" || result2[0].role !== "ADMIN") {
			res.json({ msg: "your are not authorised" });
		}
	});
});

//add entry/exit

router.put("/enterexit/:id/:ids", auth, (req, res) => {
	let query = db.query(`SELECT * FROM users WHERE login='${req.user.id}'`, (err, result2) => {
		if (err) {
			res.json({ msg: err.sqlMessage });
		}
		if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN" || result2[0].role == "USER") {
			let query1 = db.query(`SELECT * FROM entryhistory WHERE employeeID=${req.params.id}`, (err, hist) => {
				if (err) {
					res.json({ msg: err.sqlMessage });
				}
				let newNewEntryHistory = [];
				let newEntryHistory = [];
				let x = 0;
				if (hist) {
					newNewEntryHistory = JSON.parse(JSON.stringify(hist));
					newNewEntryHistory.map((el) => {
						if (el.salaryID == req.params.ids) {
							newEntryHistory.push(el);
						}
					});
					x = newEntryHistory.length - 1;
				}
				if (newEntryHistory[newEntryHistory.length - 1] && newEntryHistory[newEntryHistory.length - 1].exitDate == null) {
					if (new Date(newEntryHistory[newEntryHistory.length - 1].entryDate).getDate() == new Date().getDate()) {
						let query2 = db.query(
							`UPDATE entryhistory SET ? WHERE id=${newEntryHistory[newEntryHistory.length - 1].id}`,
							{ exitDate: new Date() },
							(err, new1) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								let query2 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { state: "out" }, (err, new1) => {
									if (err) {
										res.json({ msg: err.sqlMessage });
									}
									res.json({ msg: "Pointage de sortie enregistré" });
								});
							}
						);
					} else {
						let query7 = db.query(
							`SELECT * FROM connexionhistory WHERE userID=${newEntryHistory[newEntryHistory.length - 1].userID}`,
							(err, result3) => {
								if (err) {
									res.json({ msg: err.sqlMessage });
								}
								userLoggedHist = JSON.parse(JSON.stringify(result3));
								let query2 = db.query(
									`UPDATE entryhistory SET ? WHERE id=${newEntryHistory[newEntryHistory.length - 1].id}`,
									{ exitDate: new Date(userLoggedHist[userLoggedHist.length - 1].LogoutDate) },
									(err, new1) => {
										if (err) {
											res.json({ msg: err.sqlMessage });
										}
										let newEntry = {
											entryDate: new Date(),
											employeeID: req.params.id,
											salaryID: req.params.ids,
											userID: result2[0].id,
										};
										let query3 = db.query(`INSERT INTO entryhistory SET ?`, newEntry, (err, new2) => {
											let query2 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { state: "in" }, (err, new1) => {
												if (err) {
													res.json({ msg: err.sqlMessage });
												}
												res.json({ msg: "Pointage d'entré enregistré" });
											});
										});
									}
								);
							}
						);
					}
				} else {
					let newEntry = {
						entryDate: new Date(),
						employeeID: req.params.id,
						salaryID: req.params.ids,
						userID: result2[0].id,
					};
					let query3 = db.query(`INSERT INTO entryhistory SET ?`, newEntry, (err, new2) => {
						let query2 = db.query(`UPDATE employees SET ? WHERE id=${req.params.id}`, { state: "in" }, (err, new1) => {
							if (err) {
								res.json({ msg: err.sqlMessage });
							}
							res.json({ msg: "Pointage d'entré enregistré" });
						});
					});
				}
			});
		} else {
			res.json({ msg: "your are not authorised" });
		}
	});
});

module.exports = router;
