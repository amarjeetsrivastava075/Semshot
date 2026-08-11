import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export type SemesterData = {
  courseId: string;
  branchId: string;
  name: string;
  number: number;
  description: string;
};

export async function addSemester(data: SemesterData) {
  const ref = await addDoc(collection(db, "semesters"), {
    ...data,
    createdAt: new Date(),
  });

  return ref.id;
}

export async function getSemesters(
  courseId?: string,
  branchId?: string
) {
  const semestersRef = collection(db, "semesters");

  let q;

  if (branchId) {
    q = query(
      semestersRef,
      where("branchId", "==", branchId)
    );
  } else if (courseId) {
    q = query(
      semestersRef,
      where("courseId", "==", courseId)
    );
  } else {
    const snapshot = await getDocs(semestersRef);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data(),
    }))
    .sort((a: any, b: any) => a.number - b.number);
}

export async function deleteSemester(id: string) {
  await deleteDoc(doc(db, "semesters", id));
}