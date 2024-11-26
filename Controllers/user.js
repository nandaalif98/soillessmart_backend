const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../database/db");
const AppError = require("../utils/appError");

class UserAuthController {
  constructor(secret) {
    this.JWT_SECRET =
      secret ||
      process.env.JWT_SECRET ||
      "e0dcc9de-b11c-4e91-81dc-7c665262cdc3";
    if (!this.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
  }

  validateInput(req, res, next) {
    const { email, password } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    if (password.length < 8) {
      return next(
        new AppError("Password must be at least 8 characters long", 400)
      );
    }

    console.log("JWT_SECRET:", this.JWT_SECRET);

    next();
  }

  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;

      if (role && !["user", "teacher"].includes(role)) {
        return next(new AppError("Invalid role", 400));
      }

      const existingUser = await query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (existingUser.length > 0) {
        return next(new AppError("Email already exists", 409));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await query(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, hashedPassword, role || "user"]
      );

      if (!newUser.insertId) {
        return next(new AppError("Failed to register user", 500));
      }

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: newUser.insertId,
      });
    } catch (error) {
      console.error("User Register error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return next(new AppError("Duplicate entry", 409));
      }

      next(new AppError("Server error during registration", 500));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const users = await query("SELECT * FROM users WHERE email = ?", [email]);

      if (users.length === 0) {
        return next(new AppError("Invalid credentials", 401));
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return next(new AppError("Invalid credentials", 401));
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        this.JWT_SECRET || "e0dcc9de-b11c-4e91-81dc-7c665262cdc3",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("User Login error:", error);
      next(new AppError("Server error during login", 500));
    }
  }

  async getProfile(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return next(new AppError("Unauthorized", 401));
      }

      const user = await query(
        "SELECT id, email, role FROM users WHERE id = ?",
        [req.user.id]
      );

      if (user.length === 0) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        success: true,
        user: user[0],
      });
    } catch (error) {
      console.error("User Profile error:", error);
      next(new AppError("Server error fetching profile", 500));
    }
  }
}

module.exports = new UserAuthController();
