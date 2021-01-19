const sql = require("mysql");

const db = sql.createConnection({
  user: "root", //default is sa
  password: "",
  server: "196.179.47.196:22068", // for local machine
  database: "irongymdb", // name of database
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
