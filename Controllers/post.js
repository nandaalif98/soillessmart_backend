const { query } = require("../database/db");
const fs = require('fs');
const path = require('path');

const getPostbyCommunity = async (req, res) => {
  const communityId = req.params.communityId;

  try {
    const posts = await query(`SELECT * FROM posts WHERE community_id = ?`, [
      communityId,
    ]);
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const addPost = async (req, res) => {
  const { communityId } = req.params;
  const { title } = req.body;
  const content = req.file ? req.file.filename : null;

  if (!communityId) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: 'communityId is required' });
  }

  try {
    await query(
      `INSERT INTO posts (community_id, title, content) VALUES (?, ?, ?)`,
      [communityId, title, content]
    );

    return res.status(200).json({ msg: "post DItambahkan" });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const oldPost = await query(`SELECT content FROM posts WHERE id = ?`, [id]);
    const oldPhotoName = oldPost[0]?.photo;

    const newContent = req.file ? req.file.filename : oldPhotoName;

    await query(`UPDATE posts SET title = ?, content = ? WHERE id = ?`, [
      title,
      newContent,
      id,
    ]);

    if (req.file && oldPhotoName) {
      const oldPhotoPath = path.join(__dirname, '../uploads/posts', oldPhotoName);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    return res.status(200).json({ msg: "Post berhasil diedit" });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {

    const post = await query(`SELECT photo FROM posts WHERE id = ?`, [id]);
    const photoName = post[0]?.photo;

    await query(`DELETE FROM posts WHERE id = ?`, [id]);

    if (photoName) {
      const photoPath = path.join(__dirname, '../uploads/posts', photoName);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    return res.status(200).json({ msg: "Post berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getPostbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM posts WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ msg: "pengambilan Post ID berhasil", data: result });
  } catch (error) {
    console.log("ambil data gagal", error);
  }
};

module.exports = {
  getPostbyCommunity,
  addPost,
  updatePost,
  deletePost,
  getPostbyId,
};
