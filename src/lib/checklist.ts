import { 
  Scheme, 
  UserProfile, 
  DocumentRequirement, 
  ApplicationStep, 
  ChecklistItem, 
  GeneratedChecklist,
  Citation
} from '@/types'
import { SchemeRepository } from '@/server/repositories/scheme-repository'
import { generateId } from './utils'

export class ChecklistService {
  private schemeRepository: SchemeRepository

  constructor() {
    this.schemeRepository = new SchemeRepository()
  }

  /**
   * Generate a comprehensive checklist for a scheme application
   */
  generateChecklist(schemeId: string, profile?: UserProfile): GeneratedChecklist | null {
    const schemeDetail = this.schemeRepository.getSchemeDetail(schemeId)
    if (!schemeDetail) return null

    const items = this.generateChecklistItems(schemeDetail, profile)
    const tips = this.generateApplicationTips(schemeDetail, profile)
    const estimatedTime = this.estimateApplicationTime(schemeDetail)
    const citations = this.generateCitations(schemeDetail)

    return {
      scheme_id: schemeId,
      scheme_name: schemeDetail.name,
      items,
      documents: schemeDetail.documents,
      tips,
      sources: citations,
      estimated_time_minutes: estimatedTime
    }
  }

  /**
   * Generate checklist items from scheme requirements and steps
   */
  private generateChecklistItems(
    scheme: Scheme & { documents: DocumentRequirement[], steps: ApplicationStep[] }, 
    profile?: UserProfile
  ): ChecklistItem[] {
    const items: ChecklistItem[] = []

    // Pre-application preparation items
    items.push({
      id: generateId(),
      title: 'Review Eligibility Criteria',
      description: `Ensure you meet all requirements for ${scheme.name}. Check age, income, and category requirements.`,
      type: 'verification',
      required: true,
      notes: 'Double-check all eligibility criteria before starting the application'
    })

    // Document collection items
    const requiredDocs = scheme.documents.filter(doc => doc.required)
    const optionalDocs = scheme.documents.filter(doc => !doc.required)

    if (requiredDocs.length > 0) {
      items.push({
        id: generateId(),
        title: 'Gather Required Documents',
        description: 'Collect all mandatory documents before starting the application.',
        type: 'document',
        required: true,
        notes: `Required: ${requiredDocs.map(d => d.document_name).join(', ')}`
      })
    }

    // Individual document items for key documents
    const keyDocs = ['Aadhaar Card', 'Bank Passbook', 'Income Certificate', 'Ration Card']
    requiredDocs
      .filter(doc => keyDocs.includes(doc.document_name))
      .forEach(doc => {
        items.push({
          id: generateId(),
          title: `Verify ${doc.document_name}`,
          description: doc.notes || `Ensure your ${doc.document_name} is valid and up-to-date`,
          type: 'document',
          required: true,
          notes: doc.notes
        })
      })

    // Optional documents
    if (optionalDocs.length > 0) {
      items.push({
        id: generateId(),
        title: 'Consider Optional Documents',
        description: 'These documents may strengthen your application or provide additional benefits.',
        type: 'document',
        required: false,
        notes: `Optional: ${optionalDocs.map(d => d.document_name).join(', ')}`
      })
    }

    // Application process items from steps
    scheme.steps
      .sort((a, b) => a.step_number - b.step_number)
      .forEach(step => {
        items.push({
          id: generateId(),
          title: step.title,
          description: step.description,
          type: 'action',
          required: true,
          notes: step.mode === 'both' ? 'Available online and offline' : `${step.mode} only`
        })
      })

    // Post-application items
    items.push({
      id: generateId(),
      title: 'Track Application Status',
      description: 'Keep your application reference number safe and check status regularly.',
      type: 'action',
      required: true,
      notes: 'Save application number for future reference'
    })

    // Follow-up items based on scheme type
    if (scheme.category === 'Financial Inclusion' || scheme.category === 'Agriculture') {
      items.push({
        id: generateId(),
        title: 'Set Up Direct Benefit Transfer',
        description: 'Ensure your bank account is linked and active for receiving benefits.',
        type: 'action',
        required: true,
        notes: 'Verify bank account details are correct in application'
      })
    }

    // Profile-specific recommendations
    if (profile) {
      const profileItems = this.generateProfileSpecificItems(scheme, profile)
      items.push(...profileItems)
    }

    return items
  }

