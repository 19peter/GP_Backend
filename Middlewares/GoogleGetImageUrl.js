module.exports = async (req, res, next) => {
    console.log("google");

    const { google } = require('googleapis');
    const fs = require('fs');
    const path = require('path')

    const googleAuthClient = require('../Utils/Google Utils/GoogleVerification');


    try {
        const auth = googleAuthClient();
        const drive = await google.drive({ version: 'v3', auth });

        drive.files.list({
            q: `name contains '1002_prof' and '1hLkL05wOATzeQNNlitMQGkx7qYvlE0z0' in parents and (name contains '.jpeg' or name contains '.webp' or name contains '.jpg'  or name contains '.png')`,
            fields: 'files(id, name)',
            spaces: 'drive',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            const files = res.data.files;

            if (files.length) {
                console.log('Files:');
                let found;
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                    // You can download the file here or call another function to handle the download
                    // downloadFile(file.id);
                    found = file.name;
                });

            
                // next();

            } else {
                console.log('No files found.');
            }
        });

    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        res.status(500).send('Error uploading file');
    }
}
