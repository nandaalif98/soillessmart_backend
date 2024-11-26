const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const AppError = require('../utils/appError');

class AdminAuthController {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'e0dcc9de-b11c-4e91-81dc-7c665262cdc3';
  }

  validateInput(req, res, next) {
    const { email, password } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    if (!password) {
      return next(new AppError('Password is required', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Invalid email format', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }

    next();
  }

  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return next(new AppError('Email is required', 400));
      }

      if (!password || password.length < 6) {
        return next(new AppError('Password must be at least 6 characters', 400));
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new AppError('Invalid email format', 400));
      }

      const existingAdmin = await query(
        'SELECT * FROM admins WHERE email = ?', 
        [email]
      );

      if (existingAdmin.length > 0) {
        return next(new AppError('Email already registered', 409));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await query(
        'INSERT INTO admins (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      res.status(201).json({ 
        success: true, 
        message: 'Admin registered successfully',
        adminId: result.insertId 
      });
    } catch (error) {
      console.error('Detailed Admin Registration Error:', error);
      next(new AppError(`Registration failed: ${error.message}`, 500));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const admins = await query(
        'SELECT * FROM admins WHERE email = ?', 
        [email]
      );

      if (admins.length === 0) {
        return next(new AppError('Invalid credentials', 401));
      }

      const admin = admins[0];

      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (!isMatch) {
        return next(new AppError('Invalid credentials', 401));
      }

      const token = jwt.sign(
        { 
          id: admin.id, 
          email: admin.email,
          type: 'admin'
        }, 
        this.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        token,
        admin: {
          id: admin.id,
          email: admin.email
        }
      });
    } catch (error) {
      console.error('Admin Login error:', error);
      next(new AppError('Server error during login', 500));
    }
  }

  async getProfile(req, res, next) {
    try {
      if (!req.admin || !req.admin.id) {
        return next(new AppError('Unauthorized', 401));
      }

      const admin = await query(
        'SELECT id, email FROM admins WHERE id = ?', 
        [req.admin.id]
      );

      if (admin.length === 0) {
        return next(new AppError('Admin not found', 404));
      }

      res.status(200).json({ 
        success: true, 
        admin: admin[0] 
      });
    } catch (error) {
      console.error('Admin Profile error:', error);
      next(new AppError('Server error fetching profile', 500));
    }
  }
}

module.exports = new AdminAuthController();