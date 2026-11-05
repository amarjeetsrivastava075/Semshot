import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const courses = [
  {
    name: "B.Tech",
    code: "BTECH",
    semesters: 8,
    branches: [
      ["Computer Science & Engineering", "CSE"],
      ["Artificial Intelligence & Machine Learning", "CSE-AIML"],
      ["Artificial Intelligence & Data Science", "CSE-AIDS"],
      ["Data Science", "CSE-DS"],
      ["Information Technology", "IT"],
      ["Cyber Security", "CSE-CS"],
      ["Electronics & Communication Engineering", "ECE"],
      ["Electrical Engineering", "EE"],
      ["Mechanical Engineering", "ME"],
      ["Civil Engineering", "CE"],
      ["Biotechnology", "BT"],
    ],
  },
  {
    name: "BCA",
    code: "BCA",
    semesters: 6,
    branches: [
      ["Computer Applications", "BCA"],
      ["Artificial Intelligence & Data Science", "BCA-AIDS"],
      ["Data Science", "BCA-DS"],
    ],
  },
  {
    name: "BBA",
    code: "BBA",
    semesters: 6,
    branches: [
      ["General", "BBA"],
      ["Finance", "BBA-FIN"],
      ["Marketing", "BBA-MKT"],
      ["Human Resource Management", "BBA-HRM"],
    ],
  },
  {
    name: "B.Com",
    code: "BCOM",
    semesters: 6,
    branches: [
      ["General", "BCOM"],
      ["Computer Applications", "BCOM-CA"],
      ["Honours", "BCOM-H"],
    ],
  },
  {
    name: "B.Sc",
    code: "BSC",
    semesters: 6,
    branches: [
      ["Computer Science", "BSC-CS"],
      ["Information Technology", "BSC-IT"],
      ["Mathematics", "BSC-MATH"],
      ["Physics", "BSC-PHY"],
      ["Chemistry", "BSC-CHEM"],
      ["Biotechnology", "BSC-BT"],
    ],
  },
  {
    name: "BA",
    code: "BA",
    semesters: 6,
    branches: [
      ["General", "BA"],
      ["English", "BA-ENG"],
      ["Economics", "BA-ECO"],
      ["Psychology", "BA-PSY"],
      ["Political Science", "BA-PS"],
    ],
  },
  {
    name: "B.Pharm",
    code: "BPHARM",
    semesters: 8,
    branches: [
      ["Pharmacy", "BPHARM"],
    ],
  },
  {
    name: "M.Tech",
    code: "MTECH",
    semesters: 4,
    branches: [
      ["Computer Science & Engineering", "MTECH-CSE"],
      ["Artificial Intelligence", "MTECH-AI"],
      ["Data Science", "MTECH-DS"],
      ["Cyber Security", "MTECH-CS"],
      ["Electronics & Communication Engineering", "MTECH-ECE"],
      ["Mechanical Engineering", "MTECH-ME"],
    ],
  },
  {
    name: "MCA",
    code: "MCA",
    semesters: 4,
    branches: [
      ["Computer Applications", "MCA"],
      ["Artificial Intelligence", "MCA-AI"],
      ["Data Science", "MCA-DS"],
      ["Cyber Security", "MCA-CS"],
    ],
  },
  {
    name: "MBA",
    code: "MBA",
    semesters: 4,
    branches: [
      ["General", "MBA"],
      ["Finance", "MBA-FIN"],
      ["Marketing", "MBA-MKT"],
      ["Human Resource Management", "MBA-HRM"],
      ["Business Analytics", "MBA-BA"],
    ],
  },
  {
    name: "M.Sc",
    code: "MSC",
    semesters: 4,
    branches: [
      ["Computer Science", "MSC-CS"],
      ["Mathematics", "MSC-MATH"],
      ["Physics", "MSC-PHY"],
      ["Chemistry", "MSC-CHEM"],
      ["Biotechnology", "MSC-BT"],
      ["Data Science", "MSC-DS"],
    ],
  },
  {
    name: "M.Com",
    code: "MCOM",
    semesters: 4,
    branches: [
      ["Commerce", "MCOM"],
      ["Finance", "MCOM-FIN"],
    ],
  },
  {
    name: "LLB",
    code: "LLB",
    semesters: 6,
    branches: [
      ["Law", "LLB"],
    ],
  },
  {
    name: "LLM",
    code: "LLM",
    semesters: 4,
    branches: [
      ["Law", "LLM"],
    ],
  },
  {
    name: "B.A. LL.B",
    code: "BALLB",
    semesters: 10,
    branches: [
      ["Law", "BALLB"],
    ],
  },
  {
    name: "BBA LL.B",
    code: "BBALLB",
    semesters: 10,
    branches: [
      ["Law", "BBALLB"],
    ],
  },
  {
    name: "B.Com LL.B",
    code: "BCOMLLB",
    semesters: 10,
    branches: [
      ["Law", "BCOMLLB"],
    ],
  },
];

async function getOrCreateCourse(
  name: string,
  code: string
) {
  const q = query(
    collection(db, "courses"),
    where("name", "==", name)
  );

  const snapshot = await getDocs(q);

  if (snapshot.docs.length > 0) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "courses"),
    {
      name,
      code,
      universityName: "Chandigarh University Lucknow",
      createdAt: Timestamp.now(),
    }
  );

  return ref.id;
}

async function getOrCreateBranch(
  courseId: string,
  name: string,
  code: string
) {
  const q = query(
    collection(db, "branches"),
    where("courseId", "==", courseId),
    where("name", "==", name)
  );

  const snapshot = await getDocs(q);

  if (snapshot.docs.length > 0) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "branches"),
    {
      courseId,
      name,
      code,
      description: `${name} branch`,
      createdAt: Timestamp.now(),
    }
  );

  return ref.id;
}

async function getOrCreateSemester(
  courseId: string,
  branchId: string,
  number: number
) {
  const q = query(
    collection(db, "semesters"),
    where("branchId", "==", branchId),
    where("number", "==", number)
  );

  const snapshot = await getDocs(q);

  if (snapshot.docs.length > 0) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "semesters"),
    {
      courseId,
      branchId,
      name: `Semester ${number}`,
      number,
      description: `Semester ${number}`,
      createdAt: Timestamp.now(),
    }
  );

  return ref.id;
}

export async function seedAcademicData() {
  for (const course of courses) {
    const courseId = await getOrCreateCourse(
      course.name,
      course.code
    );

    for (const [branchName, branchCode] of course.branches) {
      const branchId = await getOrCreateBranch(
        courseId,
        branchName,
        branchCode
      );

      for (
        let semester = 1;
        semester <= course.semesters;
        semester++
      ) {
        await getOrCreateSemester(
          courseId,
          branchId,
          semester
        );
      }
    }
  }
}