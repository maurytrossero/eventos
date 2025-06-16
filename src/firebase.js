// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCN7loGI9Tp6H241Yz5AC0NQE9p_XiXSPk",
    authDomain: "eventos-43096.firebaseapp.com",
    projectId: "eventos-43096",
    storageBucket: "eventos-43096.firebasestorage.app",
    messagingSenderId: "21567775570",
    appId: "1:21567775570:web:da6d13c77dbedf5537908b",
    measurementId: "G-X2F9192TRM"
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
//# sourceMappingURL=firebase.js.map