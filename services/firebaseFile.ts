import { getStorage, getBlob, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc,doc, getDocs,deleteDoc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';

import app from '../firebaseConfig'; // Assuming the Firebase config is correctly set
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function
import UserService from './firebaseUser';
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

      const downloadURL = await getDownloadURL(storageRef);

      const thumbnailUrl = await FileService.createThumbnail(file);

      //to simulate fuzzy search because now firebase wants me to pay
      const tags = file.name.split(/[\s-_]+/).map(word => word.toLowerCase()); // Split by spaces and hyphens,underscores and lowercase
      const fieldOfStudyTags = fieldOfStudy?.toLowerCase().split(/[\s-]+/);// same case. for matching search by categories
      if(courseCode) tags.push(courseCode.toLowerCase()); // Add courseCode to the tags

      await addDoc(collection(db, "materials"), {
        authorId: userId,
        fileName: file.name,
        materialType,
        courseCode,
        fieldOfStudy,
	fileNameTags: tags,
	fieldOfStudyTags,
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
static async downloadFile(fileName: string, fileUrl: string): Promise<void> {
    try {
      // Reference the file in Firebase Storage
      const fileRef = ref(storage, fileUrl);

      // Fetch the file as a Blob
      const blob = await getBlob(fileRef);

      // Create a download link for the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error; // Re-throw the error for the calling component to handle
    }
  }
static async saveMaterial(fileId: string, userId: string) {
  try {
    const savedRef = collection(db, "savedMaterials");

    const querySnapshot = await getDocs(
      query(savedRef, where("userId", "==", userId), where("fileId", "==", fileId))
    );

    if (!querySnapshot.empty) {
      console.log("Material is already saved.");
      return;
    }
    await addDoc(savedRef, {
      userId: userId,
      fileId: fileId,
      savedAt: new Date(),
    });

    console.log(`Material saved successfully for userId ${userId}`);
  } catch (error) {

	  console.error(`Error saving material for userId ${userId}:`, error);
    throw error;
  }
}
static async getSavedMaterials(userId: string) {
  try {
    const savedRef = collection(db, "savedMaterials");
    const querySnapshot = await getDocs(
      query(savedRef, where("userId", "==", userId))
    );
    if (querySnapshot.empty) {
	    console.log(`No saved materials found for userId ${userId}.`);
      return [];
    }

    const savedMaterialsPromises = querySnapshot.docs.map(async (savedMaterialDoc) => {
      const fileId = savedMaterialDoc.data().fileId;
      const materialDoc = await getDoc(doc(db, "materials", fileId));
      console.log('material doc looks like', materialDoc.data());
      if (materialDoc.exists()) {
        return {id: materialDoc.id,  ...materialDoc.data() };
      } else {
        console.error(`Material with ID ${fileId} not found in the materials collection.`);
        return null;
      }
    });
    const savedMaterials = await Promise.all(savedMaterialsPromises);
    // Filter out any null values where the material was not found
    return savedMaterials.filter(material => material !== null);
  } catch (error) {
    console.error("Error getting saved materials:", error);
    throw error;
  }
}
static async removeSavedMaterial(fileId: string, userId: string) {
	console.log('called removeSavedMaterial');
  try {
    const savedRef = collection(db, "savedMaterials");

    const querySnapshot = await getDocs(

	    query(savedRef, where("userId", "==", userId), where("fileId", "==", fileId))
    );

    if (querySnapshot.empty) {
      console.log("Material not found in saved materials.");
      return;
    }

    // Assuming only one document for each saved material
    const docId = querySnapshot.docs[0].id;

    await deleteDoc(doc(db, "savedMaterials", docId));

    console.log("Saved material removed successfully.");
  } catch (error) {
    console.error("Error removing saved material:", error);
    throw error;
  }
}



static async searchMaterials(queryStr: string) {
    const materialsRef = collection(db, "materials");


    const queryParam = query(
      materialsRef,
      where('fileNameTags', 'array-contains', queryStr.toLowerCase())
    );
    const querySnapshot = await getDocs(queryParam);

  // Create an array to hold the materials
  const materials = await Promise.all(querySnapshot.docs.map(async (doc) => {
    const material = {
      id: doc.id,
      ...doc.data(),
    };

    // Populate author data asynchronously if available
        if (material.authorId) {
          const userData = await UserService.getUserData(material.authorId);
          if (userData) {
            material.authorPhotoUrl = userData.photoURL || '/images/defaultUser.png';
            material.authorName = userData.username || '';
          }
        }
        return material;
      })
    );

    return materials; // Return the array of materials with author info
  }
  static async getRecentMaterials(limitCount: number = 5) {
  const materialsRef = collection(db, "materials");

  const q = query(materialsRef, orderBy('uploadedAt', 'desc'),limit(limitCount));
  const querySnapshot = await getDocs(q);

  const recentMaterials = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const material = {
        id: doc.id,
        ...doc.data(),
      };

      // Populate author data asynchronously if available
      if (material.authorId) {
        const userData = await UserService.getUserData(material.authorId);
        if (userData) {
          material.authorPhotoUrl = userData.photoURL || '/images/defaultUser.png';
          material.authorName = userData.username || '';
        }
      }
      return material;
    })
  );

  return recentMaterials;
}
static async searchFilesByCategory(category: string) {
	console.log('called searchFilesByCategory');
  const materialsRef = collection(db, 'materials');
  const categoryArray = category.split(/[\s-]+/).map(word => word.toLowerCase());
  console.log('searching for these keywords in fieldOfStudyTags: ', categoryArray);

  const q = query(
    materialsRef,
    where('fieldOfStudyTags', 'array-contains-any', categoryArray)
  );

  const querySnapshot = await getDocs(q);

  const materials = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return materials;
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

static async openFile(userId: string, fileId: string): Promise<boolean> {
  try {
    const openedRef = collection(db, "openedMaterials");

    // Check if the user has already opened this file
    const querySnapshot = await getDocs(
      query(openedRef, where("userId", "==", userId), where("fileId", "==", fileId))
    );

    if (!querySnapshot.empty) {
      // User has already opened this file, do not increment download count
      return true;
    }

    // Add a record indicating the user opened this file
    await addDoc(openedRef, {
      userId: userId,
      fileId: fileId,
      openedAt: new Date(),
    });

    // Increment the user's download count
    await UserService.incrementDownloadCount(userId);
    return true;
  } catch (error) {
    console.error(`Error opening file for userId ${userId}:`, error);
    throw error;
  }
}

}

