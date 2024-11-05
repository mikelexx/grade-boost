import { getStorage, getBlob, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, getDocs, deleteDoc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import app from '../firebaseConfig'; // Assuming the Firebase config is correctly set
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function
import UserService from './firebaseUser';
//import * as pdfjs from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import { FileMaterial } from '@/types/FileMaterial';
//import { pdfjs } from 'pdfjs-dist/legacy/build/pdf';

// Set the worker to the local file for legacy after installing
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';


const storage = getStorage(app);
const db = getFirestore(app);

// Set the worker to the local file you downloaded
//pdfjs.GlobalWorkerOptions.workerSrc = '/build/pdf.worker.mjs';
// am trying this to resolve promise.withresolver function not available error

export default class FileService {
  static async uploadMaterial(file: File, userId: string, materialType: string, courseCode?: string, fieldOfStudy?: string) {
    try {
      const storageRef = ref(storage, `materials/${uuidv4()}`);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);
      const thumbnailUrl = await FileService.createThumbnail(file);

      // Simulate fuzzy search
      const tags = file.name.split(/[\s-_]+/).map(word => word.toLowerCase());
      const fieldOfStudyTags = fieldOfStudy?.toLowerCase().split(/[\s-]+/);
      if (courseCode) tags.push(courseCode.toLowerCase());

      const material: FileMaterial = {
        authorId: userId,
        fileName: file.name,
        materialType,
        courseCode,
        fieldOfStudy,
        fileNameTags: tags,
	fieldOfStudyTags,
        fileUrl: downloadURL,
        thumbnailUrl: thumbnailUrl,
        uploadedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "materials"), material);
      console.log('File and thumbnail uploaded successfully');
    } catch (error) {
      console.error('Error uploading file or creating Firestore document:', error);
      throw error;
    }
  }

  static async downloadFile(fileName: string, fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, fileUrl);
      const blob = await getBlob(fileRef);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
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
        if (materialDoc.exists()) {
          return { id: materialDoc.id, ...materialDoc.data() } as FileMaterial;
        } else {
          return null;
        }
      });
      const savedMaterials = await Promise.all(savedMaterialsPromises);
      return savedMaterials.filter(material => material !== null) as FileMaterial[];
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
        return;
      }

      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "savedMaterials", docId));
    } catch (error) {
      console.error("Error removing saved material:", error);
      throw error;
    }
  }

  static async searchMaterials(queryStr: string) {
    const materialsRef = collection(db, "materials");
    const keywords = queryStr.toLowerCase().split(" ");
    const queryParam = query(
      materialsRef,
      where('fileNameTags', 'array-contains-any', keywords)
    );
    const querySnapshot = await getDocs(queryParam);

    const materials = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as FileMaterial;
      const material: FileMaterial = {
        id: doc.id,
        ...data,
      };

      if (material.authorId) {
        const userData = await UserService.getUserData(material.authorId);
        if (userData) {
          material.authorPhotoUrl = userData.photoURL || '/images/defaultUser.png';
          material.authorName = userData.username || '';
        }
      }
      return material;
    }));

    return materials;
  }

  static async getRecentMaterials(limitCount: number = 5) {
    const materialsRef = collection(db, "materials");
    const q = query(materialsRef, orderBy('uploadedAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const recentMaterials = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as FileMaterial;
        const material: FileMaterial = {
          id: doc.id,
          ...data,
        };
        return material;
      })
    );

    return recentMaterials;
  }

  static async searchFilesByCategory(category: string) {
    const materialsRef = collection(db, 'materials');
    const categoryArray = category.split(/[\s-]+/).map(word => word.toLowerCase());

    const q = query(
      materialsRef,
      where('fieldOfStudyTags', 'array-contains-any', categoryArray)
    );

    const querySnapshot = await getDocs(q);

    const results: FileMaterial[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as FileMaterial;
      return {
        id: doc.id,
        ...data,
      };
    });

    return results;
  }

  static async createThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdf = await pdfjs.getDocument(new Uint8Array(reader.result as ArrayBuffer)).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error("Failed to get 2D context for the canvas."));
            return;
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
          const thumbnailBlob = await (await fetch(thumbnailDataUrl)).blob();
          const thumbnailRef = ref(storage, `thumbnails/${uuidv4()}.jpg`);

          await uploadBytes(thumbnailRef, thumbnailBlob);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          resolve(thumbnailUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static async hasUserAccessedFileBefore(userId: string, fileId: string): Promise<boolean> {
    try {
      const openedRef = collection(db, "openedMaterials");
      const querySnapshot = await getDocs(
        query(openedRef, where("userId", "==", userId), where("fileId", "==", fileId))
      );

      return !querySnapshot.empty; // Returns true if the file has been accessed
    } catch (error) {
      console.error("Error checking file access history:", error);
      return false;
    }
  }
  static async logUserFileAccess(userId: string, fileId: string): Promise<void> {
	  {/*Logs the user's access to the file by adding a document to openedMaterials
	     if it's the first access.*/}
    try {
      const openedRef = collection(db, "openedMaterials");
      await addDoc(openedRef, {
        userId: userId,
        fileId: fileId,
        accessedAt: new Date(),
      });
    } catch (error) {
      console.error("Error logging file access:", error);
    }
  }
  static async checkAndLogFileAccess(userId: string, fileId: string): Promise<boolean> {
    const hasAccessedBefore = await this.hasUserAccessedFileBefore(userId, fileId);
    if (!hasAccessedBefore) {
      await this.logUserFileAccess(userId, fileId);
    }
    return !hasAccessedBefore;
  }

}
