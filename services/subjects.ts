import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export type SubjectData = {
  universityId: string;
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
    createdAt: Timestamp.now(),
  });

  return ref.id;
}

export async function getSubjects(
  universityId?: string,
  courseId?: string,
  branchId?: string,
  semesterId?: string
) {
  const snapshot = await getDocs(collection(db, "subjects"));

  const subjects = snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      universityId: data.universityId || "",
      courseId: data.courseId || "",
      branchId: data.branchId || "",
      semesterId: data.semesterId || "",
      name: data.name || data.subjectName || "Unnamed Subject",
      code: data.code || data.subjectCode || "",
      credits: Number(data.credits || 0),
      units: Array.isArray(data.units) ? data.units : [],
      description: data.description || "",
    };
  });

  return subjects.filter((subject) => {
    const universityMatch =
      !universityId ||
      !subject.universityId ||
      subject.universityId === universityId;

    const courseMatch =
      !courseId ||
      !subject.courseId ||
      subject.courseId === courseId;

    const branchMatch =
      !branchId ||
      !subject.branchId ||
      subject.branchId === branchId;

    const semesterMatch =
      !semesterId ||
      !subject.semesterId ||
      subject.semesterId === semesterId;

    return (
      universityMatch &&
      courseMatch &&
      branchMatch &&
      semesterMatch
    );
  });
}

export async function getSubjectById(id: string) {
  const snapshot = await getDoc(doc(db, "subjects", id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function deleteSubject(id: string) {
  await deleteDoc(doc(db, "subjects", id));
}