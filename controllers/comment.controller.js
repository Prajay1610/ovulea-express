/*jshint esversion: 6 */

const logger = require("../loggers/logger");
const DbRequest = require("../services/db.service.js");
const DbQueryRequest = require("../services/db.query.service.js");
const hubspotApiKey = "pat-eu1-a21eaa12-0169-4b7d-b3ac-e2a9e980189d"; // Replace with your actual bearer token
const hubspotApiBaseUrl = "https://api.hubapi.com/";
const axios = require("axios");

let sharedData = null;
// Get the current URL

//Get The Comment By Date
exports.getCommentrec = (req, res) => {
  const dbqueryrequest = new DbQueryRequest({
    mode: "get-comment-rec",
  });

  DbQueryRequest.dbCall(dbqueryrequest, (err, data) => {
    if (err) {
      console.log("Error db call: ", err);
    } else {
      console.log("Successfully called db", data.userDetails[0].repId);
      // res.send(data);
      sharedData = data;
      res.send(sharedData);
    }
  });
};

//Post the comments by currentdate to hubspot
exports.postdata = async (req, res) => {
  console.log("inside postdata logic");
  try {
    // Format the data for batch creation

    // Array to store the responses from HubSpot
    const responses = [];

    for (const comment of sharedData.userDetails) {
      const requestBody = {
        properties: {
          hs_timestamp: comment.created_at,
          hs_note_body: comment.comment,
        },
        associations: [
          {
            to: {
              id: comment.hubspotId,
              type: "CONTACT",
            },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 202,
              },
            ],
          },
        ],
      };

      // Making a  request to HubSpot using axios
      const response = await axios.post(
        `${hubspotApiBaseUrl}crm/v3/objects/notes`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${hubspotApiKey}`,
          },
        }
      );
      console.log(requestBody);
      responses.push(response.data);
    }
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error posting data to HubSpot." });
  }
};

//update contact fields

exports.updatecontfields = (req, res) => {
  console.log(`Inside update field logic`);
  console.log(`my req body ${req.body.properties.score}`);
  const dbqueryrequest = new DbRequest({
    mode: "update-contact-rec",
    param_value: req.params.contactId,
    score: req.body.properties.score,
    sentiment: req.body.properties.sentiment,
  });

  DbRequest.dbCall(dbqueryrequest, (err, data) => {
    if (err) {
      console.log("Error db call: ", err);
    } else {
      console.log("Successfully called db", toString(data));
      res.json(data);
    }
  });
};
