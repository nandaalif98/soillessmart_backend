const express = require("express");
const { getPostbyCommunity, addPost, updatePost, deletePost, getPostbyId } = require ("../../Controllers/post");
const upload = require("../../Middlewares/upload");

const postRoutes = express.Router();

postRoutes.post("/posts/com/:communityId", upload.single('photo'), addPost);
postRoutes.get("/posts/com/:communityId", getPostbyCommunity);
postRoutes.put("/posts/:id", upload.single('photo'), updatePost);
postRoutes.delete("/posts/:id", deletePost);
postRoutes.get("/posts/:id", getPostbyId);

module.exports = postRoutes;