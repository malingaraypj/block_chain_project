const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileDescription: { type: String, required: true }, // Added file description field
  ownerName: { type: String, required: true },
  dateCreated: { type: Date, required: true },
  dateAdded: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  contentType: { type: String, required: true },
  filePath: { type: String, required: true }, // Path to the stored file
  originalName: { type: String, required: true } // Original filename
});

module.exports = mongoose.model('File', fileSchema);
