'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('./utils.js');
var constants = require('./constants.js');

function updateSubscription(subData,callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var orderType = new ApiContracts.OrderType();
	orderType.setInvoiceNumber(utils.getRandomString('Inv:')); 
	orderType.setDescription(utils.getRandomString('Description'));
    var creditcard = new ApiContracts.CreditCardType();
    creditcard.cardNumber = subData.creditCard
    creditcard.expirationDate = subData.expiry
	var arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
	arbSubscriptionType.setOrder(orderType);
    var payment = new ApiContracts.PaymentType();
    payment.creditCard = creditcard
   
    arbSubscriptionType.payment=payment;

	var updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
	updateRequest.setMerchantAuthentication(merchantAuthenticationType);
	updateRequest.setSubscriptionId(subData.subcriptionId);
	updateRequest.setSubscription(arbSubscriptionType);
    

	// console.log(JSON.stringify(updateRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());
    console.log('yes')
	console.log('https://api2.authorize.net/xml/v1/request.api')
	ctrl.setEnvironment('https://api2.authorize.net/xml/v1/request.api');
	
	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
                console.log("i am here at res 1")
               
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                console.log('i am here at res 2')
                
			}
		}
		else{
			console.log('Null Response.');
		}
		//send email notification
		utils.sendEmailNotification('Subscription Update', 'The subscription has been updated successfully.', function(err){
			if(err){
				console.log('Error sending email notification: ' + err);
			}
		});

		callback(response);
	});

}



module.exports.updateSubscription = updateSubscription;