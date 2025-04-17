const socketio = require('socket.io');

function initSocket(server) {
	const io = socketio(server);
	io.on('connection', (socket) => {
		// Handle room joining (e.g., group chat or user story chat)
		socket.on('joinRoom', (room) => {
			socket.join(room);
		});
		// Handle new messages
		socket.on('newMessage', (data) => {
			// Broadcast new message to the target room
			io.to(data.room).emit('message', data);
		});
		// ...other real‑time events such as notifications...
	});
}

module.exports = { initSocket };
