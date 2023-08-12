/*jshint esversion: 6 */

// const dbConfig = require("../config/db.config");
const axios = require("axios");

const DbQueryRequest = function (dbqueryreq) {
  console.log("Inside Database Request Costructor ", dbqueryreq.mode);
  console.log("Inside Database Request Costructor ", dbqueryreq.param_value);

  this.mode = dbqueryreq.mode;
  this.param_value = dbqueryreq.param_value;
  this.contactId = dbqueryreq.contactId;
};

DbQueryRequest.dbCall = (dbParams, result) => {
  console.log("DbRequest is called for", dbParams.mode);
  console.log("DbRequest is called for", dbParams.param_value);

  if (dbParams.mode === "get-comment-rec") {
    url = `http://localhost:3002/comment/date/today`;
  }

  if (dbParams.mode === "update-contact-rec") {
    url = `http://localhost:3002/crm/v3/objects/contacts/:${dbParams.contactId}`;
  }
  var dataArray = [];
  axios
    .get(url)
    .then((response) => {
      // console.log(response);

      result(null, response.data);
      dataArray = response.data;
      // console.log(dataArray);

      // console.log(dataArray);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = DbQueryRequest;
