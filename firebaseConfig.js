import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDl0Er3GAAePfmCSu7erdgUddhB3cH1sqk",
  authDomain: "app-control-77886.firebaseapp.com",
  projectId: "app-control-77886",
  storageBucket: "app-control-77886.firebasestorage.app",
  messagingSenderId: "546194684037",
  appId: "1:546194684037:web:4105bbe5a642756e89d1ec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;