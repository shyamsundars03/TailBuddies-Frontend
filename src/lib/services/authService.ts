// Auth Service - API calls for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface LoginCredentials {
  email: string
  password: string
  role: string
}

export interface SignUpCredentials {
  username: string
  email: string
  phone: string
  password: string
  role: string
  gender: string
}

export interface User {
  userId: string
  username: string
  email: string
  role: "owner" | "doctor" | "admin"
  profilePic: string | null
  isBlocked: boolean
}

export interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        return { success: true, data }
      }

      return { success: false, error: data.message || "Login failed" }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },

  async signup(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, data }
      }

      return { success: false, error: data.message || "Signup failed" }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      }

      return { success: false, error: data.message || "Failed to send reset link" }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; resetToken?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, resetToken: data.resetToken }
      }

      return { success: false, error: data.message || "Invalid OTP" }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      }

      return { success: false, error: data.message || "Failed to reset password" }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  },
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return null;
  },
  saveUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user))
  },

  getUser(): User | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  getToken(): string | null {
    return localStorage.getItem("token")
  },

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

export default authService
