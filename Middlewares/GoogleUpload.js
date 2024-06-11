module.exports = async (req, res, next) => {
    console.log("google");

    const { google } = require('googleapis');
    const fs = require('fs');
    const path = require('path')
    const stream = require('stream');

    const googleAuthClient = require('../Utils/Google Utils/GoogleVerification');


    let data = req.body.data;
    let parsed = JSON.parse(data);
    let { email, name } = parsed;

    let files = req.files;


    try {
        const auth = googleAuthClient();
        const drive = await google.drive({ version: 'v3', auth });

        files.map(async (f) => {

            let filePath = path.join(__dirname, `../uploads/${f.originalname}`);

            if (f.originalname !== 'userprofile.jpg') {

                const bufferStream = new stream.PassThrough();
                bufferStream.end(f.buffer);
                
                const fileMetadata = {
                    name: email + "_" + f.originalname,
                    parents: ["1hLkL05wOATzeQNNlitMQGkx7qYvlE0z0"]
                };

                const media = {
                    mimeType: 'image/jpeg',
                    // body: fs.createReadStream(filePath),
                    body: bufferStream,
                };

                const file = await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id',
                });

                return file;
            } else {
                fs.writeFileSync(filePath, f.buffer);
                
            }

        });

        next();

    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        res.status(500).send('Error uploading file');
    }

}