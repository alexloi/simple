/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

exports.checkAuth = function(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/dashboard');
  }
  next();
}


/*
 *  User authorizations routing middleware
 */
exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id);
      }
      next();
    }
}
