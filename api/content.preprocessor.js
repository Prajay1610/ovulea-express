/*jshint esversion: 6 */

console.log("Content Preprocessor");


const logger = require('.././loggers/logger');
const awsConfig = require('../config/aws.config.js');
console.log("Base Directory",__dirname);

require('dotenv').config({path: __dirname + '/../.env'});
global.fetch = require('node-fetch');

let prefix;
let suffix;
let separator='/';
let expiry=600;
let introfile='doc-intro.mp4';


preProcess = (req,res,next) => {
	
	console.log("Inside preProcess");
	console.log("DoctorUid:",req.body.doctorUid);
	console.log("PatientUid:",req.body.patientUid);	
	
	prefix='doctor';
	suffix='intro';
	

	req.body.bucket_name = awsConfig.AWS_BUCKET_NAME; 
	req.body.user_key = prefix+separator+req.params.doctorUid+separator+suffix;
	req.body.file_name = introfile;
	req.body.separator = separator;
	req.body.expiry = expiry;

	
	next();
	
};

const preProc = {
		preProcess: preProcess
};

module.exports = preProc;