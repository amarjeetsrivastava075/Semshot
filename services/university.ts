import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export async function getUniversities() {
  const snapshot = await getDocs(
    collection(db, "universities")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addUniversity(data: any) {
  await addDoc(
    collection(db, "universities"),
    data
  );
}