import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6Ztf_DhA5PoGJ_c1stz98iNUw2IzGV8A",
  authDomain: "zetalinked-d3d78.firebaseapp.com",
  projectId: "zetalinked-d3d78",
  storageBucket: "zetalinked-d3d78.firebasestorage.app",
  messagingSenderId: "1077201355742",
  appId: "1:1077201355742:web:728a1c15548b49ed34534f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
