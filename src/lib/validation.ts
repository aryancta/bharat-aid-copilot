import { z } from 'zod'
import { SUPPORTED_LANGUAGES, SCHEME_CATEGORIES, INDIAN_STATES, OCCUPATION_CATEGORIES, SOCIAL_CATEGORIES, EDUCATION_LEVELS } from '@/types'

// Helper schemas
const supportedLanguages = SUPPORTED_LANGUAGES.map(l => l.code)
const schemeCategories = SCHEME_CATEGORIES as readonly string[]
const indianStates = INDIAN_STATES as readonly string[]
const occupationCategories = OCCUPATION_CATEGORIES as readonly string[]
const socialCategories = SOCIAL_CATEGORIES as readonly string[]
const educationLevels = EDUCATION_LEVELS as readonly string[]

// Core schemas
export const UserProfileSchema = z.object({
  id: z.string().optional(),
  age: z.number().min(0).max(120).optional(),
  state: z.enum(indianStates as [string, ...string[]]).optional(),
  income: z.number().min(0).optional(),
  occupation: z.enum(occupationCategories as [string, ...string[]]).optional(),
  category: z.enum(socialCategories as [string, ...string[]]).optional(),
  education: z.enum(educationLevels as [string, ...string[]]).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  disability_status: z.enum(['None', 'Visual', 'Hearing', 'Physical', 'Intellectual', 'Multiple']).optional(),
  created_at: z.string().optional(),
})

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.enum(supportedLanguages as [string, ...string[]]).default('en'),
  conversation_id: z.string().uuid().optional(),
  profile: UserProfileSchema.optional(),
})

export const EligibilityCheckRequestSchema = z.object({
  profile: UserProfileSchema.refine(
    (profile) => profile.age !== undefined || profile.state !== undefined,
    { message: "At least age or state must be provided" }
  ),
})

export const ChecklistGenerateRequestSchema = z.object({
  scheme_id: z.string().min(1),
  profile: UserProfileSchema.optional(),
})

export const SchemesQuerySchema = z.object({
  q: z.string().optional(),
  category: z.enum(schemeCategories as [string, ...string[]]).optional(),
  state: z.enum([...indianStates, 'All India'] as [string, ...string[]]).optional(),
  beneficiary_type: z.string().optional(),
  language: z.enum(supportedLanguages as [string, ...string[]]).optional(),
  application_mode: z.enum(['online', 'offline', 'both']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  sort: z.enum(['relevance', 'name', 'last_updated']).default('relevance'),
})

export const EvaluationQuerySchema = z.object({
  run_id: z.string().optional(),
  language: z.enum(supportedLanguages as [string, ...string[]]).optional(),
  category: z.string().optional(),
})

// Database model schemas
export const SchemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  summary: z.string(),
  department: z.string(),
  category: z.enum(schemeCategories as [string, ...string[]]),
  beneficiary_types: z.array(z.string()),
  states: z.array(z.string()),
  languages: z.array(z.enum(supportedLanguages as [string, ...string[]])),
  application_mode: z.enum(['online', 'offline', 'both']),
  official_url: z.string().url(),
  last_updated: z.string(),
})

export const SourceChunkSchema = z.object({
  id: z.string(),
  scheme_id: z.string(),
  source_type: z.enum(['pdf', 'web', 'faq']),
  source_title: z.string(),
  section_title: z.string().optional(),
  content: z.string(),
  chunk_index: z.number().min(0),
  embedding_id: z.string().optional(),
  citation_url: z.string().url(),
  language: z.enum(supportedLanguages as [string, ...string[]]),
  created_at: z.string(),
})

export const EligibilityRuleSchema = z.object({
  id: z.string(),
  scheme_id: z.string(),
  rule_type: z.enum(['age', 'income', 'state', 'category', 'occupation', 'education', 'gender', 'disability']),
  operator: z.enum(['equals', 'less_than', 'greater_than', 'in', 'contains', 'not_equals']),
  value: z.string(),
  description: z.string(),
  severity: z.enum(['required', 'preferred', 'exclusion']),
  source_chunk_id: z.string().optional(),
})

