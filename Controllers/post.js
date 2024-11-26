const { query } = require("../database/db");

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
  const { title, content } = req.body;

  if (!communityId) {
    return res.status(400).json({ error: 'communityId is required' });
  }

  try {
    await query(
      `INSERT INTO posts (community_id, title, content) VALUES (?, ?, ?)`,
      [communityId, title, content]
    );

    return res.status(200).json({ msg: "post DItambahkan" });
  } catch (error) {
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await query(`UPDATE posts SET title = ?, content = ? WHERE id = ?`, [
      title,
      content,
      id,
    ]);
    return res.status(200).json({ msg: "Post berhasil diedit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM posts WHERE id = ?`, [id]);
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
