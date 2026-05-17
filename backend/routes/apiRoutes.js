const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { handleGenerateImage, getImages } = require('../controllers/imageController');

router.post('/chat', handleChat);
router.post('/generate-image', handleGenerateImage);
router.get('/images', getImages);

module.exports = router;
