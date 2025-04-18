const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { applicationRoutes } = require('./src/routes');
const { initializeSocketIO } = require('./src/socket');

// Application port
const PORT = process.env.NODE_PORT || 3004;

// Configure cors
const corsConfig = cors({
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,OPTIONS',
	optionsSuccessStatus: 200,
});

// Initialize Express application
const app = express();

// Initialize middlewares
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

module.exports = () => {
	// Listener of server 1
	app.server = app.listen(PORT, () => {
		console.log(`Application Server listening on port ${PORT}`);
	});

	// Initialize Socket.io
	initializeSocketIO(app.server);

	app.get('/', (req, res) => {
		res.send('Application Server is running.');
	});

	// Application server routes
	app.use('/api/', applicationRoutes);
};
