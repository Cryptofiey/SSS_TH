import { Service } from "./types";

export const SERVICES: Service[] = [
  {
    id: "dtv-visa",
    title: "Destination Thailand Visa (DTV)",
    description: "Multi-entry 5-year visa for digital nomads, remote workers, freelancers, and cultural activity participants (Muay Thai, cooking courses, medical appointments).",
    category: "visa",
    costRange: "25,000 - 35,000 THB",
    duration: "2 - 3 weeks",
    iconName: "Globe",
    fullDetails: [
      "5-Year Multi-entry visa with 180 days stay per entry.",
      "Can extend each entry by another 180 days at Thai Immigration.",
      "Requires proof of remote employment or freelance work outside Thailand.",
      "Requires minimum financial savings of 500,000 THB (or equivalent in foreign currency).",
      "Perfect for programmers, designers, digital marketers, and online teachers."
    ],
    checklists: [
      "Passport valid for at least 6 months",
      "Bank statement showing 500,000 THB or more for the last 3-6 months",
      "Employment contract or freelance service agreements outside Thailand",
      "Portfolio of work or professional business registration (if freelancer)",
      "Proof of accommodation in Thailand (rental agreement or booking)"
    ]
  },
  {
    id: "elite-visa",
    title: "Thailand Privilege Visa (Elite)",
    description: "Premium long-term residency program for high-net-worth individuals, offering 5 to 20 years multi-entry visas with exclusive VIP privileges.",
    category: "visa",
    costRange: "900,000 - 5,000,000 THB",
    duration: "4 - 8 weeks",
    iconName: "Crown",
    fullDetails: [
      "Choice of 5, 10, 15, or 20-year multiple-entry visa options.",
      "VIP Fast-track immigration service upon arrival and departure at major airports.",
      "Access to luxury airport lounges and complimentary limousine transfers.",
      "Personal elite assistants (EPA) to help with government offices and driving licenses.",
      "Annual health checks and golf/spa packages included in memberships."
    ],
    checklists: [
      "Clean passport with at least 3-4 blank pages",
      "No criminal record in home country (notarized certificate)",
      "Completed Thailand Privilege membership application form",
      "Membership payment receipt (900K THB to 5M THB depending on tier)",
      "Color passport-sized photograph"
    ]
  },
  {
    id: "retirement-visa",
    title: "Thai Retirement Visa (Non-Immigrant O / OA)",
    description: "Annual renewable visa for foreigners aged 50 and over wishing to spend their golden years in Thailand without working.",
    category: "visa",
    costRange: "15,000 - 25,000 THB",
    duration: "10 - 14 days",
    iconName: "Heart",
    fullDetails: [
      "1-Year stay with unlimited renewable yearly terms inside Thailand.",
      "Requires applicant to be 50 years of age or older.",
      "Must satisfy financial criteria: 800,000 THB in a Thai bank account OR proof of monthly income of at least 65,000 THB.",
      "Medical insurance certificate covering at least 100,000 USD (for Non-OA variant).",
      "Requires standard 90-day address reporting to Thai Immigration."
    ],
    checklists: [
      "Passport (valid for at least 18 months)",
      "Thai bank book showing 800,000 THB seasoned for at least 2 months",
      "Income certificate from Embassy or home country pension (if using income method)",
      "Medical certificate from a Thai hospital (no older than 3 months)",
      "Police clearance certificate (required for Non-OA applied from home country)",
      "Recent passport photos (4x6 cm)"
    ]
  },
  {
    id: "company-registration",
    title: "Company Registration & Work Permit",
    description: "Complete legal setup for your business in Thailand, corporate bank account setup, and work authorization for foreign employees.",
    category: "legal",
    costRange: "45,000 - 75,000 THB",
    duration: "30 - 45 days",
    iconName: "Briefcase",
    fullDetails: [
      "Drafting and registering Memorandum of Association (MOA).",
      "Setting up a private limited company (requires Thai majority shareholders for general business).",
      "Registration with the Revenue Department (VAT and Tax ID registration).",
      "Opening a corporate bank account with local banks (Kasikorn, SCB).",
      "Sponsoring and obtaining Non-Immigrant B visa and digital Work Permit."
    ],
    checklists: [
      "At least 3 proposed company names in Thai and English",
      "Passport copies of all foreign directors and promoters",
      "Thai ID copies and house registrations of Thai shareholders",
      "Address details of the corporate office (with landlord consent letter)",
      "Map of the business location and photos of the office building"
    ]
  },
  {
    id: "bank-account",
    title: "Personal Thai Bank Account Opening",
    description: "Quick and hassle-free setup of personal savings bank accounts with debit cards and robust mobile banking applications.",
    category: "legal",
    costRange: "4,000 - 6,000 THB",
    duration: "1 day",
    iconName: "CreditCard",
    fullDetails: [
      "Account setup with top-tier Thai banks (Bangkok Bank or Kasikorn Bank).",
      "Instant issuance of a VISA or Mastercard debit card valid internationally.",
      "Full activation of Thai Mobile Banking app (transfer, scan QR to pay, etc.).",
      "Can be opened even on tourist visas, DTV, or student visas without work permits.",
      "Support with local address certification required by banks."
    ],
    checklists: [
      "Passport with current valid Thai visa stamp",
      "Certificate of Residence from Immigration or Embassy OR lease agreement",
      "Thai mobile phone number (for OTP and mobile app activation)",
      "Minimum initial deposit of 500 - 1,000 THB"
    ]
  },
  {
    id: "driving-license",
    title: "Thai Driving License Conversion",
    description: "Convert your national driver's license or international driving permit (IDP) into an official Thai driving license.",
    category: "legal",
    costRange: "3,500 - 5,000 THB",
    duration: "1 - 2 days",
    iconName: "FileText",
    fullDetails: [
      "Preparation of Department of Land Transport (DLT) application forms.",
      "Obtaining the required official Certificate of Residence from Immigration.",
      "Scheduling and accompanying you to the Land Transport Office.",
      "Fast-track assistance with medical certificate issuance.",
      "Skip long queues and complete reaction tests, color-blindness tests in 2 hours."
    ],
    checklists: [
      "Original passport with valid visa stamp + copies",
      "Valid national driving license from home country (translated to English if not in English)",
      "Certificate of Residence from Thai Immigration OR Work Permit",
      "Medical certificate from a Thai clinic (standard 100 THB certificate)",
      "International Driving Permit (IDP) if national license is not in English"
    ]
  },
  {
    id: "condo-rental",
    title: "Relocation & Property Search",
    description: "Expat-friendly property hunt, legal lease agreements review, and utility connections setup in Bangkok, Phuket, or Chiang Mai.",
    category: "living",
    costRange: "Free (Commission paid by landlord)",
    duration: "3 - 7 days",
    iconName: "Home",
    fullDetails: [
      "Personalized search of condos and villas based on your budget and preferred neighborhood.",
      "Accompanied physical or virtual tours via WhatsApp/Telegram video.",
      "Drafting and review of standard Thai-English tenancy contracts protecting your security deposit.",
      "Setup of high-speed fiber internet and guidance on paying electricity/water bills.",
      "Immigration TM30 reporting submitted automatically on your behalf."
    ],
    checklists: [
      "Passport copy",
      "Visa status details",
      "Required move-in date",
      "First month's rent + 2-month security deposit in cash or bank transfer"
    ]
  }
];

