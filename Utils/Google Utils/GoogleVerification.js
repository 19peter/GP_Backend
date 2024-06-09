const { google } = require('googleapis');
const path = require('path');

let googleAuthClient = () => {
    // const SERVICE_ACCOUNT_FILE = require('./ServiceAccountCreds.json')
    const SERVICE_ACCOUNT_FILE =  path.join(__dirname, 'ServiceAccountCreds.json');
 

    const SCOPES = ['https://www.googleapis.com/auth/drive'];


    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: SCOPES,
    });

    return auth;
}

module.exports = googleAuthClient;



