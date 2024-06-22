const multer = require('multer');

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

module.exports = (req, res, next) => {

    upload.array('idPics', 3);
    next();
}