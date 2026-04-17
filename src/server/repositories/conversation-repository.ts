import db, { statements, parseJSON, stringifyJSON } from '@/lib/db'
import { Conversation, ChatMessage, Citation } from '@/types'
import { generateId } from '@/lib/utils'

export class ConversationRepository {
  getConversationById(id: string): Conversation | null {
    const row = statements.getConversation().get(id) as any
    return row ? this.mapRowToConversation(row) : null
  }

  getRecentConversations(limit: number = 10): Conversation[] {
    const rows = statements.getRecentConversations().all(limit) as any[]
    return rows.map(this.mapRowToConversation)
  }

  createConversation(language: string, title: string): Conversation {
    const conversation: Conversation = {
      id: generateId(),
      user_language: language,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    statements.insertConversation().run(
      conversation.id,
      conversation.user_language,
      conversation.title
    )

    return conversation
  }

  updateConversationTimestamp(id: string): void {
    statements.updateConversation().run(id)
  }

  getMessagesByConversation(conversationId: string): ChatMessage[] {
    const rows = statements.getMessagesByConversation().all(conversationId) as any[]
    return rows.map(this.mapRowToMessage)
  }

  addMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage {
    const newMessage: ChatMessage = {
      id: generateId(),
      ...message,
      created_at: new Date().toISOString()
    }

    statements.insertMessage().run(
      newMessage.id,
      newMessage.conversation_id,
      newMessage.role,
      newMessage.content,
      newMessage.language,
      newMessage.citations ? stringifyJSON(newMessage.citations) : null
    )

    // Update conversation timestamp
    this.updateConversationTimestamp(newMessage.conversation_id)

    return newMessage
  }

  generateConversationTitle(firstMessage: string): string {
    // Generate a meaningful title from the first message
    const words = firstMessage.trim().split(/\s+/).slice(0, 6)
    let title = words.join(' ')
    
    if (title.length > 50) {
      title = title.substring(0, 50) + '...'
    }

    // Ensure title ends properly
    if (title.endsWith(',') || title.endsWith('.') || title.endsWith('?') || title.endsWith('!')) {
      return title
    }

    return title + '...'
  }

  // Helper methods
  private mapRowToConversation(row: any): Conversation {
    return {
      id: row.id,
      user_language: row.user_language,
      title: row.title,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  private mapRowToMessage(row: any): ChatMessage {
    return {
      id: row.id,
      conversation_id: row.conversation_id,
      role: row.role,
      content: row.content,
      language: row.language,
      created_at: row.created_at,
      citations: row.citations ? parseJSON<Citation>(row.citations) : undefined
    }
  }
}