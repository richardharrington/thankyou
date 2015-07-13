"use strict";

var http 		= require('http');
var session 	= require('express-session')
var express  	= require('express');
var bodyParser	= require('body-parser');

var defaultPort = 8080;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static('./public'));

/*
app.engine('html', hbs.__express);
hbs.registerPartials(env.PARTIALS_DIR);
*/

app.use(session({ 
	secret: 'somerandomstring',
	saveUninitialized: false,
	resave: false
})); 

var server = http.createServer(app);
server.listen(process.env.PORT || defaultPort);

console.log('HTTP server listening on', process.env.PORT || defaultPort);

var clients = {};

// UPGRADE #server to handle ws: protocol
//
require('./bindSocketServer.js')(server);

