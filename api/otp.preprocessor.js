require("dotenv").config();
const AWS = require("aws-sdk");
const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({
  apiVersion: process.env.API_VERSION,
  region: process.env.AWS_REGION,
});

console.log("Inside OTP preprocessor");

exports.preotp = async (req, res) => {
  console.log("Username: ", req.body.user_name);
  try {
    const params = {
      UserPoolId: process.env.COGNITO_POOL_ID,
      Username: req.body.user_name,
    };
    cognitoIdentityService.adminGetUser(params, (err, data) => {
      if (err) {
        if (err.statusCode === 400) {
          console.log(err.statusCode);
          res.json({ message: "INVALID" });
        }
      } else {
        if (data.UserStatus === "CONFIRMED") {
          console.log(data.UserStatus);
          res.json({ message: "CONFIRMED" });
        }
      }
    });
  } catch (error) {
    res.json(error);
  }
};
