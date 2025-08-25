
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO8884PUgdwifE1-kejbgcQW_ZpoZOJ5A",
  authDomain: "anan-image.firebaseapp.com",
  projectId: "anan-image",
  storageBucket: "anan-image.appspot.com",
  messagingSenderId: "466165140963",
  appId: "1:466165140963:web:767aba95b76a9f7bae64d6",
  measurementId: "G-V57TR8KJ3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);