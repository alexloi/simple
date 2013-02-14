var mongoose = require('mongoose')
  , dbox = require('dbox')
  , node_cryptojs = require('node-cryptojs-aes')
  , _ = require('underscore')
  , User = mongoose.model('User')
  , dropbox = dbox.app({"app_key": "7is17xce4pu49m1", "app_secret": "277e15u3lk5xjdu"})
  , CryptoJS = node_cryptojs.CryptoJS
  , JsonFormatter = node_cryptojs.JsonFormatter;


exports.store = function(req, res){
	console.log("POST DATA:", req.body, req.body.master);

	var data = req.body
	  , r_pass_base64 = data.master.toString('base64')
	  , encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), r_pass_base64, { format: JsonFormatter })
	  , encrypted_json_str = encrypt.toString();
	  //, decrypt = CryptoJS.AES.decrypt(encrypted_json_str, r_pass_base64, { format: JsonFormatter })
	  //, decrypted_json_str = CryptoJS.enc.Utf8.stringify(decrypt);

	// Client
	var client = dropbox.client(req.user.dropbox_acc_token);
	client.account(function(status, reply){
  		if(status == 200){
  			client.put("data.txt", encrypted_json_str, function(status, reply){
  				if(status == 200){
  					console.log("FILE PUT RESPONSE:", reply);
  				}
			});
  		}
	});

	//console.log("ENCRYPTED STRING JSON:", encrypted_json_str);
	//console.log("DENCRYPTED STRING JSON:", decrypted_json_str);

	res.redirect('/dashboard');
}

exports.retrieve = function(req, res){
	var data = req.body
	  , r_pass_base64 = data.master.toString('base64');

	var client = dropbox.client(req.user.dropbox_acc_token);
	client.account(function(status, reply){
		if(status == 200){
			client.get("data.txt", function(status, reply, metadata){
  				if(status == 200){
  					try {
	  					var decrypt = CryptoJS.AES.decrypt(reply.toString(), r_pass_base64, { format: JsonFormatter });
	  					var decrypted_json_str = CryptoJS.enc.Utf8.stringify(decrypt);
	  					if(!decrypted_json_str) console.log("Master password is wrong amigo.");
	  					console.log("OEOE DECRYPTED:", decrypted_json_str);
  					} catch (err) {
  						console.log("Master password is wrong amigo.");
  					}
  				}
			});
		}
	});

	res.redirect('/dashboard');
}