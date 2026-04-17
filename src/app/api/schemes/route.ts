import { NextRequest, NextResponse } from 'next/server'
import { SchemeService } from '@/server/services/scheme-service'
import { SchemesQuerySchema, SchemesListResponseSchema } from '@/lib/validation'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryParams = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      state: searchParams.get('state') || undefined,
      beneficiaryType: searchParams.get('beneficiaryType') || undefined,
      language: searchParams.get('language') || undefined,
      applicationMode: searchParams.get('applicationMode') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : DEFAULT_PAGE_SIZE,
      sort: searchParams.get('sort') || 'relevance',
    }

    const validatedParams = SchemesQuerySchema.parse(queryParams)
    
    const schemeService = new SchemeService()
    const result = schemeService.getSchemes(validatedParams)
    
    // Validate response
    const validated = SchemesListResponseSchema.parse(result)
    
    return NextResponse.json(validated)

  } catch (error) {
    console.error('Schemes API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET statistics endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'stats') {
      const schemeService = new SchemeService()
      const stats = schemeService.getSchemeStatistics()
      
      return NextResponse.json(stats)
    }
    
    if (body.action === 'featured') {
      const schemeService = new SchemeService()
      const featured = schemeService.getFeaturedSchemes(body.limit || 6)
      
      return NextResponse.json({ items: featured })
    }
    
    if (body.action === 'trending') {
      const schemeService = new SchemeService()
      const trending = schemeService.getTrendingSchemes(body.limit || 5)
      
      return NextResponse.json({ items: trending })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Schemes POST API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}