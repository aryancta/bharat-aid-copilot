import { 
  Scheme, 
  SourceChunk, 
  EligibilityRule, 
  DocumentRequirement, 
  ApplicationStep, 
  BenchmarkQuestion,
  UserProfile
} from '@/types'
import { generateId, slugify } from './utils'

// Comprehensive seed data for Indian government schemes

export const mockSchemes: Scheme[] = [
  {
    id: 'pm-kisan-samman-nidhi',
    name: 'PM-KISAN Samman Nidhi',
    slug: 'pm-kisan-samman-nidhi',
    summary: 'Financial benefit of Rs. 6000 per year in three equal installments to all landholding farmer families across the country.',
    department: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    beneficiary_types: ['Small and Marginal Farmers', 'Landholding Farmers'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr'],
    application_mode: 'online',
    official_url: 'https://pmkisan.gov.in',
    last_updated: '2024-01-15T00:00:00Z'
  },
  {
    id: 'jal-jeevan-mission',
    name: 'Jal Jeevan Mission',
    slug: 'jal-jeevan-mission',
    summary: 'Aims to provide safe and adequate drinking water through individual household tap connections by 2024 to all households in rural India.',
    department: 'Ministry of Jal Shakti',
    category: 'Rural Development',
    beneficiary_types: ['Rural Households', 'Villages'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'gu', 'mr'],
    application_mode: 'offline',
    official_url: 'https://jaljeevanmission.gov.in',
    last_updated: '2024-02-01T00:00:00Z'
  },
  {
    id: 'ayushman-bharat-pmjay',
    name: 'Ayushman Bharat PM-JAY',
    slug: 'ayushman-bharat-pmjay',
    summary: 'World\'s largest health insurance scheme providing coverage of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.',
    department: 'Ministry of Health and Family Welfare',
    category: 'Health',
    beneficiary_types: ['Below Poverty Line Families', 'Economically Vulnerable Groups'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'ml', 'kn'],
    application_mode: 'both',
    official_url: 'https://pmjay.gov.in',
    last_updated: '2024-01-20T00:00:00Z'
  },
  {
    id: 'pradhan-mantri-awas-yojana',
    name: 'Pradhan Mantri Awas Yojana - Gramin',
    slug: 'pradhan-mantri-awas-yojana',
    summary: 'Provides assistance to rural poor for construction of pucca houses with basic amenities.',
    department: 'Ministry of Rural Development',
    category: 'Housing',
    beneficiary_types: ['Rural Poor', 'Houseless Families', 'Families with Kutcha Houses'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'gu', 'mr', 'ta'],
    application_mode: 'offline',
    official_url: 'https://pmayg.nic.in',
    last_updated: '2023-12-10T00:00:00Z'
  },
  {
    id: 'national-scholarship-portal',
    name: 'National Scholarship Portal',
    slug: 'national-scholarship-portal',
    summary: 'One-stop solution for various scholarship schemes for students belonging to different sections of society.',
    department: 'Ministry of Electronics and Information Technology',
    category: 'Education',
    beneficiary_types: ['Students', 'SC/ST Students', 'OBC Students', 'Minority Students'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'ml', 'kn', 'gu', 'mr', 'pa'],
    application_mode: 'online',
    official_url: 'https://scholarships.gov.in',
    last_updated: '2024-02-15T00:00:00Z'
  },
  {
    id: 'mgnrega',
    name: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    slug: 'mgnrega',
    summary: 'Guarantees 200 days of wage employment in a financial year to every household in rural areas whose adult members volunteer to do unskilled manual work.',
    department: 'Ministry of Rural Development',
    category: 'Employment',
    beneficiary_types: ['Rural Households', 'Unskilled Workers', 'Agricultural Laborers'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'],
    application_mode: 'offline',
    official_url: 'https://nrega.nic.in',
    last_updated: '2024-01-05T00:00:00Z'
  },
  {
    id: 'pradhan-mantri-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana',
    slug: 'pradhan-mantri-mudra-yojana',
    summary: 'Provides loans up to Rs. 10 lakhs to non-corporate, non-farm small/micro enterprises.',
    department: 'Ministry of Finance',
    category: 'Financial Inclusion',
    beneficiary_types: ['Small Business Owners', 'Micro Entrepreneurs', 'Self Employed'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu'],
    application_mode: 'both',
    official_url: 'https://mudra.org.in',
    last_updated: '2024-01-25T00:00:00Z'
  },
  {
    id: 'beti-bachao-beti-padhao',
    name: 'Beti Bachao Beti Padhao',
    slug: 'beti-bachao-beti-padhao',
    summary: 'Aims to address the declining child sex ratio and empowerment of women and girls.',
    department: 'Ministry of Women and Child Development',
    category: 'Women and Child Development',
    beneficiary_types: ['Girl Child', 'Women', 'Families with Girl Children'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'],
    application_mode: 'offline',
    official_url: 'https://wcd.nic.in/bbbp-scheme',
    last_updated: '2023-11-20T00:00:00Z'
  },
  {
    id: 'pradhan-mantri-jan-arogya-yojana',
    name: 'Pradhan Mantri Jan Arogya Yojana',
    slug: 'pradhan-mantri-jan-arogya-yojana',
    summary: 'Provides health coverage of Rs. 5 lakhs per family per year to over 10.74 crore poor and vulnerable families.',
    department: 'Ministry of Health and Family Welfare',
    category: 'Health',
    beneficiary_types: ['Poor Families', 'Vulnerable Families', 'Rural Population', 'Urban Population'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'],
    application_mode: 'both',
    official_url: 'https://pmjay.gov.in',
    last_updated: '2024-02-10T00:00:00Z'
  },
  {
    id: 'pradhan-mantri-kisan-credit-card',
    name: 'Pradhan Mantri Kisan Credit Card',
    slug: 'pradhan-mantri-kisan-credit-card',
    summary: 'Provides adequate and timely credit support from the banking system to farmers for their cultivation and other needs.',
    department: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    beneficiary_types: ['Farmers', 'Agricultural Cooperatives', 'Self Help Groups in Agriculture'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu'],
    application_mode: 'both',
    official_url: 'https://pmkisan.gov.in/kcc.aspx',
    last_updated: '2024-01-30T00:00:00Z'
  },
  {
    id: 'pradhan-mantri-ujjwala-yojana',
    name: 'Pradhan Mantri Ujjwala Yojana',
    slug: 'pradhan-mantri-ujjwala-yojana',
    summary: 'Aims to provide LPG connections to women from Below Poverty Line (BPL) households.',
    department: 'Ministry of Petroleum and Natural Gas',
    category: 'Social Welfare',
    beneficiary_types: ['BPL Women', 'Rural Women', 'SC/ST Women'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn'],
    application_mode: 'offline',
    official_url: 'https://pmuy.gov.in',
    last_updated: '2023-12-15T00:00:00Z'
  },
  {
    id: 'skill-india-mission',
    name: 'Skill India Mission',
    slug: 'skill-india-mission',
    summary: 'Aims to train over 40 crore people in India in different skills by 2025.',
    department: 'Ministry of Skill Development and Entrepreneurship',
    category: 'Skill Development',
    beneficiary_types: ['Youth', 'Job Seekers', 'School Dropouts', 'College Graduates'],
    states: ['All India'],
    languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa'],
    application_mode: 'online',
    official_url: 'https://skillindia.gov.in',
    last_updated: '2024-01-12T00:00:00Z'
  }
]

export const mockSourceChunks: SourceChunk[] = [
  // PM-KISAN sources
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    source_type: 'web',
    source_title: 'PM-KISAN Official Guidelines',
    section_title: 'Scheme Overview',
    content: 'PM-KISAN is a Central Sector scheme with 100% funding from Government of India. Under the scheme, an amount of Rs.6000/- per year is transferred in three 4-monthly installments of Rs.2000/- each directly into the bank accounts of the beneficiaries. The scheme covers all landholding farmers irrespective of the size of their land holdings.',
    chunk_index: 0,
    citation_url: 'https://pmkisan.gov.in/Guidelines.aspx',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    source_type: 'pdf',
    source_title: 'PM-KISAN Eligibility Criteria',
    section_title: 'Beneficiary Identification',
    content: 'All landholding farmers\' families are eligible for benefits under the scheme. However, the following categories are excluded: (a) Institutional land holders (b) Farmer families which belong to one or more of the following categories - Former and present holders of constitutional posts, Former and present Ministers/State Ministers, Former and present Members of Lok Sabha/Rajya Sabha/State Legislative Assemblies/State Legislative Councils.',
    chunk_index: 1,
    citation_url: 'https://pmkisan.gov.in/Documents/EligibilityCriteria.pdf',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  // Ayushman Bharat sources
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    source_type: 'web',
    source_title: 'Ayushman Bharat PM-JAY Coverage Details',
    section_title: 'Coverage and Benefits',
    content: 'PM-JAY provides coverage of up to Rs. 5 lakh per family per year for secondary and tertiary care hospitalization to over 10.74 crore poor and vulnerable families (approximately 50 crore beneficiaries) that form the bottom 40% of the Indian population. The scheme covers both pre-existing diseases and includes cashless treatment at empaneled hospitals.',
    chunk_index: 0,
    citation_url: 'https://pmjay.gov.in/about/pmjay',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    source_type: 'faq',
    source_title: 'PM-JAY Eligibility FAQ',
    section_title: 'Who is eligible?',
    content: 'Beneficiaries are identified based on the Socio-Economic Caste Census (SECC) 2011 database. Families are automatically enrolled based on deprivation and occupational criteria defined in SECC 2011 for rural areas and occupational criteria for urban areas. There is no cap on family size, age, or gender.',
    chunk_index: 1,
    citation_url: 'https://pmjay.gov.in/FAQ',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  // National Scholarship Portal sources
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    source_type: 'web',
    source_title: 'NSP Scholarship Categories',
    section_title: 'Available Scholarships',
    content: 'National Scholarship Portal hosts various scholarship schemes including Pre-Matric Scholarship for SC/ST/OBC students, Post-Matric Scholarship for SC/ST/OBC students, Merit-cum-Means Scholarship for professional and technical courses, Central Sector Scholarship for college and university students, and various state government scholarships.',
    chunk_index: 0,
    citation_url: 'https://scholarships.gov.in/schemeList',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  // MGNREGA sources
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    source_type: 'pdf',
    source_title: 'MGNREGA Operational Guidelines',
    section_title: 'Employment Guarantee',
    content: 'Under MGNREGA, every household in rural areas is entitled to 200 days of guaranteed employment in a financial year. The work should be provided within 15 days of application, and if not, unemployment allowance must be paid. The wage rate is determined by the Central Government and varies by state.',
    chunk_index: 0,
    citation_url: 'https://nrega.nic.in/netnrega/writereaddata/circulars/Operational_guidelines_4thEdition_eng_2013.pdf',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  },
  // MUDRA Yojana sources
  {
    id: generateId(),
    scheme_id: 'pradhan-mantri-mudra-yojana',
    source_type: 'web',
    source_title: 'MUDRA Loan Categories',
    section_title: 'Loan Types',
    content: 'MUDRA loans are given under three categories: Shishu (loans up to Rs. 50,000), Kishore (loans from Rs. 50,001 to Rs. 5 lakh), and Tarun (loans from Rs. 5,00,001 to Rs. 10 lakh). These loans are provided by Banks, NBFCs, and MFIs to support micro and small enterprises.',
    chunk_index: 0,
    citation_url: 'https://mudra.org.in/About-Mudra',
    language: 'en',
    created_at: '2024-01-01T00:00:00Z'
  }
]

export const mockEligibilityRules: EligibilityRule[] = [
  // PM-KISAN rules
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    rule_type: 'occupation',
    operator: 'equals',
    value: 'Farmer',
    description: 'Applicant must be a landholding farmer',
    severity: 'required'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    rule_type: 'income',
    operator: 'less_than',
    value: '2000000',
    description: 'Annual income should be less than Rs. 20 lakhs',
    severity: 'exclusion'
  },
  // Ayushman Bharat rules
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    rule_type: 'income',
    operator: 'less_than',
    value: '120000',
    description: 'Annual family income should be less than Rs. 1.2 lakhs in rural areas',
    severity: 'required'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    rule_type: 'category',
    operator: 'in',
    value: 'SC,ST,OBC',
    description: 'Belongs to SC/ST/OBC category or economically vulnerable group',
    severity: 'preferred'
  },
  // NSP rules
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    rule_type: 'occupation',
    operator: 'equals',
    value: 'Student',
    description: 'Applicant must be a student in recognized educational institution',
    severity: 'required'
  },
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    rule_type: 'age',
    operator: 'less_than',
    value: '30',
    description: 'Age should be less than 30 years for most scholarships',
    severity: 'preferred'
  },
  // MGNREGA rules
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    rule_type: 'age',
    operator: 'greater_than',
    value: '18',
    description: 'Applicant must be above 18 years of age',
    severity: 'required'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    rule_type: 'occupation',
    operator: 'in',
    value: 'Unemployed,Daily Wage Worker,Agricultural Worker',
    description: 'Suitable for unemployed or unskilled workers seeking employment',
    severity: 'preferred'
  },
  // MUDRA rules
  {
    id: generateId(),
    scheme_id: 'pradhan-mantri-mudra-yojana',
    rule_type: 'occupation',
    operator: 'in',
    value: 'Small Business Owner,Self Employed,Artisan/Craftsperson',
    description: 'For non-corporate, non-farm small/micro enterprises',
    severity: 'required'
  },
  // Housing scheme rules
  {
    id: generateId(),
    scheme_id: 'pradhan-mantri-awas-yojana',
    rule_type: 'income',
    operator: 'less_than',
    value: '100000',
    description: 'Annual household income should be less than Rs. 1 lakh',
    severity: 'required'
  }
]

export const mockDocumentRequirements: DocumentRequirement[] = [
  // PM-KISAN documents
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    document_name: 'Aadhaar Card',
    required: true,
    notes: 'Aadhaar number is mandatory for enrollment'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    document_name: 'Land Ownership Documents',
    required: true,
    notes: 'Revenue records showing land ownership like Khata/Khatauni'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    document_name: 'Bank Passbook',
    required: true,
    notes: 'Active bank account for direct benefit transfer'
  },
  // Ayushman Bharat documents
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    document_name: 'Ration Card',
    required: true,
    notes: 'BPL or APL ration card'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    document_name: 'Aadhaar Card',
    required: true,
    notes: 'For all family members'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    document_name: 'Mobile Number',
    required: true,
    notes: 'For receiving OTP and notifications'
  },
  // NSP documents
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    document_name: 'Student ID Card',
    required: true,
    notes: 'Valid student identity from current institution'
  },
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    document_name: 'Income Certificate',
    required: true,
    notes: 'Family income certificate from competent authority'
  },
  {
    id: generateId(),
    scheme_id: 'national-scholarship-portal',
    document_name: 'Caste Certificate',
    required: false,
    notes: 'Required for category-specific scholarships'
  },
  // MGNREGA documents
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    document_name: 'Aadhaar Card',
    required: true,
    notes: 'For job card registration'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    document_name: 'Passport Size Photo',
    required: true,
    notes: 'Recent photograph for job card'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    document_name: 'Bank Account Details',
    required: true,
    notes: 'For wage payment through bank transfer'
  }
]

