const jwt = require("jsonwebtoken");
const jwtsecret = "secret";

module.exports = function (req, res, next) {
	const token = req.header("x-auth-token");
	if (!token) {
		res.json({ msg: "access denied" });
	}
	jwt.verify(token, jwtsecret, (err, decoded) => {
		if (err) {
			res.json({ msg: "access denied" });
		}
		req.user = decoded.user;
		next();
	});
};
