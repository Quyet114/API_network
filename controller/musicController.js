const { User } = require('../models/User')
const {Music} = require('../models/Music')
const musicController = {

  async createNewMusic(req, res) {
    try {
      const { name, type, time, url,creator } = req.body;
      // Tạo một đối tượng Music mới
      const newMusic = new Music({
        creator: creator,
        url: url,
        name: name,
        type: type || 0,
        time: time || 0,
      });

      await newMusic.save();
      res.status(200).json({
        status: 1,
        music: newMusic,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: -1, error: 'Lỗi máy chủ' });
    }
  },
  
  async getAllMusic(req, res) {
    try {
      const musicList = await Music.find().populate('creator', 'name avatar');
      res.status(200).json({
        status: 1,
        music: musicList,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: -1, error: 'Lỗi máy chủ' });
    }
  },
  async searchMusicName(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ status: -1, error: 'Vui lòng cung cấp từ khóa tìm kiếm' });
      }
      const regex = new RegExp(keyword, 'i');
      const musicList = await Music.find({ name: { $regex: regex } }).populate('creator', 'name avatar');

      res.status(200).json({
        status: 1,
        music: musicList,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: -1, error: 'Lỗi máy chủ' });
    }
  }

};
module.exports = musicController;