import { initializeDatabase } from '@/lib/db'
import { SchemeRepository } from '../repositories/scheme-repository'
import { BenchmarkRepository } from '../repositories/benchmark-repository'
import { getAllMockData } from '@/lib/mock-data'

export class SeedService {
  private schemeRepository: SchemeRepository
  private benchmarkRepository: BenchmarkRepository

  constructor() {
    this.schemeRepository = new SchemeRepository()
    this.benchmarkRepository = new BenchmarkRepository()
  }

  /**
   * Initialize database and seed with mock data
   */
  async seedDatabase(): Promise<void> {
    console.log('🌱 Starting database seeding...')

    try {
      // Initialize database schema
      initializeDatabase()

      // Get all mock data
      const mockData = getAllMockData()

      // Seed schemes
      console.log('📋 Seeding schemes...')
      for (const scheme of mockData.schemes) {
        try {
          this.schemeRepository.insertScheme(scheme)
        } catch (error) {
          console.log(`   ⚠️  Scheme ${scheme.name} already exists, skipping...`)
        }
      }

      // Seed source chunks
      console.log('📄 Seeding source chunks...')
      for (const chunk of mockData.sourceChunks) {
        try {
          this.schemeRepository.insertSourceChunk(chunk)
        } catch (error) {
          console.log(`   ⚠️  Source chunk ${chunk.id} already exists, skipping...`)
        }
      }

      // Seed eligibility rules
      console.log('✅ Seeding eligibility rules...')
      for (const rule of mockData.eligibilityRules) {
        try {
          this.schemeRepository.insertEligibilityRule(rule)
        } catch (error) {
          console.log(`   ⚠️  Eligibility rule ${rule.id} already exists, skipping...`)
        }
      }

      // Seed document requirements
      console.log('📋 Seeding document requirements...')
      for (const doc of mockData.documentRequirements) {
        try {
          this.schemeRepository.insertDocument(doc)
        } catch (error) {
          console.log(`   ⚠️  Document requirement ${doc.id} already exists, skipping...`)
        }
      }

      // Seed application steps
      console.log('📝 Seeding application steps...')
      for (const step of mockData.applicationSteps) {
        try {
          this.schemeRepository.insertStep(step)
        } catch (error) {
          console.log(`   ⚠️  Application step ${step.id} already exists, skipping...`)
        }
      }

      // Seed benchmark questions
      console.log('🎯 Seeding benchmark questions...')
      for (const question of mockData.benchmarkQuestions) {
        try {
          this.benchmarkRepository.insertBenchmark(question)
        } catch (error) {
          console.log(`   ⚠️  Benchmark question ${question.id} already exists, skipping...`)
        }
      }

      console.log('✅ Database seeding completed successfully!')
      console.log(`   📊 Seeded ${mockData.schemes.length} schemes`)
      console.log(`   📄 Seeded ${mockData.sourceChunks.length} source chunks`)
      console.log(`   ✅ Seeded ${mockData.eligibilityRules.length} eligibility rules`)
      console.log(`   📋 Seeded ${mockData.documentRequirements.length} document requirements`)
      console.log(`   📝 Seeded ${mockData.applicationSteps.length} application steps`)
      console.log(`   🎯 Seeded ${mockData.benchmarkQuestions.length} benchmark questions`)

    } catch (error) {
      console.error('❌ Error during database seeding:', error)
      throw error
    }
  }

  /**
   * Clear all data from database (for development/testing)
   */
  async clearDatabase(): Promise<void> {
    console.log('🗑️  Clearing database...')

    try {
      // Since we're using CASCADE deletes, just deleting schemes will clean up most data
      const db = require('@/lib/db').default
      
      db.exec('DELETE FROM evaluation_results')
      db.exec('DELETE FROM benchmark_questions')
      db.exec('DELETE FROM chat_messages')
      db.exec('DELETE FROM conversations')
      db.exec('DELETE FROM user_profiles')
      db.exec('DELETE FROM application_steps')
      db.exec('DELETE FROM document_requirements')
      db.exec('DELETE FROM eligibility_rules')
      db.exec('DELETE FROM source_chunks')
      db.exec('DELETE FROM schemes')

      console.log('✅ Database cleared successfully!')

    } catch (error) {
      console.error('❌ Error clearing database:', error)
      throw error
    }
  }

  /**
   * Reset database - clear and re-seed
   */
  async resetDatabase(): Promise<void> {
    console.log('🔄 Resetting database...')
    await this.clearDatabase()
    await this.seedDatabase()
    console.log('✅ Database reset completed!')
  }

  /**
   * Get database statistics
   */
  getStats(): {
    schemes: number
    sourceChunks: number
    eligibilityRules: number
    documentRequirements: number
    applicationSteps: number
    benchmarkQuestions: number
  } {
    const db = require('@/lib/db').default

    const schemeCount = db.prepare('SELECT COUNT(*) as count FROM schemes').get() as { count: number }
    const chunkCount = db.prepare('SELECT COUNT(*) as count FROM source_chunks').get() as { count: number }
    const ruleCount = db.prepare('SELECT COUNT(*) as count FROM eligibility_rules').get() as { count: number }
    const docCount = db.prepare('SELECT COUNT(*) as count FROM document_requirements').get() as { count: number }
    const stepCount = db.prepare('SELECT COUNT(*) as count FROM application_steps').get() as { count: number }
    const benchmarkCount = db.prepare('SELECT COUNT(*) as count FROM benchmark_questions').get() as { count: number }

    return {
      schemes: schemeCount.count,
      sourceChunks: chunkCount.count,
      eligibilityRules: ruleCount.count,
      documentRequirements: docCount.count,
      applicationSteps: stepCount.count,
      benchmarkQuestions: benchmarkCount.count
    }
  }

  /**
   * Check if database is seeded
   */
  isSeeded(): boolean {
    const stats = this.getStats()
    return stats.schemes > 0 && stats.sourceChunks > 0
  }
}