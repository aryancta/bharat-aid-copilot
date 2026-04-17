import { Scheme, SchemeDetail, SchemesListResponse } from '@/types'
import { SchemeRepository } from '../repositories/scheme-repository'
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants'

export class SchemeService {
  private schemeRepository: SchemeRepository

  constructor() {
    this.schemeRepository = new SchemeRepository()
  }

  /**
   * Get paginated list of schemes with search and filters
   */
  getSchemes(params: {
    q?: string
    category?: string
    state?: string
    beneficiaryType?: string
    language?: string
    applicationMode?: string
    page?: number
    limit?: number
    sort?: string
  }): SchemesListResponse {
    const page = Math.max(1, params.page || 1)
    const limit = Math.min(params.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
    const offset = (page - 1) * limit

    // Get filtered schemes
    let schemes = this.schemeRepository.searchSchemes(params.q, {
      category: params.category,
      state: params.state,
      beneficiaryType: params.beneficiaryType,
      language: params.language,
      applicationMode: params.applicationMode
    })

    // Apply sorting
    schemes = this.applySorting(schemes, params.sort || 'relevance', params.q)

    // Apply pagination
    const total = schemes.length
    const items = schemes.slice(offset, offset + limit)
    const hasMore = offset + limit < total

    return {
      items,
      page,
      limit,
      total,
      has_more: hasMore
    }
  }

  /**
   * Get scheme by ID with full details
   */
  getSchemeById(id: string): SchemeDetail | null {
    return this.schemeRepository.getSchemeDetail(id)
  }

  /**
   * Get scheme by slug with full details
   */
  getSchemeBySlug(slug: string): SchemeDetail | null {
    const scheme = this.schemeRepository.getSchemeBySlug(slug)
    if (!scheme) return null
    
    return this.schemeRepository.getSchemeDetail(scheme.id)
  }

  /**
   * Get related schemes based on category and beneficiary types
   */
  getRelatedSchemes(schemeId: string, limit: number = 4): Scheme[] {
    const scheme = this.schemeRepository.getSchemeById(schemeId)
    if (!scheme) return []

    const allSchemes = this.schemeRepository.getAllSchemes()
    
    // Score schemes based on similarity
    const scoredSchemes = allSchemes
      .filter(s => s.id !== schemeId) // Exclude the original scheme
      .map(s => ({
        scheme: s,
        score: this.calculateSimilarityScore(scheme, s)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return scoredSchemes.map(s => s.scheme)
  }

  /**
   * Get schemes by category
   */
  getSchemesByCategory(category: string, limit?: number): Scheme[] {
    const schemes = this.schemeRepository.searchSchemes(undefined, { category })
    return limit ? schemes.slice(0, limit) : schemes
  }

  /**
   * Get schemes suitable for a beneficiary type
   */
  getSchemesByBeneficiary(beneficiaryType: string, limit?: number): Scheme[] {
    const schemes = this.schemeRepository.searchSchemes(undefined, { beneficiaryType })
    return limit ? schemes.slice(0, limit) : schemes
  }

  /**
   * Search schemes with fuzzy matching
   */
  searchSchemes(query: string, limit?: number): Scheme[] {
    if (!query.trim()) return []

    const schemes = this.schemeRepository.searchSchemes(query)
    return limit ? schemes.slice(0, limit) : schemes
  }

  /**
   * Get scheme statistics for dashboard/analytics
   */
  getSchemeStatistics(): {
    total_schemes: number
    by_category: Record<string, number>
    by_state_coverage: Record<string, number>
    by_application_mode: Record<string, number>
    by_language: Record<string, number>
    last_updated: string
  } {
    const allSchemes = this.schemeRepository.getAllSchemes()

    const stats = {
      total_schemes: allSchemes.length,
      by_category: {} as Record<string, number>,
      by_state_coverage: {} as Record<string, number>,
      by_application_mode: {} as Record<string, number>,
      by_language: {} as Record<string, number>,
      last_updated: new Date().toISOString()
    }

    allSchemes.forEach(scheme => {
      // Category stats
      stats.by_category[scheme.category] = (stats.by_category[scheme.category] || 0) + 1

      // Application mode stats
      stats.by_application_mode[scheme.application_mode] = (stats.by_application_mode[scheme.application_mode] || 0) + 1

      // State coverage stats
      scheme.states.forEach(state => {
        stats.by_state_coverage[state] = (stats.by_state_coverage[state] || 0) + 1
      })

      // Language stats
      scheme.languages.forEach(lang => {
        stats.by_language[lang] = (stats.by_language[lang] || 0) + 1
      })
    })

    return stats
  }

  /**
   * Get featured/recommended schemes for homepage
   */
  getFeaturedSchemes(limit: number = 6): Scheme[] {
    const allSchemes = this.schemeRepository.getAllSchemes()
    
    // Prioritize popular categories and recent updates
    const scored = allSchemes
      .map(scheme => ({
        scheme,
        score: this.calculateFeaturedScore(scheme)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return scored.map(s => s.scheme)
  }

  /**
   * Get trending schemes (mock implementation)
   */
  getTrendingSchemes(limit: number = 5): Scheme[] {
    // In production, this would be based on actual usage metrics
    const popularCategories = ['Agriculture', 'Health', 'Education', 'Financial Inclusion']
    const allSchemes = this.schemeRepository.getAllSchemes()
    
    const trending = allSchemes
      .filter(scheme => popularCategories.includes(scheme.category))
      .sort((a, b) => {
        // Prioritize by category popularity and recent updates
        const aScore = popularCategories.indexOf(a.category) * -1 + new Date(a.last_updated).getTime()
        const bScore = popularCategories.indexOf(b.category) * -1 + new Date(b.last_updated).getTime()
        return bScore - aScore
      })
      .slice(0, limit)

    return trending
  }

  /**
   * Apply sorting to schemes list
   */
  private applySorting(schemes: Scheme[], sortBy: string, query?: string): Scheme[] {
    switch (sortBy) {
      case 'name':
        return schemes.sort((a, b) => a.name.localeCompare(b.name))
      
      case 'last_updated':
        return schemes.sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
      
      case 'category':
        return schemes.sort((a, b) => a.category.localeCompare(b.category))
      
      case 'relevance':
      default:
        if (query) {
          // Sort by relevance score when there's a query
          return schemes.sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, query)
            const bScore = this.calculateRelevanceScore(b, query)
            return bScore - aScore
          })
        }
        return schemes.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(scheme: Scheme, query: string): number {
    const queryLower = query.toLowerCase()
    let score = 0

    // Exact name match gets highest score
    if (scheme.name.toLowerCase().includes(queryLower)) {
      score += 10
    }

    // Category match
    if (scheme.category.toLowerCase().includes(queryLower)) {
      score += 5
    }

    // Summary match
    const summaryMatches = (scheme.summary.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length
    score += summaryMatches * 2

    // Beneficiary type match
    const beneficiaryMatch = scheme.beneficiary_types.some(bt => 
      bt.toLowerCase().includes(queryLower)
    )
    if (beneficiaryMatch) {
      score += 3
    }

    return score
  }

  /**
   * Calculate similarity score between two schemes
   */
  private calculateSimilarityScore(schemeA: Scheme, schemeB: Scheme): number {
    let score = 0

    // Same category gets high score
    if (schemeA.category === schemeB.category) {
      score += 5
    }

    // Same department gets medium score
    if (schemeA.department === schemeB.department) {
      score += 3
    }

    // Overlapping beneficiary types
    const commonBeneficiaries = schemeA.beneficiary_types.filter(bt =>
      schemeB.beneficiary_types.includes(bt)
    )
    score += commonBeneficiaries.length

    // Overlapping states
    const commonStates = schemeA.states.filter(state =>
      schemeB.states.includes(state)
    )
    score += commonStates.length * 0.5

    // Same application mode
    if (schemeA.application_mode === schemeB.application_mode) {
      score += 1
    }

    return score
  }

  /**
   * Calculate featured score for homepage promotion
   */
  private calculateFeaturedScore(scheme: Scheme): number {
    let score = 0

    // Popular categories get higher scores
    const popularCategories: Record<string, number> = {
      'Agriculture': 10,
      'Health': 9,
      'Education': 8,
      'Financial Inclusion': 7,
      'Employment': 6,
      'Housing': 5,
      'Social Welfare': 4
    }

    score += popularCategories[scheme.category] || 1

    // Recent updates get bonus
    const daysSinceUpdate = (Date.now() - new Date(scheme.last_updated).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 30) {
      score += 3
    } else if (daysSinceUpdate < 90) {
      score += 1
    }

    // All India schemes get slight bonus
    if (scheme.states.includes('All India')) {
      score += 2
    }

    // Online schemes get slight bonus for accessibility
    if (scheme.application_mode === 'online' || scheme.application_mode === 'both') {
      score += 1
    }

    // Multilingual schemes get bonus
    if (scheme.languages.length > 3) {
      score += 2
    }

    return score
  }

  /**
   * Get scheme availability by state
   */
  getSchemesByState(state: string): Scheme[] {
    return this.schemeRepository.searchSchemes(undefined, { state })
  }

  /**
   * Validate scheme data (for admin operations)
   */
  validateSchemeData(scheme: Partial<Scheme>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!scheme.name || scheme.name.trim().length < 3) {
      errors.push('Scheme name must be at least 3 characters long')
    }

    if (!scheme.summary || scheme.summary.trim().length < 10) {
      errors.push('Scheme summary must be at least 10 characters long')
    }

    if (!scheme.department || scheme.department.trim().length < 5) {
      errors.push('Department name is required')
    }

    if (!scheme.category) {
      errors.push('Category is required')
    }

    if (!scheme.beneficiary_types || scheme.beneficiary_types.length === 0) {
      errors.push('At least one beneficiary type is required')
    }

    if (!scheme.states || scheme.states.length === 0) {
      errors.push('State coverage information is required')
    }

    if (!scheme.official_url || !this.isValidUrl(scheme.official_url)) {
      errors.push('Valid official URL is required')
    }

    if (!scheme.application_mode || !['online', 'offline', 'both'].includes(scheme.application_mode)) {
      errors.push('Valid application mode is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Helper to validate URLs
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}