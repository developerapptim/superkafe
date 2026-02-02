const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/UploadController');
const { uploadAudio } = require('../middleware/uploadMiddleware');
const { checkApiKey } = require('../middleware/auth');

router.use(checkApiKey);

// Settings Sound Upload
router.post('/settings/sound', uploadAudio.single('soundFile'), UploadController.uploadSound);

module.exports = router;
