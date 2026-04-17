import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@/server/services/chat-service'
import { ChatRequestSchema, ChatResponseSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedRequest = ChatRequestSchema.parse(body)
    
    const chatService = new ChatService()
    const response = await chatService.processMessage(validatedRequest)
    
    // Validate response
    const validatedResponse = ChatResponseSchema.parse(response)
    
    return NextResponse.json(validatedResponse)

  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Chat service temporarily unavailable',
        answer: 'I apologize, but I\'m currently experiencing technical difficulties. Please try again in a moment or browse our scheme catalog directly.',
        answer_language: 'en',
        citations: [],
        confidence: 0,
        follow_ups: ['Browse all schemes', 'Check eligibility', 'View popular schemes'],
        retrieved_schemes: [],
        conversation_id: 'error-' + Date.now()
      },
      { status: 500 }
    )
  }
}