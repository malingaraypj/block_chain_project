const express = require('express');
const File = require('../models/file');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      // Extract metadata from the request body, including the new fileDescription
      const { filename, fileDescription, ownerName, dateCreated, price } = req.body;
      const newFile = new File({
        filename,
        fileDescription, // Save the file description
        ownerName,
        dateCreated: new Date(dateCreated),
        price: parseFloat(price),
        contentType: req.file.mimetype,
        filePath: req.file.path,
        originalName: req.file.originalname
      });
  
      await newFile.save();
      res.status(201).send({ message: 'File uploaded successfully', fileId: newFile._id });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file to database');
    }
});

// Get all files metadata
router.get('/', async (req, res) => {
  try {
    const files = await File.find({}).select('-__v');
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files');
  }
});

// Get a specific file's metadata
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).select('-__v');
    if (!file) {
      return res.status(404).send('File not found');
    }
    res.status(200).json(file);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
});

// Download a file
router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send('File not found');
    }
    
    const filePath = file.filePath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found on server');
    }
    
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error downloading file');
  }
});
  
module.exports = router;