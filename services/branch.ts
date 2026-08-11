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

export type BranchData = {
  courseId: string;
  name: string;
  code: string;
  description: string;
};

export async function addBranch(data: BranchData) {
  const ref = await addDoc(collection(db, "branches"), {
    ...data,
    createdAt: new Date(),
  });

  return ref.id;
}

export async function getBranches(courseId?: string) {
  const branchesRef = collection(db, "branches");

  if (courseId) {
    const q = query(
      branchesRef,
      where("courseId", "==", courseId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  }

  const snapshot = await getDocs(branchesRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function deleteBranch(id: string) {
  await deleteDoc(doc(db, "branches", id));
}