const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

// Create GridFS storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmanagement',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return {
      filename: `${uniqueSuffix}-${file.originalname}`,
      bucketName: 'images'
    };
  }
});

// Configure multer for MongoDB upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Function to get file by filename
const getFileByFilename = async (filename) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
  return bucket.find({ filename: filename }).toArray();
};

// Function to create download stream
const createDownloadStream = (filename) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
  return bucket.openDownloadStreamByName(filename);
};

module.exports = { 
  upload,
  getFileByFilename,
  createDownloadStream
};
