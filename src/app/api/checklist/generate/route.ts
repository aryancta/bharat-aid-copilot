import { NextRequest, NextResponse } from 'next/server'
import { ChecklistService } from '@/lib/checklist'
import { ChecklistGenerateRequestSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedRequest = ChecklistGenerateRequestSchema.parse(body)
    
    const checklistService = new ChecklistService()
    const checklist = checklistService.generateChecklist(
      validatedRequest.scheme_id,
      validatedRequest.profile
    )
    
    if (!checklist) {
      return NextResponse.json(
        { error: 'Scheme not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(checklist)

  } catch (error) {
    console.error('Checklist generation API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Checklist service temporarily unavailable' },
      { status: 500 }
    )
  }
}