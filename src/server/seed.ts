#!/usr/bin/env node

/**
 * Database seeding script for BharatAid Copilot
 * Usage: npm run seed
 */

import { SeedService } from './services/seed-service'

async function main() {
  const seedService = new SeedService()

  try {
    const args = process.argv.slice(2)
    const command = args[0]

    switch (command) {
      case 'reset':
        console.log('🔄 Resetting database...')
        await seedService.resetDatabase()
        break
        
      case 'clear':
        console.log('🗑️  Clearing database...')
        await seedService.clearDatabase()
        break
        
      case 'stats':
        console.log('📊 Database statistics:')
        const stats = seedService.getStats()
        console.log('  Schemes:', stats.schemes)
        console.log('  Source chunks:', stats.sourceChunks)
        console.log('  Eligibility rules:', stats.eligibilityRules)
        console.log('  Document requirements:', stats.documentRequirements)
        console.log('  Application steps:', stats.applicationSteps)
        console.log('  Benchmark questions:', stats.benchmarkQuestions)
        break
        
      case 'seed':
      default:
        if (seedService.isSeeded()) {
          console.log('⏩ Database already seeded. Use "reset" to force re-seed.')
          const stats = seedService.getStats()
          console.log(`   📊 Current: ${stats.schemes} schemes, ${stats.sourceChunks} chunks`)
        } else {
          await seedService.seedDatabase()
        }
        break
    }

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}