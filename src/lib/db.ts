import Database from 'better-sqlite3'
import { DATABASE_PATH } from './constants'
import path from 'path'
import fs from 'fs'

// Ensure data directory exists
const dbPath = DATABASE_PATH.replace('sqlite:', '')
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize SQLite database
const db = new Database(dbPath)

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')
db.pragma('cache_size = 1000')
db.pragma('temp_store = MEMORY')

// Track if database is initialized
let isInitialized = false

// Check if tables exist
function tablesExist(): boolean {
  try {
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='schemes'").get()
    return !!result
  } catch {
    return false
  }
}

// Initialize database if needed
function ensureInitialized() {
  if (!isInitialized && !tablesExist()) {
    initializeDatabase()
    isInitialized = true
  }
}

// Create tables
export function initializeDatabase() {
  // Schemes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schemes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT NOT NULL,
      department TEXT NOT NULL,
      category TEXT NOT NULL,
      beneficiary_types TEXT NOT NULL, -- JSON array
      states TEXT NOT NULL, -- JSON array
      languages TEXT NOT NULL, -- JSON array
      application_mode TEXT NOT NULL CHECK (application_mode IN ('online', 'offline', 'both')),
      official_url TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Source chunks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS source_chunks (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'web', 'faq')),
      source_title TEXT NOT NULL,
      section_title TEXT,
      content TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      embedding_id TEXT,
      citation_url TEXT NOT NULL,
      language TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE
    )
  `)

  // Eligibility rules table
  db.exec(`
    CREATE TABLE IF NOT EXISTS eligibility_rules (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      rule_type TEXT NOT NULL CHECK (rule_type IN ('age', 'income', 'state', 'category', 'occupation', 'education', 'gender', 'disability')),
      operator TEXT NOT NULL CHECK (operator IN ('equals', 'less_than', 'greater_than', 'in', 'contains', 'not_equals')),
      value TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK (severity IN ('required', 'preferred', 'exclusion')),
      source_chunk_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
      FOREIGN KEY (source_chunk_id) REFERENCES source_chunks (id) ON DELETE SET NULL
    )
  `)

  // Document requirements table
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_requirements (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      document_name TEXT NOT NULL,
      required BOOLEAN NOT NULL,
      notes TEXT,
      source_chunk_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
      FOREIGN KEY (source_chunk_id) REFERENCES source_chunks (id) ON DELETE SET NULL
    )
  `)

  // Application steps table
  db.exec(`
    CREATE TABLE IF NOT EXISTS application_steps (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'both')),
      source_chunk_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
      FOREIGN KEY (source_chunk_id) REFERENCES source_chunks (id) ON DELETE SET NULL
    )
  `)

  // Conversations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_language TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Chat messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      language TEXT NOT NULL,
      citations TEXT, -- JSON array
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
    )
  `)

  // User profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      age INTEGER,
      state TEXT,
      income REAL,
      occupation TEXT,
      category TEXT,
      education TEXT,
      gender TEXT,
      disability_status TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Benchmark questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS benchmark_questions (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      language TEXT NOT NULL,
      expected_scheme_ids TEXT NOT NULL, -- JSON array
      expected_answer_points TEXT NOT NULL, -- JSON array
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Evaluation results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluation_results (
      id TEXT PRIMARY KEY,
      benchmark_question_id TEXT NOT NULL,
      retrieved_scheme_ids TEXT NOT NULL, -- JSON array
      retrieval_score REAL NOT NULL,
      answer_score REAL NOT NULL,
      citation_coverage REAL NOT NULL,
      language_score REAL NOT NULL,
      run_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (benchmark_question_id) REFERENCES benchmark_questions (id) ON DELETE CASCADE
    )
  `)

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes (category);
    CREATE INDEX IF NOT EXISTS idx_schemes_slug ON schemes (slug);
    CREATE INDEX IF NOT EXISTS idx_source_chunks_scheme ON source_chunks (scheme_id);
    CREATE INDEX IF NOT EXISTS idx_eligibility_rules_scheme ON eligibility_rules (scheme_id);
    CREATE INDEX IF NOT EXISTS idx_document_requirements_scheme ON document_requirements (scheme_id);
    CREATE INDEX IF NOT EXISTS idx_application_steps_scheme ON application_steps (scheme_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages (conversation_id);
    CREATE INDEX IF NOT EXISTS idx_evaluation_results_run ON evaluation_results (run_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at);
  `)

  console.log('Database initialized successfully')
  isInitialized = true
}

// Helper functions for JSON handling
export function parseJSON<T>(jsonString: string | null): T[] {
  if (!jsonString) return [] as T[]
  try {
    return JSON.parse(jsonString) as T[]
  } catch {
    return [] as T[]
  }
}

export function stringifyJSON<T>(data: T[]): string {
  return JSON.stringify(data)
}

// Transaction helper
export function transaction<T>(fn: () => T): T {
  return db.transaction(fn)()
}

// Safe prepared statements that initialize DB if needed
export const statements = {
  // Schemes
  getScheme: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM schemes WHERE id = ?')
  },
  getSchemeBySlug: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM schemes WHERE slug = ?')
  },
  listSchemes: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM schemes ORDER BY name')
  },
  searchSchemes: () => {
    ensureInitialized()
    return db.prepare(`
      SELECT * FROM schemes 
      WHERE name LIKE ? OR summary LIKE ? OR category LIKE ?
      ORDER BY name
    `)
  },
  insertScheme: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO schemes (id, name, slug, summary, department, category, beneficiary_types, states, languages, application_mode, official_url, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
  },

  // Source chunks
  getSourceChunksByScheme: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM source_chunks WHERE scheme_id = ? ORDER BY chunk_index')
  },
  insertSourceChunk: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO source_chunks (id, scheme_id, source_type, source_title, section_title, content, chunk_index, citation_url, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
  },

  // Eligibility rules
  getEligibilityRulesByScheme: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM eligibility_rules WHERE scheme_id = ? ORDER BY severity DESC')
  },
  insertEligibilityRule: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO eligibility_rules (id, scheme_id, rule_type, operator, value, description, severity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
  },

  // Document requirements
  getDocumentsByScheme: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM document_requirements WHERE scheme_id = ? ORDER BY required DESC, document_name')
  },
  insertDocument: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO document_requirements (id, scheme_id, document_name, required, notes)
      VALUES (?, ?, ?, ?, ?)
    `)
  },

  // Application steps
  getStepsByScheme: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM application_steps WHERE scheme_id = ? ORDER BY step_number')
  },
  insertStep: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO application_steps (id, scheme_id, step_number, title, description, mode)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
  },

  // Conversations
  getConversation: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM conversations WHERE id = ?')
  },
  getRecentConversations: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?')
  },
  insertConversation: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO conversations (id, user_language, title)
      VALUES (?, ?, ?)
    `)
  },
  updateConversation: () => {
    ensureInitialized()
    return db.prepare(`
      UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
  },

  // Chat messages
  getMessagesByConversation: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at')
  },
  insertMessage: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO chat_messages (id, conversation_id, role, content, language, citations)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
  },

  // Benchmark questions
  getBenchmarkQuestions: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM benchmark_questions')
  },
  getBenchmarkQuestionsByCategory: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM benchmark_questions WHERE category = ?')
  },
  insertBenchmarkQuestion: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO benchmark_questions (id, question, language, expected_scheme_ids, expected_answer_points, category, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
  },

  // Evaluation results
  getEvaluationResults: () => {
    ensureInitialized()
    return db.prepare('SELECT * FROM evaluation_results WHERE run_id = ?')
  },
  insertEvaluationResult: () => {
    ensureInitialized()
    return db.prepare(`
      INSERT INTO evaluation_results (id, benchmark_question_id, retrieved_scheme_ids, retrieval_score, answer_score, citation_coverage, language_score, run_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
  },
}

export default db