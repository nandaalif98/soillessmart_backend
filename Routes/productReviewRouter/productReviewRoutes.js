const express = require("express");
const { getReviewbyProduct, addReviewProduct, updateReviewProduct, deleteReviewProduct, getReviewbyId } = require ("../../Controllers/productReview");

const reviewRoutes = express.Router();

reviewRoutes.post("/review/pro/:productId", addReviewProduct);
reviewRoutes.get("/review/pro/:productId", getReviewbyProduct);
reviewRoutes.put("/review/:id", updateReviewProduct);
reviewRoutes.delete("/review/:id", deleteReviewProduct);
reviewRoutes.get("/review/:id", getReviewbyId);

module.exports = reviewRoutes;