const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only .pdf, .doc, and .docx files are allowed!');
    }
  },
}).single('cv');

// Upload CV
router.post('/upload', (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;

    upload(req, res, err => {
      if (err) {
        return res.status(400).json({ msg: err });
      }
      if (req.file === undefined) {
        return res.status(400).json({ msg: 'No file selected' });
      }

      res.json({
        msg: 'CV uploaded successfully',
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
      });
    });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Get CVs (For example purposes)
router.get('/', async (req, res) => {
  try {
    const cvs = []; // This is just a placeholder, you can implement a full solution with a database
    res.json(cvs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
