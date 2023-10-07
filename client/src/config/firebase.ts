import { initializeApp, getApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB8Grqsv1-Ey6xcNzu5lUBnIE3l9IZcVX8",
  authDomain: "general-324a0.firebaseapp.com",
  projectId: "general-324a0",
  storageBucket: "general-324a0.appspot.com",
  messagingSenderId: "991655734727",
  appId: "1:991655734727:web:5c38901c6f896326497de2",
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

const auth = getAuth(app)

export { app, auth }
