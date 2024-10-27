import { getFirestore, query, where, collection,  doc, setDoc, getDoc, updateDoc,deleteDoc,  getDocs, increment, DocumentReference, DocumentData } from 'firebase/firestore';
import {GoogleAuthProvider, getAuth,signInWithPopup, signInWithEmailAndPassword,reauthenticateWithCredential, onAuthStateChanged,deleteUser, User} from 'firebase/auth';
import app from '../firebaseConfig';
const auth = getAuth(app);
const db = getFirestore(app);

interface UserData {
  username?: string;
  email: string;
  downloadCount: number;
  profileUrl?: string;
  uploadCount: number;
  photoURL?: string;
  uid?:string;
}

export default class UserService {
   static getCurrentUser() {
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
	      return {uid, ...userDoc.data()} as UserData;  // Return the user data with the correct type
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Function to create a new user document
  static async createUserDocument(uid: string, email: string, photoURL: string | null ): Promise<void> {
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
	    const userData = await UserService.getUserData(user.uid);

	    if (userData) {
		    {/*provider id is what they used to sign with e.g google.com, password...*/}
		    if (user.providerData[0].providerId === 'password') {
			    // Re-authenticate with email and password
			    await signInWithEmailAndPassword(auth, userData.email, password);
		    } else if (user.providerData[0].providerId === 'google.com') {
			    const provider = new GoogleAuthProvider();
			    const result = await signInWithPopup(auth, provider);
			    const credential = GoogleAuthProvider.credentialFromResult(result);
			    if (credential) {
				    // Re-authenticate the user with the credential
				    await reauthenticateWithCredential(user, credential);
			    } else {
				    throw new Error('Failed to obtain Google credential');
			    }

			    // Re-authenticate the user with the credential
			    await reauthenticateWithCredential(user, credential);
		    } else {
			    throw new Error('Unsupported authentication provider');
		    }
	    } else {
		    throw new Error('No user obtained');
	    }
    } catch (error) {
      console.error('Error during re-authentication:', error);
      throw error; // Throw the error to handle it in the calling function
    }
  }
static async deleteUserAccount(user: User): Promise<void> {
  try {
    const userData = await UserService.getUserData(user.uid);
    if (!userData || !userData.uid) {
      throw new Error("No valid user data obtained");
    }

    const userDocRef = doc(db, "users", userData.uid);
    await deleteDoc(userDocRef);

    await this.deleteUserSavedMaterials(user.uid);

    await this.deleteUserOpenedMaterials(user.uid);

    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}
// Function to delete all saved materials associated with a user
static async deleteUserSavedMaterials(userId: string): Promise<void> {
  try {
    const savedRef = collection(db, "savedMaterials");
    const querySnapshot = await getDocs(query(savedRef, where("userId", "==", userId)));

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Error deleting saved materials for userId ${userId}:`, error);
    throw error;
  }
}

// Function to delete all opened materials associated with a user
static async deleteUserOpenedMaterials(userId: string): Promise<void> {
  try {
    const openedRef = collection(db, "openedMaterials");
    const querySnapshot = await getDocs(query(openedRef, where("userId", "==", userId)));

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Error deleting opened materials for userId ${userId}:`, error);
    throw error;
  }
}

}

