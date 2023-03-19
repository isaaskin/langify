import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit, documentId, where } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARxPHJYjVLOJjq6lzxh9WZnh1vyYgtj04",
  authDomain: "langify-45b13.firebaseapp.com",
  projectId: "langify-45b13",
  storageBucket: "langify-45b13.appspot.com",
  messagingSenderId: "796821918654",
  appId: "1:796821918654:web:32e461599e0b15050edfef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }

export const getLastDocumentById = async (): Promise<number> => {
  const q = await getDocs(query(collection(db, "words"), orderBy("id", "desc"), limit(1)));
  return q.docs[0].data().id as number;
}
