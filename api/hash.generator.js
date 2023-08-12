/*jshint esversion: 6 */

var CryptoJS = require("crypto-js");


const HashGen = function (hashgen) {
  console.log("Inside HashGen Request Costructor ", hashgen.message);
  console.log("Inside HashGen Request Costructor ", hashgen.key);

  this.message = hashgen.message;
  this.key = hashgen.key;
};

HashGen.genHash =  (hashParams, result) => {
	
  console.log("HashGen is called for",hashParams.message);
  console.log("HashGen is called for",hashParams.key);
  
  try
  {
	  
 //throw new InternalError("Test Error");

  var privateKey = CryptoJS.enc.Utf8.parse(hashParams.key);
  var userMessage = CryptoJS.enc.Utf8.parse(hashParams.message);
  var hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(userMessage, privateKey));

  result(null, hmac);
  }
  catch(err)
  {
	  
	  console.log("Exception in HMac Generation:",err);
	  result(null, null);
  }
};

module.exports = HashGen;
