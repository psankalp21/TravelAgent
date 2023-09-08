import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function uploadPDFToGoogleDrive(pdfFilePath) {
    const folderName = "pdf"
    const serviceFilePath = path.join(__dirname, '../../drive.json');
    const auth = new google.auth.GoogleAuth({
        keyFile: serviceFilePath, 
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: 'data.pdf',
        parents: folderName ? [folderName] : [], 
    };

    const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(pdfFilePath),
    };

    try {
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log(`File ID: ${response.data.id}`);
    } catch (err) {
        console.error(`Error uploading PDF: ${err}`);
    }
}

export { uploadPDFToGoogleDrive };
