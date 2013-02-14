// Dashboard controller

exports.index = function(req,res){
	// Show dashboard index 
	console.log("USER:", req.user);
	res.render('dashboard/index');
}

exports.tutorial = function(req,res){
	// Show dashboard index 
	console.log("USER:", req.user);
	res.render('dashboard/tutorial');
}