import db from '@/lib/db'
import { UserProfile } from '@/types'
import { generateId } from '@/lib/utils'

export class UserProfileRepository {
  getUserProfileById(id: string): UserProfile | null {
    const stmt = db.prepare('SELECT * FROM user_profiles WHERE id = ?')
    const row = stmt.get(id) as any
    return row ? this.mapRowToUserProfile(row) : null
  }

  createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const newProfile: UserProfile = {
      id: generateId(),
      ...profile,
      created_at: new Date().toISOString()
    }

    const stmt = db.prepare(`
      INSERT INTO user_profiles (id, age, state, income, occupation, category, education, gender, disability_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      newProfile.id,
      newProfile.age || null,
      newProfile.state || null,
      newProfile.income || null,
      newProfile.occupation || null,
      newProfile.category || null,
      newProfile.education || null,
      newProfile.gender || null,
      newProfile.disability_status || null
    )

    return newProfile
  }

  updateUserProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existing = this.getUserProfileById(id)
    if (!existing) return null

    const fields: string[] = []
    const values: any[] = []

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) return existing

    values.push(id)
    
    const sql = `UPDATE user_profiles SET ${fields.join(', ')} WHERE id = ?`
    const stmt = db.prepare(sql)
    stmt.run(...values)

    return this.getUserProfileById(id)
  }

  deleteUserProfile(id: string): boolean {
    const stmt = db.prepare('DELETE FROM user_profiles WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // Get anonymous aggregate stats for demo purposes
  getProfileStats(): {
    total_profiles: number
    by_state: Record<string, number>
    by_occupation: Record<string, number>
    by_age_group: Record<string, number>
  } {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM user_profiles')
    const total = (totalStmt.get() as any).count

    const stateStmt = db.prepare(`
      SELECT state, COUNT(*) as count 
      FROM user_profiles 
      WHERE state IS NOT NULL 
      GROUP BY state
    `)
    const stateRows = stateStmt.all() as any[]
    const byState = stateRows.reduce((acc, row) => {
      acc[row.state] = row.count
      return acc
    }, {})

    const occupationStmt = db.prepare(`
      SELECT occupation, COUNT(*) as count 
      FROM user_profiles 
      WHERE occupation IS NOT NULL 
      GROUP BY occupation
    `)
    const occupationRows = occupationStmt.all() as any[]
    const byOccupation = occupationRows.reduce((acc, row) => {
      acc[row.occupation] = row.count
      return acc
    }, {})

    const ageStmt = db.prepare(`
      SELECT 
        CASE 
          WHEN age < 25 THEN '18-24'
          WHEN age < 35 THEN '25-34'
          WHEN age < 45 THEN '35-44'
          WHEN age < 55 THEN '45-54'
          ELSE '55+'
        END as age_group,
        COUNT(*) as count
      FROM user_profiles 
      WHERE age IS NOT NULL 
      GROUP BY age_group
    `)
    const ageRows = ageStmt.all() as any[]
    const byAgeGroup = ageRows.reduce((acc, row) => {
      acc[row.age_group] = row.count
      return acc
    }, {})

    return {
      total_profiles: total,
      by_state: byState,
      by_occupation: byOccupation,
      by_age_group: byAgeGroup
    }
  }

  private mapRowToUserProfile(row: any): UserProfile {
    return {
      id: row.id,
      age: row.age,
      state: row.state,
      income: row.income,
      occupation: row.occupation,
      category: row.category,
      education: row.education,
      gender: row.gender,
      disability_status: row.disability_status,
      created_at: row.created_at
    }
  }
}