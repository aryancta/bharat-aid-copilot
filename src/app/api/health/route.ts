import { NextResponse } from 'next/server'
import { SeedService } from '@/server/services/seed-service'
import { HealthResponseSchema } from '@/lib/validation'

export async function GET() {
  try {
    const seedService = new SeedService()
    
    // Check database connectivity by getting stats
    const stats = seedService.getStats()
    
    // Auto-seed if database is empty
    if (!seedService.isSeeded()) {
      console.log('📅 Database appears empty, auto-seeding...')
      await seedService.seedDatabase()
    }

    const response = {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'connected' as const,
      stats
    }

    // Validate response
    const validated = HealthResponseSchema.parse(response)

    return NextResponse.json(validated)

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'error' as const,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}