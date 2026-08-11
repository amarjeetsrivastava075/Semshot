import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Course } from "@/types/course";

const coursesCollection = collection(db, "courses");

export async function addCourse(data: Omit<Course, "id" | "createdAt">) {
  const ref = await addDoc(coursesCollection, {
    ...data,
    createdAt: Timestamp.now(),
  });

  return ref.id;
}

export async function getCourses() {
  const q = query(coursesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    createdAt: item.data().createdAt?.toDate?.() || new Date(),
  })) as Course[];
}

export async function deleteCourse(id: string) {
  await deleteDoc(doc(db, "courses", id));
}