import { SourceChunk, Scheme, Citation } from '@/types'
import { calculateMatchScore, extractKeywords } from './utils'
import { SchemeRepository } from '@/server/repositories/scheme-repository'

export class RetrievalService {
  private schemeRepository: SchemeRepository

  constructor() {
    this.schemeRepository = new SchemeRepository()
  }

  /**
   * Retrieve relevant source chunks for a query using simple text matching
   * In production, this would use vector embeddings and semantic search
   */
  retrieveRelevantChunks(query: string, maxChunks: number = 5): {
    chunks: SourceChunk[]
    citations: Citation[]
    schemes: Scheme[]
  } {
    // Get all schemes and their source chunks
    const allSchemes = this.schemeRepository.getAllSchemes()
    const allChunks: SourceChunk[] = []

    // Collect all source chunks
    for (const scheme of allSchemes) {
      const chunks = this.schemeRepository.getSourceChunksByScheme(scheme.id)
      allChunks.push(...chunks)
    }

    // Score chunks based on query relevance
    const scoredChunks = allChunks
      .map(chunk => ({
        chunk,
        score: this.calculateRelevanceScore(query, chunk)
      }))
      .filter(({ score }) => score > 0.1) // Minimum relevance threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)

    const relevantChunks = scoredChunks.map(({ chunk }) => chunk)
    
    // Get unique schemes from relevant chunks
    const schemeIds = [...new Set(relevantChunks.map(chunk => chunk.scheme_id))]
    const schemes = this.schemeRepository.getSchemesByIds(schemeIds)

    // Generate citations
    const citations = this.generateCitations(relevantChunks, schemes)

    return {
      chunks: relevantChunks,
      citations,
      schemes
    }
  }

  /**
   * Rank schemes based on query relevance
   */
  rankSchemes(query: string, schemes: Scheme[]): Scheme[] {
    return schemes
      .map(scheme => ({
        scheme,
        score: this.calculateSchemeRelevance(query, scheme)
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ scheme }) => scheme)
  }

  /**
   * Calculate relevance score between query and source chunk
   */
  private calculateRelevanceScore(query: string, chunk: SourceChunk): number {
    const queryLower = query.toLowerCase()
    const contentLower = chunk.content.toLowerCase()
    const titleLower = chunk.source_title.toLowerCase()
    const sectionLower = (chunk.section_title || '').toLowerCase()

    // Exact phrase matching gets high score
    if (contentLower.includes(queryLower)) {
      return 0.9
    }

    // Title matching is important
    let score = calculateMatchScore(queryLower, titleLower) * 0.4

    // Section title matching
    if (chunk.section_title) {
      score += calculateMatchScore(queryLower, sectionLower) * 0.3
    }

    // Content keyword matching
    score += calculateMatchScore(queryLower, contentLower) * 0.3

    // Boost for certain source types
    if (chunk.source_type === 'faq') {
      score *= 1.2 // FAQs are often more directly relevant
    }

    // Language matching bonus (assuming query is in English)
    if (chunk.language === 'en') {
      score *= 1.1
    }

    return Math.min(score, 1.0)
  }

  /**
   * Calculate scheme relevance for a query
   */
  private calculateSchemeRelevance(query: string, scheme: Scheme): number {
    const queryLower = query.toLowerCase()
    
    let score = 0
    
    // Name matching is most important
    score += calculateMatchScore(queryLower, scheme.name.toLowerCase()) * 0.3

    // Summary matching
    score += calculateMatchScore(queryLower, scheme.summary.toLowerCase()) * 0.25

    // Category matching
    score += calculateMatchScore(queryLower, scheme.category.toLowerCase()) * 0.2

    // Beneficiary type matching
    const beneficiaryText = scheme.beneficiary_types.join(' ').toLowerCase()
    score += calculateMatchScore(queryLower, beneficiaryText) * 0.15

    // Department matching
    score += calculateMatchScore(queryLower, scheme.department.toLowerCase()) * 0.1

    return Math.min(score, 1.0)
  }

  /**
   * Generate citations from source chunks and schemes
   */
  private generateCitations(chunks: SourceChunk[], schemes: Scheme[]): Citation[] {
    const schemeMap = new Map(schemes.map(s => [s.id, s]))
    
    return chunks.map(chunk => {
      const scheme = schemeMap.get(chunk.scheme_id)
      
      return {
        id: chunk.id,
        scheme_id: chunk.scheme_id,
        scheme_name: scheme?.name || 'Unknown Scheme',
        source_type: chunk.source_type,
        source_title: chunk.source_title,
        excerpt: this.generateExcerpt(chunk.content),
        citation_url: chunk.citation_url,
        relevance_score: 0.8 // Would be calculated in real retrieval
      }
    })
  }

  /**
   * Generate a concise excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 200): string {
    if (content.length <= maxLength) return content
    
    // Try to break at sentence boundary
    const sentences = content.split(/[.!?]+/)
    let excerpt = ''
    
    for (const sentence of sentences) {
      if ((excerpt + sentence).length <= maxLength - 3) {
        excerpt += sentence + '. '
      } else {
        break
      }
    }
    
    if (excerpt.length === 0) {
      // Fallback to word boundary
      excerpt = content.substring(0, maxLength - 3)
      const lastSpace = excerpt.lastIndexOf(' ')
      if (lastSpace > maxLength * 0.7) {
        excerpt = excerpt.substring(0, lastSpace)
      }
    }
    
    return excerpt.trim() + (excerpt.length < content.length ? '...' : '')
  }

  /**
   * Get suggested follow-up prompts based on retrieved schemes
   */
  generateFollowUpPrompts(schemes: Scheme[], query: string): string[] {
    if (schemes.length === 0) return []

    const prompts: string[] = []
    const mainScheme = schemes[0]

    // Eligibility-focused prompts
    prompts.push(`What are the eligibility criteria for ${mainScheme.name}?`)
    prompts.push(`What documents do I need to apply for ${mainScheme.name}?`)
    
    // Process-focused prompts
    if (mainScheme.application_mode === 'online') {
      prompts.push(`How do I apply for ${mainScheme.name} online?`)
    } else if (mainScheme.application_mode === 'offline') {
      prompts.push(`Where can I apply for ${mainScheme.name} offline?`)
    } else {
      prompts.push(`What is the application process for ${mainScheme.name}?`)
    }

    // Category-based prompts
    if (schemes.length > 1) {
      const categories = [...new Set(schemes.map(s => s.category))]
      if (categories.length > 1) {
        prompts.push(`Show me more ${categories[1]} schemes`)
      }
    }

    // State-specific prompts
    if (mainScheme.states.includes('All India')) {
      prompts.push(`Are there state-specific variants of ${mainScheme.name}?`)
    }

    return prompts.slice(0, 3) // Return top 3 most relevant
  }
}