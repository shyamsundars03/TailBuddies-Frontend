import { Calendar, Users, ChevronRight, } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "../../../../lib/utils/utils"
import { useAppSelector, useAppDispatch } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import { useRef, useState } from "react"
import { uploadToCloudinary } from "../../../../lib/utils/cloudinary"
import { userApi } from "../../../../lib/api/user"
import { setUser } from "../../../../lib/redux/slices/authSlice"
import { toast } from "sonner"
import Swal from "sweetalert2"
import { DOCTOR_ROUTES } from "../../../../lib/constants/routes"
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  Bot,
  type LucideIcon,
} from "lucide-react"


interface DoctorSidebarProps {
  username: string
  email: string
  qualification: string
  specialty?: string
  totalPatients: number
  patientsToday: number
  appointmentsToday: number
  availability: string
  onAvailabilityChange?: (value: string) => void
  onImageClick?: () => void
  activeSection: string
  onSectionChange?: (sectionId: string) => void
  showStats?: boolean
  showChangeButton?: boolean
  className?: string
}

interface DoctorSidebarMenuItem {
  icon: LucideIcon
  label: string
  id: string
  href: string
  badge?: boolean
}
const menuItems: DoctorSidebarMenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", href: DOCTOR_ROUTES.DASHBOARD },
  { icon: ClipboardList, label: "Requests", id: "requests", href: DOCTOR_ROUTES.REQUESTS, badge: true },
  { icon: Calendar, label: "Appointments", id: "appointments", href: DOCTOR_ROUTES.APPOINTMENTS },
  { icon: Calendar, label: "Calendar", id: "calendar", href: DOCTOR_ROUTES.CALENDAR },
  { icon: Users, label: "My Patients", id: "patients", href: DOCTOR_ROUTES.PATIENTS },
  { icon: Star, label: "Ratings/Reviews", id: "reviews", href: DOCTOR_ROUTES.REVIEWS },
  { icon: Bot, label: "Wallet", id: "wallet", href: DOCTOR_ROUTES.WALLET },
]

