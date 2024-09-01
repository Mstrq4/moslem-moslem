import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAWQv_vhkAOhaMCXiGhAp0F6oHyJKsdtYs",
    authDomain: "azkar-almoslem-7afd6.firebaseapp.com",
    projectId: "azkar-almoslem-7afd6",
    storageBucket: "azkar-almoslem-7afd6.appspot.com",
    messagingSenderId: "399928605497",
    appId: "1:399928605497:web:8e08b9ef877252b485c6e8",
    measurementId: "G-HMH4NP4RJ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// firebase login
// firebase init
// firebase deploy