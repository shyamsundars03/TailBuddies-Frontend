import { Calendar, Users, ChevronRight, } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "../../../../lib/redux/hooks"
import { useSignin } from "../../../../lib/hooks/auth/useSignin"
import { useRef, useState } from "react"
import { uploadToCloudinary } from "../../../../lib/utils/cloudinary"
import { userApi } from "../../../../lib/api/user"
import { setUser } from "../../../../lib/redux/slices/authSlice"
import { toast } from "sonner"
import {
  LayoutDashboard,
  ClipboardList,
  //   Calendar,
  Clock,
  //   Users,
  CreditCard,
  Star,
  FileText,
  Bell,
  MessageSquare,
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
}

interface DoctorSidebarMenuItem {
  icon: LucideIcon
  label: string
  id: string
  href: string
  badge?: boolean
}
const menuItems: DoctorSidebarMenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", href: "/doctor/dashboard" },
  { icon: ClipboardList, label: "Requests", id: "requests", href: "/doctor/requests", badge: true },
  { icon: Calendar, label: "Appointments", id: "appointments", href: "/doctor/appointments" },
  { icon: Clock, label: "Available Timings", id: "timings", href: "/doctor/slots" },
  { icon: Calendar, label: "Calendar", id: "calendar", href: "/doctor/calendar" },
  { icon: Users, label: "My Patients", id: "patients", href: "/doctor/patients" },
  { icon: CreditCard, label: "Subscription", id: "subscription", href: "#" },
  { icon: Star, label: "Ratings/Reviews", id: "reviews", href: "/doctor/reviews" },
  // { icon: FileText, label: "Invoices", id: "invoices", href: "/doctor/invoices" },
  // { icon: Bell, label: "Notifications", id: "notifications", href: "#", badge: true },
  // { icon: MessageSquare, label: "Message", id: "message", href: "/doctor/chat" },
  { icon: Bot, label: "Wallet", id: "wallet", href: "/doctor/wallet" },
]

export function DoctorSidebar({
  username,
  email: _email,
  qualification,
  specialty,
  totalPatients,
  patientsToday,
  appointmentsToday,
  availability,
  onAvailabilityChange,
  onImageClick: _onImageClick,
  activeSection: _activeSection,
  onSectionChange,
  showStats = true,
  showChangeButton: _showChangeButton = false,
}: DoctorSidebarProps) {
  const pathname = usePathname()
  const isProfilePage = pathname === "/doctor/profile" || pathname === "/doctor/dashboard"
  const { user } = useAppSelector((state) => state.auth)
  const { logout } = useSignin()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isGoogleUser = !!user?.googleId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleProfileClick = () => {
    router.push("/doctor/profile")
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

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Section */}
        <div className="bg-linear-to-br from-blue-600 to-blue-500 p-6 text-center">
          <div
            className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden mb-3 border-4 border-white shadow-lg cursor-pointer transition hover:scale-105 group relative"
            onClick={handleProfileClick}
          >
            <Image src={user?.profilePic || "/placeholder.svg?height=96&width=96"} alt="Doctor" width={96} height={96} className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                className="w-16 h-6 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-red-600 shadow-md"
                onClick={handleChangeClick}
              >
                <span className="text-white text-xs font-bold">Change</span>
              </div>
            </>
          )}

          <h3 className="text-white font-bold text-lg mb-1">{username}</h3>
          <p className="text-blue-100 text-sm">{qualification}</p>
        </div>

        {/* Specialty Label */}
        {specialty && (
          <div className="px-6 py-3 text-center border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">{specialty}</span>
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <>
            {/* <div className="grid grid-cols-2 border-b border-gray-200">
              <div className="p-4 text-center border-r border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users size={18} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Total Patient</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar size={18} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Patients Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{patientsToday}</p>
              </div>
            </div> */}

            {/* Availability */}
            <div className="p-4 border-b border-gray-200">
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

            {/* Appointments Today */}
            {/* <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-sm text-gray-600">Appointments Today</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{appointmentsToday}</p>
            </div> */}
          </>
        )}

        {/* Menu Items - Updated with navigation */}
        <div className="py-2">
          {menuItems.map((item) => {
            const isActive = !isProfilePage && pathname === item.href
            const Icon = item.icon

            return item.href && item.href !== "#" ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onSectionChange?.(item.id)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition group ${isActive
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : "hover:bg-blue-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 group-hover:text-blue-600"
                    }
                  />

                  <span
                    className={`text-sm ${isActive
                      ? "text-blue-600 font-medium"
                      : "text-gray-700 group-hover:text-blue-600"
                      }`}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-blue-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-gray-600 group-hover:text-blue-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
            onClick={logout}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-red-50 transition group mt-2 border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg group-hover:scale-110 transition">🚪</span>
              <span className="text-sm text-gray-700 group-hover:text-red-600">Logout</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
