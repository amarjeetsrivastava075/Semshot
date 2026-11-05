import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

async function migrateSubjects() {
  const subjectsSnapshot = await getDocs(collection(db, "subjects"));

  for (const subjectDoc of subjectsSnapshot.docs) {
    const subject = subjectDoc.data();

    if (!subject.courseId) {
      console.log(`Skipping ${subjectDoc.id}: no courseId`);
      continue;
    }

    const courseRef = doc(db, "courses", subject.courseId);
    const courseSnapshot = await getDocs(
      collection(db, "courses")
    );

    const courseDoc = courseSnapshot.docs.find(
      (item) => item.id === subject.courseId
    );

    if (!courseDoc) {
      console.log(
        `Skipping ${subjectDoc.id}: course not found`
      );
      continue;
    }

    const course = courseDoc.data();

    if (!course.universityId) {
      console.log(
        `Skipping ${subjectDoc.id}: course has no universityId`
      );
      continue;
    }

    await updateDoc(subjectDoc.ref, {
      universityId: course.universityId,
    });

    console.log(
      `Updated: ${subject.name} → ${course.universityId}`
    );
  }

  console.log("Subject migration completed.");
}

migrateSubjects();