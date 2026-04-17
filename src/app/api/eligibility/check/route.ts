import { NextRequest, NextResponse } from 'next/server'
import { EligibilityService } from '@/lib/eligibility'
import { EligibilityCheckRequestSchema, EligibilityCheckResponseSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedRequest = EligibilityCheckRequestSchema.parse(body)
    
    const eligibilityService = new EligibilityService()
    const result = eligibilityService.evaluateEligibility(validatedRequest.profile)
    
    // Validate response
    const validatedResponse = EligibilityCheckResponseSchema.parse(result)
    
    return NextResponse.json(validatedResponse)

  } catch (error) {
    console.error('Eligibility check API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Eligibility service temporarily unavailable',
        matches: [],
        missing_fields: [],
        summary: 'We are currently unable to process eligibility checks. Please try again later.'
      },
      { status: 500 }
    )
  }
}