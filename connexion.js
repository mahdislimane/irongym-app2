const sql = require("mysql");

const db = sql.createConnection({
	user: "root", //default is sa
	password: "",
	server: "localhost", // for local machine
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