  /**
   * Generate profile-specific checklist items
   */
  private generateProfileSpecificItems(scheme: Scheme, profile: UserProfile): ChecklistItem[] {
    const items: ChecklistItem[] = []

    // Age-specific items
    if (profile.age && profile.age < 25 && scheme.category === 'Education') {
      items.push({
        id: generateId(),
        title: 'Verify Student Status',
        description: 'Ensure you have valid student ID and enrollment certificate.',
        type: 'verification',
        required: true,
        notes: 'Required for most education schemes for young applicants'
      })
    }

    // State-specific items
    if (profile.state && !scheme.states.includes('All India')) {
      if (scheme.states.includes(profile.state)) {
        items.push({
          id: generateId(),
          title: 'Verify State Residency',
          description: `Ensure you have valid proof of residency in ${profile.state}.`,
          type: 'document',
          required: true,
          notes: 'State-specific schemes require residency proof'
        })
      }
    }

    // Category-specific items
    if (profile.category && profile.category !== 'General') {
      items.push({
        id: generateId(),
        title: 'Prepare Category Certificate',
        description: `Have your ${profile.category} certificate ready if required.`,
        type: 'document',
        required: false,
        notes: 'May provide additional benefits or relaxed criteria'
      })
    }

    // Occupation-specific items
    if (profile.occupation === 'Farmer' && scheme.category === 'Agriculture') {
      items.push({
        id: generateId(),
        title: 'Verify Land Ownership',
        description: 'Collect land records (Khata/Khatauni) showing ownership or cultivation rights.',
        type: 'document',
        required: true,
        notes: 'Essential for agricultural schemes'
      })
    }

    return items
  }

  /**
   * Generate application tips based on scheme and profile
   */
  private generateApplicationTips(
    scheme: Scheme & { documents: DocumentRequirement[], steps: ApplicationStep[] }, 
    profile?: UserProfile
  ): string[] {
    const tips: string[] = []

    // General application tips
    tips.push('Keep both digital and physical copies of all documents')
    tips.push('Apply early to avoid last-minute rush and system issues')
    
    // Mode-specific tips
    if (scheme.application_mode === 'online') {
      tips.push('Ensure stable internet connection during application')
      tips.push('Use Chrome or Firefox browser for best compatibility')
      tips.push('Scan documents in PDF format under 2MB each')
    } else if (scheme.application_mode === 'offline') {
      tips.push('Visit the office during working hours with all documents')
      tips.push('Carry photocopies along with original documents')
      tips.push('Get acknowledgement receipt for your application')
    } else {
      tips.push('Online application is usually faster than offline')
      tips.push('Check which mode has earlier processing times')
    }

    // Category-specific tips
    if (scheme.category === 'Agriculture') {
      tips.push('Ensure land records are updated and names match across documents')
      tips.push('Bank account should be linked to Aadhaar for DBT')
    }
    
    if (scheme.category === 'Education') {
      tips.push('Academic documents should be attested by the issuing authority')
      tips.push('Income certificate should be recent (within 6 months)')
    }

    if (scheme.category === 'Health') {
      tips.push('Include all family members in the application')
      tips.push('Medical documents should be from recognized hospitals')
    }

    // Profile-specific tips
    if (profile?.category && profile.category !== 'General') {
      tips.push('Category certificates should be from competent authority')
      tips.push('Check if you qualify for relaxed criteria due to your category')
    }

    if (profile?.income && profile.income < 100000) {
      tips.push('Income certificate is crucial - ensure it shows correct annual income')
      tips.push('Include all sources of household income in calculation')
    }

    // Document-specific tips
    const hasAadhaar = scheme.documents.some(doc => doc.document_name.includes('Aadhaar'))
    if (hasAadhaar) {
      tips.push('Aadhaar should be linked to mobile number for OTP verification')
    }

    const hasBankAccount = scheme.documents.some(doc => doc.document_name.includes('Bank'))
    if (hasBankAccount) {
      tips.push('Bank account should be active with correct name matching other documents')
    }

    return tips.slice(0, 6) // Return top 6 most relevant tips
  }