export const mockApplicationSteps: ApplicationStep[] = [
  // PM-KISAN steps
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    step_number: 1,
    title: 'Visit Official Portal',
    description: 'Go to pmkisan.gov.in and click on "Farmers Corner"',
    mode: 'online'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    step_number: 2,
    title: 'Self Registration',
    description: 'Select "New Farmer Registration" and fill the form with Aadhaar, name, and mobile number',
    mode: 'online'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    step_number: 3,
    title: 'Document Verification',
    description: 'Upload land ownership documents and bank account details for verification',
    mode: 'online'
  },
  {
    id: generateId(),
    scheme_id: 'pm-kisan-samman-nidhi',
    step_number: 4,
    title: 'Submit Application',
    description: 'Review all details and submit the application. Note down registration number for tracking',
    mode: 'online'
  },
  // Ayushman Bharat steps
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    step_number: 1,
    title: 'Check Eligibility',
    description: 'Visit pmjay.gov.in and check if your family is eligible using mobile number or ration card',
    mode: 'online'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    step_number: 2,
    title: 'Visit Common Service Center',
    description: 'Go to nearest CSC or empaneled hospital with required documents',
    mode: 'offline'
  },
  {
    id: generateId(),
    scheme_id: 'ayushman-bharat-pmjay',
    step_number: 3,
    title: 'Generate e-card',
    description: 'Complete biometric authentication and get your Ayushman Bharat card printed',
    mode: 'offline'
  },
  // MGNREGA steps
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    step_number: 1,
    title: 'Apply for Job Card',
    description: 'Submit application to Gram Panchayat with household details and photographs',
    mode: 'offline'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    step_number: 2,
    title: 'Receive Job Card',
    description: 'Collect job card from Gram Panchayat within 15 days of application',
    mode: 'offline'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    step_number: 3,
    title: 'Apply for Work',
    description: 'Submit work application to Gram Panchayat or block office requesting employment',
    mode: 'offline'
  },
  {
    id: generateId(),
    scheme_id: 'mgnrega',
    step_number: 4,
    title: 'Join Work',
    description: 'Report at worksite as per work allocation and maintain attendance',
    mode: 'offline'
  }
]

