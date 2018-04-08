	// red data ---------------------------------------------------------------------
	// all contacts
	var contacts=[{Head:'Aadhar1',Id:'1',Number:'+917406420999'},
	                          {Head:'Aadhar2',Id:'2', Number:'+918218118401'}];

	// all mesages will be stored here
	var messages=[];

	module.exports = function(app) {

	// api ---------------------------------------------------------------------

	// get Value
	/*app.get('/api/getvalue', function(req, res) {		
		res.json(value);
    });*/

   // app.post('/api/sendOTPs', function(req, res) {
	app.get('/api/generateOTP', function(req, res) {	
		var accountSid = 'ACe9645b3017a9645ebf2897f57371c4c5';  // Unique twilio ID 
		var authToken = '0b71c80606daebb9e986a55f6583daf7'; 	// Unique twilio ID 	       	
		var client = require('twilio')(accountSid, authToken);
		var sender="+16193042570 ";    // Unique twilio Sender Number 
		var OTP=Math.floor((Math.random() * 900000) + 100000);   //Generating random six digit OTP.
		var text="YOUR OTP is "+OTP; 
		var receipent= contacts[0].Number;  //receipent number form Contact Object

		client.messages.create({ 
			        to: receipent, 
			        from: sender, 
			        body: text, 
			    }, function(err, message) { 
			    	if(err===null){	
			    		res.json(OTP);		    				    		
			    	}
			    	else{
			    		console.log("error");		        	
			    	}			    	
			    });		

	});
   
};
