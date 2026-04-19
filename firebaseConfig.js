import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfoAA-e6LxUOLtmxCOFzq4AYUdU1u8Y10",
  authDomain: "bhoomi-b2388.firebaseapp.com",
  projectId: "bhoomi-b2388",
  storageBucket: "bhoomi-b2388.firebasestorage.app",
  messagingSenderId: "386307038540",
  appId: "1:386307038540:web:cf7ef67fea94dab4cb83e9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
