const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./connexion");

require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());

//init middleware
app.use(express.json());

// route

app.use("/api/user", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/abonne", require("./routes/Abonne"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/caisse", require("./routes/caisse"));
app.use("/api/buvette", require("./routes/buvette"));

let port = process.env.PORT || 5000;
app.listen(port, (err, data) => {
  if (err) throw err;
  console.log("server is running on port " + port);
});
