// Current Date
import {
  ManageAccounts,
  Trophy,
  Campaign,
  ConnectWithoutContact,
  DesignServices,
  Palette,
  Language,
  Mobile2,
  SportsEsports,
  Analytics,
  Hub,
  Link,
  Cloud,
} from "@material-symbols-svg/react/outlined";

export const curDay = new Date().getDay();
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Contact Links
export const LINKS = {
  instagram: "https://www.instagram.com/gdg.vitc/",
  discord: "https://discord.com/invite/67G6bg4Xeq",
  gmail: "mailto:gdgvitc@gmail.com",
  linkedin: "https://www.linkedin.com/company/gdg-vitc/posts/?feedView=all",
  x: "https://x.com/gdg_vitc",
};

// Department Details
export const reviews = [
  {
    id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    icon: ManageAccounts,
    tone: "#FFD45E", // Yellow
    name: "Management",
    type: "non-technical",
    description: "The backbone of GDG, running things internally by planning, executing, and improving processes.",
  },
  {
    id: "4499a966-2740-4c36-88dd-8916a909fc77",
    icon: Campaign,
    tone: "#8AB4F8", // Blue
    name: "Outreach",
    type: "non-technical",
    description: "Builds partnerships and expands GDG's reach by connecting with communities, sponsors, and collaborators.",
  },
  {
    id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    icon: ConnectWithoutContact,
    tone: "#FF7A6B", // Red
    name: "Social Media & Marketing",
    type: "non-technical",
    description: "Drives GDG's online presence with creative campaigns, video editing, and storytelling.",
  },
  {
    id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    icon: DesignServices,
    tone: "#6EE7A0", // Green
    name: "Design",
    type: "non-technical",
    description: "Creates stunning visuals, event posters, and branding materials that capture GDG's identity.",
  },
  {
    id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    icon: Palette,
    tone: "#6EE7A0", // Green
    name: "UI/UX",
    type: "technical",
    description: "Designs visually appealing, user-friendly digital interfaces with a focus on accessibility and aesthetics.",
  },
  {
    id: "8143de1d-db17-42fa-958d-13b10804f894",
    icon: Language,
    tone: "#FFD45E", // Yellow
    name: "Web Dev",
    type: "technical",
    description: "Designs, develops, and maintains responsive, high-performance websites for GDG projects.",
  },
  {
    id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    icon: Mobile2,
    tone: "#FF7A6B", // Red
    name: "App Dev",
    type: "technical",
    description: "Builds intuitive, impactful mobile applications that bring GDG's ideas to life.",
  },
  {
    id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
    icon: SportsEsports,
    tone: "#8AB4F8", // Blue
    name: "Game Dev",
    type: "technical",
    description: "Combines creativity and technical skills to design engaging, entertaining games.",
  },
  {
    id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    icon: Analytics,
    tone: "#FF7A6B", // Red
    name: "Data Science",
    type: "technical",
    description: "Applies Machine learning and analytics to transform data into actionable insights.",
  },
  {
    id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    icon: Cloud,
    tone: "#8AB4F8", // Blue
    name: "Open Source",
    type: "technical",
    description: "Encourages members to contribute to open-source projects, building collaboration skills.",
  },
  {
    id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    icon: Hub,
    tone: "#FFD45E", // Yellow
    name: "Blockchain",
    type: "technical",
    description: "Explores decentralized technologies by building blockchain-based applications and hosting workshops.",
  },
  {
    id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    icon: Trophy,
    tone: "#6EE7A0", // Green
    name: "Competitive Programming",
    type: "technical",
    description: "Promotes problem-solving skills through coding contests, hackathons, and peer learning.",
  },
];

