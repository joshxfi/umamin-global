import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFDyEq6l8Zd-WlC6ZzHCUC8Slnxe_SXfY",
  authDomain: "umamin-app.firebaseapp.com",
  projectId: "umamin-app",
  storageBucket: "umamin-app.appspot.com",
  messagingSenderId: "496522144815",
  appId: "1:496522144815:web:5cc62492d4b2026d8e2ada",
  measurementId: "G-KD9PJ5MKHJ",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
