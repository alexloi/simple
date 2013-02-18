var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];
  
var mongoose = require('mongoose')
  , dbox = require('dbox')
  , _ = require('underscore')
  , node_cryptojs = require('node-cryptojs-aes')
  , User = mongoose.model('User')
  , dropbox = dbox.app({"app_key": config.dropbox.appKey, "app_secret": config.dropbox.appSecret})
  , CryptoJS = node_cryptojs.CryptoJS
  , JsonFormatter = node_cryptojs.JsonFormatter;


exports.store = function(req, res){
	console.log("POST DATA:", req.body, req.body.data, req.body.master);

	var data = req.body.data
	  , user = req.user
	  , r_pass_base64 = req.body.master.toString('base64')
	  , encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), r_pass_base64, { format: JsonFormatter })
	  , encrypted_json_str = encrypt.toString();
	  //, decrypt = CryptoJS.AES.decrypt(encrypted_json_str, r_pass_base64, { format: JsonFormatter })
	  //, decrypted_json_str = CryptoJS.enc.Utf8.stringify(decrypt);

	 console.log('JSON STR', encrypted_json_str);
	// Client
	var client = dropbox.client(req.user.dropbox_acc_token);
	client.account(function(status, reply){
  		console.log('Account status', status, reply);
  		if(status == 200){
  			client.put("data.txt", encrypted_json_str, function(status, reply){
  				console.log('PUT REPLY', status, reply);
  				if(status == 200){
  					console.log("FILE PUT RESPONSE:", reply);
  				}
			});
  		}
	});

	if(req.user.first){
		try{
			user = _.extend(user, {first: false});
			user.save(function(err,doc){
				if(err){
					console.log('ERROR CHANGING FIRST FOR USER', err);
				}
			});
		}catch(err){
			console.log("JEEZ big error on extend / save - exports.store - data.js", err);
		}
	}

	res.send(200);
}

exports.retrieve = function(req, res){
	var data = req.body
	  , r_pass_base64 = data.master.toString('base64');

	var client = dropbox.client(req.user.dropbox_acc_token);
	client.account(function(status, reply){
		if(status == 200){
			client.get("data.txt", function(status, reply, metadata){
  				if(status == 200){
  					try{
	  					var decrypt = CryptoJS.AES.decrypt(reply.toString(), r_pass_base64, { format: JsonFormatter });
	  					var decrypted_json_str = CryptoJS.enc.Utf8.stringify(decrypt);
	  					console.log("OEOE DECRYPTED:", decrypted_json_str);
	  					res.send(200, { obj: decrypted_json_str});
	  					return;
	  				}catch(err){
	  					res.send(400, { error: "Cannot decrypt code! Wrong master key?", status: status, reply: reply});
  						return;	
	  				}
  				} else {
				  	res.send(400, { error: "No file", status: status, reply: reply});
  					return;
  				}
			});
		}
	});
}