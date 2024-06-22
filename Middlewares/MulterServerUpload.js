module.exports = (req, res, next) => {
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/'); // directory where files will be stored
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
    });

    // Initialize multer upload middleware
    const upload = multer({ storage: storage });

    upload.single('profilePic');
}