// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBy5StWSK9VwiK65fvN9SkypyMxXMcJifA',
	authDomain: 'hose-market.firebaseapp.com',
	projectId: 'hose-market',
	storageBucket: 'hose-market.appspot.com',
	messagingSenderId: '588536291762',
	appId: '1:588536291762:web:b2b5e0617d32ed15ff04ab',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore();
