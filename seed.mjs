import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Simple env loader
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || "";
      if (val.length > 0 && val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') {
        val = val.replace(/\\n/gm, "\n");
      }
      val = val.replace(/(^['"]|['"]$)/g, "").trim();
      process.env[match[1]] = val;
    }
  });
}

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
const db = getFirestore(app);

const mockApplicants = [
  // Applicant 1: Applies to Web Dev (Pref 1) and UI/UX (Pref 2)
  {
    Name: "Arun Kumar",
    RegistrationNumber: "25BCE1001",
    Gender: "Male",
    Email: "arun.kumar2025@vitstudent.ac.in",
    Phone: "9876543201",
    "Why do you want to join Organization Name?": "I am passionate about creating impactful software and GDG seems like the perfect community.",
    Department: "Web Dev",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "Are you more interested in Frontend, Backend, or Full-stack development?": "Full-stack development.",
      "Which web technologies or frameworks (e.g., React, Node.js, Next.js) have you used before?": "React, Next.js, and Node.js.",
      "Describe a web project you built. What was the most challenging bug you fixed?": "Built an e-commerce platform. The hardest bug was handling race conditions during checkout."
    }
  },
  {
    Name: "Arun Kumar",
    RegistrationNumber: "25BCE1001",
    Gender: "Male",
    Email: "arun.kumar2025@vitstudent.ac.in",
    Phone: "9876543201",
    "Why do you want to join Organization Name?": "I am passionate about creating impactful software and GDG seems like the perfect community.",
    Department: "UI/UX",
    Pref: "2",
    shortlisted: false,
    Questions: {
      "What design tools (Figma, Adobe XD, Sketch) are you most comfortable using?": "Figma is my primary tool.",
      "Share a link to your design portfolio (Behance, Dribbble, or personal website).": "https://behance.net/arunkumardesign",
      "Describe a time you redesigned an interface to improve its user experience. What was your process?": "Redesigned my college club's website by conducting user interviews first, then wireframing."
    }
  },
  // Applicant 2: Applies to App Dev (Pref 1) and Game Dev (Pref 2)
  {
    Name: "Sarah Jenkins",
    RegistrationNumber: "24BCE2002",
    Gender: "Female",
    Email: "sarah.jenkins2024@vitstudent.ac.in",
    Phone: "9876543202",
    "Why do you want to join Organization Name?": "I want to surround myself with talented developers and learn from them.",
    Department: "App Dev",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "What platforms (iOS, Android, Cross-platform) are you most interested in developing for and why?": "Cross-platform using Flutter because of its fast iteration speed.",
      "Describe a mobile app you've built or want to build. What problems does it solve?": "A habit tracker app that gamifies daily tasks.",
      "Which mobile development frameworks or languages (e.g., Flutter, React Native, Swift, Kotlin) are you familiar with?": "Flutter and Dart."
    }
  },
  {
    Name: "Sarah Jenkins",
    RegistrationNumber: "24BCE2002",
    Gender: "Female",
    Email: "sarah.jenkins2024@vitstudent.ac.in",
    Phone: "9876543202",
    "Why do you want to join Organization Name?": "I want to surround myself with talented developers and learn from them.",
    Department: "Game Dev",
    Pref: "2",
    shortlisted: false,
    Questions: {
      "Which game engines (e.g., Unity, Unreal Engine, Godot) do you have experience with?": "Unity and C#.",
      "What role in game development (programming, 3D modeling, level design) do you want to focus on?": "Programming.",
      "Tell us about a game concept you'd love to build during a hackathon.": "A 2D platformer with time manipulation mechanics."
    }
  },
  // Applicant 3: Single Dept - Management
  {
    Name: "Vikram Singh",
    RegistrationNumber: "26BCE3003",
    Gender: "Male",
    Email: "vikram.singh2026@vitstudent.ac.in",
    Phone: "9876543203",
    "Why do you want to join Organization Name?": "I love organizing events and managing teams to achieve great things.",
    Department: "Management",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "Describe a time you successfully managed a team or organized an event. What were the challenges?": "Organized a tech fest in high school. Dealing with last-minute dropouts was tough.",
      "How do you handle disagreements or conflicts within a team?": "I encourage open communication and finding a middle ground.",
      "What strategies do you use to ensure a project stays on schedule?": "Using Trello boards and setting clear micro-deadlines."
    }
  },
  // Applicant 4: Applies to Outreach (Pref 1) and Social Media & Marketing (Pref 2)
  {
    Name: "Neha Gupta",
    RegistrationNumber: "25BCE4004",
    Gender: "Female",
    Email: "neha.gupta2025@vitstudent.ac.in",
    Phone: "9876543204",
    "Why do you want to join Organization Name?": "I enjoy connecting with people and building a brand's image.",
    Department: "Outreach",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "How would you approach a potential sponsor or speaker for a GDG event?": "I would research their interests and craft a personalized email highlighting mutual benefits.",
      "What do you think makes a tech community thrive and grow?": "Consistent engagement and welcoming environments.",
      "Do you have any prior experience in public relations or community management?": "Yes, I managed my school's debate club PR."
    }
  },
  {
    Name: "Neha Gupta",
    RegistrationNumber: "25BCE4004",
    Gender: "Female",
    Email: "neha.gupta2025@vitstudent.ac.in",
    Phone: "9876543204",
    "Why do you want to join Organization Name?": "I enjoy connecting with people and building a brand's image.",
    Department: "Social Media & Marketing",
    Pref: "2",
    shortlisted: false,
    Questions: {
      "Provide links to any social media campaigns or pages you have managed.": "https://instagram.com/nehacreates",
      "How would you increase engagement for an upcoming GDG VIT Chennai event?": "Interactive stories, reels, and tag-a-friend giveaways.",
      "What video editing or graphic design tools are you proficient in?": "Canva and Premiere Pro."
    }
  },
  // Applicant 5: Single Dept - Competitive Programming
  {
    Name: "Rahul Sharma",
    RegistrationNumber: "24BCE5005",
    Gender: "Male",
    Email: "rahul.sharma2024@vitstudent.ac.in",
    Phone: "9876543205",
    "Why do you want to join Organization Name?": "To find a community of like-minded problem solvers.",
    Department: "Competitive Programming",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "What is your preferred programming language for solving algorithmic problems?": "C++",
      "Share your profile link(s) for LeetCode, Codeforces, or CodeChef.": "https://leetcode.com/rahul123",
      "Describe your approach to optimizing a solution when you hit a Time Limit Exceeded (TLE) error.": "I analyze the time complexity and try to find overlapping subproblems or better data structures."
    }
  },
  // Applicant 6: Single Dept - Data Science
  {
    Name: "Emily Chen",
    RegistrationNumber: "26BCE6006",
    Gender: "Female",
    Email: "emily.chen2026@vitstudent.ac.in",
    Phone: "9876543206",
    "Why do you want to join Organization Name?": "I want to apply theoretical ML concepts to real-world datasets in a team setting.",
    Department: "Data Science",
    Pref: "1",
    shortlisted: false,
    Questions: {
      "What areas of Data Science (e.g., Machine Learning, Analytics, NLP, Computer Vision) interest you?": "Computer Vision and NLP.",
      "Explain a data science or machine learning project you have worked on.": "Built a sentiment analysis model for Twitter data using BERT.",
      "Which libraries or tools (e.g., Pandas, Scikit-Learn, TensorFlow) do you prefer and why?": "PyTorch for deep learning, Pandas for data wrangling."
    }
  }
];