export const mockBenchmarkQuestions: BenchmarkQuestion[] = [
  {
    id: generateId(),
    question: 'What is PM-KISAN scheme and who can apply for it?',
    language: 'en',
    expected_scheme_ids: ['pm-kisan-samman-nidhi'],
    expected_answer_points: [
      'Financial benefit of Rs. 6000 per year',
      'For landholding farmers',
      'Three installments of Rs. 2000 each',
      'Requires Aadhaar and land documents'
    ],
    category: 'basic_query',
    difficulty: 'easy'
  },
  {
    id: generateId(),
    question: 'I am a 25-year-old farmer from Maharashtra with 2 acres of land. Which schemes can I apply for?',
    language: 'en',
    expected_scheme_ids: ['pm-kisan-samman-nidhi', 'pradhan-mantri-kisan-credit-card'],
    expected_answer_points: [
      'PM-KISAN for income support',
      'Kisan Credit Card for agricultural credit',
      'Age and occupation make you eligible'
    ],
    category: 'eligibility_check',
    difficulty: 'medium'
  },
  {
    id: generateId(),
    question: 'मुझे स्वास्थ्य बीमा योजना के बारे में जानकारी चाहिए',
    language: 'hi',
    expected_scheme_ids: ['ayushman-bharat-pmjay', 'pradhan-mantri-jan-arogya-yojana'],
    expected_answer_points: [
      'Ayushman Bharat provides health coverage',
      'Rs. 5 lakh coverage per family',
      'For poor and vulnerable families'
    ],
    category: 'multilingual',
    difficulty: 'medium'
  },
  {
    id: generateId(),
    question: 'I am a single mother with two children, unemployed, living in rural Karnataka. What support can I get?',
    language: 'en',
    expected_scheme_ids: ['mgnrega', 'ayushman-bharat-pmjay', 'beti-bachao-beti-padhao', 'pradhan-mantri-awas-yojana'],
    expected_answer_points: [
      'MGNREGA for employment guarantee',
      'Ayushman Bharat for health coverage',
      'Housing scheme for shelter',
      'Women and child development programs'
    ],
    category: 'complex_reasoning',
    difficulty: 'hard'
  },
  {
    id: generateId(),
    question: 'What documents do I need to apply for PM-KISAN?',
    language: 'en',
    expected_scheme_ids: ['pm-kisan-samman-nidhi'],
    expected_answer_points: [
      'Aadhaar Card',
      'Land ownership documents',
      'Bank account details',
      'Mobile number'
    ],
    category: 'basic_query',
    difficulty: 'easy'
  }
]

export const mockUserProfiles: UserProfile[] = [
  {
    id: generateId(),
    age: 35,
    state: 'Maharashtra',
    income: 80000,
    occupation: 'Farmer',
    category: 'General',
    education: 'High School',
    gender: 'Male',
    disability_status: 'None',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: generateId(),
    age: 22,
    state: 'Karnataka',
    income: 25000,
    occupation: 'Student',
    category: 'SC',
    education: 'Graduate',
    gender: 'Female',
    disability_status: 'None',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: generateId(),
    age: 45,
    state: 'Uttar Pradesh',
    income: 60000,
    occupation: 'Daily Wage Worker',
    category: 'OBC',
    education: 'Primary',
    gender: 'Male',
    disability_status: 'None',
    created_at: '2024-01-03T00:00:00Z'
  }
]

// Helper function to get all mock data
export function getAllMockData() {
  return {
    schemes: mockSchemes,
    sourceChunks: mockSourceChunks,
    eligibilityRules: mockEligibilityRules,
    documentRequirements: mockDocumentRequirements,
    applicationSteps: mockApplicationSteps,
    benchmarkQuestions: mockBenchmarkQuestions,
    userProfiles: mockUserProfiles
  }
}