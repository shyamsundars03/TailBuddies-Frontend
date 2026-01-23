"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
// import { useAppDispatch } from "@/lib/redux/hooks"
import { useAppDispatch } from "../../lib/redux/hooks"
import { setUser, setLoading, setError } from "../../lib/redux/slices/authSlice"
import authService from "../../lib/services/authService"

export function AdminLoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const result = await authService.login({
        ...formData,
        role: "admin",
      })

      if (result.success && result.data) {
        dispatch(
          setUser({
            userId: result.data.user.userId,
            username: result.data.user.username,
            email: result.data.user.email,
            phone: "",
            role: result.data.user.role,
            isBlocked: result.data.user.isBlocked,
            createdAt: new Date().toISOString(),
            token: result.data.token,
          }),
        )

        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", result.data.token || "")
          localStorage.setItem("user_role", result.data.user.role)
        }

        router.push("/admin/dashboard")
      } else {
        dispatch(setError(result.error || "Invalid admin credentials"))
      }
    } catch (error) {
      dispatch(setError("An error occurred"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-md w-full">
        <div className="bg-red-600 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">ADMIN PORTAL</h1>
          <p className="text-red-100 text-sm mt-2">Restricted Access Only</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@tailbuddies.com"
                
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                  
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Admin Login
            </button>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                This portal is for authorized administrators only. Unauthorized access is prohibited.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
