import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU4SWNMlHa4SBXZffDoMHY859IOVndCTw",
  authDomain: "smart-retail-48fce.firebaseapp.com",
  projectId: "smart-retail-48fce",
  storageBucket: "smart-retail-48fce.appspot.com",
  messagingSenderId: "763664720935",
  appId: "1:763664720935:web:2beabf56922ecd3106da02",
  measurementId: "G-1TFW04G0NT"
};
// Initialize Firebase
initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
export const firebaseDB = getFirestore();