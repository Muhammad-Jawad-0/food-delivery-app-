 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
//  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore,collection, addDoc,query, where, getDocs,getDoc,doc ,serverTimestamp,updateDoc  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

 const firebaseConfig = {
  apiKey: "AIzaSyBb8V3GTp8bonVvCFAFOwexB9kAeluL_Pw",
  authDomain: "food-delivery-website-324db.firebaseapp.com",
  projectId: "food-delivery-website-324db",
  storageBucket: "food-delivery-website-324db.appspot.com",
  messagingSenderId: "889512414859",
  appId: "1:889512414859:web:47824d25694f4c82c24e8e",
  measurementId: "G-JWV87WWJPY"
 };

 const app = initializeApp(firebaseConfig);
//  const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app)


export {
    auth,
    signInWithEmailAndPassword ,
    onAuthStateChanged,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    getDoc ,
    doc,
    serverTimestamp,
    updateDoc
}

