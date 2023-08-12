/*jshint esversion: 6 */

console.log("Payment Preprocessor");

const logger = require(".././loggers/logger");
// const awsConfig = require('../config/aws.config.js');
console.log("Base Directory", __dirname);
const DbQueryRequest = require("../services/db.query.service.js");
const DeCipherRec = require("../api/decipherrec.generator.js");

require("dotenv").config({ path: __dirname + "/../.env" });
global.fetch = require("node-fetch");

let userDeCipher;
let userCipher;

prePayProcess = (req, res, next) => {
  console.log("Inside prePayProcess");
  console.log("Appoitment Uid:", req.body.appointmentUid);
  console.log("PatientUid:", req.body.patientUid);

  //Added to get patient contact information

  // Create a Database User
  const dbqueryrequest = new DbQueryRequest({
    mode: "find-by-patient-details",
    param_value: req.body.patientUid,
  });

  DbQueryRequest.dbCall(dbqueryrequest, (err, data) => {
    if (err) {
      console.log("Error Database Call: ", err);
      logger.log.info("Error Database Call:", err);
      /* res.status(500).send({
		        message:
		          err.message || "Some error occurred while creating the User."
		      });*/
    } else {
      console.log("Successfully Called Database", data);
      logger.log.info("Successfully Called Database:", toString(data));

      userCipher = data.userDetails[0]["userInfo"];

      console.log("Returned User Cipher", userCipher);

      //Generate Decipher Start
      const decipherrec = new DeCipherRec({
        ciphertext: userCipher,
      });

      DeCipherRec.deCipher(decipherrec, (err, result) => {
        if (err) {
          console.log("Error In Decipher Record Gearation: ", err);
          logger.log.info("Error In Decipher Record Gearation:", err);
        } else {
          console.log("Success In Decipher Record Gearation:", result);
          logger.log.info(
            "Success In Decipher Record Gearation:",
            toString(result)
          );

          userDeCipher = result;

          if (userDeCipher == null) {
            console.log(
              "Returned Null DeCipher, Setting Value to Default Empty JSON {}"
            );
            userDeCipher = "{}";
          }
        }
      });
      //Generate Decipher Record End

      console.log(
        "Deciphered User Value:",
        JSON.parse(userDeCipher).userrec.phone
      );
      req.body.contact = JSON.parse(userDeCipher).userrec.phone;
      console.log("Deciphered payUserPhone:", req.body.contact);

      req.body.name = JSON.parse(userDeCipher).userrec.name;
      console.log("Deciphered payUserName:", req.body.name);
      //payUserEmail = JSON.parse(userDeCipher).userrec.email;

      req.body.email = "dummy@dummy.com";
      // req.body.email = JSON.parse(userDeCipher).userrec.email;
      //res.send({ uid_text: data.userDetails[0]["uid_text"], userDeCipher });

      next();
      //res.send(data);
    }
  });

  //Added to get patient contact information

  //next();
};

const prePayProc = {
  prePayProcess: prePayProcess,
};

module.exports = prePayProc;
