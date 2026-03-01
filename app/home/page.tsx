'use client';

import React from 'react'
import Link from 'next/link'
import { useAppSelector } from '../../lib/redux/hooks'
import { Button } from '../../components/common/ui/Button'
import { Badge } from '../../components/common/ui/Badge'
import { PawPrint, Heart, Shield, Calendar, User, LogOut } from 'lucide-react'
import { useSignin } from '../../lib/hooks/auth/useSignin'

export default function HomePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { logout } = useSignin()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
            <PawPrint className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">TailBuddies</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <Link href="/home" className="text-yellow-500">Home</Link>
          <Link href="/services" className="hover:text-yellow-500 transition">Services</Link>
          <Link href="/vets" className="hover:text-yellow-500 transition">Find Vets</Link>
          <Link href="/blog" className="hover:text-yellow-500 transition">Pet Care</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-100">
                <User size={18} className="text-yellow-600" />
                <span className="text-sm font-bold text-gray-800">{user?.username || user?.email}</span>
                <Badge variant={user?.role === 'doctor' ? 'doctor' : 'owner'}>
                  {user?.role === 'doctor' ? '🩺 Doctor' : '🐾 Owner'}
                </Badge>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button variant="outline" rounded>Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="owner" rounded>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-linear-to-b from-yellow-50 to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-yellow-200">
              <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Trusted by 10k+ Pet Parents</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Give Your Best Friend the <span className="text-yellow-500">Best Care</span>.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              TailBuddies is the all-in-one platform for modern pet parents. Manage health records, book vet appointments, and find top-rated grooming services near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={isAuthenticated ? "/appointments" : "/signup"}>
                <Button variant="owner" size="lg" rounded className="px-8 py-6 text-lg">
                  {isAuthenticated ? "Book an Appointment" : "Join TailBuddies Now"}
                </Button>
              </Link>
              <Link href="/vets">
                <Button variant="outline" size="lg" rounded className="px-8 py-6 text-lg">Find a Veterinarian</Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl border border-yellow-100">
              <div className="aspect-4/5 bg-gray-100 rounded-4xl flex items-center justify-center overflow-hidden">
                <PawPrint size={120} className="text-yellow-200 opacity-50" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Health Score</p>
                  <p className="text-lg font-black text-gray-900">98% Perfect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Everything for Your Pet&apos;s Wellness</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We&apos;ve built a suite of tools that make pet parenting easier than ever.</p>

        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: <Calendar className="text-blue-600" />, title: "Easy Booking", desc: "Schedule appointments with local vets and groomers in seconds.", color: "bg-blue-50" },
            { icon: <Shield className="text-green-600" />, title: "Medical Records", desc: "Keep all your pet's vaccinations and medical history in one secure place.", color: "bg-green-50" },
            { icon: <Heart className="text-red-600" />, title: "Pet Social", desc: "Connect with other pet parents in your neighborhood and share tips.", color: "bg-red-50" }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl border border-gray-100 hover:border-yellow-200 hover:shadow-xl transition-all duration-300 group">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
