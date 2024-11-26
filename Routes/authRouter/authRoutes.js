const express = require('express');
const adminAuthController = require('../../Controllers/admin');
const userAuthController = require('../../Controllers/user');
const authMiddleware = require('../../Middlewares/auth');

const authRoutes = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'e0dcc9de-b11c-4e91-81dc-7c665262cdc3';

userAuthController.JWT_SECRET = jwtSecret;

authRoutes.post('/register', userAuthController.register);
authRoutes.post('/login', userAuthController.login);
authRoutes.get('/profile', 
  authMiddleware.authenticateUserToken,
  authMiddleware.authorize('user'), 
  userAuthController.getProfile
);

authRoutes.get('/teacher/dashboard',
  authMiddleware.authenticateUserToken,
  authMiddleware.authorize('teacher'),
  (req, res) => {
    res.json({ message: 'Welcome, Teacher!', user: req.user });
  }
);

authRoutes.post('/admin/register', adminAuthController.register);
authRoutes.post('/admin/login', adminAuthController.login);
authRoutes.get('/admin/profile', authMiddleware.authenticateAdminToken, adminAuthController.getProfile);

module.exports = authRoutes;