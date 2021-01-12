const sql = require("mysql");

const db = sql.createConnection({
  user: "223697", //default is sa
  password: "",
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
