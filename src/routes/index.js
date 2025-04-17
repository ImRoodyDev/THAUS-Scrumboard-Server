// Express Js
const express = require('express');
const applicationRoutes = express.Router();

// Middleware for routes
const { NoAuthentication, Authentication } = require('../middlewares/authentication');

// Routes handleing for express application
const Register = require('./auth/register');
const Login = require('./auth/login');

applicationRoutes.use('/login', NoAuthentication, Login);
applicationRoutes.use('/register', NoAuthentication, Register);

module.exports = { applicationRoutes };
