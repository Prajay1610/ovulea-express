/*jshint esversion: 6 */

const winston = require('winston');
const { format, transports } = winston;
const moment = require('moment');
const instance = "production";
var custom_log_level = "info";

const consoleLogger = new winston.transports.Console({
	
	timestamp: function(){
		const today =moment();
		return today.format('DD-MM-YYYY h:mm:ssa');
		},
		colorize: true
});

const logger = winston.createLogger({
		level: custom_log_level, //'error',
		//format: winston.format.simple(),
		//format: winston.format.combine(
		//	    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
		//	    winston.format.prettyPrint()
		//	  ),
		format: winston.format.combine(
			   // winston.format.colorize({ all: true }),
			    winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
			    winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
			  ),
		transports: [
			
			new winston.transports.Console(),
			new winston.transports.File({ filename: 'devLogs.log' 
													, level: custom_log_level
													, format: format.combine(
													        // Render in one line in your log file.
													        // If you use prettyPrint() here it will be really
													        // difficult to exploit your logs files afterwards.
													        format.json())
													        })
			//consoleLogger
		]
		}
);


logger.exitOnError = false;
module.exports.log = logger;