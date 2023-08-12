/*jshint esversion: 6 */

// const dbConfig = require("../config/db.config");
const axios = require("axios");
let url;
let jsonData;

const DbRequest = function (dbqueryreq) {
  console.log("Inside Database Request Costructor ", dbqueryreq.mode);
  console.log("Inside Database Request Costructor ", dbqueryreq.param_value);

  this.mode = dbqueryreq.mode;
  this.param_value = dbqueryreq.param_value;
  this.score = dbqueryreq.score;
  this.sentiment = dbqueryreq.sentiment;
  console.log(`Test before ${dbqueryreq.score}`);
};

DbRequest.dbCall = async (dbParams, result) => {
  try {
    console.log("DbRequest is called for", dbParams.mode);
    console.log("DbRequest is called for", dbParams.param_value);

    if (dbParams.mode == "update-contact-rec") {
      url = `https://api.hubapi.com/crm/v3/objects/contacts/${dbParams.param_value}`;
      jsonData = {
        properties: {
          score: dbParams.score,
          sentiment: dbParams.sentiment,
        },
      };

      console.log(`my params ${dbParams.score},${dbParams.sentiment}`);
      // Set up the request headers
      const headers = {
        Authorization: `Bearer pat-eu1-a21eaa12-0169-4b7d-b3ac-e2a9e980189d`, // Replace with your access token
        "Content-Type": "application/json",
      };

      const response = await axios.patch(url, jsonData, { headers });
      console.log(response.data);
      result(null, response.data); // Assuming you're passing back data to the callback
      // res.json(response);
    }
  } catch (error) {
    // console.error("Error updating field:", error.response.data);
    result(error.response, null); // Passing back the error to the callback
  }
};

module.exports = DbRequest;