export const DocumentRequirementSchema = z.object({
  id: z.string(),
  scheme_id: z.string(),
  document_name: z.string(),
  required: z.boolean(),
  notes: z.string().optional(),
  source_chunk_id: z.string().optional(),
})

export const ApplicationStepSchema = z.object({
  id: z.string(),
  scheme_id: z.string(),
  step_number: z.number().min(1),
  title: z.string(),
  description: z.string(),
  mode: z.enum(['online', 'offline', 'both']),
  source_chunk_id: z.string().optional(),
})

export const ConversationSchema = z.object({
  id: z.string(),
  user_language: z.enum(supportedLanguages as [string, ...string[]]),
  created_at: z.string(),
  updated_at: z.string(),
  title: z.string(),
})

export const ChatMessageSchema = z.object({
  id: z.string(),
  conversation_id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  language: z.enum(supportedLanguages as [string, ...string[]]),
  created_at: z.string(),
  citations: z.array(z.any()).optional(),
})

export const BenchmarkQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  language: z.enum(supportedLanguages as [string, ...string[]]),
  expected_scheme_ids: z.array(z.string()),
  expected_answer_points: z.array(z.string()),
  category: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

export const EvaluationResultSchema = z.object({
  id: z.string(),
  benchmark_question_id: z.string(),
  retrieved_scheme_ids: z.array(z.string()),
  retrieval_score: z.number().min(0).max(1),
  answer_score: z.number().min(0).max(1),
  citation_coverage: z.number().min(0).max(1),
  language_score: z.number().min(0).max(1),
  run_id: z.string(),
  created_at: z.string(),
})

// Response schemas
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  version: z.string(),
  database: z.enum(['connected', 'error']),
})

export const ChatResponseSchema = z.object({
  answer: z.string(),
  answer_language: z.enum(supportedLanguages as [string, ...string[]]),
  citations: z.array(z.any()),
  confidence: z.number().min(0).max(1),
  follow_ups: z.array(z.string()),
  retrieved_schemes: z.array(SchemeSchema),
  conversation_id: z.string(),
})

export const SchemesListResponseSchema = z.object({
  items: z.array(SchemeSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  has_more: z.boolean(),
})

export const EligibilityCheckResponseSchema = z.object({
  matches: z.array(z.object({
    scheme: SchemeSchema,
    match_score: z.number().min(0).max(1),
    eligible: z.boolean(),
    reasoning: z.string(),
    missing_requirements: z.array(z.string()).optional(),
    matched_rules: z.array(EligibilityRuleSchema),
  })),
  missing_fields: z.array(z.string()),
  summary: z.string(),
})

export const EvaluationMetricsResponseSchema = z.object({
  metrics: z.object({
    retrieval_accuracy: z.number(),
    citation_coverage: z.number(),
    answer_completeness: z.number(),
    multilingual_score: z.number(),
  }),
  runs: z.array(z.object({
    run_id: z.string(),
    experiment_name: z.string(),
    status: z.string(),
    start_time: z.string(),
    metrics: z.record(z.number()),
    tags: z.record(z.string()),
  })),
  samples: z.array(z.object({
    question: z.string(),
    language: z.string(),
    expected_schemes: z.string(),
    retrieved_schemes: z.string(),
    retrieval_score: z.number(),
    answer_quality: z.number(),
    citation_count: z.number(),
  })),
})

// Type inference
export type UserProfileData = z.infer<typeof UserProfileSchema>
export type ChatRequestData = z.infer<typeof ChatRequestSchema>
export type EligibilityCheckRequestData = z.infer<typeof EligibilityCheckRequestSchema>
export type ChecklistGenerateRequestData = z.infer<typeof ChecklistGenerateRequestSchema>
export type SchemesQueryData = z.infer<typeof SchemesQuerySchema>
export type EvaluationQueryData = z.infer<typeof EvaluationQuerySchema>