// User types for TailBuddies

export interface OwnerProfile {
  userId: string
  userName: string
  email: string
  phone: string
  gender: string
  address: Address
  profilePic?: string
  pets: number
  upcomingAppointments: number
  totalConsultations: number
}

export interface DoctorProfile {
  userId: string
  userName: string
  email: string
  phone: string
  gender: string
  specialty: string
  designation: string
  qualification: string
  experience: Experience[]
  education: Education[]
  certificates: Certificate[]
  businessHours: BusinessHours[]
  profilePic?: string
  totalPatients: number
  patientsToday: number
  appointmentsToday: number
  availability: "available" | "not_available" | "available_later"
}

export interface Address {
  address: string
  city: string
  state: string
  country: string
  pincode: string
}

export interface Experience {
  id: string
  organization: string
  designation: string
  startDate: string
  endDate: string
  years: number
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  startDate: string
  endDate: string
}

export interface Certificate {
  id: string
  name: string
  issuedBy: string
  year: string
}

export interface BusinessHours {
  day: string
  slots: string[]
}

export interface Appointment {
  id: string
  patientName: string
  patientAvatar: string
  time: string
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
}

export interface AdminUser {
  id: number
  name: string
  phone: string
  email: string
  blocked: boolean
  image: string
}

export interface Speciality {
  id: number
  name: string
  status: boolean
}
