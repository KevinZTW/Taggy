import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDm9y9LooIll5HBJY1gHfJm8_G-khi4TOs",
    authDomain: "taggy-a0164.firebaseapp.com",
    projectId: "taggy-a0164",
    storageBucket: "taggy-a0164.appspot.com",
    messagingSenderId: "822200641725",
    appId: "1:822200641725:web:ac84d441689da47304efd4",
    measurementId: "G-TW98Q8LRFC"
  };
  
  // Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);