  /**
   * Estimate application completion time
   */
  private estimateApplicationTime(
    scheme: Scheme & { documents: DocumentRequirement[], steps: ApplicationStep[] }
  ): number {
    let timeMinutes = 0

    // Base time for document preparation
    timeMinutes += scheme.documents.length * 5 // 5 minutes per document

    // Time for application steps
    scheme.steps.forEach(step => {
      if (step.mode === 'online') {
        timeMinutes += 10 // 10 minutes per online step
      } else {
        timeMinutes += 30 // 30 minutes per offline step (including travel)
      }
    })

    // Additional time based on scheme complexity
    if (scheme.category === 'Agriculture' || scheme.category === 'Financial Inclusion') {
      timeMinutes += 20 // More complex verification
    }

    if (scheme.documents.length > 5) {
      timeMinutes += 15 // Additional time for complex applications
    }

    // Minimum and maximum bounds
    return Math.max(30, Math.min(timeMinutes, 180)) // 30 min to 3 hours
  }

  /**
   * Generate citations for the checklist
   */
  private generateCitations(scheme: Scheme & { sources: any[] }): Citation[] {
    return scheme.sources.map((source: any) => ({
      id: source.id,
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      source_type: source.source_type,
      source_title: source.source_title,
      excerpt: source.content.substring(0, 150) + '...',
      citation_url: source.citation_url
    }))
  }

  /**
   * Export checklist as formatted text
   */
  exportChecklistAsText(checklist: GeneratedChecklist): string {
    let text = `# Application Checklist for ${checklist.scheme_name}\n\n`
    
    text += `**Estimated Time:** ${checklist.estimated_time_minutes} minutes\n\n`
    
    text += `## Required Steps\n\n`
    
    const requiredItems = checklist.items.filter(item => item.required)
    requiredItems.forEach((item, index) => {
      text += `${index + 1}. **${item.title}**\n`
      text += `   ${item.description}\n`
      if (item.notes) {
        text += `   *Note: ${item.notes}*\n`
      }
      text += '\n'
    })
    
    const optionalItems = checklist.items.filter(item => !item.required)
    if (optionalItems.length > 0) {
      text += `## Optional Steps\n\n`
      optionalItems.forEach(item => {
        text += `- **${item.title}**: ${item.description}\n`
      })
      text += '\n'
    }
    
    text += `## Required Documents\n\n`
    const requiredDocs = checklist.documents.filter(doc => doc.required)
    requiredDocs.forEach(doc => {
      text += `- ${doc.document_name}`
      if (doc.notes) {
        text += ` (${doc.notes})`
      }
      text += '\n'
    })
    
    const optionalDocs = checklist.documents.filter(doc => !doc.required)
    if (optionalDocs.length > 0) {
      text += `\n## Optional Documents\n\n`
      optionalDocs.forEach(doc => {
        text += `- ${doc.document_name}`
        if (doc.notes) {
          text += ` (${doc.notes})`
        }
        text += '\n'
      })
    }
    
    if (checklist.tips.length > 0) {
      text += `\n## Application Tips\n\n`
      checklist.tips.forEach(tip => {
        text += `- ${tip}\n`
      })
    }
    
    text += `\n---\nGenerated by BharatAid Copilot`
    
    return text
  }
}