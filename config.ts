// Firebase configuration
// ВАЖНО: Замените эти значения на свои из Firebase Console
// 1. Идите на https://console.firebase.google.com/
// 2. Создайте проект
// 3. Добавьте веб-приложение
// 4. Скопируйте конфигурацию сюда
// 5. Включите Google Sign-In в Authentication → Sign-in method

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0Vs_fdjcYPhULx9ZE_1QGukgOyjDngsw",
  authDomain: "boiling-point-288dd.firebaseapp.com",
  projectId: "boiling-point-288dd",
  storageBucket: "boiling-point-288dd.firebasestorage.app",
  messagingSenderId: "791287796414",
  appId: "1:791287796414:web:811c73f09539652e33c4ef",
  measurementId: "G-EX31E643ZF"
};

// Проверяем, настроен ли Firebase
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, db, googleProvider };
