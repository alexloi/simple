// Dashboard controller

exports.index = function(req,res){
	// Show dashboard index 
	console.log("USER:", req.user);
	res.render('dashboard/index', {user: { first: req.user.first }});
}

exports.tutorial = function(req,res){
	// Show dashboard index 
	console.log("USER:", req.user);
	res.render('dashboard/tutorial');
}

exports.profile = function(req, res){
	console.log("Templating par excellence", req.body);
	res.render('templates/profile', {profile: req.body.profile});
}