// Extract unique users from applicants
const uniqueUsers = Array.from(new Set(mockApplicants.map(a => a.Email))).map(email => {
  const applicant = mockApplicants.find(a => a.Email === email);
  return {
    name: applicant.Name,
    email: applicant.Email,
    emailVerified: true,
    banned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

async function seed() {
  const formCollection = db.collection("formData");
  const usersCollection = db.collection("users");

  console.log("Deleting existing mock documents...");
  // Clear formData
  const formSnapshot = await formCollection.get();
  const formBatchDelete = db.batch();
  formSnapshot.docs.forEach((doc) => {
    formBatchDelete.delete(doc.ref);
  });
  await formBatchDelete.commit();

  // Clear mock users (we will not delete admins, let's just delete users that have the mock emails)
  const usersSnapshot = await usersCollection.get();
  const usersBatchDelete = db.batch();
  usersSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (uniqueUsers.some(u => u.email === data.email)) {
      usersBatchDelete.delete(doc.ref);
    }
  });
  await usersBatchDelete.commit();

  console.log("Inserting new mock applicants to formData...");
  const formBatchInsert = db.batch();
  for (const data of mockApplicants) {
    const docRef = formCollection.doc();
    formBatchInsert.set(docRef, { ...data, submittedAt: new Date().toISOString() });
  }
  await formBatchInsert.commit();

  console.log("Inserting new mock users to users collection...");
  const usersBatchInsert = db.batch();
  for (const user of uniqueUsers) {
    const docRef = usersCollection.doc();
    usersBatchInsert.set(docRef, user);
  }
  await usersBatchInsert.commit();

  console.log("Successfully refreshed mock data across formData and users collections!");
}

seed().catch(console.error);
