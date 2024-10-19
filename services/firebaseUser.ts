import { getFirestore, doc, setDoc, getDoc, updateDoc,deleteDoc, increment, DocumentReference, DocumentData } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,deleteUser, User} from 'firebase/auth';
import app from '../firebaseConfig';
const auth = getAuth(app);
const db = getFirestore(app);

interface UserData {
  username?: string;
  email: string;
  downloadCount: number;
  profileUrl?: string;
  uploadCount: number;
}

export default class UserService {
   static getCurrentUser() {
	   console.log('getCurrentUser called')
    return auth.currentUser;

  }
  static getCurrentUserPromise(){
	  return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });
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
  static async createUserDocument(uid: string, email: string, photoURL: string | null): Promise<void> {
    try {
      const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        email: email,
        downloadCount: 0,
        uploadCount: 0,
	photoURL
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
  static async reauthenticateUser(user: User, password: string): Promise<void> {
    const auth = getAuth(app);
    try {
      // Use signInWithEmailAndPassword to re-authenticate
      await signInWithEmailAndPassword(auth, user.email, password);
    } catch (error) {
      console.error('Error during re-authentication:', error);
      throw error; // Throw the error to handle it in the calling function
    }
  }

  static async deleteUser(user: User): Promise<void> {

		  try {
		    const userDocRef: DocumentReference<DocumentData> = doc(db, 'users', user.uid);
		    await deleteDoc(userDocRef);
		    await deleteUser(user);
		  } catch (error) {
		     console.error('Error deleting account:', error);
		    throw error;
		  }

}
}

