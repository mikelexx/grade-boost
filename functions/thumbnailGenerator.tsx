const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises; // Use the promises API for fs
const path = require('path');
const { createCanvas } = require('canvas'); // For image rendering
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;
  console.log('generating thumbnai for this filepath: ', filePath);
  const contentType = object.contentType;

  if (contentType === 'application/pdf') {
    const tempFilePath = path.join('/tmp', path.basename(filePath));

    // Download the file to a temporary location to reduce number fo firebase storage
    // interactions reducing latency. ALso i don't want to accidentaly affect
    // original file.
    await bucket.file(filePath).download({ destination: tempFilePath });

    // draw image of the firstpage on canvas and save that image as the thumbnail
    const pdfBytes = await fs.readFile(tempFilePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    page.draw(context);
    const thumbnailPath = path.join('/tmp', `thumb_${path.basename(filePath, '.pdf')}.png`);
    const buffer = canvas.toBuffer('image/png');

    await fs.writeFile(thumbnailPath, buffer);

    // Upload the thumbnail from localpath(tmp i just created) to Firebase Storage
    const destinationThumbPath = `thumbnails/thumb_${path.basename(filePath)}`;
    await bucket.upload(thumbnailPath, { destination: `thumbnails/thumb_${destinationThumbPath}`});

    // clean up temporary files
    await fs.unlink(tempFilePath);
    await fs.unlink(thumbnailPath);

    // Get the signed URL for the uploaded thumbnail
    const thumbnailUrl = await bucket.file(destinationThumbPath).getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Long expiration for public access
    });

    // Update Firestore document with the geneeated thumbnail URL
    const db = admin.firestore();
    const materialsRef = db.collection('materials').doc(filePath.split('/').pop());
    await materialsRef.update({
      thumbnailUrl: thumbnailUrl[0], // Update the document with the first URL from the array
    });

    console.log('Thumbnail generated for PDF:', filePath);
  }
});