// Questionnaire Data
export const QuestionnaireData = [
  {
    department: "App Dev",
    questions: [
      {
        name: "What platforms (iOS, Android, Cross-platform) are you most interested in developing for and why?",
        type: "generic",
        placeholder: "I am interested in..."
      },
      {
        name: "Describe a mobile app you've built or want to build. What problems does it solve?",
        type: "long-text",
        placeholder: "The app I want to build solves..."
      },
      {
        name: "Which mobile development frameworks or languages (e.g., Flutter, React Native, Swift, Kotlin) are you familiar with?",
        type: "generic",
        placeholder: "I have experience with..."
      }
    ],
  },
  {
    department: "Blockchain",
    questions: [
      {
        name: "What excites you the most about Web3 and decentralized technologies?",
        type: "long-text",
        placeholder: "I am excited about..."
      },
      {
        name: "Have you ever written a smart contract or interacted with a blockchain network? If so, elaborate.",
        type: "long-text",
        placeholder: "Yes, I have written a smart contract using..."
      },
      {
        name: "Describe a real-world problem that blockchain can solve effectively.",
        type: "long-text",
        placeholder: "Blockchain can solve..."
      }
    ],
  },
  {
    department: "Open Source",
    questions: [
      {
        name: "Have you ever contributed to an open-source project? Share a link to your PR or issue if yes.",
        type: "short-text",
        placeholder: "https://github.com/..."
      },
      {
        name: "Which open-source communities or tools do you follow closely?",
        type: "generic",
        placeholder: "I follow..."
      },
      {
        name: "Why is open-source software important for the developer ecosystem?",
        type: "long-text",
        placeholder: "Open source is important because..."
      }
    ],
  },
  {
    department: "Competitive Programming",
    questions: [
      {
        name: "What is your preferred programming language for solving algorithmic problems?",
        type: "short-text",
        placeholder: "C++, Python, Java..."
      },
      {
        name: "Share your profile link(s) for LeetCode, Codeforces, or CodeChef.",
        type: "short-text",
        placeholder: "https://leetcode.com/..."
      },
      {
        name: "Describe your approach to optimizing a solution when you hit a Time Limit Exceeded (TLE) error.",
        type: "long-text",
        placeholder: "When I get a TLE, I usually..."
      }
    ],
  },
  {
    department: "Data Science",
    questions: [
      {
        name: "What areas of Data Science (e.g., Machine Learning, Analytics, NLP, Computer Vision) interest you?",
        type: "generic",
        placeholder: "I am interested in..."
      },
      {
        name: "Explain a data science or machine learning project you have worked on.",
        type: "long-text",
        placeholder: "I worked on a project that..."
      },
      {
        name: "Which libraries or tools (e.g., Pandas, Scikit-Learn, TensorFlow) do you prefer and why?",
        type: "generic",
        placeholder: "I prefer using..."
      }
    ],
  },
  {
    department: "UI/UX",
    questions: [
      {
        name: "What design tools (Figma, Adobe XD, Sketch) are you most comfortable using?",
        type: "short-text",
        placeholder: "Figma, Adobe XD..."
      },
      {
        name: "Share a link to your design portfolio (Behance, Dribbble, or personal website).",
        type: "short-text",
        placeholder: "https://behance.net/..."
      },
      {
        name: "Describe a time you redesigned an interface to improve its user experience. What was your process?",
        type: "long-text",
        placeholder: "I redesigned..."
      }
    ],
  },
  {
    department: "Game Dev",
    questions: [
      {
        name: "Which game engines (e.g., Unity, Unreal Engine, Godot) do you have experience with?",
        type: "short-text",
        placeholder: "Unity, Godot..."
      },
      {
        name: "What role in game development (programming, 3D modeling, level design) do you want to focus on?",
        type: "generic",
        placeholder: "I want to focus on..."
      },
      {
        name: "Tell us about a game concept you'd love to build during a hackathon.",
        type: "long-text",
        placeholder: "I'd love to build a game where..."
      }
    ],
  },
  {
    department: "Management",
    questions: [
      {
        name: "Describe a time you successfully managed a team or organized an event. What were the challenges?",
        type: "long-text",
        placeholder: "I managed..."
      },
      {
        name: "How do you handle disagreements or conflicts within a team?",
        type: "long-text",
        placeholder: "When conflicts arise, I..."
      },
      {
        name: "What strategies do you use to ensure a project stays on schedule?",
        type: "generic",
        placeholder: "I use..."
      }
    ],
  },
  {
    department: "Social Media & Marketing",
    questions: [
      {
        name: "Provide links to any social media campaigns or pages you have managed.",
        type: "generic",
        placeholder: "https://instagram.com/..."
      },
      {
        name: "How would you increase engagement for an upcoming GDG VIT Chennai event?",
        type: "long-text",
        placeholder: "To increase engagement, I would..."
      },
      {
        name: "What video editing or graphic design tools are you proficient in?",
        type: "generic",
        placeholder: "Premiere Pro, Canva..."
      }
    ],
  },
  {
    department: "Outreach",
    questions: [
      {
        name: "How would you approach a potential sponsor or speaker for a GDG event?",
        type: "long-text",
        placeholder: "I would approach them by..."
      },
      {
        name: "What do you think makes a tech community thrive and grow?",
        type: "generic",
        placeholder: "A community thrives when..."
      },
      {
        name: "Do you have any prior experience in public relations or community management?",
        type: "short-text",
        placeholder: "Yes, I have experience in..."
      }
    ],
  },
  {
    department: "Design",
    questions: [
      {
        name: "Please link your design portfolio (Behance, Instagram page, Drive link).",
        type: "short-text",
        placeholder: "https://drive.google.com/..."
      },
      {
        name: "Which tools (e.g., Illustrator, Photoshop, Figma, After Effects) do you use for graphic design?",
        type: "generic",
        placeholder: "I use..."
      },
      {
        name: "What is your design process for creating an event poster from scratch?",
        type: "long-text",
        placeholder: "My process starts with..."
      }
    ],
  },
  {
    department: "Web Dev",
    questions: [
      {
        name: "Are you more interested in Frontend, Backend, or Full-stack development?",
        type: "short-text",
        placeholder: "Frontend, Full-stack..."
      },
      {
        name: "Which web technologies or frameworks (e.g., React, Node.js, Next.js) have you used before?",
        type: "generic",
        placeholder: "I have used..."
      },
      {
        name: "Describe a web project you built. What was the most challenging bug you fixed?",
        type: "long-text",
        placeholder: "I built..."
      }
    ],
  },
];

// Sample Admin Data
export const sampleAdminHeader = [
  {
    Header: "SrNo",
    accessor: "srno",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Department",
    accessor: "department",
  },
];

// Headers for CSV exports
export const CSV_Header = [
  {
    label: "Name",
    key: "Name",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Registration Number",
    key: "RegistrationNumber",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Department",
    key: "Department",
  },

  {
    label: "Preference",
    key: "Pref",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
  },
  {
    label: "Questions",
    key: "Questions",
  },
];

// Mailing Templates
export const mailingTemplate = {
  Interview:
    "<p>Edit content</p><br><p>Thank you for applying to GDG VIT Chennai. We are excited to let you know that you have been shortlisted for joining the #dept Department!</p><p>We look forward to your active participation!</p>",
};
