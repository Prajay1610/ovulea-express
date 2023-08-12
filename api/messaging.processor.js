require("dotenv").config();
const DbQueryRequest = require("../services/db.query.service.js");
const DeCipherRec = require("../api/decipherrec.generator.js");
console.log("Inside messaging processor");
const whatsAppMessenger = require("../services/whatsAppMessenger.js");
const logger = require(".././loggers/logger");

exports.messaging = async (req, res, next) => {
  console.log(req.body.doctorUid);
  let doctorUid = req.body.doctorUid;
  let docObj = "";
  let docPhone = "";

  if (req.body.event_type === "new" || "") {
    try {
      const dbqueryrequest = new DbQueryRequest({
        mode: "get-docdetail",
        param_value: req.body.doctorUid,
      });

      DbQueryRequest.dbCall(dbqueryrequest, (err, data) => {
        if (err) {
          console.log("Error db call: ", err);
        } else {
          console.log("Successfully called db", data);
          userCipher = data[0]["docInfo"];
          console.log("Returned Doctor Cipher", userCipher);

          const decipherrec = new DeCipherRec({
            ciphertext: userCipher,
          });

          DeCipherRec.deCipher(decipherrec, (err, result) => {
            if (err) {
              console.log("Error in decipher record generation: ", err);
            } else {
              console.log("Success in decipher record generation: ", result);
              docObj = JSON.parse(result);
              console.log(docObj["userrec"]["phone"]);
              docPhone = docObj["userrec"]["phone"];
            }

            userDeCipher = result;

            if (userDeCipher == null) {
              console.log("Returned null decipher, setting value to {}");
              userDeCipher = "{}";
            }
          });
          console.log("Doctor Contact:", docPhone);
          //console.log(result[0]["phone"]);

          //Call Messaging API

          let whatsappmessenger = new whatsAppMessenger({
            from_phone: process.env.FROM_PHONE,
            to_phone: docPhone,
            text:
              "A New Appointment Has Been Booked For " +
              req.body.inviteeName +
              " at time " +
              req.body.scheduleTimeWA,
            link: ". Callback to follow-up at " + req.body.inviteeNumber,
          });
          whatsAppMessenger.send(whatsappmessenger, (err, data) => {
            if (err) {
              console.log(
                "Error In Sending Appointment Booking Message: ",
                err
              );
              logger.log.info(
                "Error In Sending Appointment Booking Message:",
                err
              );

              res.status(500).send({
                message:
                  err.message || "Appointment Message Could Not Be Sent.",
              });
            } else {
              console.log("Successfully Sent Appointment Confirmation", data);
              logger.log.info(
                "Successfully Sent Appointment Confirmation",
                data
              );
            }
          });

          next();

          //res.send({ uid_text: data[0]["docInfo"], userDeCipher });
        }
      });
    } catch (error) {
      res.json(error);
    }
  } else if (req.body.event_type === "updated") {
    console.log(req.body.doctorUid);
    console.log(req.body.phone);
    let whatsappmessenger = new whatsAppMessenger({
      from_phone: process.env.FROM_PHONE,
      to_phone: req.body.phone,
      text: `Your existing appointment at ${req.body.former_date} is updated at ${req.body.updated_date}`,
      link: "",
    });
    whatsAppMessenger.send(whatsappmessenger, (err, data) => {
      if (err) {
        console.log("Error In Sending Appointment Booking Message: ", err);
        res.status(500).send({
          message: err.message || "Appointment Message Could Not Be Sent.",
        });
      } else {
        console.log("Successfully Sent Appointment Confirmation", data);
      }
    });
  } else if (req.body.event_type === "cancelled") {
    console.log(req.body.doctorUid);
    console.log(req.body.phone);
    let whatsappmessenger = new whatsAppMessenger({
      from_phone: process.env.FROM_PHONE,
      to_phone: docPhone,
      text: `Your existing appointment at ${req.body.date} is cancelled`,
      link: "",
    });
    whatsAppMessenger.send(whatsappmessenger, (err, data) => {
      if (err) {
        console.log("Error In Sending Appointment Booking Message: ", err);
        res.status(500).send({
          message: err.message || "Appointment Message Could Not Be Sent.",
        });
      } else {
        console.log("Successfully Sent Appointment Confirmation", data);
      }
    });
  }
};
