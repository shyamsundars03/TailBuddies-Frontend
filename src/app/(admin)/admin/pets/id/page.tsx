"use client";
import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function SinglePetViewPage() {
    
  const menuItems = [
    { icon: "🏠", label: "Dashboard", active: true },
    { icon: "👨‍⚕️", label: "Doctors" },
    { icon: "👥", label: "Users" },
    { icon: "🐕", label: "Pets" },
    { icon: "📋", label: "Specialities" },
    { icon: "📅", label: "Appointments" },
    { icon: "📝", label: "Subscriptions" },
    { icon: "⭐", label: "Reviwes" },
    { icon: "💰", label: "Payments" },
    { icon: "⚡", label: "Transactions" },
    { icon: "💬", label: "Chat / Call" },
    { icon: "📊", label: "Reports"},
    { icon: "🚪", label: "Logout" }
  ];



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
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="text-sm">ADMIN</span> */}
          </div>
          <button className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-400 transition">
            <User size={20} className="text-white" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Breadcrumb & Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">List of Pet</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span className="text-blue-600 hover:underline cursor-pointer">Dashboard</span>
                <span>/</span>
                <span className="text-blue-600 hover:underline cursor-pointer">List of Pets</span>
                <span>/</span>
                <span>Pet- ID</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition">
                Verify
              </button>
              <button className="px-5 py-2 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-800 transition">
                Block
              </button>
            </div>
          </div>

          {/* Pet Profile Card */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              {/* Pet Header with Image */}
              <div className="flex items-start gap-6 mb-6">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🐕</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">📷</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Owner Name</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Vaccinated
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Pet details</p>
                </div>
              </div>

              {/* Pet Details Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <p className="text-sm text-gray-800">Max</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Species</label>
                  <p className="text-sm text-gray-800">Golden Retriever</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <p className="text-sm text-gray-800">Male</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">DOB</label>
                  <p className="text-sm text-gray-800">01 March 2021</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                  <p className="text-sm text-gray-800">1 Year 8 Months</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
                  <p className="text-sm text-gray-800">28 Kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Vaccination:</h3>
              <button className="px-5 py-2 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 transition">
                Verify
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Vaccination Name</label>
                  <p className="text-sm text-gray-800">Rabies</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">LastTaken/Date</label>
                  <p className="text-sm text-gray-800">2024-03-15</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">NextDue/Date</label>
                  <p className="text-sm text-gray-800">2025-01-01</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Certificates</label>
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">Rabies.pdf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Others Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Others:</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subscription</label>
                  <p className="text-sm text-gray-800">Active</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Up Coming Appointments</label>
                  <p className="text-sm text-gray-800">12</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Total Consultations</label>
                  <p className="text-sm text-gray-800">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


