import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBAm-GxeTN5PGY8GgPwVzQhmUrB1EAcEL0",
  authDomain: "sahar-modestbrand.firebaseapp.com",
  projectId: "sahar-modestbrand",
  storageBucket: "sahar-modestbrand.firebasestorage.app",
  messagingSenderId: "888470419107",
  appId: "1:888470419107:web:97717a975fd85b43e0f116"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);