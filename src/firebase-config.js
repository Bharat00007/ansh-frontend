import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAy5YTk5k0K5CVcHz7rN78SQlwpaV7Wssk",
  authDomain: "evento-5b777.firebaseapp.com",
  projectId: "evento-5b777",
  storageBucket: "evento-5b777.firebasestorage.app",
  messagingSenderId: "972890263335",
  appId: "1:972890263335:web:a6143eaf350f37d9cf2302",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  
  export { auth, firestore, storage };