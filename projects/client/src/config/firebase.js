import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider, signOut,signInWithGoogleRedirect } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRFUUPR5hHSw4BqfkNn-c7q80Ga3I0fik",
  authDomain: "nginepcom.firebaseapp.com",
  projectId: "nginepcom",
  storageBucket: "nginepcom.appspot.com",
  messagingSenderId: "903799666581",
  appId: "1:903799666581:web:113b38f6ebd7282176289c",
  measurementId: "G-JTEHJKKP48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})
export const auth = getAuth()
  
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider)


export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)