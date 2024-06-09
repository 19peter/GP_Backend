const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        // cb(null, Date.now() + '-' + file.originalname); // Custom filename logic
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = (req, res, next) => {
    
    upload.array('image', 2)(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // console.log(req.files);
        next();
    });
}