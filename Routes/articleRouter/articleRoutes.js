const express = require("express");
const { getArticles, addArticle, updateArticle, deleteArticle, getArticleId } = require ("../../Controllers/article");
const upload = require("../../Middlewares/upload");

const articleRoutes = express.Router();

articleRoutes.post("/article", upload.single('photo'), addArticle);
articleRoutes.get("/article", getArticles);
articleRoutes.put("/article/:id", upload.single('photo'), updateArticle);
articleRoutes.delete("/article/:id", deleteArticle);
articleRoutes.get("/article/:id", getArticleId);

module.exports = articleRoutes;