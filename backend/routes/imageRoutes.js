const express = require('express');
const router = express.Router();
const { upload, getFileByFilename, createDownloadStream } = require('../services/storageService');

// Upload single image
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get image by filename
router.get('/:filename', async (req, res) => {
  try {
    const file = await getFileByFilename(req.params.filename);
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    const downloadStream = createDownloadStream(req.params.filename);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
