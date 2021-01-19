const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");
const { body, validationResult } = require("express-validator");
const db = require("../connexion");

const abonne = require("../models/Abonne");
const User = require("../models/User");
const employee = require("../models/Employee");
const Income = require("../models/Income");

//get all abonnes
router.get("/", auth, (req, res) => {
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (
        result2[0].role == "SUPERADMIN" ||
        result2[0].role == "ADMIN" ||
        result2[0].role == "USER"
      ) {
        let query1 = db.query(`SELECT * FROM abonnes`, (err, abonnes) => {
          if (err) {
            res.json({ msg: err.sqlMessage });
          }
          let query1 = db.query(`SELECT * FROM presences`, (err, pres) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            let allAbonnes = [];
            let allPresences = [];
            let allAbonnements = [];
            let newAllAbonnes = [];
            if (abonnes && pres) {
              allPresences = JSON.parse(JSON.stringify(pres));
              allAbonnes = JSON.parse(JSON.stringify(abonnes));
              let query1 = db.query(
                `SELECT * FROM abonnements`,
                (err, abonnements1) => {
                  if (err) {
                    res.json({ msg: err.sqlMessage });
                  }
                  allAbonnements = JSON.parse(JSON.stringify(abonnements1));
                  if (allAbonnements) {
                    let newAllAbonnements = [];
                    allAbonnements.map((el) => {
                      let pre = [];
                      allPresences.map((elem) => {
                        if (el.id == elem.abonnementId) {
                          pre.push(elem);
                        }
                      });
                      el = { ...el, presences: pre };
                      newAllAbonnements.push(el);
                    });
                    allAbonnes.map((el, i) => {
                      let abonnements = [];
                      newAllAbonnements.map((ele) => {
                        if (el.id == ele.abonneID) {
                          abonnements.push(ele);
                        }
                      });
                      newAllAbonnes.push({ ...el, abonnements: abonnements });
                    });
                    res.json(newAllAbonnes);
                  }
                }
              );
            }
          });
        });
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//get abonne
router.get("/:id", auth, (req, res) => {
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (
        result2[0].role == "SUPERADMIN" ||
        result2[0].role == "ADMIN" ||
        result2[0].role == "USER"
      ) {
        let query1 = db.query(
          `SELECT * FROM abonnes WHERE id = ${req.params.id}`,
          (err, abonnes) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            let allAbonnes = [];
            let allAbonnements = [];
            let allPresences = [];
            let newAllAbonne;
            if (abonnes) {
              allAbonnes = JSON.parse(JSON.stringify(abonnes));
              let query1 = db.query(
                `SELECT * FROM abonnements WHERE abonneID=${req.params.id}`,
                (err, abonnements1) => {
                  if (err) {
                    res.json({ msg: err.sqlMessage });
                  }
                  let query1 = db.query(
                    `SELECT * FROM presences WHERE abonneID=${req.params.id}`,
                    (err, presence) => {
                      if (err) {
                        res.json({ msg: err.sqlMessage });
                      }

                      allPresences = JSON.parse(JSON.stringify(presence));
                      allAbonnements = JSON.parse(JSON.stringify(abonnements1));
                      let newNewAllAbonnement = [];
                      allAbonnements.map((el) => {
                        let presences = [];
                        allPresences.map((ele) => {
                          if (el.id == ele.abonnementId) {
                            presences.push(ele);
                          }
                        });
                        el = { ...el, presences: presences };
                        newNewAllAbonnement.push(el);
                      });
                      newAllAbonne = {
                        ...allAbonnes[0],
                        abonnements: newNewAllAbonnement,
                      };
                      res.json(newAllAbonne);
                    }
                  );
                }
              );
            }
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//add abonnes
router.post(
  "/",
  [
    auth,
    [
      body("firstName").not().isEmpty(),
      body("lastName").not().isEmpty(),
      body("phoneNumber").not().isEmpty(),
    ],
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    let query = db.query(
      `SELECT * FROM users WHERE login='${req.user.id}'`,
      (err, result2) => {
        if (err) {
          res.json({ msg: err.sqlMessage });
        }
        if (
          result2[0].role == "SUPERADMIN" ||
          result2[0].role == "ADMIN" ||
          result2[0].role == "USER"
        ) {
          const { firstName, lastName, phoneNumber } = req.body;
          const credit = 0;
          const userLogedIn = result2[0].firstName + " " + result2[0].lastName;
          const date = new Date();
          const newAbonne = {
            userLogedIn,
            firstName,
            lastName,
            phoneNumber,
            credit,
            date,
          };
          let query1 = db.query(
            `INSERT INTO abonnes SET ?`,
            newAbonne,
            (err, newAbonne) => {
              if (err) {
                res.json({ msg: err.sqlMessage });
              }
              res.json({ msg: "OK", abonne: newAbonne });
            }
          );
        } else {
          res.json({ msg: "your are not authorised" });
        }
      }
    );
  }
);

//delete abonnes
router.delete("/:id", auth, (req, res) => {
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
        let query1 = db.query(
          `DELETE FROM abonnes WHERE id=${req.params.id}`,
          (err, newUser) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            let query2 = db.query(
              `DELETE FROM abonnements WHERE abonneID=${req.params.id}`,
              (err, newUser) => {
                if (err) {
                  res.json({ msg: err.sqlMessage });
                }
                let query3 = db.query(
                  `DELETE FROM presences WHERE abonneID=${req.params.id}`,
                  (err, newUser) => {
                    if (err) {
                      res.json({ msg: err.sqlMessage });
                    }
                    res.json({ msg: "OK" });
                  }
                );
              }
            );
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//edit abonne
router.put("/:id", auth, (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  let abonnePut = {};
  if (firstName) abonnePut.firstName = firstName;
  if (lastName) abonnePut.lastName = lastName;
  if (phoneNumber) abonnePut.phoneNumber = phoneNumber;
  abonnePut.credit = 0;
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
        let query1 = db.query(
          `UPDATE abonnes SET ? WHERE id='${req.params.id}'`,
          abonnePut,
          (err, newData) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            } else {
              res.json({ msg: `OK` });
            }
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//add abonnement
router.put(
  "/:id/abonnement",
  auth,
  [
    body("departement").not().isEmpty(),
    body("abType").not().isEmpty(),
    body("price").not().isEmpty(),
    body("pay").not().isEmpty(),
    body("date").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    let query = db.query(
      `SELECT * FROM users WHERE login='${req.user.id}'`,
      (err, result2) => {
        if (err) {
          res.json({ msg: err.sqlMessage });
        }
        if (
          result2[0].role == "SUPERADMIN" ||
          result2[0].role == "ADMIN" ||
          result2[0].role == "USER"
        ) {
          const { departement, abType, pay, price, date } = req.body;
          let abonnementPut = {};
          if (departement) abonnementPut.departement = departement;
          if (abType) abonnementPut.abType = abType;
          if (price) abonnementPut.price = price;
          if (pay) abonnementPut.pay = pay;
          if (date) abonnementPut.date = date;
          abonnementPut.abonneID = req.params.id;
          abonnementPut.incomeID =
            req.params.id +
            "" +
            new Date().getFullYear() +
            "" +
            new Date().getMonth() +
            "" +
            new Date().getDate() +
            "" +
            new Date().getHours() +
            "" +
            new Date().getMinutes() +
            "" +
            new Date().getSeconds() +
            "" +
            new Date().getMilliseconds();
          let IncomeID = abonnementPut.incomeID;
          let query1 = db.query(
            `INSERT INTO abonnements SET ?`,
            abonnementPut,
            (err, newAbonnement) => {
              if (err) {
                res.json({ msg: err.sqlMessage });
              }
              let query2 = db.query(
                `SELECT credit FROM abonnes WHERE id=${req.params.id}`,
                abonnementPut,
                (err, credit0) => {
                  if (err) {
                    res.json({ msg: err.sqlMessage });
                  }
                  let newCredit = credit0[0].credit + (price - pay);
                  let query3 = db.query(
                    `UPDATE abonnes SET ? WHERE id='${req.params.id}'`,
                    { credit: newCredit },
                    (err, dat) => {
                      if (err) {
                        res.json({ msg: err.sqlMessage });
                      }
                      let query4 = db.query(
                        `SELECT * FROM employees WHERE jobTitle='${departement}'`,
                        (err, empl) => {
                          if (err) {
                            res.json({ msg: err.sqlMessage });
                          }
                          if (empl[0]) {
                            let employe = JSON.parse(JSON.stringify(empl))[0];

                            let query5 = db.query(
                              `SELECT * FROM salarys WHERE employeeID=${employe.id}`,
                              (err, sala) => {
                                if (err) {
                                  res.json({ msg: err.sqlMessage });
                                }

                                if (sala) {
                                  let salar = JSON.parse(JSON.stringify(sala));
                                  let newSala = 0;
                                  let test = 0;
                                  let idel = 0;
                                  let nowyear = new Date().getFullYear();
                                  let nowmonth = new Date().getMonth();
                                  salar.map((el) => {
                                    if (
                                      el.year === nowyear &&
                                      el.month === nowmonth + 1
                                    ) {
                                      newSala =
                                        el.salary + pay * (employe.part / 100);
                                      test += 1;
                                      idel = el.id;
                                    }
                                  });
                                  if (test !== 0) {
                                    let query6 = db.query(
                                      `UPDATE salarys SET ? WHERE id=${idel}`,
                                      { salary: newSala },
                                      (err, newsala) => {
                                        if (err) {
                                          res.json({ msg: err.sqlMessage });
                                        }
                                        let query8 = db.query(
                                          `UPDATE employees SET ? WHERE id=${employe.id}`,
                                          {
                                            rest:
                                              employe.rest +
                                              pay * (employe.part / 100),
                                          },
                                          (err, newsala) => {
                                            if (err) {
                                              res.json({ msg: err.sqlMessage });
                                            }
                                            res.json({
                                              msg: "OK",
                                              incomeID: IncomeID,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  } else {
                                    let newSalaryAdded = {
                                      salary: pay * (employe.part / 100),
                                      year: new Date(date).getFullYear(),
                                      month: new Date(date).getMonth() + 1,
                                      employeeID: employe.id,
                                    };
                                    let query7 = db.query(
                                      `INSERT INTO salarys SET ?`,
                                      newSalaryAdded,
                                      (err, newsala) => {
                                        if (err) {
                                          res.json({ msg: err.sqlMessage });
                                        }
                                        let query9 = db.query(
                                          `UPDATE employees SET ? WHERE id=${employe.id}`,
                                          {
                                            rest:
                                              employe.rest +
                                              pay * (employe.part / 100),
                                          },
                                          (err, newsala) => {
                                            if (err) {
                                              res.json({ msg: err.sqlMessage });
                                            }
                                            res.json({
                                              msg: "OK",
                                              incomeID: IncomeID,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  }
                                }
                              }
                            );
                          } else {
                            res.json({ msg: "OK", incomeID: IncomeID });
                          }
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        } else {
          res.json({ msg: "your are not authorised" });
        }
      }
    );
  }
);

//edit abonnement
router.put("/:id/abonnement/:ida", auth, (req, res) => {
  const { pay } = req.body;
  let abonnementUpdated = {};
  let abind;
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (
        result2[0].role == "SUPERADMIN" ||
        result2[0].role == "ADMIN" ||
        result2[0].role == "USER"
      ) {
        let query1 = db.query(
          `SELECT * FROM abonnements WHERE id=${req.params.ida}`,
          (err, abonnemen) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            let query2 = db.query(
              `SELECT * FROM abonnes WHERE id=${req.params.id}`,
              (err, abonn) => {
                if (err) {
                  res.json({ msg: err.sqlMessage });
                }
                if (abonn && abonnemen) {
                  let oldAbonnement = JSON.parse(JSON.stringify(abonnemen))[0];
                  let oldAbonne = JSON.parse(JSON.stringify(abonn))[0];
                  let query4 = db.query(
                    `UPDATE abonnements SET ? WHERE id=${req.params.ida}`,
                    { pay: oldAbonnement.pay + pay },
                    (err, abonn2) => {
                      if (err) {
                        res.json({ msg: err.sqlMessage });
                      }
                      let query5 = db.query(
                        `UPDATE abonnes SET ? WHERE id=${req.params.id}`,
                        { credit: oldAbonne.credit - pay },
                        (err, abonn3) => {
                          if (err) {
                            res.json({ msg: err.sqlMessage });
                          }

                          let query3 = db.query(
                            `SELECT * FROM employees WHERE jobTitle='${oldAbonnement.departement}'`,
                            (err, empl) => {
                              if (err) {
                                res.json({ msg: err.sqlMessage });
                              }
                              if (empl[0]) {
                                let theEmpl = JSON.parse(
                                  JSON.stringify(empl)
                                )[0];
                                let query7 = db.query(
                                  `SELECT * FROM salarys WHERE employeeID=${theEmpl.id}`,
                                  (err, salas) => {
                                    if (err) {
                                      res.json({ msg: err.sqlMessage });
                                    }
                                    if (salas) {
                                      let allSalas = JSON.parse(
                                        JSON.stringify(salas)
                                      );
                                      let salarID = 0;
                                      let oldSalary = 0;
                                      allSalas.map((el) => {
                                        if (
                                          el.year ===
                                            new Date(
                                              oldAbonnement.date
                                            ).getFullYear() &&
                                          el.month ===
                                            new Date(
                                              oldAbonnement.date
                                            ).getMonth() +
                                              1
                                        ) {
                                          salarID = el.id;
                                          oldSalary = el.salary;
                                        }
                                      });
                                      let query6 = db.query(
                                        `UPDATE salarys SET ? WHERE id=${salarID}`,
                                        {
                                          salary:
                                            oldSalary +
                                            pay * (theEmpl.part / 100),
                                        },
                                        (err, abonn1) => {
                                          if (err) {
                                            res.json({ msg: err.sqlMessage });
                                          }
                                          let query6 = db.query(
                                            `UPDATE employees SET ? WHERE id=${theEmpl.id}`,
                                            {
                                              rest:
                                                theEmpl.rest +
                                                pay * (theEmpl.part / 100),
                                            },
                                            (err, abonn1) => {
                                              if (err) {
                                                res.json({
                                                  msg: err.sqlMessage,
                                                });
                                              }
                                              res.json({
                                                msg: "OK",
                                                incomeID:
                                                  oldAbonnement.incomeID,
                                                abName:
                                                  oldAbonne.firstName +
                                                  " " +
                                                  oldAbonne.lastName,
                                              });
                                            }
                                          );
                                        }
                                      );
                                    }
                                  }
                                );
                              } else {
                                res.json({
                                  msg: "OK",
                                  incomeID: oldAbonnement.incomeID,
                                  abName:
                                    oldAbonne.firstName +
                                    " " +
                                    oldAbonne.lastName,
                                });
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//delete abonnement
router.delete("/:id/abonnement/:ida", auth, (req, res) => {
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
        let query2 = db.query(
          `SELECT * FROM abonnements WHERE id='${req.params.ida}'`,
          (err, abonnem) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            if (abonnem) {
              let thisAbonnement = JSON.parse(JSON.stringify(abonnem))[0];
              let query1 = db.query(
                `SELECT * FROM employees WHERE jobTitle='${thisAbonnement.departement}'`,
                (err, empl) => {
                  if (err) {
                    res.json({ msg: err.sqlMessage });
                  }
                  if (empl[0]) {
                    let thisEmployee = JSON.parse(JSON.stringify(empl))[0];
                    let query3 = db.query(
                      `SELECT * FROM salarys WHERE employeeID='${thisEmployee.id}'`,
                      (err, sals) => {
                        if (err) {
                          res.json({ msg: err.sqlMessage });
                        }
                        if (sals) {
                          let allSalary = JSON.parse(JSON.stringify(sals));
                          let theSalary = {};
                          allSalary.map((el) => {
                            if (
                              el.year ===
                                new Date(thisAbonnement.date).getFullYear() &&
                              el.month ===
                                new Date(thisAbonnement.date).getMonth() + 1
                            ) {
                              theSalary = el;
                            }
                          });
                          if (theSalary.id) {
                            let query4 = db.query(
                              `UPDATE salarys SET ? WHERE id=${theSalary.id}`,
                              {
                                salary:
                                  theSalary.salary -
                                  thisAbonnement.pay *
                                    (thisEmployee.part / 100),
                              },
                              (err, abonn1) => {
                                if (err) {
                                  res.json({ msg: err.sqlMessage });
                                }
                                let query5 = db.query(
                                  `DELETE FROM abonnements WHERE id=${req.params.ida}`,
                                  (err, newUser) => {
                                    if (err) {
                                      res.json({ msg: err.sqlMessage });
                                    }

                                    let query6 = db.query(
                                      `DELETE FROM incomes WHERE abonnementId=${thisAbonnement.incomeID}`,
                                      (err, newUser) => {
                                        if (err) {
                                          res.json({ msg: err.sqlMessage });
                                        }
                                        let query3 = db.query(
                                          `DELETE FROM presences WHERE abonnementId=${req.params.ida}`,
                                          (err, newUser) => {
                                            if (err) {
                                              res.json({ msg: err.sqlMessage });
                                            }
                                            let query6 = db.query(
                                              `UPDATE employees SET ? WHERE id=${thisEmployee.id}`,
                                              {
                                                rest:
                                                  thisEmployee.rest -
                                                  thisAbonnement.pay *
                                                    (thisEmployee.part / 100),
                                              },
                                              (err, abonn1) => {
                                                if (err) {
                                                  res.json({
                                                    msg: err.sqlMessage,
                                                  });
                                                }
                                                let query1 = db.query(
                                                  `SELECT * FROM abonnes WHERE id='${req.params.id}'`,
                                                  (err, ab) => {
                                                    if (err) {
                                                      res.json({
                                                        msg: err.sqlMessage,
                                                      });
                                                    }
                                                    let theAbonne = JSON.parse(
                                                      JSON.stringify(ab)
                                                    )[0];
                                                    let newCredit =
                                                      theAbonne.credit -
                                                      (thisAbonnement.price -
                                                        thisAbonnement.pay);
                                                    let query3 = db.query(
                                                      `UPDATE abonnes SET ? WHERE id='${req.params.id}'`,
                                                      { credit: newCredit },
                                                      (err, dat) => {
                                                        if (err) {
                                                          res.json({
                                                            msg: err.sqlMessage,
                                                          });
                                                        }
                                                        res.json({ msg: "OK" });
                                                      }
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          } else {
                            let query7 = db.query(
                              `DELETE FROM abonnements WHERE id=${req.params.ida}`,
                              (err, newUser) => {
                                if (err) {
                                  res.json({ msg: err.sqlMessage });
                                }
                                let query8 = db.query(
                                  `DELETE FROM incomes WHERE abonnementId=${thisAbonnement.incomeID}`,
                                  (err, newUser) => {
                                    if (err) {
                                      res.json({ msg: err.sqlMessage });
                                    }
                                    let query1 = db.query(
                                      `SELECT * FROM abonnes WHERE id='${req.params.id}'`,
                                      (err, ab) => {
                                        if (err) {
                                          res.json({ msg: err.sqlMessage });
                                        }
                                        let theAbonne = JSON.parse(
                                          JSON.stringify(ab)
                                        )[0];
                                        let newCredit =
                                          theAbonne.credit -
                                          (thisAbonnement.price -
                                            thisAbonnement.pay);
                                        let query3 = db.query(
                                          `UPDATE abonnes SET ? WHERE id='${req.params.id}'`,
                                          { credit: newCredit },
                                          (err, dat) => {
                                            if (err) {
                                              res.json({ msg: err.sqlMessage });
                                            }
                                            res.json({ msg: "OK" });
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              }
                            );
                          }
                        }
                      }
                    );
                  } else {
                    let query2 = db.query(
                      `DELETE FROM abonnements WHERE id=${req.params.ida}`,
                      (err, newUser) => {
                        if (err) {
                          res.json({ msg: err.sqlMessage });
                        }
                        let query2 = db.query(
                          `DELETE FROM incomes WHERE abonnementId=${thisAbonnement.incomeID}`,
                          (err, newUser) => {
                            if (err) {
                              res.json({ msg: err.sqlMessage });
                            }
                            let query1 = db.query(
                              `SELECT * FROM abonnes WHERE id='${req.params.id}'`,
                              (err, ab) => {
                                if (err) {
                                  res.json({ msg: err.sqlMessage });
                                }
                                let theAbonne = JSON.parse(
                                  JSON.stringify(ab)
                                )[0];
                                let newCredit =
                                  theAbonne.credit -
                                  (thisAbonnement.price - thisAbonnement.pay);
                                let query3 = db.query(
                                  `UPDATE abonnes SET ? WHERE id='${req.params.id}'`,
                                  { credit: newCredit },
                                  (err, dat) => {
                                    if (err) {
                                      res.json({ msg: err.sqlMessage });
                                    }
                                    res.json({ msg: "OK" });
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

//add presence
router.put("/:id/presence/:ida", auth, (req, res) => {
  console.log(req.user);
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (
        result2[0].role == "SUPERADMIN" ||
        result2[0].role == "ADMIN" ||
        result2[0].role == "USER"
      ) {
        let newPresence = {
          date: new Date(),
          abonneID: req.params.id,
          abonnementId: req.params.ida,
        };
        let query1 = db.query(
          `INSERT INTO presences SET ?`,
          newPresence,
          (err, newUser) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            res.json({ msg: "OK" });
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});
//delete presence
router.delete("/:id/presence/:ida/:idp", auth, (req, res) => {
  let query = db.query(
    `SELECT role FROM users WHERE login='${req.user.id}'`,
    (err, result2) => {
      if (err) {
        res.json({ msg: err.sqlMessage });
      }
      if (result2[0].role == "SUPERADMIN" || result2[0].role == "ADMIN") {
        let query1 = db.query(
          `DELETE FROM presences WHERE id=${req.params.idp}`,
          (err, newUser) => {
            if (err) {
              res.json({ msg: err.sqlMessage });
            }
            res.json({ msg: "présence supprimé" });
          }
        );
      } else {
        res.json({ msg: "your are not authorised" });
      }
    }
  );
});

module.exports = router;
