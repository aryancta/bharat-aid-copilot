import db, { statements, parseJSON, stringifyJSON } from '@/lib/db'
import { BenchmarkQuestion } from '@/types'
import { generateId } from '@/lib/utils'

export class BenchmarkRepository {
  getAllBenchmarks(): BenchmarkQuestion[] {
    const rows = statements.getBenchmarkQuestions.all() as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  getBenchmarksByCategory(category: string): BenchmarkQuestion[] {
    const rows = statements.getBenchmarkQuestionsByCategory.all(category) as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  getBenchmarksByLanguage(language: string): BenchmarkQuestion[] {
    const stmt = db.prepare('SELECT * FROM benchmark_questions WHERE language = ?')
    const rows = stmt.all(language) as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  getBenchmarksByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): BenchmarkQuestion[] {
    const stmt = db.prepare('SELECT * FROM benchmark_questions WHERE difficulty = ?')
    const rows = stmt.all(difficulty) as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  insertBenchmark(benchmark: BenchmarkQuestion): void {
    statements.insertBenchmarkQuestion.run(
      benchmark.id,
      benchmark.question,
      benchmark.language,
      stringifyJSON(benchmark.expected_scheme_ids),
      stringifyJSON(benchmark.expected_answer_points),
      benchmark.category,
      benchmark.difficulty
    )
  }

  insertBenchmarks(benchmarks: BenchmarkQuestion[]): void {
    const transaction = db.transaction(() => {
      benchmarks.forEach(benchmark => this.insertBenchmark(benchmark))
    })
    transaction()
  }

  getBenchmarkById(id: string): BenchmarkQuestion | null {
    const stmt = db.prepare('SELECT * FROM benchmark_questions WHERE id = ?')
    const row = stmt.get(id) as any
    return row ? this.mapRowToBenchmarkQuestion(row) : null
  }

  deleteBenchmark(id: string): boolean {
    const stmt = db.prepare('DELETE FROM benchmark_questions WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  searchBenchmarks(query: string): BenchmarkQuestion[] {
    const stmt = db.prepare(`
      SELECT * FROM benchmark_questions 
      WHERE question LIKE ? OR category LIKE ?
      ORDER BY difficulty, question
    `)
    const searchQuery = `%${query}%`
    const rows = stmt.all(searchQuery, searchQuery) as any[]
    return rows.map(this.mapRowToBenchmarkQuestion)
  }

  getBenchmarkStats(): {
    total: number
    by_category: Record<string, number>
    by_language: Record<string, number>
    by_difficulty: Record<string, number>
  } {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM benchmark_questions')
    const total = (totalStmt.get() as any).count

    const categoryStmt = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM benchmark_questions 
      GROUP BY category
    `)
    const categoryRows = categoryStmt.all() as any[]
    const byCategory = categoryRows.reduce((acc, row) => {
      acc[row.category] = row.count
      return acc
    }, {})

    const languageStmt = db.prepare(`
      SELECT language, COUNT(*) as count 
      FROM benchmark_questions 
      GROUP BY language
    `)
    const languageRows = languageStmt.all() as any[]
    const byLanguage = languageRows.reduce((acc, row) => {
      acc[row.language] = row.count
      return acc
    }, {})

    const difficultyStmt = db.prepare(`
      SELECT difficulty, COUNT(*) as count 
      FROM benchmark_questions 
      GROUP BY difficulty
    `)
    const difficultyRows = difficultyStmt.all() as any[]
    const byDifficulty = difficultyRows.reduce((acc, row) => {
      acc[row.difficulty] = row.count
      return acc
    }, {})

    return {
      total,
      by_category: byCategory,
      by_language: byLanguage,
      by_difficulty: byDifficulty
    }
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
}