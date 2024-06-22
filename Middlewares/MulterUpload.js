const multer = require('multer');

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

module.exports = (req, res, next) => {
    const uploadFields = [
        {name: 'profilePic', maxCount: 1},
        {name: 'idPics', maxCount: 3}
    ]
    
    upload.fields(uploadFields);
    next();
}