/*jshint esversion: 6 */
require("dotenv").config();
var CryptoJS = require("crypto-js");

const CipherRec = function (cipherrec) {
  console.log("Inside CipherRec Request Costructor ", cipherrec.phone);
  console.log("Inside CipherRec Request Costructor ", cipherrec.name);

  this.phone = cipherrec.phone;
  this.name = cipherrec.name;
};

CipherRec.genCipher = (cipherParams, result) => {
  console.log("CipherRec is called for", cipherParams.phone);
  console.log("CipherRec is called for", cipherParams.name);

  //var userRec = '{userrec: { phone: +919876500020 , name: Masha Bear }}';
  try {
    //throw new InternalError("Test Error");

    var userRec = `{"userrec": { "phone": "${cipherParams.phone}" , "name": "${cipherParams.name}" }}`;

    console.log("userRec is called for", userRec);

    var cipherText = CryptoJS.AES.encrypt(
      userRec,
      process.env.JWT_SECRET
    ).toString();

    console.log("cipherText is generated as", cipherText);

    result(null, cipherText);
  } catch (err) {
    console.log("Exception in Cipher Generation:", err);
    result(err, null);
  }
};

module.exports = CipherRec;
