/*jshint esversion: 6 */

console.log("Inside Hash Verifier");
const HashGen = require("../api/hash.generator.js");
const logger = require(".././loggers/logger");
let hash;

verifyHash = (req, res, next) => {
  console.log("Inside verifyHash");

  let token = req.headers["x-access-token"];

  if (req.body.role == "Doctor") {
    req.body.mode = "doctor-create";
    next();
  }
  if (req.body.role == "Receptionist") {
    req.body.mode = "recep-create";
    next();
  } else {
    if (!token) {
      console.log("Inside Hash Token Found");
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    //Call Hash Generator For OTP Start

    const hashgen = new HashGen({
      message: req.body.user_name,
      key: req.body.otp,
    });

    //Return OTP To Calling Application
    HashGen.genHash(hashgen, (err, data) => {
      if (err) {
        console.log("Error In OTP Hash Generation: ", err);
        logger.log.info("Error In OTP Hash Generation:", err);

        res.status(500).send({
          message:
            err.message || "OTP Hash Could Not Be Genarated. Please Retry!",
        });
      } else {
        console.log("Successfully Generated OTP Hash", data);
        logger.log.info("Successfully Generated OTP Hash", data);
        hash = data;

        if (hash == token) {
          next();
        } else {
          return res.status(403).send({
            message: "Invalid OTP",
          });
        }
      }
    });

    //Call Hash Generator For OTP End
  }

  //next();

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

const authHash = {
  verifyHash: verifyHash,
};

module.exports = authHash;
