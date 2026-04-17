import { NextRequest, NextResponse } from 'next/server'
import { SchemeService } from '@/server/services/scheme-service'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const schemeService = new SchemeService()
    
    // Try to get by ID first, then by slug
    let schemeDetail = schemeService.getSchemeById(params.id)
    
    if (!schemeDetail) {
      schemeDetail = schemeService.getSchemeBySlug(params.id)
    }
    
    if (!schemeDetail) {
      return NextResponse.json(
        { error: 'Scheme not found' },
        { status: 404 }
      )
    }
    
    // Get related schemes
    const relatedSchemes = schemeService.getRelatedSchemes(schemeDetail.id, 4)
    
    const response = {
      scheme: schemeDetail,
      sources: schemeDetail.sources || [],
      relatedSchemes
    }
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('Scheme detail API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}