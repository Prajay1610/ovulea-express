/*jshint esversion: 6 */
require("dotenv").config();
var CryptoJS = require("crypto-js");

const DeCipherRec = function (decipherrec) {
  console.log("Inside DeCipherRec Request Costructor ", decipherrec.ciphertext);

  this.cipherrec = decipherrec.ciphertext;
};

DeCipherRec.deCipher = (decipherParams, result) => {
  console.log("DeCipherRec is called for", decipherParams.cipherrec);

  try {
    //throw new InternalError("Test Error");

    var bytes = CryptoJS.AES.decrypt(
      decipherParams.cipherrec,
      process.env.JWT_SECRET
    );
    console.log("bytes:", bytes);

    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log("originalText", originalText);

    if (originalText === "") {
      console.log("Unable To Decipher. Please Regenerate AccessRec");
      result("Invalid Cipher", null);
    } else {
      console.log("Return originalText");
    }

    result(null, originalText);
  } catch (err) {
    console.log("Exception in DeCipher Generation:", err);
    result(err, null);
  }
};

module.exports = DeCipherRec;
