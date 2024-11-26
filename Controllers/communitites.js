const { query } = require("../database/db");

const getCommunities = async (req, res) => {
  try {
    const communities = await query(`SELECT * FROM communities`);
    return res.status(200).json({ success: true, data: communities });
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const addCommunities = async (req, res) => {
  const { name, description, location } = req.body;
  try {
    await query(
      `INSERT INTO communities (name, description, location) VALUES (?, ?, ?)`,
      [name, description, location]
    );
    return res.status(200).json({ msg: "Komunitas DItambahkan" });
  } catch (error) {
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const updateCommunities = async (req, res) => {
  const { id } = req.params;
  const { name, description, location } = req.body;
  try {
    await query(
      `UPDATE communities SET name = ?, description = ?, location = ? WHERE id = ?`,
      [name, description, location, id]
    );
    return res.status(200).json({ msg: "Komunitas berhasil diedit" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const deletecommunities = async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM communities WHERE id = ?`, [id]);
    return res.status(200).json({ msg: "Komunitas berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

const getCommunitiesId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM communities WHERE id = ?`, [id]);
    return res
      .status(200)
      .json({ msg: "pengambilan Komunitas ID berhasil", data: result });
  } catch (error) {
    console.log("ambil data gagal", error);
  }
};

module.exports = {
  getCommunities,
  addCommunities,
  updateCommunities,
  deletecommunities,
  getCommunitiesId,
};
