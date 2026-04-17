import { NextRequest, NextResponse } from 'next/server'
import { EvaluationRepository } from '@/server/repositories/evaluation-repository'
import { EvaluationQuerySchema, EvaluationMetricsResponseSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryParams = {
      run_id: searchParams.get('run_id') || undefined,
      language: searchParams.get('language') || undefined,
      category: searchParams.get('category') || undefined,
    }

    const validatedParams = EvaluationQuerySchema.parse(queryParams)
    
    const evaluationRepository = new EvaluationRepository()
    
    // Get metrics
    const metrics = evaluationRepository.getEvaluationMetrics(validatedParams.run_id)
    
    // Get MLflow runs (mock for now)
    const runs = evaluationRepository.getMockMLflowRuns()
    
    // Get sample benchmark results
    const samples = evaluationRepository.getBenchmarkSamples(10)
    
    const response = {
      metrics,
      runs,
      samples
    }
    
    // Validate response
    const validatedResponse = EvaluationMetricsResponseSchema.parse(response)
    
    return NextResponse.json(validatedResponse)

  } catch (error) {
    console.error('Evaluation metrics API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Evaluation service temporarily unavailable' },
      { status: 500 }
    )
  }
}