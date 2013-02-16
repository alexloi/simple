module.exports = {
	development: {
		root: require('path').normalize(__dirname + '/..')
		,app: {
			name: 'asimpleform'
		  , url: 'http://localhost:3000'
		}
		,db: 'mongodb://localhost/asimpleform'
		,dropbox: {
	          appKey: "7is17xce4pu49m1"
	        , appSecret: "277e15u3lk5xjdu"
	        , callbackURL: "/connect/dropbox/"
	    }
	}
	, staging: {
		root: require('path').normalize(__dirname + '/..')
		,app: {
			name: 'asimpleform - staging'
	      , url: 'http://staging-asimpleform.herokuapp.com'
		}
		,db: process.env.MONGOLAB_URI
		,dropbox: {
	          appKey: "7is17xce4pu49m1"
	        , appSecret: "277e15u3lk5xjdu"
	        , callbackURL: "/connect/dropbox/"
	    }
	}
	, production: {
		root: require('path').normalize(__dirname + '/..')
		,app: {
			name: 'asimpleform - production'
			, url: 'http://asimpleform.com'
		}
		,db: process.env.MONGOLAB_URI
		,dropbox: {
	          appKey: "7is17xce4pu49m1"
	        , appSecret: "277e15u3lk5xjdu"
	        , callbackURL: "/connect/dropbox/"
	    }
	}
}