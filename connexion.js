const sql = require("mysql");

const db = sql.createConnection({
  user: "223697_Mahdi", //default is sa
  password: "Mahdi1234",
  server: "mysql-mahdislimane.alwaysdata.net", // for local machine
  database: "mahdislimane_irongymdb", // name of database
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
});
db.connect(
  // db,
  // { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) throw err;
    console.log("database connected....");
  }
);
module.exports = db;
