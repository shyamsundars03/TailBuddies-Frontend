
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { useAppDispatch } from "../../lib/redux/hooks"
import { setUser } from "../../lib/redux/slices/authSlice"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "../../lib/api/apiClient"

import { clientCookies } from "../../lib/utils/clientCookies"
import logger from "../../lib/logger"

export function AdminLoginForm() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })







const [showPassword, setShowPassword] = useState(false)
const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await apiClient.post('/admin/signin', formData)
            const result = response.data

            if (result.success && result.data) {
                const { user, accessToken } = result.data;



                const userToStore = {
                    ...user,
                    username: user.username || 'Admin'
                };

                dispatch(setUser(userToStore));

                if (accessToken) {


                    clientCookies.set('token', accessToken, 7 * 24 * 60 * 60);
                    localStorage.setItem('user', JSON.stringify(userToStore));




                    logger.info('Admin logged in', { email: user.email });


                }

                toast.success("Admin login successful!")
                router.push("/admin/dashboard")

            } else {
                toast.error(result.message || "Invalid admin credentials")
            }



        } catch (error: unknown) {


if (error instanceof AxiosError) {
logger.error('Admin login error', {
status: error.response?.status,
data: error.response?.data,
message: error.message
});

                const message = error.response?.data?.message || "Invalid admin credentials";
                toast.error(message);
            } else {
                logger.error('Unexpected admin login error', error);
                toast.error("An unexpected error occurred");
            }
        } finally {

            setIsLoading(false)
        }
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
                                required
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
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                        >
                            {isLoading ? "Logging in..." : "Admin Login"}
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
