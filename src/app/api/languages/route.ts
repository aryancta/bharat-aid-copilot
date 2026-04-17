import { NextResponse } from 'next/server'
import { SUPPORTED_LANGUAGES } from '@/types'

export async function GET() {
  try {
    return NextResponse.json({
      languages: SUPPORTED_LANGUAGES
    })

  } catch (error) {
    console.error('Languages API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}