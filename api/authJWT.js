/*jshint esversion: 6 */
require("dotenv").config();
console.log("Inside JWT Auth");

const logger = require(".././loggers/logger");
const jwt = require("jsonwebtoken");
let uid;
let group;

verifyJWT = (req, res, next) => {
  console.log("Inside authJWT");

  let token = req.headers["x-access-token"];
  console.log("JWT Token Received:", token);

  if (!token) {
    console.log("Inside Hash Token Found");
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  //Verify The JWT Start

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err) {
      console.log("Inside Invalid Token"); //Fix this verification
    } else {
      console.log("Valid Token:", decoded);
    }
  });
  //Verify The JWT End

  uid = jwt.decode(token, { complete: true }).payload.uid;
  console.log("UID:", uid);
  group = jwt.decode(token, { complete: true }).payload.group;
  console.log("Group:", group);

  if (group == "Doctor") {
    req.body.doctorUid = uid;
  }
  if (group === "Receptionist") {
    req.body.recepUid = uid;
  } else {
    req.body.patientUid = uid;
  }

  next();

  /*jwt.verify(token,config.secret, (err,decoded) =>{
		if(err) {
			console.log("Inside authJwt Invalid Token");
			return res.status(401).send({
				message: "Unauthorized!"
			});
		}
		req.userId = decoded.id;
		next();
	});*/
};

const authJWT = {
  verifyJWT: verifyJWT,
};

module.exports = authJWT;
