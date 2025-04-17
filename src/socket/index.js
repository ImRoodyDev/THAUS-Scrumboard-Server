const { Server } = require('socket.io');

// This module exports a function to initialize Socket.IO and a function to get the Socket.IO instance.
let io = null;

function initializeSocketIO(server) {
	io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		console.log('New client connected');

		socket.on('disconnect', () => {
			console.log('Client disconnected');
		});
	});
}


function getSocketIO() {
	if (!io) {
		throw new Error('Socket.IO not initialized. Call initializeSocketIO first.');
	}
	return io;

}


module.exports = {
	initializeSocketIO,
	getSocketIO,
}

