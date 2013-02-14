var mongoose = require('mongoose')
  , Demo = mongoose.model('Demo')
  , _ = require('underscore');


// Show list of demos
exports.index = function(req,res){
	Demo
		.find({})
		.sort({'createdAt': -1})
		.exec(function(err, demos){
			if(err) return res.render('500')
			Demo.count().exec(function(err,count){
				res.render('demos/index', {
					title: 'List of demos'
				   ,demos: demos
				});
			})
		});

}	
