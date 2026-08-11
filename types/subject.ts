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

export type SubjectData = {
  courseId: string;
  branchId: string;
  semesterId: string;
  name: string;
  code: string;
  credits: number;
  units: string[];
  description: string;
};

export async function addSubject(data: SubjectData) {
  const ref = await addDoc(collection(db, "subjects"), {
    ...data,
    createdAt: new Date(),
  });

  return ref.id;
}

export async function getSubjects(
  semesterId?: string,
  branchId?: string,
  courseId?: string
) {
  const subjectsRef = collection(db, "subjects");

  let q;

  if (semesterId) {
    q = query(
      subjectsRef,
      where("semesterId", "==", semesterId)
    );
  } else if (branchId) {
    q = query(
      subjectsRef,
      where("branchId", "==", branchId)
    );
  } else if (courseId) {
    q = query(
      subjectsRef,
      where("courseId", "==", courseId)
    );
  } else {
    const snapshot = await getDocs(subjectsRef);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getSubjectById(id: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "subjects"),
      where("__name__", "==", id)
    )
  );

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

export async function deleteSubject(id: string) {
  await deleteDoc(doc(db, "subjects", id));
}