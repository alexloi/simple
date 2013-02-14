module.exports = {
	development: {
		root: require('path').normalize(__dirname + '/..')
		,app: {
			name: 'roboboogie.us'
		}
		,db: 'mongodb://localhost/demo'
		,dropbox: {
	          appKey: "7is17xce4pu49m1"
	        , appSecret: "277e15u3lk5xjdu"
	        , callbackURL: "http://localhost:3000/auth/connect/dropbox/callback"
	    }
	}
	, staging: {

	}
	, production: {

	}
}