export interface FaqEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: "hours" | "departments" | "fees" | "services" | "general";
}

export const FAQ_DATA: FaqEntry[] = [
  // --- Hours ---
  {
    id: "city-hall-hours",
    keywords: ["hours", "open", "close", "schedule", "time", "office", "city hall"],
    question: "What are City Hall's office hours?",
    answer:
      "City Hall is open Monday to Friday, 8:00 AM – 5:00 PM. We are closed on weekends and public holidays.",
    category: "hours",
  },
  {
    id: "treasury-hours",
    keywords: ["treasury", "payment", "pay", "tax", "hours", "cashier"],
    question: "What are the Treasury Office hours?",
    answer:
      "The Treasury Office is open Monday to Friday, 8:00 AM – 5:00 PM. Tax payments and other transactions are accepted until 4:30 PM.",
    category: "hours",
  },
  {
    id: "civil-registry-hours",
    keywords: ["civil registry", "birth certificate", "marriage", "death certificate", "nso", "psa"],
    question: "What are the Civil Registry Office hours?",
    answer:
      "The Civil Registry Office is open Monday to Friday, 8:00 AM – 5:00 PM. Processing of documents may take 1–3 working days.",
    category: "hours",
  },

  // --- Departments ---
  {
    id: "departments-list",
    keywords: ["department", "office", "contact", "where", "which office"],
    question: "What departments does the city government have?",
    answer:
      "San Pablo City has the following key offices: Mayor's Office, City Administrator, City Treasurer, City Assessor, Civil Registry, CSWDO (Social Welfare), City Health Office, CPDO (Planning), and City Engineering. You can visit the About Us page for the full list and contact details.",
    category: "departments",
  },
  {
    id: "mayor-office",
    keywords: ["mayor", "mayor's office", "contact mayor"],
    question: "How do I contact the Mayor's Office?",
    answer:
      "The Mayor's Office is located at the San Pablo City Hall, Rizal Avenue, San Pablo City, Laguna. You may also reach them through the city's official hotline. Please check the Contact Us page for the latest numbers.",
    category: "departments",
  },
  {
    id: "social-welfare",
    keywords: ["cswdo", "social welfare", "assistance", "indigent", "4ps", "ayuda", "aid"],
    question: "How do I apply for social welfare assistance?",
    answer:
      "Visit the City Social Welfare and Development Office (CSWDO) at City Hall during office hours. Bring a valid government ID and proof of residency. The CSWDO handles indigent burial assistance, educational aid, senior citizen benefits, and more.",
    category: "services",
  },

  // --- Fees ---
  {
    id: "business-permit-fee",
    keywords: ["business permit", "fee", "cost", "how much", "renewal", "mayor's permit"],
    question: "How much does a business permit cost?",
    answer:
      "Business permit fees vary depending on the type and size of the business. Fees are assessed by the Business Permits and Licensing Office (BPLO). Visit City Hall or call the BPLO directly for a fee assessment. Annual renewals are due by January 20.",
    category: "fees",
  },
  {
    id: "real-property-tax",
    keywords: ["real property tax", "rpt", "land tax", "property tax", "amilyar"],
    question: "How do I pay my Real Property Tax (RPT)?",
    answer:
      "Real Property Tax (RPT / Amilyar) can be paid at the City Treasury Office. Payments made in January enjoy a 20% discount. You will need your Tax Declaration Number or previous Official Receipt. Online payment options may be available — check the Full Disclosure Portal for updates.",
    category: "fees",
  },
  {
    id: "cedula-fee",
    keywords: ["cedula", "community tax certificate", "ctc", "how much cedula"],
    question: "How much does a cedula (CTC) cost?",
    answer:
      "The basic Community Tax Certificate (Cedula) costs ₱5.00. Additional fees apply based on income and property. Cedulas are available at the City Treasury Office.",
    category: "fees",
  },

  // --- Services ---
  {
    id: "business-permit-requirements",
    keywords: ["business permit", "requirements", "documents", "apply", "new business"],
    question: "What are the requirements for a new business permit?",
    answer:
      "For a new business permit, you typically need: (1) Duly accomplished application form, (2) DTI/SEC/CDA registration, (3) Barangay Clearance, (4) Lease contract or proof of ownership of business location, (5) Fire Safety Inspection Certificate, and (6) Sanitary Permit. Visit the BPLO at City Hall for the complete and updated list.",
    category: "services",
  },
  {
    id: "senior-citizen",
    keywords: ["senior", "senior citizen", "osca", "elderly", "id", "discount"],
    question: "How do I get a Senior Citizen ID?",
    answer:
      "Apply at the Office for Senior Citizens Affairs (OSCA) at City Hall. Requirements: PSA Birth Certificate, 1x1 photo, and proof of residency (barangay certificate). The ID is free of charge. Processing takes about 1–2 weeks.",
    category: "services",
  },
  {
    id: "pwd-id",
    keywords: ["pwd", "persons with disability", "disability id", "pwd id"],
    question: "How do I apply for a PWD ID?",
    answer:
      "Visit the City Social Welfare and Development Office (CSWDO). Requirements: Medical certificate from a government physician, 1x1 photo, and valid ID. The PWD ID is free and entitles the holder to a 20% discount on medicines, medical services, and other establishments.",
    category: "services",
  },

  // --- General ---
  {
    id: "location",
    keywords: ["location", "address", "where", "how to get", "directions", "city hall"],
    question: "Where is San Pablo City Hall located?",
    answer:
      "San Pablo City Hall is located along Rizal Avenue, San Pablo City, Laguna. It is accessible by jeepney, tricycle, and private vehicle. Landmarks nearby include the San Pablo City Plaza and the Cathedral.",
    category: "general",
  },
  {
    id: "seven-lakes",
    keywords: ["seven lakes", "lake", "tourism", "visit", "laguna", "tourist"],
    question: "What are the Seven Lakes of San Pablo?",
    answer:
      "San Pablo City is known as the \"City of Seven Lakes\": Sampaloc (the largest), Bunot, Calibato, Palakpakin, Pandin, Mohicap, and Yambo. These lakes are popular eco-tourism destinations. For tourism inquiries, contact the City Tourism Office.",
    category: "general",
  },
  {
    id: "hotline",
    keywords: ["hotline", "emergency", "call", "contact", "phone", "number"],
    question: "What are the city's emergency hotlines?",
    answer:
      "For emergencies, please contact: San Pablo City Police: (049) 562-XXXX | City Disaster Risk Reduction Office (CDRRMO): (049) 562-XXXX | City Health Emergency: (049) 562-XXXX. Please replace XXXX with the actual numbers from the city's official contact page.",
    category: "general",
  },
];

export const SUGGESTED_QUESTIONS = [
  "What are City Hall's office hours?",
  "How do I get a business permit?",
  "How do I pay my property tax?",
  "Where is City Hall located?",
  "How do I apply for a Senior Citizen ID?",
];
