module.exports = async (req, res, next) => {
    console.log("google");

    const { google } = require('googleapis');
    const fs = require('fs');
    const path = require('path')

    const googleAuthClient = require('../Utils/Google Utils/GoogleVerification');


    let data = req.body.data;
    let parsed = JSON.parse(data);
    let { id, name } = parsed;

    let files = req.files;

    console.log(files);

    // if (!req.file) {
    //     return res.status(400).send('No file uploaded.');
    // }

    try {
        const auth = googleAuthClient();
        const drive = await google.drive({ version: 'v3', auth });

        files.forEach(f => {
            let filePath = path.join(__dirname, `../uploads/${f.originalname}`);

            const fileMetadata = {
                name: id + "_" + f.originalname,
                parents: ["1hLkL05wOATzeQNNlitMQGkx7qYvlE0z0"]
            };

            const media = {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(filePath),
            };

            const file =  drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });

        });

        // fs.unlink(path.join(__dirname, '../uploads/image'), (err) => {
        //     console.log(err);
        // })

        next();

    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        res.status(500).send('Error uploading file');
    }

}