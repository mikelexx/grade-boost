import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../firebaseConfig'; // Assuming the Firebase config is correctly set
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function
import * as pdfjs from 'pdfjs-dist';

const storage = getStorage(app);
const db = getFirestore(app);

// Set the worker to the local file you downloaded
pdfjs.GlobalWorkerOptions.workerSrc = '/build/pdf.worker.mjs';

export default class FileService {
  static async uploadMaterial(file: File, userId: string, materialType?: string, courseCode?: string, fieldOfStudy?: string) {
    try {
      // Generate a unique filename for the uploaded file
      const storageRef = ref(storage, `materials/${uuidv4()}`);

      // Upload the PDF file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded PDF
      const downloadURL = await getDownloadURL(storageRef);

      // Create a thumbnail for the PDF
      const thumbnailUrl = await FileService.createThumbnail(file);

      // Save document to Firestore
      await addDoc(collection(db, "materials"), {
        userId,
        fileName: file.name,
        materialType,
        courseCode,
        fieldOfStudy,
        fileUrl: downloadURL,
        thumbnailUrl: thumbnailUrl, // Add the thumbnail URL to the document
        uploadedAt: new Date(),
      });

      console.log('File and thumbnail uploaded successfully');
    } catch (error) {
      console.error('Error uploading file or creating Firestore document:', error);
      throw error;
    }
  }

  static async createThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Get the PDF document from the loaded array buffer
          const pdf = await pdfjs.getDocument(new Uint8Array(reader.result as ArrayBuffer)).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          // Convert canvas to a JPEG image
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
          const thumbnailBlob = await (await fetch(thumbnailDataUrl)).blob(); // Convert Data URL to Blob
          const thumbnailRef = ref(storage, `thumbnails/${uuidv4()}.jpg`);

          // Upload the Blob instead of the Data URL
          await uploadBytes(thumbnailRef, thumbnailBlob);

          // Get the download URL for the thumbnail
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          resolve(thumbnailUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}

