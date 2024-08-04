// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRDzjFNeFQZ9fbMhTApabUa-LE2hNyuuc",
  authDomain: "pantrytracker-e09a5.firebaseapp.com",
  projectId: "pantrytracker-e09a5",
  storageBucket: "pantrytracker-e09a5.appspot.com",
  messagingSenderId: "724900725949",
  appId: "1:724900725949:web:41ff94ffbc41aa778ee3d4",
  measurementId: "G-MRS2RJQXJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {
  app, firestore
}