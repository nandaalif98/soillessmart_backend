const { query } = require("../database/db");
const fs = require('fs');
const path = require('path');

const getReviewbyProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const posts = await query(`SELECT * FROM product_reviews WHERE prduct_id = ?`, [
      productId,
    ]);
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const addReviewProduct = async (req, res) => {
  const { productId } = req.params;
  const { review } = req.body;

  try {
    await query(
      `INSERT INTO product_reviews (product_id, review_text) VALUES (?, ?)`,
      [productId, review]
    );

    return res.status(200).json({ msg: "review product DItambahkan" });
  } catch (error) {
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updateReviewProduct = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  try {
    await query(`UPDATE product_reviews SET review_text = ? WHERE id = ?`, [
      review,
      id,
    ]);
    return res.status(200).json({ msg: "Post berhasil diedit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deleteReviewProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM product_reviews WHERE id = ?`, [id]);

    return res.status(200).json({ msg: "Post berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getReviewbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM product_reviews WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ msg: "pengambilan review ID berhasil", data: result });
  } catch (error) {
    console.log("ambil data gagal", error);
  }
};

module.exports = {
  getReviewbyProduct,
  addReviewProduct,
  updateReviewProduct,
  deleteReviewProduct,
  getReviewbyId,
};