export function DoctorSidebar({
  username,
  email: _email,
  qualification,
  specialty,
  totalPatients: _totalPatients,
  patientsToday: _patientsToday,
  appointmentsToday: _appointmentsToday,
  availability,
  onAvailabilityChange,
  onImageClick: _onImageClick,
  activeSection: _activeSection,
  onSectionChange,
  showStats = true,
  showChangeButton: _showChangeButton = false,
  className,
}: DoctorSidebarProps) {
  const pathname = usePathname()
  const isProfilePage = pathname === DOCTOR_ROUTES.PROFILE || pathname === DOCTOR_ROUTES.DASHBOARD
  const { user } = useAppSelector((state) => state.auth)
  const { logout } = useSignin()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isGoogleUser = !!user?.googleId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleProfileClick = () => {
    router.push(DOCTOR_ROUTES.PROFILE)
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
    if (file) {
      // Validation: Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File size exceeds 5MB limit.")
      }

      // Validation: JPEG/PNG only
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        return toast.error("Only JPEG and PNG formats are supported.")
      }

      try {
        setIsUploading(true)
        const imageUrl = await uploadToCloudinary(file)
        const response = await userApi.updateProfilePic(imageUrl)

        if (response.success && user) {
          const updatedUser = {
            ...user,
            profilePic: imageUrl
          };
          dispatch(setUser(updatedUser));
          localStorage.setItem('user', JSON.stringify(updatedUser));
          toast.success("Profile picture updated!");
        } else {
          toast.error(response.error || "Failed to update profile picture")
        }
      } catch {
        toast.error("Upload failed. Please check your connection.")
      } finally {
        setIsUploading(false)
      }
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
    <div className={cn("w-16 md:w-80 shrink-0 transition-all duration-300", className)}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Section */}
        <div className="bg-linear-to-br from-blue-600 to-blue-500 p-2 md:p-6 text-center">
          <div
            className="w-10 h-10 md:w-24 md:h-24 mx-auto bg-white rounded-full overflow-hidden mb-0 md:mb-3 border-2 md:border-4 border-white shadow-lg cursor-pointer transition hover:scale-105 group relative shrink-0"
            onClick={handleProfileClick}
          >
            <Image src={user?.profilePic || "/placeholder.svg?height=96&width=96"} alt="Doctor" width={96} height={96} className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Change button ONLY on profile page */}
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
                className="w-10 h-4 md:w-16 md:h-6 bg-red-500 rounded-full flex items-center justify-center mx-auto mt-1 md:mt-0 mb-0 md:mb-2 cursor-pointer hover:bg-red-600 shadow-md"
                onClick={handleChangeClick}
              >
                <span className="text-white text-[8px] md:text-xs font-bold">Change</span>
              </div>
            </>
          )}

          <h3 className="text-white font-bold text-xs md:text-lg hidden md:block mt-2 md:mt-1 mb-1">{username}</h3>
          <p className="text-blue-100 text-[10px] md:text-sm hidden md:block">{qualification}</p>
        </div>

        {/* Specialty Label */}
        {specialty && (
          <div className="px-2 py-2 md:px-6 md:py-3 text-center border-b border-gray-200 hidden md:block">
            <span className="text-sm font-medium text-gray-700">{specialty}</span>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <>
            {/* Availability */}
            <div className="p-1 md:p-4 border-b border-gray-200 hidden md:block">
              <label className="block text-sm text-gray-600 mb-2">Availability :</label>
              <select
                value={availability}
                onChange={(e) => onAvailabilityChange?.(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>I am Available Now</option>
                <option>Not Available</option>
                <option>Available Later</option>
              </select>
            </div>
          </>
        )}

        {/* Menu Items - Updated with navigation */}
        <div className="p-1 md:py-2 md:px-0 space-y-1">
          {menuItems.map((item) => {
            const isActive = !isProfilePage && pathname === item.href
            const Icon = item.icon

            return item.href && item.href !== "#" ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onSectionChange?.(item.id)}
                className={cn(
                  "w-full flex items-center justify-center md:justify-between px-2 py-2.5 md:px-5 md:py-3 text-left transition rounded-lg md:rounded-none",
                  isActive ? "bg-blue-50 border-l-2 md:border-l-4 border-blue-600" : "hover:bg-blue-50"
                )}
              >
                <div className="flex items-center gap-0 md:gap-3">
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0",
                      isActive ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"
                    )}
                  />

                  <span
                    className={cn(
                      "text-sm hidden md:inline",
                      isActive ? "text-blue-600 font-medium" : "text-gray-700 group-hover:text-blue-600"
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  {item.badge && (
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                  <ChevronRight
                    size={16}
                    className={isActive ? "text-blue-400" : "text-gray-400"}
                  />
                </div>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className="w-full flex items-center justify-center md:justify-between px-2 py-2.5 md:px-5 md:py-3 text-left hover:bg-blue-50 transition rounded-lg md:rounded-none"
              >
                <div className="flex items-center gap-0 md:gap-3">
                  <Icon
                    size={18}
                    className="text-gray-600 group-hover:text-blue-600 shrink-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 hidden md:inline">
                    {item.label}
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  {item.badge && (
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </button>
            )
          })}

          {/* Logout button at the bottom */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-between px-2 py-2.5 md:px-5 md:py-3 text-left hover:bg-red-50 transition group mt-2 border-t border-gray-100 rounded-lg md:rounded-none"
          >
            <div className="flex items-center gap-0 md:gap-3">
              <span className="text-base md:text-lg group-hover:scale-110 transition shrink-0">🚪</span>
              <span className="text-sm text-gray-700 group-hover:text-red-600 hidden md:inline">Logout</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-red-400 hidden md:block" />
          </button>
        </div>
      </div>
    </div>
  )
}
