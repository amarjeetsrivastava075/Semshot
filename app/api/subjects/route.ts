import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "subjects"));

    const subjects = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name || data.subjectName || "",
        code: data.code || data.subjectCode || "",
        credits: data.credits || 0,
        units: Array.isArray(data.units) ? data.units : [],
        syllabus: Array.isArray(data.syllabus) ? data.syllabus : [],
        description: data.description || "",
        courseId: data.courseId || "",
        courseName: data.courseName || "",
        branchId: data.branchId || "",
        branchName: data.branchName || "",
        semesterId: data.semesterId || "",
        semesterName: data.semesterName || "",
      };
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Subjects API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch subjects",
      },
      {
        status: 500,
      }
    );
  }
}