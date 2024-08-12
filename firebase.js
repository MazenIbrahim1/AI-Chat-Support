// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmlRSURvYpADwIhHNy1ghGF4h1ShKcFCM",
    authDomain: "feedback-96bbd.firebaseapp.com",
    projectId: "feedback-96bbd",
    storageBucket: "feedback-96bbd.appspot.com",
    messagingSenderId: "673984516281",
    appId: "1:673984516281:web:a20e8409abf06394704b68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }