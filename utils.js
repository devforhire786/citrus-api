'use strict';

function getRandomString(text){
	return text + Math.floor((Math.random() * 100000) + 1);
}

function getRandomInt(){
	return Math.floor((Math.random() * 100000) + 1);
}

function getRandomAmount(){
	return ((Math.random() * 100) + 1).toFixed(2);
}

function getDate(){
	return (new Date()).toISOString().substring(0, 10) ;
}
//send email notification with nodemailer
function sendEmailNotification(subject, text, callback) {
	const nodemailer = require('nodemailer');
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'abacus790@gmail.com',
			pass: 'njth lnpy cdwz byhr'
		}
	});

	const mailOptions = {
		from: 'abacus790@gmail.com',
		to: 'chnouman49@gmail.com',
		subject: subject,
		text: text
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log('Error sending email: ' + error);
			callback(error);
		} else {
			console.log('Email sent: ' + info.response);
			callback(null);
		}
	});
}

module.exports.getRandomString = getRandomString;
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomAmount = getRandomAmount;
module.exports.getDate = getDate;
module.exports.sendEmailNotification = sendEmailNotification;