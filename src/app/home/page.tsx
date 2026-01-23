"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks"
import { setUser, logout } from "../../lib/redux/slices/authSlice"
import authService from "../../lib/services/authService"

import { Bell, MessageSquare, User, Stethoscope, Phone, Calendar, Video, Search } from "lucide-react"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      dispatch(setUser(currentUser))
    }
    setIsLoading(false)
  }, [dispatch])

  const handleLogout = () => {
    authService.logout()
    dispatch(logout())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100">
      {/* Header */}
<header className="bg-yellow-400 px-6 py-0 flex items-center justify-between pl-40 pr-40">
  <div className="flex items-center gap-2">
    <div className="mb-0">
      <img src="/tailbuddies-logo.png" alt="TailBuddies Logo" width="100" height="70" />
    </div>
  </div>

  <nav className="hidden md:flex items-center gap-8 text-sm">
    <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
      Home
    </Link>
    <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
      About
    </Link>
    <Link href="/services" className="text-gray-700 hover:text-gray-900 font-medium">
      Services
    </Link>
    <Link href="/contacts" className="text-gray-700 hover:text-gray-900 font-medium">
      Contacts
    </Link>
  </nav>

  <div className="flex items-center gap-4">
    {/* Always show Sign In / Doctor buttons */}
    <Link
      href="/signin"
      className="px-4 py-2 bg-white-800 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full text-sm transition"
    >
      Owner
    </Link>

    <Link
      href="/signin?role=doctor"
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full text-sm transition flex items-center gap-2"
    >
      <Stethoscope size={16} />
      Doctor
    </Link>

    {/* Only show dashboard and icons if user is logged in */}
    {user && (
      <>
        {user.role === "doctor" && (
          <Link
            href="/doctor/dashboard"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            <Stethoscope size={16} />
            Doctor Dashboard
          </Link>
        )}

        {user.role === "owner" && (
          <Link
            href="/owner/dashboard"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-full text-sm font-medium"
          >
            <User size={16} />
            My Dashboard
          </Link>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
            <Search size={18} className="text-gray-700" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
            <Bell size={18} className="text-gray-700" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
            <MessageSquare size={18} className="text-gray-700" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition">
            <User size={18} className="text-gray-700" />
          </button>
        </div>
      </>
    )}
  </div>
</header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full">
                <span className="text-2xl">🐾</span>
                <span className="text-sm font-semibold text-gray-900">Welcome to TailBuddies</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your Trusted
                <br />
                <span className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-lg">
                    <Stethoscope className="text-pink-500" size={32} />
                    <span className="text-pink-500">Doctors</span>
                  </span>
                  Today
                </span>
              </h1>

              <p className="text-gray-600 text-lg">
                Your pet's health and happiness are our top priority. Connect with expert veterinarians anytime,
                anywhere.
              </p>

              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-full transition">
                Get Started
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop"
                alt="Cat and Dog"
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-purple-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock assistance for your pet's needs</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-pink-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">Schedule appointments with just a few clicks</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-teal-600" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Care</h3>
              <p className="text-gray-600 text-sm">Certified veterinarians ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighting Care & Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Highlighting the Care & Support</h2>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop"
                alt="Pet Care 1"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop"
                alt="Pet Care 2"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1541599468348-e96984315921?w=300&h=300&fit=crop"
                alt="Pet Care 3"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop"
                alt="Pet Care 4"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop"
                alt="Pet Care 5"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">+</span>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&h=300&fit=crop"
                alt="Pet Care 6"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop"
                alt="Pet Care 7"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Services */}
      <section className="py-16 bg-linear-to-b from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Services
            </span>
            <h2 className="text-4xl font-bold text-gray-900">Our Highlighted Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Emergency Care</h3>
              <p className="text-gray-600 text-sm mb-4">
                24/7 emergency veterinary services for urgent pet care needs with immediate response.
              </p>
              <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-orange-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Regular Checkups</h3>
              <p className="text-gray-600 text-sm mb-4">
                Schedule routine health examinations to keep your pet healthy and happy year-round.
              </p>
              <a href="#" className="text-orange-600 font-semibold text-sm hover:underline">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-teal-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Specialized Treatment</h3>
              <p className="text-gray-600 text-sm mb-4">
                Expert care from specialists in various fields of veterinary medicine and surgery.
              </p>
              <a href="#" className="text-teal-600 font-semibold text-sm hover:underline">
                Learn More →
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Telemedicine</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect with veterinarians remotely through video consultations from home comfort.
              </p>
              <a href="#" className="text-purple-600 font-semibold text-sm hover:underline">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-bold text-gray-900">Compelling Reasons to Choose</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl">🏆</span>
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Experienced Team</h3>
              <p className="text-gray-600">
                Our team consists of highly qualified veterinarians with years of experience in treating all types of
                pets with care and compassion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl">💰</span>
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Affordable Prices</h3>
              <p className="text-gray-600">
                We believe quality pet care should be accessible to everyone. Our services are competitively priced
                without compromising on quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl">⭐</span>
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Licensed Care</h3>
              <p className="text-gray-600">
                All our veterinarians are fully licensed and certified professionals who follow the highest standards of
                veterinary medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-b from-blue-50 to-blue-100 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Locations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Treatments</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Dental
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Cardiac
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Spinal Cord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Hair Growth
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Anemia & Disorder
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Specialities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Neurologist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Cardiologist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Oncology
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Orthopedics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Gynecology
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Utilities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2026 TailBuddies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
