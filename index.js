require('dotenv').config();
const { initializeSequelize, disconnectSequelize } = require('./database');
const mainApp = require('./app');

// Inialize database
initializeSequelize().then(r => {console.log('Sequelize initialized')});

// Initialize applications
mainApp();

// Check node enviroment
if (process.env.NODE_ENV == 'production') {
	console.log = () => {};
	console.error = () => {};
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
	await disconnectSequelize();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await disconnectSequelize();
	process.exit(0);
});
