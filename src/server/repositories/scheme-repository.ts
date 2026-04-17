import db, { statements, parseJSON, stringifyJSON } from '@/lib/db'
import { Scheme, SchemeDetail, SourceChunk, EligibilityRule, DocumentRequirement, ApplicationStep } from '@/types'
import { generateId } from '@/lib/utils'

export class SchemeRepository {
  getAllSchemes(): Scheme[] {
    const rows = statements.listSchemes.all() as any[]
    return rows.map(this.mapRowToScheme)
  }

  getSchemeById(id: string): Scheme | null {
    const row = statements.getScheme.get(id) as any
    return row ? this.mapRowToScheme(row) : null
  }

  getSchemeBySlug(slug: string): Scheme | null {
    const row = statements.getSchemeBySlug.get(slug) as any
    return row ? this.mapRowToScheme(row) : null
  }

  getSchemeDetail(id: string): SchemeDetail | null {
    const scheme = this.getSchemeById(id)
    if (!scheme) return null

    const sources = this.getSourceChunksByScheme(id)
    const eligibilityRules = this.getEligibilityRulesByScheme(id)
    const documents = this.getDocumentsByScheme(id)
    const steps = this.getStepsByScheme(id)

    return {
      ...scheme,
      sources,
      eligibility_rules: eligibilityRules,
      documents,
      steps
    }
  }

  searchSchemes(query?: string, filters?: {
    category?: string
    state?: string
    beneficiaryType?: string
    language?: string
    applicationMode?: string
  }): Scheme[] {
    let sql = 'SELECT * FROM schemes WHERE 1=1'
    const params: any[] = []

    if (query) {
      sql += ' AND (name LIKE ? OR summary LIKE ? OR category LIKE ?)'
      const searchQuery = `%${query}%`
      params.push(searchQuery, searchQuery, searchQuery)
    }

    if (filters?.category) {
      sql += ' AND category = ?'
      params.push(filters.category)
    }

    if (filters?.applicationMode) {
      sql += ' AND application_mode = ?'
      params.push(filters.applicationMode)
    }

    if (filters?.state) {
      sql += ' AND (states LIKE ? OR states LIKE ?)'
      params.push(`%"${filters.state}"%`, '%"All India"%')
    }

    if (filters?.language) {
      sql += ' AND languages LIKE ?'
      params.push(`%"${filters.language}"%`)
    }

    if (filters?.beneficiaryType) {
      sql += ' AND beneficiary_types LIKE ?'
      params.push(`%"${filters.beneficiaryType}"%`)
    }

    sql += ' ORDER BY name'

    const stmt = db.prepare(sql)
    const rows = stmt.all(...params) as any[]
    return rows.map(this.mapRowToScheme)
  }

  getSchemesByIds(ids: string[]): Scheme[] {
    if (ids.length === 0) return []
    
    const placeholders = ids.map(() => '?').join(',')
    const sql = `SELECT * FROM schemes WHERE id IN (${placeholders})`
    const stmt = db.prepare(sql)
    const rows = stmt.all(...ids) as any[]
    return rows.map(this.mapRowToScheme)
  }

  insertScheme(scheme: Scheme): void {
    statements.insertScheme.run(
      scheme.id,
      scheme.name,
      scheme.slug,
      scheme.summary,
      scheme.department,
      scheme.category,
      stringifyJSON(scheme.beneficiary_types),
      stringifyJSON(scheme.states),
      stringifyJSON(scheme.languages),
      scheme.application_mode,
      scheme.official_url,
      scheme.last_updated
    )
  }

  getSourceChunksByScheme(schemeId: string): SourceChunk[] {
    const rows = statements.getSourceChunksByScheme.all(schemeId) as any[]
    return rows.map(this.mapRowToSourceChunk)
  }

  insertSourceChunk(chunk: SourceChunk): void {
    statements.insertSourceChunk.run(
      chunk.id,
      chunk.scheme_id,
      chunk.source_type,
      chunk.source_title,
      chunk.section_title || null,
      chunk.content,
      chunk.chunk_index,
      chunk.citation_url,
      chunk.language
    )
  }

  getEligibilityRulesByScheme(schemeId: string): EligibilityRule[] {
    const rows = statements.getEligibilityRulesByScheme.all(schemeId) as any[]
    return rows.map(this.mapRowToEligibilityRule)
  }

  insertEligibilityRule(rule: EligibilityRule): void {
    statements.insertEligibilityRule.run(
      rule.id,
      rule.scheme_id,
      rule.rule_type,
      rule.operator,
      rule.value,
      rule.description,
      rule.severity
    )
  }

  getDocumentsByScheme(schemeId: string): DocumentRequirement[] {
    const rows = statements.getDocumentsByScheme.all(schemeId) as any[]
    return rows.map(this.mapRowToDocument)
  }

  insertDocument(doc: DocumentRequirement): void {
    statements.insertDocument.run(
      doc.id,
      doc.scheme_id,
      doc.document_name,
      doc.required,
      doc.notes || null
    )
  }

  getStepsByScheme(schemeId: string): ApplicationStep[] {
    const rows = statements.getStepsByScheme.all(schemeId) as any[]
    return rows.map(this.mapRowToStep)
  }

  insertStep(step: ApplicationStep): void {
    statements.insertStep.run(
      step.id,
      step.scheme_id,
      step.step_number,
      step.title,
      step.description,
      step.mode
    )
  }

  // Helper methods to map database rows to domain objects
  private mapRowToScheme(row: any): Scheme {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      summary: row.summary,
      department: row.department,
      category: row.category,
      beneficiary_types: parseJSON<string>(row.beneficiary_types),
      states: parseJSON<string>(row.states),
      languages: parseJSON<string>(row.languages),
      application_mode: row.application_mode,
      official_url: row.official_url,
      last_updated: row.last_updated
    }
  }

  private mapRowToSourceChunk(row: any): SourceChunk {
    return {
      id: row.id,
      scheme_id: row.scheme_id,
      source_type: row.source_type,
      source_title: row.source_title,
      section_title: row.section_title,
      content: row.content,
      chunk_index: row.chunk_index,
      embedding_id: row.embedding_id,
      citation_url: row.citation_url,
      language: row.language,
      created_at: row.created_at
    }
  }

  private mapRowToEligibilityRule(row: any): EligibilityRule {
    return {
      id: row.id,
      scheme_id: row.scheme_id,
      rule_type: row.rule_type,
      operator: row.operator,
      value: row.value,
      description: row.description,
      severity: row.severity,
      source_chunk_id: row.source_chunk_id
    }
  }

  private mapRowToDocument(row: any): DocumentRequirement {
    return {
      id: row.id,
      scheme_id: row.scheme_id,
      document_name: row.document_name,
      required: Boolean(row.required),
      notes: row.notes,
      source_chunk_id: row.source_chunk_id
    }
  }

  private mapRowToStep(row: any): ApplicationStep {
    return {
      id: row.id,
      scheme_id: row.scheme_id,
      step_number: row.step_number,
      title: row.title,
      description: row.description,
      mode: row.mode,
      source_chunk_id: row.source_chunk_id
    }
  }
}