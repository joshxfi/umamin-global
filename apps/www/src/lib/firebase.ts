import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC3C9scwkR2tbJHxSodUq46dnyPirUULBQ",
  authDomain: "umamin-global.firebaseapp.com",
  projectId: "umamin-global",
  storageBucket: "umamin-global.appspot.com",
  messagingSenderId: "355086340864",
  appId: "1:355086340864:web:ca9653f1f2c7115a80d9e5",
  measurementId: "G-0S0X0VLGVJ",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
