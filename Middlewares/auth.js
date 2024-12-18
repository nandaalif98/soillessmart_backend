const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
require ('dotenv').config();

class AuthMiddleware {
  constructor(secret) {
    this.JWT_SECRET = secret || process.env.JWT_SECRET || 'e0dcc9de-b11c-4e91-81dc-7c665262cdc3';
  }

  authenticateUserToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token == null) {
        return res.status(401).json({ 
          success: false, 
          message: 'No token provided for user' 
        });
      }

      const decoded = jwt.verify(token, this.JWT_SECRET);
      
      if (decoded.type !== 'user') {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid user token' 
        });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired user token' 
      });
    }
  }

  authenticateAdminToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token == null) {
        return res.status(401).json({ 
          success: false, 
          message: 'No token provided for admin' 
        });
      }

      const decoded = jwt.verify(token, this.JWT_SECRET);
      
      if (decoded.type !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid admin token' 
        });
      }

      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired admin token' 
      });
    }
  }

  authorize(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return next(new AppError('Forbidden: Access denied', 403));
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware();