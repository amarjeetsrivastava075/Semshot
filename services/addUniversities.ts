import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export async function addUniversity(data: any) {
  await addDoc(collection(db, "universities"), {
    ...data,
    createdAt: new Date(),
  });
}