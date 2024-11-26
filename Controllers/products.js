const { query } = require("../database/db");

const getProducts = async (req, res) => {
  try {
    const products = await query(`SELECT * FROM products`);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const addProduct = async (req, res) => {
  const { name, product, description, price } = req.body;
  try {
    await query(
      `INSERT INTO products (name, product, description, price) VALUES (?, ?, ?, ?)`,
      [name, product, description, price]
    );
    return res.status(200).json({ msg: "Produk DItambahkan" });
  } catch (error) {
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, product, description, price } = req.body;
  try {
    await query(
      `UPDATE products SET name = ?, product = ?, description = ?, price = ? WHERE id = ?`,
      [name, product, description, price, id]
    );
    return res.status(200).json({ msg: "Produk berhasil diedit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM products WHERE id = ?`, [id]);
    return res.status(200).json({ msg: "Produk berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getProductId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM products WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ msg: "pengambilan product ID berhasil", data: result });
  } catch (error) {
    console.log("ambil data gagal", error);
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductId,
};
