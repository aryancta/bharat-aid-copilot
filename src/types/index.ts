// Core domain types for BharatAid Copilot

export interface Scheme {
  id: string
  name: string
  slug: string
  summary: string
  department: string
  category: string
  beneficiary_types: string[]
  states: string[]
  languages: string[]
  application_mode: 'online' | 'offline' | 'both'
  official_url: string
  last_updated: string
}

export interface SourceChunk {
  id: string
  scheme_id: string
  source_type: 'pdf' | 'web' | 'faq'
  source_title: string
  section_title?: string
  content: string
  chunk_index: number
  embedding_id?: string
  citation_url: string
  language: string
  created_at: string
}

export interface EligibilityRule {
  id: string
  scheme_id: string
  rule_type: 'age' | 'income' | 'state' | 'category' | 'occupation' | 'education' | 'gender' | 'disability'
  operator: 'equals' | 'less_than' | 'greater_than' | 'in' | 'contains' | 'not_equals'
  value: string
  description: string
  severity: 'required' | 'preferred' | 'exclusion'
  source_chunk_id?: string
}

export interface DocumentRequirement {
  id: string
  scheme_id: string
  document_name: string
  required: boolean
  notes?: string
  source_chunk_id?: string
}

export interface ApplicationStep {
  id: string
  scheme_id: string
  step_number: number
  title: string
  description: string
  mode: 'online' | 'offline' | 'both'
  source_chunk_id?: string
}

export interface Conversation {
  id: string
  user_language: string
  created_at: string
  updated_at: string
  title: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  language: string
  created_at: string
  citations?: Citation[]
}

export interface UserProfile {
  id?: string
  age?: number
  state?: string
  income?: number
  occupation?: string
  category?: string
  education?: string
  gender?: string
  disability_status?: string
  created_at?: string
}

export interface BenchmarkQuestion {
  id: string
  question: string
  language: string
  expected_scheme_ids: string[]
  expected_answer_points: string[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface EvaluationResult {
  id: string
  benchmark_question_id: string
  retrieved_scheme_ids: string[]
  retrieval_score: number
  answer_score: number
  citation_coverage: number
  language_score: number
  run_id: string
  created_at: string
}

// Extended types for API responses
export interface SchemeDetail extends Scheme {
  eligibility_rules: EligibilityRule[]
  documents: DocumentRequirement[]
  steps: ApplicationStep[]
  sources: SourceChunk[]
}

export interface Citation {
  id: string
  scheme_id: string
  scheme_name: string
  source_type: string
  source_title: string
  excerpt: string
  citation_url: string
  relevance_score?: number
}

export interface EligibilityMatch {
  scheme: Scheme
  match_score: number
  eligible: boolean
  reasoning: string
  missing_requirements?: string[]
  matched_rules: EligibilityRule[]
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  type: 'document' | 'action' | 'verification'
  required: boolean
  completed?: boolean
  notes?: string
}

export interface GeneratedChecklist {
  scheme_id: string
  scheme_name: string
  items: ChecklistItem[]
  documents: DocumentRequirement[]
  tips: string[]
  sources: Citation[]
  estimated_time_minutes: number
}

export interface ChatResponse {
  answer: string
  answer_language: string
  citations: Citation[]
  confidence: number
  follow_ups: string[]
  retrieved_schemes: Scheme[]
  conversation_id: string
}

export interface Language {
  code: string
  label: string
  nativeName: string
}

export interface EvaluationMetrics {
  retrieval_accuracy: number
  citation_coverage: number
  answer_completeness: number
  multilingual_score: number
  total_questions: number
  timestamp: string
}

export interface MLflowRunSummary {
  run_id: string
  experiment_name: string
  status: string
  start_time: string
  metrics: Record<string, number>
  tags: Record<string, string>
}

export interface BenchmarkRow {
  question: string
  language: string
  expected_schemes: string
  retrieved_schemes: string
  retrieval_score: number
  answer_quality: number
  citation_count: number
}

// API request/response types
export interface ChatRequest {
  message: string
  language: string
  conversation_id?: string
  profile?: UserProfile
}

export interface EligibilityCheckRequest {
  profile: UserProfile
}

export interface EligibilityCheckResponse {
  matches: EligibilityMatch[]
  missing_fields: string[]
  summary: string
}

export interface ChecklistGenerateRequest {
  scheme_id: string
  profile?: UserProfile
}

export interface SchemesListResponse {
  items: Scheme[]
  page: number
  limit: number
  total: number
  has_more: boolean
}

export interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  version: string
  database: 'connected' | 'error'
}

// Constants
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
]

export const SCHEME_CATEGORIES = [
  'Education',
  'Agriculture',
  'Health',
  'Livelihood',
  'Social Welfare',
  'Rural Development',
  'Urban Development',
  'Financial Inclusion',
  'Skill Development',
  'Women and Child Development',
  'Senior Citizens',
  'Disability Support',
  'Housing',
  'Employment',
  'Entrepreneurship',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

export const OCCUPATION_CATEGORIES = [
  'Student',
  'Farmer',
  'Agricultural Worker',
  'Small Business Owner',
  'Self Employed',
  'Private Employee',
  'Government Employee',
  'Daily Wage Worker',
  'Unemployed',
  'Homemaker',
  'Senior Citizen',
  'Person with Disability',
  'Artisan/Craftsperson',
  'Fisher',
  'Migrant Worker',
] as const

export const SOCIAL_CATEGORIES = [
  'General',
  'Other Backward Class (OBC)',
  'Scheduled Caste (SC)',
  'Scheduled Tribe (ST)',
  'Economically Weaker Section (EWS)',
] as const

export const EDUCATION_LEVELS = [
  'Below Primary',
  'Primary',
  'Middle School',
  'High School',
  'Higher Secondary',
  'Graduate',
  'Post Graduate',
  'Diploma',
  'Technical/Vocational',
  'PhD/Doctorate',
] as const