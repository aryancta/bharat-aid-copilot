import { UserProfile, EligibilityRule, Scheme, EligibilityMatch } from '@/types'
import { SchemeRepository } from '@/server/repositories/scheme-repository'

export class EligibilityService {
  private schemeRepository: SchemeRepository

  constructor() {
    this.schemeRepository = new SchemeRepository()
  }

  /**
   * Evaluate user profile against all schemes and return ranked matches
   */
  evaluateEligibility(profile: UserProfile): {
    matches: EligibilityMatch[]
    missing_fields: string[]
    summary: string
  } {
    const allSchemes = this.schemeRepository.getAllSchemes()
    const matches: EligibilityMatch[] = []
    const missingFields = this.identifyMissingFields(profile)

    for (const scheme of allSchemes) {
      const eligibilityRules = this.schemeRepository.getEligibilityRulesByScheme(scheme.id)
      const match = this.evaluateSchemeEligibility(profile, scheme, eligibilityRules)
      matches.push(match)
    }

    // Sort by match score (eligible schemes first, then by score)
    matches.sort((a, b) => {
      if (a.eligible !== b.eligible) {
        return a.eligible ? -1 : 1
      }
      return b.match_score - a.match_score
    })

    const eligibleCount = matches.filter(m => m.eligible).length
    const summary = this.generateSummary(eligibleCount, matches.length, profile)

    return {
      matches,
      missing_fields: missingFields,
      summary
    }
  }

  /**
   * Evaluate eligibility for a specific scheme
   */
  evaluateSchemeEligibility(
    profile: UserProfile, 
    scheme: Scheme, 
    rules: EligibilityRule[]
  ): EligibilityMatch {
    const evaluationResults = rules.map(rule => this.evaluateRule(profile, rule))
    
    const requiredRules = evaluationResults.filter(r => r.rule.severity === 'required')
    const preferredRules = evaluationResults.filter(r => r.rule.severity === 'preferred')
    const exclusionRules = evaluationResults.filter(r => r.rule.severity === 'exclusion')

    // Check for exclusions first
    const failedExclusions = exclusionRules.filter(r => r.passed === false)
    if (failedExclusions.length > 0) {
      return {
        scheme,
        match_score: 0,
        eligible: false,
        reasoning: `Excluded due to: ${failedExclusions.map(r => r.rule.description).join(', ')}`,
        missing_requirements: [],
        matched_rules: []
      }
    }

    // Check required rules
    const failedRequired = requiredRules.filter(r => r.passed === false || r.passed === null)
    const eligible = failedRequired.length === 0

    // Calculate match score
    let score = 0
    let totalWeight = 0

    // Required rules weight heavily
    requiredRules.forEach(result => {
      const weight = 3
      totalWeight += weight
      if (result.passed === true) score += weight
      else if (result.passed === null) score += weight * 0.5 // Partial credit for missing data
    })

    // Preferred rules add bonus
    preferredRules.forEach(result => {
      const weight = 1
      totalWeight += weight
      if (result.passed === true) score += weight
      else if (result.passed === null) score += weight * 0.3
    })

    const matchScore = totalWeight > 0 ? score / totalWeight : 0

    // Generate reasoning
    const reasoning = this.generateReasoning(eligible, evaluationResults, scheme)
    
    // Identify missing requirements
    const missingRequirements = failedRequired
      .map(r => r.rule.description)
      .filter(desc => desc.length > 0)

    const matchedRules = evaluationResults
      .filter(r => r.passed === true)
      .map(r => r.rule)

    return {
      scheme,
      match_score: matchScore,
      eligible,
      reasoning,
      missing_requirements: missingRequirements,
      matched_rules: matchedRules
    }
  }

  /**
   * Evaluate a single eligibility rule against user profile
   */
  private evaluateRule(profile: UserProfile, rule: EligibilityRule): {
    rule: EligibilityRule
    passed: boolean | null // null means insufficient data
  } {
    const fieldValue = this.getProfileFieldValue(profile, rule.rule_type)
    
    if (fieldValue === undefined || fieldValue === null) {
      return { rule, passed: null }
    }

    let passed: boolean

    switch (rule.operator) {
      case 'equals':
        passed = String(fieldValue).toLowerCase() === rule.value.toLowerCase()
        break
      
      case 'not_equals':
        passed = String(fieldValue).toLowerCase() !== rule.value.toLowerCase()
        break
      
      case 'less_than':
        passed = Number(fieldValue) < Number(rule.value)
        break
      
      case 'greater_than':
        passed = Number(fieldValue) > Number(rule.value)
        break
      
      case 'in':
        const allowedValues = rule.value.split(',').map(v => v.trim().toLowerCase())
        passed = allowedValues.includes(String(fieldValue).toLowerCase())
        break
      
      case 'contains':
        passed = String(fieldValue).toLowerCase().includes(rule.value.toLowerCase())
        break
      
      default:
        passed = false
    }

    return { rule, passed }
  }