export const FAQS = [
  {
    question: "What is the new DTV (Destination Thailand Visa)?",
    answer: "The Destination Thailand Visa (DTV) is a massive game-changer introduced by the government. It's a 5-year multiple-entry visa designed for digital nomads, remote workers, freelancers, and people doing cultural activities like Muay Thai or cooking classes. Each entry gives you 180 days stay, which can be extended once inside Thailand for another 180 days for a small fee."
  },
  {
    question: "Do I really need 500,000 THB to apply for the DTV?",
    answer: "Yes, the financial requirement of 500,000 THB (roughly $13,600 USD) is a strict requirement. You must show a bank statement (foreign or Thai account) showing this balance at the time of your application. The funds do not necessarily need to be seasoning for a long time, but they must be clearly visible under your name."
  },
  {
    question: "Can I open a Thai bank account on a tourist visa?",
    answer: "Yes, you can! While most Thai banks officially require a long-term visa or work permit, we can assist you in opening an account with top banks (like Bangkok Bank or Kasikorn Bank) using our residential certificate and specialized embassy/legal assistance. You'll get a debit card and mobile banking immediately."
  },
  {
    question: "How long does it take to convert my home driver's license?",
    answer: "If you have a valid national driving license from your home country (or an International Driving Permit), we can help you convert it at the Land Transport Office in just 1-2 days. You will not need to take a physical driving theory or road test; you only need to pass standard physical reaction and color-blindness tests."
  },
  {
    question: "Can you help me set up a business and get a work permit?",
    answer: "Absolutely. We register Thai private limited companies, register your VAT, obtain tax IDs, and set up your commercial bank accounts. Once the company is active with appropriate registered capital (typically 2 Million THB for one foreign employee), we sponsor your Non-Immigrant B visa and digital Work Permit."
  }
];
