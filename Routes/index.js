const express = require("express");
const authRoutes = require("./authRouter/authRoutes");
const productsRoutes = require("./productRouter/productsRoutes");
const communitiesRoutes = require("./communitiesRouter/communitiesRoutes");
const usersRoutes = require("./postRouter/postRoutes");

const Router = express.Router();
const api = "/api/v1";

Router.use(api, authRoutes);
Router.use(api, productsRoutes);
Router.use(api, communitiesRoutes);
Router.use(api, usersRoutes);

module.exports = Router;

Router.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
  });