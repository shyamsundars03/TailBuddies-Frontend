export interface Specialty {
    id: string
    name: string
    description: string
    commonDesignation: string[]
    typicalKeywords: string[]
    status: 'active' | 'inactive'
}

export interface AdminUser {
    id: string
    username: string
    email: string
    phone: string
    role: "owner" | "doctor"
    isBlocked: boolean
    profilePic?: string
}
