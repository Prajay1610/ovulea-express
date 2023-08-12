/*jshint esversion: 6 */
const logger = require("../loggers/logger");
const authJWT = require("../api/authJWT.js");

console.log("Inside Comment Routes");
logger.log.info("Inside comment Routes");

module.exports = (app) => {
  // const patientrec = require("../controllers/patient.controller.js");
  const commentrec = require("../controllers/comment.controller.js");
  const compostrec = require("../controllers/comment.controller");
  const contactupdrec = require("../controllers/comment.controller");
  // const updatepatient = require("../controllers/comment.controller");

  //Added Header Validation
  app.use(function (req, res, next) {
    res.status(404);
    res.send({
      error: "Not Found",
    });
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //Added Header Validation
  console.log("Passed Header Routes");

  //Get Comments of Current Date

  app.get("/getcomments", commentrec.getCommentrec);

  //post data by date to hubspot

  app.post("/posttoHs", compostrec.postdata);

  //update contact fields

  app.patch("/updatefields/:contactId", contactupdrec.updatecontfields);
};
