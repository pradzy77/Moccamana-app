import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBC4Efz5oUGxM_X_FJ3zLzDD-rOjRIXLfY",
  authDomain: "moccamana.firebaseapp.com",
  databaseURL: "https://moccamana-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moccamana",
  storageBucket: "moccamana.firebasestorage.app",
  messagingSenderId: "654160519334",
  appId: "1:654160519334:web:34501b5b046936cd7cd467",
  measurementId: "G-P8R6GSYYRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
