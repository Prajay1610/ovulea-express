/**
 * http://usejsdoc.org/
 */
/*jshint esversion: 6 */

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./loggers/logger");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

//parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Curamatix Ovulea Application" });
});

//require("./routes/doctor.routes.js")(app);
//require("./routes/doctorsAvl.routes.js")(app);

require("./routes/comment.routes")(app);

//set port, listen for requests
app.listen(3001, () => {
  logger.log.info("Ovulea Server Is Running At Port 3001!");
  logger.log.debug("Testing Debug");
  logger.log.error("Testing Error");
  //logger.log.info(`${pjson.name} running -> PORT ${server.address().port}`);
  //console.log("Server is running on port 3001.");
});
