import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, DocumentReference, DocumentData } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User} from 'firebase/auth';
import app from '../firebaseConfig';
const auth = getAuth(app);
const db = getFirestore(app);

interface UserData {
  email: string;
  downloadCount: number;
  uploadCount: number;
}

export default class UserService {
   static getCurrentUser() {
    return auth.currentUser;
  }
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Function to get user data
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData;  // Return the user data with the correct type
      } else {
        console.log('User document not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Function to create a new user document
  static async createUserDocument(uid: string, email: string): Promise<void> {
    try {
      const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        email: email,
        downloadCount: 0,
        uploadCount: 0,
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  // Function to increment download count
  static async incrementDownloadCount(uid: string): Promise<void> {
    try {
      const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', uid);
      await updateDoc(userDocRef, { downloadCount: increment(1) });
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  }

  // Function to increment upload count
  static async incrementUploadsCount(uid: string): Promise<void> {
    try {
      const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', uid);
      await updateDoc(userDocRef, { uploadCount: increment(1) });
    } catch (error) {
      console.error('Error incrementing upload count:', error);
      throw error;
    }
  }
}

