import db, { statements, parseJSON, stringifyJSON } from '@/lib/db'
import { BenchmarkQuestion, EvaluationResult, EvaluationMetrics, MLflowRunSummary, BenchmarkRow } from '@/types'
import { generateId } from '@/lib/utils'

export class EvaluationRepository {
  getAllBenchmarkQuestions(): BenchmarkQuestion[] {
    const rows = statements.getBenchmarkQuestions().all() as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  getBenchmarkQuestionsByCategory(category: string): BenchmarkQuestion[] {
    const rows = statements.getBenchmarkQuestionsByCategory().all(category) as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  insertBenchmarkQuestion(question: BenchmarkQuestion): void {
    statements.insertBenchmarkQuestion().run(
      question.id,
      question.question,
      question.language,
      stringifyJSON(question.expected_scheme_ids),
      stringifyJSON(question.expected_answer_points),
      question.category,
      question.difficulty
    )
  }

  getEvaluationResultsByRunId(runId: string): EvaluationResult[] {
    const rows = statements.getEvaluationResults().all(runId) as any[]
    return rows.map(this.mapRowToEvaluationResult)
  }

  insertEvaluationResult(result: EvaluationResult): void {
    statements.insertEvaluationResult().run(
      result.id,
      result.benchmark_question_id,
      stringifyJSON(result.retrieved_scheme_ids),
      result.retrieval_score,
      result.answer_score,
      result.citation_coverage,
      result.language_score,
      result.run_id
    )
  }

  getEvaluationMetrics(runId?: string): EvaluationMetrics {
    let sql = `
      SELECT 
        AVG(retrieval_score) as retrieval_accuracy,
        AVG(citation_coverage) as citation_coverage,
        AVG(answer_score) as answer_completeness,
        AVG(language_score) as multilingual_score,
        COUNT(*) as total_questions
      FROM evaluation_results
    `
    const params: any[] = []

    if (runId) {
      sql += ' WHERE run_id = ?'
      params.push(runId)
    }

    const stmt = db.prepare(sql)
    const row = stmt.get(...params) as any

    return {
      retrieval_accuracy: row.retrieval_accuracy || 0,
      citation_coverage: row.citation_coverage || 0,
      answer_completeness: row.answer_completeness || 0,
      multilingual_score: row.multilingual_score || 0,
      total_questions: row.total_questions || 0,
      timestamp: new Date().toISOString()
    }
  }

  getBenchmarkSamples(limit: number = 10): BenchmarkRow[] {
    const sql = `
      SELECT 
        bq.question,
        bq.language,
        bq.expected_scheme_ids,
        er.retrieved_scheme_ids,
        er.retrieval_score,
        er.answer_score,
        er.citation_coverage
      FROM benchmark_questions bq
      LEFT JOIN evaluation_results er ON bq.id = er.benchmark_question_id
      LIMIT ?
    `
    
    const stmt = db.prepare(sql)
    const rows = stmt.all(limit) as any[]

    return rows.map((row): BenchmarkRow => ({
      question: row.question,
      language: row.language,
      expected_schemes: this.formatSchemeIds(parseJSON<string>(row.expected_scheme_ids)),
      retrieved_schemes: row.retrieved_scheme_ids ? 
        this.formatSchemeIds(parseJSON<string>(row.retrieved_scheme_ids)) : 
        'N/A',
      retrieval_score: row.retrieval_score || 0,
      answer_quality: row.answer_score || 0,
      citation_count: Math.floor((row.citation_coverage || 0) * 3) // Approximate citation count
    }))
  }

  // Mock MLflow integration - in production this would connect to actual MLflow
  getMockMLflowRuns(): MLflowRunSummary[] {
    return [
      {
        run_id: 'run_001_' + Date.now(),
        experiment_name: 'bharat-aid-copilot',
        status: 'FINISHED',
        start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        metrics: {
          'retrieval_accuracy': 0.85,
          'citation_coverage': 0.78,
          'answer_completeness': 0.82,
          'multilingual_score': 0.76
        },
        tags: {
          'model_version': 'v1.0',
          'data_version': 'v1.0',
          'environment': 'development'
        }
      },
      {
        run_id: 'run_002_' + Date.now(),
        experiment_name: 'bharat-aid-copilot',
        status: 'FINISHED',
        start_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        metrics: {
          'retrieval_accuracy': 0.81,
          'citation_coverage': 0.75,
          'answer_completeness': 0.79,
          'multilingual_score': 0.72
        },
        tags: {
          'model_version': 'v0.9',
          'data_version': 'v1.0',
          'environment': 'development'
        }
      }
    ]
  }

  private formatSchemeIds(ids: string[]): string {
    if (!ids || ids.length === 0) return 'None'
    return ids.slice(0, 2).join(', ') + (ids.length > 2 ? `, +${ids.length - 2} more` : '')
  }

  private mapRowToBenchmarkQuestion(row: any): BenchmarkQuestion {
    return {
      id: row.id,
      question: row.question,
      language: row.language,
      expected_scheme_ids: parseJSON<string>(row.expected_scheme_ids),
      expected_answer_points: parseJSON<string>(row.expected_answer_points),
      category: row.category,
      difficulty: row.difficulty
    }
  }

  private mapRowToEvaluationResult(row: any): EvaluationResult {
    return {
      id: row.id,
      benchmark_question_id: row.benchmark_question_id,
      retrieved_scheme_ids: parseJSON<string>(row.retrieved_scheme_ids),
      retrieval_score: row.retrieval_score,
      answer_score: row.answer_score,
      citation_coverage: row.citation_coverage,
      language_score: row.language_score,
      run_id: row.run_id,
      created_at: row.created_at
    }
  }
}