"use strict";

var WebSocket = require('ws');
var SServer = WebSocket.Server;

module.exports = function(server) {

	// Create the local socket server, which communicates
	// with web clients.
	//
	var wss = new SServer({
		server: server
	});
	
	
	wss.on('connection', function(ws) {
	
		var keepalive;
		
		// Create connection to switchboard for this client UI
		//
		var switchboard = new WebSocket('ws://limitless-thicket-4456.herokuapp.com');
	
		switchboard.onopen = function() {
		
			console.log("You have connected to the switchboard.");
			
			// This is necessary for some hosts, which will terminate
			// idle socket connections. Just ping to keep alive (20sec).
			//
			(function $ping() {
				switchboard.ping();
				keepalive = setTimeout($ping, 20000);
			})();
		};
		
		switchboard.on('pong', function() {
			console.log('got pong');
			// Do something re: switchboard unavailability if pong 
			// not received after x seconds...
			//
		});
		
		switchboard.onmessage = function(event) {
	
			var data = event.data;
			var messages;
	
			try {
				data = JSON.parse(data);
			} catch(e) {
				return console.log('Unable to process data: ', data);
			}
			
			if(data.type === 'alert') {
				return console.log(data.text);
			}
	
			if(data.type === 'update') {

				console.log("got update:", data);

				messages = data.list.reverse().map(function(msg) {

					// Somewhat redundant, but the # is in the messages
					//
					data.phoneNumber = msg.phoneNumber;
					
					return {
						received: msg.received,
						message: msg.message,
						sentiment: 'devil'
					}
				});
				
				ws.sendMessage({
					messages: messages,
					phone: data.phoneNumber
				})
			}
		};

		// Need to configure handlers so we can bidirectionally
		// communicate with client UI (snd/rcv messages)
		//
		ws.sendMessage = function ws$sendMessage(obj) {
		
			console.log("TRYING TO SEND:", obj);

			ws.send(JSON.stringify(obj));
		};
	
		ws.on('message', function incoming(payload) {

			try {
				payload = JSON.parse(payload);
			} catch(e) {
				return;
			}
			
			switch(payload.command) {
			
				case 'available':
					ws.sendMessage({
						messages: [{
							date : 'Yesterday',
							message : 'I think we should bump this up in priority. Maybe Jack can take this?',
							sentiment: 'devil'
						}, {
							date : 'Last week',
							message : 'This is another message',
							sentiment: 'happy'
						}, {
							date : 'Last week',
							message : 'This is another YOOOOO message',
							sentiment: 'wink'
						}],
						phone: '1 917-767-4492'
					})
				break;
				
				case 'response':
				break;
			
				default:
					// do nothing
				break;
			}
		});
		
		// When UI client disconnects need to close switchboard connection
		// and the keepalive ping
		//
		ws.on('close', function() {
			clearTimeout(keepalive);
			switchboard.close();
			switchboard = null;
		});
	});
	
	console.log('Client socket server is ready.');
};