const { query } = require("../database/db");
const fs = require('fs');
const path = require('path');

const getArticles = async (req, res) => {
  try {
    const articles = await query(`SELECT * FROM articles`);
    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const addArticle = async (req, res) => {
  const { title, content } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    await query(
      `INSERT INTO articles (title, photo, content) VALUES (?, ?, ?)`,
      [title, photo, content]
    );
    return res.status(200).json({ msg: "Produk DItambahkan" });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const oldArticle = await query(`SELECT photo FROM articles WHERE id = ?`, [id]);
    const oldPhotoName = oldArticle[0]?.photo;

    const newPhoto = req.file ? req.file.filename : oldPhotoName;

    await query(
      `UPDATE articles SET title = ?, photo = ?, content = ? WHERE id = ?`,
      [title, newPhoto, content, id]
    );
    
    if (req.file && oldPhotoName) {
      const oldPhotoPath = path.join(__dirname, '../uploads/articles', oldPhotoName);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    return res.status(200).json({ msg: "Produk berhasil diedit" });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await query(`SELECT photo FROM articles WHERE id = ?`, [id]);
    const photoName = article[0]?.photo;

    await query(`DELETE FROM articles WHERE id = ?`, [id]);

    if (photoName) {
      const photoPath = path.join(__dirname, '../uploads/articles', photoName);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    return res.status(200).json({ msg: "Produk berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getArticleId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM articles WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ msg: "pengambilan product ID berhasil", data: result });
  } catch (error) {
    console.log("ambil data gagal", error);
  }
};

module.exports = {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticleId,
};