import { SUPPORTED_LANGUAGES, SCHEME_CATEGORIES, INDIAN_STATES, OCCUPATION_CATEGORIES, SOCIAL_CATEGORIES, EDUCATION_LEVELS } from '@/types'

// App-wide constants
export const APP_NAME = 'BharatAid Copilot'
export const APP_DESCRIPTION = 'Find the right government scheme, check eligibility, and get step-by-step help in your language.'

// Default values
export const DEFAULT_LANGUAGE = 'en'
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100
export const MAX_CHAT_HISTORY = 50
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.7
export const MIN_RETRIEVAL_SCORE = 0.5

// Database
export const DATABASE_PATH = process.env.DATABASE_URL || 'sqlite:./data/app.db'

// API Limits
export const RATE_LIMIT_REQUESTS = 100
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

// Retrieval settings
export const MAX_RETRIEVED_CHUNKS = 5
export const MAX_ANSWER_LENGTH = 2000
export const MAX_FOLLOW_UPS = 3

// Evaluation
export const BENCHMARK_CATEGORIES = ['basic_query', 'eligibility_check', 'multilingual', 'complex_reasoning'] as const
export const EVALUATION_METRICS = ['retrieval_accuracy', 'citation_coverage', 'answer_completeness', 'multilingual_score'] as const

// Export re-exported constants for convenience
export {
  SUPPORTED_LANGUAGES,
  SCHEME_CATEGORIES,
  INDIAN_STATES,
  OCCUPATION_CATEGORIES,
  SOCIAL_CATEGORIES,
  EDUCATION_LEVELS,
}

// Confidence level mappings
export const CONFIDENCE_LEVELS = {
  HIGH: { min: 0.8, label: 'High', color: 'green' },
  MEDIUM: { min: 0.6, label: 'Medium', color: 'yellow' },
  LOW: { min: 0.0, label: 'Low', color: 'red' },
} as const

// UI Theme
export const THEME_COLORS = {
  primary: 'indigo',
  secondary: 'teal', 
  accent: 'saffron',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
} as const

// Mock API settings for development
export const MOCK_API_DELAY = 1000 // ms
export const ENABLE_MOCK_RESPONSES = process.env.NODE_ENV === 'development'

// Feature flags
export const FEATURES = {
  multilingual: true,
  databricks_integration: process.env.DATABRICKS_HOST ? true : false,
  mlflow_logging: process.env.MLFLOW_TRACKING_URI ? true : false,
  evaluation_dashboard: true,
  source_citations: true,
} as const