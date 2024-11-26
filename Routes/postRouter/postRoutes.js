const express = require("express");
const { getPostbyCommunity, addPost, updatePost, deletePost, getPostbyId } = require ("../../Controllers/post");

const postRoutes = express.Router();

postRoutes.post("/posts/com/:communityId", addPost);
postRoutes.get("/posts/com/:communityId", getPostbyCommunity);
postRoutes.put("/posts/:id", updatePost);
postRoutes.delete("/posts/:id", deletePost);
postRoutes.get("/posts/:id", getPostbyId);

module.exports = postRoutes;