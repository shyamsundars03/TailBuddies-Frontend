
"use client";
import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function SingleDoctorViewPage() {
  const menuItems = [
    { icon: "🏠", label: "Dashboard", active: false },
    { icon: "👥", label: "Users", active: false },
    { icon: "✓", label: "Doctor's Verifications", active: true },
    { icon: "🐕", label: "Pets", active: false },
    { icon: "📋", label: "Specialities", active: false },
    { icon: "📝", label: "Subscription", active: false },
    { icon: "📅", label: "Appointments", active: false },
    { icon: "⚡", label: "Transactions", active: false },
    { icon: "💰", label: "Payments", active: false },
    { icon: "💬", label: "Chat Assistant", active: false },
    { icon: "⭐", label: "Reviews", active: false },
    { icon: "📊", label: "Report", active: false },
    { icon: "🚪", label: "Logout", active: false }
  ];

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-700 text-white shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
            <span className="font-bold text-lg">TailBuddies</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                item.active 
                  ? 'bg-gray-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

{/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Header */}
        <header className="bg-gray-700 border-b border-gray-200 px-6 py-4 flex items-center justify-end">
          <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
            <User size={20} className="text-gray-700" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Breadcrumb & Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">List of Doctors</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span className="text-blue-600 hover:underline cursor-pointer">Dashboard</span>
                <span>/</span>
                <span className="text-blue-600 hover:underline cursor-pointer">List of Doctors Verifications</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition">
                Block Status
              </button>
              <button className="px-5 py-2 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-800 transition">
                Verified
              </button>
            </div>
          </div>

          {/* Doctor Profile Card */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-6">
              {/* Doctor Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Dr. M.Ananthram</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>

              {/* Experience & Education */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Work & Experience</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span>Consultant/Clinic Doctor/Internally</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span>Consultant/Clinic Doctor/Internally</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Work & Education</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span>American Dental Medical University</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    <span>Council Of Higher Medical University</span>
                  </li>
                </ul>
              </div>

              {/* Certificates */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Certificates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-700 mb-2">Veterinary Council of india</p>
                    <button className="text-sm text-blue-600 hover:underline">View Certificate</button>
                    <button className="ml-4 px-4 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition">
                      Verify
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-700 mb-2">Certificate/License Membership/Nationally</p>
                    <button className="text-sm text-blue-600 hover:underline">View Certificate</button>
                    <button className="ml-4 px-4 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition">
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Certificates */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Other Certificates</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-700">National Veterinary Council of India</p>
                    <button className="text-sm text-blue-600 hover:underline">View Certificate</button>
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-700">Membership License Membership/Nationally</p>
                    <button className="text-sm text-blue-600 hover:underline">View Certificate</button>
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-700">ABC Dr License</p>
                    <button className="text-sm text-blue-600 hover:underline">View Certificate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Details */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Clinic Details</h4>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Clinic name</label>
                  <p className="text-sm text-gray-800">ABC Clinic</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Clinic Address</label>
                  <p className="text-sm text-gray-800">123 Main St, City</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Clinic Timing</label>
                  <p className="text-sm text-gray-800">9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Online Consulting</label>
                  <p className="text-sm text-gray-800">Available</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Experience</label>
                  <p className="text-sm text-gray-800">10 Years</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location/City/District/State/City</label>
                  <p className="text-sm text-gray-800">California, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}