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

// Data constants
const departments = [
  "Management", "Outreach", "Social Media & Marketing", "Design", "UI/UX",
  "Web Dev", "App Dev", "Game Dev", "Data Science", "Open Source",
  "Blockchain", "Competitive Programming"
];

// Sample answers for any generic question
const sampleAnswers = [
  "I have a deep passion for learning new technologies and applying them to solve real-world problems. My experience includes working with various tools and frameworks that align with this role.",
  "I usually approach such challenges by breaking them down into smaller, manageable tasks. I rely heavily on documentation, community forums, and systematic debugging.",
  "In my previous projects, I collaborated closely with designers and product managers to ensure the end product met all requirements. I value clear communication and iterative feedback.",
  "I am comfortable using modern tools like Git, Docker, and various IDEs. I am always open to learning new stack requirements as the project demands.",
  "I have built a few personal projects that involve user authentication, database management, and responsive UI design. These projects taught me a lot about end-to-end development.",
  "I am highly interested in this domain because of its rapid evolution and the impact it has on modern digital experiences.",
  "When faced with a conflict, I try to understand the other person's perspective and find a compromise that benefits the project as a whole.",
  "I have participated in multiple hackathons where I honed my skills under pressure and learned to work efficiently in a team environment.",
  "My preferred tools include VS Code, Figma, Postman, and GitHub. I believe mastering the right tools is key to productivity.",
  "I want to join GDG to be part of a vibrant community of developers, learn from peers, and contribute to impactful open-source projects."
];

// Random generators
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[getRandomInt(0, arr.length - 1)];
const generateRegNo = () => `${getRandomItem(["23", "24", "25", "26"])}BCE${getRandomInt(1000, 9999)}`;
const generatePhone = () => `9${getRandomInt(100000000, 999999999)}`;

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Atharv", "Ananya", "Diya", "Navya", "Kavya", "Isha", "Riya", "Aditi", "Zara", "Saanvi", "Myra", "Neha", "Rahul", "Priya", "Vikram", "Sneha", "Rohan", "Pooja", "Karan", "Aarti", "Siddharth", "Nisha", "Rishabh", "Meera", "Kartik", "Tanvi", "Varun", "Shruti", "Akash", "Swati"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Chopra", "Kapoor", "Singh", "Yadav", "Patil", "Deshmukh", "Joshi", "Kulkarni", "Iyer", "Nair", "Menon", "Reddy", "Rao", "Kumar", "Das", "Sen", "Bose", "Dutta", "Ghosh", "Mukherjee", "Banerjee", "Chatterjee", "Mishra", "Pandey", "Shukla", "Tiwari", "Dubey"];

// Fetch questionnaire schema dynamically
import { QuestionnaireData } from "./constants/index.js";

async function generateApplicants(count = 75) {
  const applicants = [];
  const uniqueUsersMap = new Map();

  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(2023, 2026)}@vitstudent.ac.in`;
    const gender = Math.random() > 0.5 ? "Male" : "Female";
    const phone = generatePhone();
    const regNo = generateRegNo();
    const coreReason = getRandomItem(sampleAnswers);

    // Randomly choose 1 or 2 departments for this applicant
    const numDepts = Math.random() > 0.7 ? 2 : 1; 
    
    let userDepts = [];
    while (userDepts.length < numDepts) {
      const d = getRandomItem(departments);
      if (!userDepts.includes(d)) userDepts.push(d);
    }

    userDepts.forEach((dept, idx) => {
      // Find the specific questions for this department
      const deptQuestionsSchema = QuestionnaireData.find(q => q.department === dept)?.questions || [];
      const answers = {};
      
      deptQuestionsSchema.forEach(q => {
        answers[q.name] = getRandomItem(sampleAnswers);
      });

      applicants.push({
        Name: fullName,
        RegistrationNumber: regNo,
        Gender: gender,
        Email: email,
        Phone: phone,
        "Why do you want to join Organization Name?": coreReason,
        Department: dept,
        Pref: (idx + 1).toString(),
        shortlisted: false,
        Questions: answers
      });
    });

    if (!uniqueUsersMap.has(email)) {
      uniqueUsersMap.set(email, {
        name: fullName,
        email: email,
        emailVerified: true,
        banned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return { applicants, uniqueUsers: Array.from(uniqueUsersMap.values()) };
}

async function seed() {
  console.log("Generating 75+ users...");
  const { applicants, uniqueUsers } = await generateApplicants(80); // generate 80 people
  
  const formCollection = db.collection("formData");
  const usersCollection = db.collection("users");

  console.log("Deleting existing mock documents (if any)...");
  
  // Clear formData
  const formSnapshot = await formCollection.get();
  // Firestore batches have a limit of 500 operations, so we process in chunks if needed
  const deleteBatch = db.batch();
  formSnapshot.docs.forEach((doc) => {
    deleteBatch.delete(doc.ref);
  });
  await deleteBatch.commit();

  console.log(`Inserting ${applicants.length} applications for ${uniqueUsers.length} users into formData...`);
  
  // Chunk insert into formData (max 500 per batch)
  const chunkSize = 400;
  for (let i = 0; i < applicants.length; i += chunkSize) {
    const batch = db.batch();
    const chunk = applicants.slice(i, i + chunkSize);
    chunk.forEach(data => {
      const docRef = formCollection.doc();
      batch.set(docRef, { ...data, submittedAt: new Date().toISOString() });
    });
    await batch.commit();
  }

  console.log(`Inserting ${uniqueUsers.length} users into users collection...`);
  
  // Clear existing users except admins
  const usersSnapshot = await usersCollection.get();
  const deleteUsersBatch = db.batch();
  usersSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.email && data.email.includes("@vitstudent.ac.in") && data.role !== "admin") {
      deleteUsersBatch.delete(doc.ref);
    }
  });
  await deleteUsersBatch.commit();

  // Insert new users
  for (let i = 0; i < uniqueUsers.length; i += chunkSize) {
    const batch = db.batch();
    const chunk = uniqueUsers.slice(i, i + chunkSize);
    chunk.forEach(user => {
      const docRef = usersCollection.doc();
      batch.set(docRef, user);
    });
    await batch.commit();
  }

  console.log(`Success! Inserted ${applicants.length} applications and ${uniqueUsers.length} user records!`);
}

seed().catch(console.error);
