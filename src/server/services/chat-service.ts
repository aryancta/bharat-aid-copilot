import { ChatRequest, ChatResponse, UserProfile } from '@/types'
import { RetrievalService } from '@/lib/retrieval'
import { ConversationRepository } from '../repositories/conversation-repository'
import { generateId, sanitizeInput } from '@/lib/utils'
import { MOCK_API_DELAY, ENABLE_MOCK_RESPONSES } from '@/lib/constants'

export class ChatService {
  private retrievalService: RetrievalService
  private conversationRepository: ConversationRepository

  constructor() {
    this.retrievalService = new RetrievalService()
    this.conversationRepository = new ConversationRepository()
  }

  /**
   * Process a chat message and generate a response
   */
  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    // Add mock delay in development
    if (ENABLE_MOCK_RESPONSES) {
      await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY))
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(request.message)

    // Get or create conversation
    let conversationId = request.conversation_id
    if (!conversationId) {
      const title = this.conversationRepository.generateConversationTitle(sanitizedMessage)
      const conversation = this.conversationRepository.createConversation(request.language, title)
      conversationId = conversation.id
    }

    // Add user message to conversation
    this.conversationRepository.addMessage({
      conversation_id: conversationId,
      role: 'user',
      content: sanitizedMessage,
      language: request.language
    })

    // Retrieve relevant information
    const retrievalResult = this.retrievalService.retrieveRelevantChunks(sanitizedMessage, 5)

    // Generate answer
    const answer = this.generateAnswer(
      sanitizedMessage,
      retrievalResult.chunks,
      retrievalResult.schemes,
      request.profile
    )

    // Generate follow-up prompts
    const followUps = this.retrievalService.generateFollowUpPrompts(
      retrievalResult.schemes,
      sanitizedMessage
    )

    // Calculate confidence based on retrieval quality
    const confidence = this.calculateConfidence(retrievalResult.chunks, sanitizedMessage)

    // Create response
    const response: ChatResponse = {
      answer,
      answer_language: request.language,
      citations: retrievalResult.citations,
      confidence,
      follow_ups: followUps,
      retrieved_schemes: retrievalResult.schemes,
      conversation_id: conversationId
    }

    // Add assistant message to conversation
    this.conversationRepository.addMessage({
      conversation_id: conversationId,
      role: 'assistant',
      content: answer,
      language: request.language,
      citations: retrievalResult.citations
    })

    return response
  }

  /**
   * Generate an answer based on retrieved information
   */
  private generateAnswer(
    query: string,
    chunks: any[],
    schemes: any[],
    profile?: UserProfile
  ): string {
    if (chunks.length === 0) {
      return this.generateNoResultsAnswer(query)
    }

    // Determine query intent
    const intent = this.classifyQueryIntent(query)

    switch (intent) {
      case 'eligibility':
        return this.generateEligibilityAnswer(query, schemes, chunks, profile)
      case 'documents':
        return this.generateDocumentsAnswer(query, schemes, chunks)
      case 'application':
        return this.generateApplicationAnswer(query, schemes, chunks)
      case 'general':
      default:
        return this.generateGeneralAnswer(query, schemes, chunks)
    }
  }

  /**
   * Classify the intent of user query
   */
  private classifyQueryIntent(query: string): 'eligibility' | 'documents' | 'application' | 'general' {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('eligible') || lowerQuery.includes('qualify') || 
        lowerQuery.includes('criteria') || lowerQuery.includes('requirements')) {
      return 'eligibility'
    }

    if (lowerQuery.includes('document') || lowerQuery.includes('papers') || 
        lowerQuery.includes('certificate') || lowerQuery.includes('proof')) {
      return 'documents'
    }

    if (lowerQuery.includes('apply') || lowerQuery.includes('application') || 
        lowerQuery.includes('process') || lowerQuery.includes('how to') ||
        lowerQuery.includes('steps')) {
      return 'application'
    }

    return 'general'
  }

  /**
   * Generate eligibility-focused answer
   */
  private generateEligibilityAnswer(
    query: string,
    schemes: any[],
    chunks: any[],
    profile?: UserProfile
  ): string {
    if (schemes.length === 0) {
      return "I couldn't find specific eligibility information for your query. Could you please specify which scheme you're asking about?"
    }

    const mainScheme = schemes[0]
    let answer = `For **${mainScheme.name}**, here are the key eligibility criteria:\n\n`

    // Extract eligibility info from chunks
    const eligibilityChunks = chunks.filter(chunk =>
      chunk.content.toLowerCase().includes('eligible') ||
      chunk.content.toLowerCase().includes('criteria') ||
      chunk.content.toLowerCase().includes('requirements')
    )

    if (eligibilityChunks.length > 0) {
      const eligibilityInfo = eligibilityChunks[0].content
      answer += this.extractKeyPoints(eligibilityInfo, 3) + '\n\n'
    }

    // Add beneficiary information
    if (mainScheme.beneficiary_types.length > 0) {
      answer += `**Target Beneficiaries:** ${mainScheme.beneficiary_types.join(', ')}\n\n`
    }

    // Add geographic coverage
    if (mainScheme.states.includes('All India')) {
      answer += '**Coverage:** Available across all states in India\n\n'
    } else {
      answer += `**Coverage:** Available in ${mainScheme.states.join(', ')}\n\n`
    }

    // Profile-specific guidance
    if (profile) {
      answer += this.generateProfileSpecificGuidance(mainScheme, profile)
    } else {
      answer += 'For personalized eligibility assessment, please use our eligibility checker tool.\n\n'
    }

    return answer
  }

  /**
   * Generate documents-focused answer
   */
  private generateDocumentsAnswer(query: string, schemes: any[], chunks: any[]): string {
    if (schemes.length === 0) {
      return "Please specify which scheme you need document information for."
    }

    const mainScheme = schemes[0]
    let answer = `For **${mainScheme.name}** application, you'll typically need:\n\n`

    // Extract document info from chunks
    const docChunks = chunks.filter(chunk =>
      chunk.content.toLowerCase().includes('document') ||
      chunk.content.toLowerCase().includes('certificate') ||
      chunk.content.toLowerCase().includes('proof')
    )

    if (docChunks.length > 0) {
      answer += this.extractDocumentList(docChunks[0].content) + '\n\n'
    } else {
      // Fallback to common documents based on scheme category
      answer += this.generateCommonDocuments(mainScheme.category) + '\n\n'
    }

    answer += `**Application Mode:** ${mainScheme.application_mode}\n\n`
    answer += 'For the complete and most up-to-date document list, please visit the official scheme page or use our checklist generator.\n\n'

    return answer
  }

  /**
   * Generate application process answer
   */
  private generateApplicationAnswer(query: string, schemes: any[], chunks: any[]): string {
    if (schemes.length === 0) {
      return "Please specify which scheme you want to apply for."
    }

    const mainScheme = schemes[0]
    let answer = `Here's how to apply for **${mainScheme.name}**:\n\n`

    // Extract application steps from chunks
    const appChunks = chunks.filter(chunk =>
      chunk.content.toLowerCase().includes('apply') ||
      chunk.content.toLowerCase().includes('application') ||
      chunk.content.toLowerCase().includes('process')
    )

    if (appChunks.length > 0) {
      answer += this.extractApplicationSteps(appChunks[0].content) + '\n\n'
    } else {
      // Generate generic steps based on application mode
      answer += this.generateGenericApplicationSteps(mainScheme) + '\n\n'
    }

    answer += `**Official Website:** ${mainScheme.official_url}\n\n`
    answer += 'For a detailed step-by-step checklist, use our application checklist generator.\n\n'

    return answer
  }

  /**
   * Generate general informational answer
   */
  private generateGeneralAnswer(query: string, schemes: any[], chunks: any[]): string {
    const mainScheme = schemes[0]
    let answer = `**${mainScheme.name}** is a ${mainScheme.category.toLowerCase()} scheme by the ${mainScheme.department}.\n\n`

    answer += `${mainScheme.summary}\n\n`

    // Add relevant chunk information
    if (chunks.length > 0) {
      const keyInfo = this.extractKeyInformation(chunks[0].content, query)
      if (keyInfo) {
        answer += `**Key Information:**\n${keyInfo}\n\n`
      }
    }

    // Add beneficiary and coverage info
    answer += `**Target Beneficiaries:** ${mainScheme.beneficiary_types.join(', ')}\n`
    answer += `**Coverage:** ${mainScheme.states.includes('All India') ? 'All India' : mainScheme.states.join(', ')}\n`
    answer += `**Application:** ${mainScheme.application_mode}\n\n`

    if (schemes.length > 1) {
      answer += `**Related Schemes:** You might also be interested in ${schemes.slice(1, 3).map(s => s.name).join(', ')}.\n\n`
    }

    return answer
  }

  /**
   * Generate answer when no results found
   */
  private generateNoResultsAnswer(query: string): string {
    let answer = "I couldn't find specific information about your query in our current database. "

    // Provide helpful alternatives based on query content
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('scheme') || lowerQuery.includes('yojana')) {
      answer += "You can browse all available schemes using our scheme explorer, or try rephrasing your question with more specific details."
    } else if (lowerQuery.includes('apply') || lowerQuery.includes('application')) {
      answer += "Try asking about a specific scheme name, or browse our scheme catalog to find relevant programs."
    } else {
      answer += "Here are some things I can help you with:\n\n"
      answer += "• Find government schemes by category or beneficiary type\n"
      answer += "• Check eligibility for specific schemes\n"
      answer += "• Get application processes and required documents\n"
      answer += "• Generate step-by-step application checklists\n\n"
      answer += "Try asking about schemes for farmers, students, women, or other specific groups."
    }

    return answer
  }

  /**
   * Calculate confidence score based on retrieval quality
   */
  private calculateConfidence(chunks: any[], query: string): number {
    if (chunks.length === 0) return 0.1

    // Base confidence on number and relevance of chunks
    let confidence = Math.min(chunks.length / 3, 1) * 0.6 // Up to 0.6 for chunk count

    // Add confidence based on content relevance
    const queryKeywords = query.toLowerCase().split(/\s+/)
    let matchScore = 0
    
    chunks.forEach(chunk => {
      const chunkText = chunk.content.toLowerCase()
      const matches = queryKeywords.filter(keyword => chunkText.includes(keyword))
      matchScore += matches.length / queryKeywords.length
    })

    confidence += Math.min(matchScore / chunks.length, 0.4) // Up to 0.4 for content relevance

    return Math.min(confidence, 0.95) // Cap at 95%
  }

  // Helper methods for answer generation
  private extractKeyPoints(text: string, maxPoints: number): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    return sentences.slice(0, maxPoints).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n')
  }

  private extractDocumentList(text: string): string {
    const common_docs = ['Aadhaar', 'Bank', 'Income', 'Ration', 'Certificate', 'Passport', 'Photo']
    const mentioned = common_docs.filter(doc => 
      text.toLowerCase().includes(doc.toLowerCase())
    )
    
    if (mentioned.length > 0) {
      return `**Required Documents:**\n• ${mentioned.join(' documents\n• ')} documents`
    }
    
    return '**Common Documents:** Aadhaar Card, Bank Account Details, Income Certificate, Passport Size Photos'
  }

  private generateCommonDocuments(category: string): string {
    const docMap: Record<string, string[]> = {
      'Agriculture': ['Aadhaar Card', 'Land ownership documents', 'Bank account details', 'Passport size photos'],
      'Education': ['Student ID', 'Income certificate', 'Caste certificate (if applicable)', 'Academic transcripts'],
      'Health': ['Aadhaar Card', 'Ration card', 'Income certificate', 'Medical documents'],
      'Employment': ['Aadhaar Card', 'Bank account details', 'Passport size photos', 'Address proof'],
      'Housing': ['Aadhaar Card', 'Income certificate', 'Property documents', 'Bank account details']
    }
    
    const docs = docMap[category] || ['Aadhaar Card', 'Bank account details', 'Income certificate', 'Passport size photos']
    return `**Typically Required:**\n• ${docs.join('\n• ')}`
  }

  private extractApplicationSteps(text: string): string {
    // Simple extraction - in production would use NLP
    if (text.toLowerCase().includes('online')) {
      return '1. Visit the official scheme website\n2. Register or login with your details\n3. Fill the application form\n4. Upload required documents\n5. Submit and note the reference number'
    } else {
      return '1. Collect all required documents\n2. Visit the nearest government office\n3. Fill the application form\n4. Submit with documents\n5. Get acknowledgement receipt'
    }
  }

  private generateGenericApplicationSteps(scheme: any): string {
    if (scheme.application_mode === 'online') {
      return `1. Visit ${scheme.official_url}\n2. Register with your mobile/email\n3. Fill the online application form\n4. Upload scanned documents\n5. Submit and save the reference number`
    } else if (scheme.application_mode === 'offline') {
      return '1. Download application form from the official website\n2. Fill the form with accurate details\n3. Attach photocopies of required documents\n4. Submit at nearest government office\n5. Collect acknowledgement receipt'
    } else {
      return 'You can apply either online through the official website or offline by visiting the nearest government office. Online application is usually faster and more convenient.'
    }
  }

  private extractKeyInformation(text: string, query: string): string | null {
    const relevantSentences = text.split(/[.!?]+/)
      .filter(sentence => {
        const lowerSentence = sentence.toLowerCase()
        const queryWords = query.toLowerCase().split(/\s+/)
        return queryWords.some(word => lowerSentence.includes(word))
      })
      .slice(0, 2)

    return relevantSentences.length > 0 ? relevantSentences.join('. ') + '.' : null
  }

  private generateProfileSpecificGuidance(scheme: any, profile: UserProfile): string {
    let guidance = '**Based on your profile:**\n'
    
    if (profile.age && profile.age < 25 && scheme.category === 'Education') {
      guidance += '• You may qualify for student-specific benefits\n'
    }
    
    if (profile.occupation === 'Farmer' && scheme.category === 'Agriculture') {
      guidance += '• This scheme is specifically designed for farmers like you\n'
    }
    
    if (profile.category && profile.category !== 'General') {
      guidance += `• As a ${profile.category} category applicant, you may have relaxed criteria\n`
    }
    
    if (profile.state && scheme.states.includes(profile.state)) {
      guidance += `• This scheme is available in ${profile.state}\n`
    }
    
    guidance += '\nFor detailed eligibility assessment, please use our eligibility checker.\n\n'
    
    return guidance
  }
}