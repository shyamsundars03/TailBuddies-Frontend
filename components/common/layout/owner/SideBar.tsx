"use client"

import {
    User,
    Calendar,
    FileText,
    Wallet,
    Star,
    LogOut,
    ChevronRight,
    Search,
    type LucideIcon,
} from "lucide-react"
import { cn } from "../../../../lib/utils/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import { useOwnerProfile } from "../../../../lib/hooks/owner/useOwnerProfile"
import { useRef } from "react"
import { uploadToCloudinary } from "../../../../lib/utils/cloudinary"
import { toast } from "sonner"
import Image from "next/image"
import Swal from "sweetalert2"
import { OWNER_ROUTES } from "../../../../lib/constants/routes"

export interface SidebarMenuItem {
    icon: LucideIcon
    label: string
    id: string
    badge?: boolean
    href?: string
}

export interface OwnerSidebarProps {
    username: string
    email: string
    activeSection: string
    onSectionChange: (sectionId: string) => void
    showChangeButton?: boolean
    onImageClick?: () => void
    className?: string
}

const defaultMenuItems: SidebarMenuItem[] = [
    { icon: User, label: "Account", id: "account", href: OWNER_ROUTES.ACCOUNT },
    { icon: Search, label: "Find Doctor", id: "services", href: OWNER_ROUTES.SERVICES },
    { icon: Calendar, label: "My Pet", id: "pet", href: OWNER_ROUTES.PETS },
    { icon: FileText, label: "My Bookings", id: "bookings", href: OWNER_ROUTES.BOOKINGS },
    { icon: FileText, label: "Medical Records", id: "medical", href: OWNER_ROUTES.MEDICAL_RECORDS },
    { icon: Calendar, label: "Calendar", id: "calendar", href: OWNER_ROUTES.CALENDAR },
    { icon: Wallet, label: "Wallet", id: "wallet", href: OWNER_ROUTES.WALLET },
    { icon: Star, label: "Ratings/Reviews", id: "reviews", href: OWNER_ROUTES.REVIEWS },
]

export function OwnerSidebar({
    username,
    email,
    activeSection,
    onSectionChange,
    showChangeButton: _showChangeButton = false,
    onImageClick: _onImageClick,
    className,
}: OwnerSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const isProfilePage = pathname === OWNER_ROUTES.PROFILE

    const { user } = useAppSelector((state) => state.auth)
    const { logout } = useSignin()
    const { isLoading: isUploading, updateProfilePic } = useOwnerProfile()

    const isGoogleUser = !!user?.googleId
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleProfileClick = () => {
        router.push(OWNER_ROUTES.PROFILE)
    }

    const handleChangeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isGoogleUser) {
            toast.info("This is a Google sign-in account. Please change your profile picture in your Google settings.")
            return
        }
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit.")
            return
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPEG and PNG formats are supported.")
            return
        }

        try {
            const imageUrl = await uploadToCloudinary(file)
            await updateProfilePic(imageUrl)
        } catch {
            toast.error("Upload failed. Please check your connection.")
        }
    }

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                logout()
            }
        })
    }

    return (
        <div className={cn("md:w-80", className)}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="bg-linear-to-br from-blue-900 to-blue-700 p-6 relative">
                    <div
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={handleProfileClick}
                    >
                        <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-3 border-4 border-white transition group-hover:scale-105 overflow-hidden relative">
                            {user?.profilePic ? (
                                <Image src={user.profilePic} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl">👤</span>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Show Change button ONLY on profile page */}
                        {isProfilePage && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg"
                                />
                                <div
                                    className="absolute top-6 right-6 px-3 py-1 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 shadow-md z-20"
                                    onClick={handleChangeClick}
                                >
                                    <span className="text-white text-xs font-bold">Change</span>
                                </div>
                            </>
                        )}

                        <h3 className="text-white font-semibold text-lg">{username}</h3>
                        <p className="text-blue-200 text-sm">{email}</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                    {defaultMenuItems.map((item) => {
                        const isActive = !isProfilePage && pathname === item.href

                        return item.href && item.href !== "#" ? (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => onSectionChange(item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition",
                                    isActive && "bg-yellow-50 border-l-4 border-yellow-400",
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={isActive ? "text-yellow-600" : "text-gray-600"} />
                                    <span className={cn("text-sm", isActive ? "text-yellow-700 font-medium" : "text-gray-700")}>{item.label}</span>
                                </div>
                                {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                                <ChevronRight size={16} className={isActive ? "text-yellow-400" : "text-gray-400"} />
                            </Link>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => onSectionChange(item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition",
                                    !isProfilePage && activeSection === item.id && "bg-yellow-50 border-l-4 border-yellow-400",
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className="text-gray-600" />
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                </div>
                                {item.badge && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        )
                    })}

                    {/* Logout button at the bottom */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-red-50 transition group mt-2 border-t border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut size={18} className="text-gray-600 group-hover:text-red-500" />
                            <span className="text-sm text-gray-700 group-hover:text-red-600">Sign Out</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-red-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}
