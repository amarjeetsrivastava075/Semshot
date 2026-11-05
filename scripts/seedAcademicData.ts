import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const UNIVERSITY_NAME = "Chandigarh University Lucknow";
const UNIVERSITY_CODE = "CUL";

const academicData = [
  {
    name: "B.Tech",
    code: "BTECH",
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
    semesters: 8,
  },
  {
    name: "BCA",
    code: "BCA",
    branches: [
      ["Computer Applications", "BCA"],
      ["Artificial Intelligence & Data Science", "BCA-AIDS"],
      ["Data Science", "BCA-DS"],
    ],
    semesters: 6,
  },
  {
    name: "BBA",
    code: "BBA",
    branches: [
      ["General", "BBA"],
      ["Finance", "BBA-FIN"],
      ["Marketing", "BBA-MKT"],
      ["Human Resource Management", "BBA-HRM"],
    ],
    semesters: 6,
  },
  {
    name: "B.Com",
    code: "BCOM",
    branches: [
      ["General", "BCOM"],
      ["Computer Applications", "BCOM-CA"],
      ["Honours", "BCOM-H"],
    ],
    semesters: 6,
  },
  {
    name: "B.Sc",
    code: "BSC",
    branches: [
      ["Computer Science", "BSC-CS"],
      ["Information Technology", "BSC-IT"],
      ["Mathematics", "BSC-MATH"],
      ["Physics", "BSC-PHY"],
      ["Chemistry", "BSC-CHEM"],
      ["Biotechnology", "BSC-BT"],
    ],
    semesters: 6,
  },
  {
    name: "BA",
    code: "BA",
    branches: [
      ["General", "BA"],
      ["English", "BA-ENG"],
      ["Economics", "BA-ECO"],
      ["Psychology", "BA-PSY"],
      ["Political Science", "BA-PS"],
    ],
    semesters: 6,
  },
  {
    name: "B.Pharm",
    code: "BPHARM",
    branches: [
      ["Pharmacy", "BPHARM"],
    ],
    semesters: 8,
  },
  {
    name: "M.Tech",
    code: "MTECH",
    branches: [
      ["Computer Science & Engineering", "MTECH-CSE"],
      ["Artificial Intelligence", "MTECH-AI"],
      ["Data Science", "MTECH-DS"],
      ["Cyber Security", "MTECH-CS"],
      ["Electronics & Communication Engineering", "MTECH-ECE"],
      ["Mechanical Engineering", "MTECH-ME"],
    ],
    semesters: 4,
  },
  {
    name: "MCA",
    code: "MCA",
    branches: [
      ["Computer Applications", "MCA"],
      ["Artificial Intelligence", "MCA-AI"],
      ["Data Science", "MCA-DS"],
      ["Cyber Security", "MCA-CS"],
    ],
    semesters: 4,
  },
  {
    name: "MBA",
    code: "MBA",
    branches: [
      ["General", "MBA"],
      ["Finance", "MBA-FIN"],
      ["Marketing", "MBA-MKT"],
      ["Human Resource Management", "MBA-HRM"],
      ["Business Analytics", "MBA-BA"],
    ],
    semesters: 4,
  },
  {
    name: "M.Sc",
    code: "MSC",
    branches: [
      ["Computer Science", "MSC-CS"],
      ["Mathematics", "MSC-MATH"],
      ["Physics", "MSC-PHY"],
      ["Chemistry", "MSC-CHEM"],
      ["Biotechnology", "MSC-BT"],
      ["Data Science", "MSC-DS"],
    ],
    semesters: 4,
  },
  {
    name: "M.Com",
    code: "MCOM",
    branches: [
      ["Commerce", "MCOM"],
      ["Finance", "MCOM-FIN"],
    ],
    semesters: 4,
  },
  {
    name: "LLB",
    code: "LLB",
    branches: [
      ["Law", "LLB"],
    ],
    semesters: 6,
  },
  {
    name: "LLM",
    code: "LLM",
    branches: [
      ["Law", "LLM"],
    ],
    semesters: 4,
  },
  {
    name: "B.A. LL.B",
    code: "BALLB",
    branches: [
      ["Law", "BALLB"],
    ],
    semesters: 10,
  },
  {
    name: "BBA LL.B",
    code: "BBALLB",
    branches: [
      ["Law", "BBALLB"],
    ],
    semesters: 10,
  },
  {
    name: "B.Com LL.B",
    code: "BCOMLLB",
    branches: [
      ["Law", "BCOMLLB"],
    ],
    semesters: 10,
  },
];

async function getOrCreateUniversity() {
  const q = query(
    collection(db, "universities"),
    where("name", "==", UNIVERSITY_NAME)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "universities"),
    {
      name: UNIVERSITY_NAME,
      code: UNIVERSITY_CODE,
      location: "Lucknow",
      createdAt: Timestamp.now(),
    }
  );

  return ref.id;
}

async function getOrCreateCourse(
  universityId: string,
  name: string,
  code: string
) {
  const q = query(
    collection(db, "courses"),
    where("universityId", "==", universityId),
    where("name", "==", name)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "courses"),
    {
      universityId,
      universityName: UNIVERSITY_NAME,
      name,
      code,
      createdAt: Timestamp.now(),
    }
  );

  return ref.id;
}

async function getOrCreateBranch(
  universityId: string,
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

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "branches"),
    {
      universityId,
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
  universityId: string,
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

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const ref = await addDoc(
    collection(db, "semesters"),
    {
      universityId,
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
  console.log("Starting academic data setup...");

  const universityId = await getOrCreateUniversity();

  console.log(
    `University ready: ${UNIVERSITY_NAME} (${universityId})`
  );

  for (const course of academicData) {
    const courseId = await getOrCreateCourse(
      universityId,
      course.name,
      course.code
    );

    console.log(`Course ready: ${course.name}`);

    for (const branch of course.branches) {
      const branchId = await getOrCreateBranch(
        universityId,
        courseId,
        branch[0],
        branch[1]
      );

      console.log(`  Branch ready: ${branch[0]}`);

      for (
        let semester = 1;
        semester <= course.semesters;
        semester++
      ) {
        await getOrCreateSemester(
          universityId,
          courseId,
          branchId,
          semester
        );
      }

      console.log(
        `  Semesters 1-${course.semesters} ready`
      );
    }
  }

  console.log("Academic data setup completed.");

  return {
    success: true,
    universityId,
  };
}