  /**
   * Get field value from user profile based on rule type
   */
  private getProfileFieldValue(profile: UserProfile, fieldType: string): any {
    switch (fieldType) {
      case 'age': return profile.age
      case 'income': return profile.income
      case 'state': return profile.state
      case 'category': return profile.category
      case 'occupation': return profile.occupation
      case 'education': return profile.education
      case 'gender': return profile.gender
      case 'disability': return profile.disability_status
      default: return undefined
    }
  }

  /**
   * Generate human-readable reasoning for eligibility decision
   */
  private generateReasoning(
    eligible: boolean, 
    evaluationResults: Array<{rule: EligibilityRule, passed: boolean | null}>,
    scheme: Scheme
  ): string {
    if (eligible) {
      const passedRules = evaluationResults.filter(r => r.passed === true)
      if (passedRules.length === 0) {
        return `You appear to be eligible for ${scheme.name}. No disqualifying criteria found.`
      }
      
      const reasons = passedRules
        .slice(0, 3) // Show top 3 matching criteria
        .map(r => r.rule.description)
        .join(', ')
      
      return `You are eligible for ${scheme.name}. You meet the following criteria: ${reasons}.`
    } else {
      const failedRequired = evaluationResults.filter(r => 
        r.rule.severity === 'required' && (r.passed === false || r.passed === null)
      )
      
      if (failedRequired.length === 0) {
        return `You may not be eligible for ${scheme.name}. Please verify your details.`
      }
      
      const missingReasons = failedRequired
        .slice(0, 2) // Show top 2 missing requirements
        .map(r => r.rule.description)
        .join(', ')
      
      return `You are not currently eligible for ${scheme.name}. Missing requirements: ${missingReasons}.`
    }
  }

  /**
   * Identify missing fields that could improve matching
   */
  private identifyMissingFields(profile: UserProfile): string[] {
    const missing: string[] = []
    
    if (!profile.age) missing.push('age')
    if (!profile.state) missing.push('state')
    if (!profile.income) missing.push('income')
    if (!profile.occupation) missing.push('occupation')
    if (!profile.category) missing.push('category')
    if (!profile.education) missing.push('education')
    
    return missing
  }

  /**
   * Generate summary of eligibility evaluation
   */
  private generateSummary(eligibleCount: number, totalCount: number, profile: UserProfile): string {
    const profileSummary = this.getProfileSummary(profile)
    
    if (eligibleCount === 0) {
      return `Based on your profile (${profileSummary}), you don't currently match the eligibility criteria for any of the ${totalCount} schemes we evaluated. Consider updating your profile with more details or exploring other government programs.`
    }
    
    if (eligibleCount === 1) {
      return `Based on your profile (${profileSummary}), you are eligible for 1 scheme out of ${totalCount} evaluated. Review the details and application process below.`
    }
    
    return `Great news! Based on your profile (${profileSummary}), you are eligible for ${eligibleCount} schemes out of ${totalCount} evaluated. The schemes are ranked by relevance to your situation.`
  }

  /**
   * Create a brief profile summary for display
   */
  private getProfileSummary(profile: UserProfile): string {
    const parts: string[] = []
    
    if (profile.age) parts.push(`${profile.age} years old`)
    if (profile.occupation) parts.push(profile.occupation.toLowerCase())
    if (profile.state) parts.push(`from ${profile.state}`)
    if (profile.category && profile.category !== 'General') parts.push(profile.category)
    
    return parts.length > 0 ? parts.join(', ') : 'provided details'
  }

  /**
   * Get recommendations for improving eligibility
   */
  getEligibilityRecommendations(profile: UserProfile, matches: EligibilityMatch[]): string[] {
    const recommendations: string[] = []
    
    // Check for common missing fields that could unlock more schemes
    const almostEligible = matches.filter(m => 
      !m.eligible && m.match_score > 0.5 && m.missing_requirements && m.missing_requirements.length <= 2
    )
    
    if (almostEligible.length > 0) {
      recommendations.push(`You're close to qualifying for ${almostEligible.length} additional schemes. Consider updating your profile with complete information.`)
    }
    
    // Suggest specific fields to fill
    const missingFields = this.identifyMissingFields(profile)
    if (missingFields.includes('income') && almostEligible.length > 0) {
      recommendations.push('Adding your annual income could help match you with income-based schemes.')
    }
    
    if (missingFields.includes('education') && almostEligible.length > 0) {
      recommendations.push('Including your education level may unlock additional scholarship and skill development programs.')
    }
    
    // Suggest exploring other categories
    const userSchemeCategories = matches
      .filter(m => m.eligible)
      .map(m => m.scheme.category)
    
    const otherCategories = ['Education', 'Health', 'Agriculture', 'Employment', 'Housing']
      .filter(cat => !userSchemeCategories.includes(cat))
    
    if (otherCategories.length > 0 && matches.filter(m => m.eligible).length < 3) {
      recommendations.push(`Explore ${otherCategories[0]} schemes which might have different eligibility criteria.`)
    }
    
    return recommendations.slice(0, 3) // Return top 3 recommendations
  }
}