const HashGen = require("../api/hash.generator.js");
let hash;

verifyHash = (req, res) => {
  console.log("Inside verifyHash");

  let token = req.headers["x-access-token"];

  //   if (req.body.role == "Doctor") {
  //     req.body.mode = "doctor-create";
  //     next();
  //   } else {
  if (!token) {
    console.log("Inside Hash Token Found");
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  const hashgen = new HashGen({
    message: req.body.user_name,
    key: req.body.otp,
  });

  HashGen.genHash(hashgen, (err, data) => {
    if (err) {
      console.log("Error In OTP Hash Generation: ", err);

      res.status(500).send({
        message:
          err.message || "OTP Hash Could Not Be Genarated. Please Retry!",
      });
    } else {
      console.log("Successfully Generated OTP Hash", data);
      hash = data;

      if (hash == token) {
        res.json({ message: data });
      } else {
        return res.status(403).send({
          message: "Invalid OTP",
        });
      }
    }
  });
  //   }
};

const authHash = {
  verifyHash: verifyHash,
};

module.exports = authHash;
