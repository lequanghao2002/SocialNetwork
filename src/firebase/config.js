// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBFUhOrI5LRxT8hB9vX5hRbEKmUODosg5U',
    authDomain: 'social-network-97199.firebaseapp.com',
    projectId: 'social-network-97199',
    storageBucket: 'social-network-97199.appspot.com',
    messagingSenderId: '1026090028298',
    appId: '1:1026090028298:web:efe522ebd2faeee4bdfef3',
    measurementId: 'G-HHE8B2CKJV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
//const db = firebase.firestore();
const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, facebookProvider, googleProvider, githubProvider };
