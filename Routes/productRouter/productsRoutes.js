const express = require("express");
const { getProducts, addProduct, updateProduct, deleteProduct, getProductId } = require ("../../Controllers/products");

const productsRoutes = express.Router();

productsRoutes.post("/products", addProduct);
productsRoutes.get("/products", getProducts);
productsRoutes.put("/products/:id", updateProduct);
productsRoutes.delete("/products/:id", deleteProduct);
productsRoutes.get("/products/:id", getProductId);

module.exports = productsRoutes;