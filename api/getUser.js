require("dotenv").config();
const AWS = require("aws-sdk");
const DbQueryRequest = require("../services/db.query.service.js");
const jwt = require("jsonwebtoken");

const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({
  apiVersion: process.env.API_VERSION,
  region: process.env.AWS_REGION,
});

exports.poolid = (req, res) => {
  console.log("Username: ", req.body.user_name);
  try {
    const params = {
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: req.body.user_name,
    };
    cognitoIdentityService.adminListGroupsForUser(params, (err, grp) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        console.log(grp.Groups[0].GroupName);
        cognitoIdentityService.adminGetUser(params, (err, data) => {
          if (err) {
            res.json(err);
            console.log(err);
          } else {
            console.log(data);
            const dbqueryrequest = new DbQueryRequest({
              mode: "app-get-user",
              param_value: data.Username,
            });
            DbQueryRequest.dbCall(dbqueryrequest, (err, response) => {
              if (err) {
                console.log("Error Database Call: ", err);
              } else {
                console.log("Successfully Called Database", response);
                let token = jwt.sign(
                  {
                    doctorUid: response[0].doctorUid,
                    group: grp.Groups[0].GroupName,
                  },
                  process.env.JWT_SECRET,
                  {
                    algorithm: "HS256",
                    expiresIn: "12h",
                  }
                );
                res.send({ token: token, group: grp.Groups[0].GroupName });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.json(error);
  }
};
