import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHUX8C_WBR_FtAOzlx41vC4D0RrM5MR0c",
  authDomain: "scheduler-ac553.firebaseapp.com",
  projectId: "scheduler-ac553",
  storageBucket: "scheduler-ac553.appspot.com",
  messagingSenderId: "230195785939",
  appId: "1:230195785939:web:91d5392befd315e4fe6426",
  measurementId: "G-E5MH4GR0QL",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
