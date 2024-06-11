module.exports = async (req, res, next) => {
    const path = require('path');
    const fs = require('fs');


    let files = req.files;
    let data = req.body.data;
    let parsed = JSON.parse(data);
    let { email } = parsed;
    let newSProvider = req.newSProvider;

    files.forEach(f => {
        if (f.originalname === `userprofile.jpg`) {
            let oldName = path.join(__dirname, `../uploads/${f.originalname}`);
            let newName = path.join(__dirname, `../uploads/${ email }_Profile.jpg`);

            fs.rename(oldName, newName, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
    // next();
    return res.status(200).json({newSProvider});
}