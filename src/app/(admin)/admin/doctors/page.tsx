"use client";
import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr.Ruby Perrin', specialty: 'Cardiology', earned: '$3200.00', location: 'California, USA', status: false },
    { id: 2, name: 'Dr.Darren Elder', specialty: 'Neurology', earned: '$3100.00', location: 'Newyork, USA', status: false },
    { id: 3, name: 'Dr.Deborah Angel', specialty: 'Urology', earned: '$4000.00', location: 'Georgia, USA', status: false },
    { id: 4, name: 'Dr.Sofia Brient', specialty: 'Orthopaedics', earned: '$3500.00', location: 'Louisiana, USA', status: false },
    { id: 5, name: 'Dr.Marvin Campbell', specialty: 'Ophthalmology', earned: '$3100.00', location: 'Michigan, USA', status: false },
    { id: 6, name: 'Dr.Katharine Berthold', specialty: 'Orthopaedics', earned: '$4100.00', location: 'Texas, USA', status: false },
    { id: 7, name: 'Dr.Linda Tobin', specialty: 'Neurology', earned: '$3700.00', location: 'Kansas, USA', status: false },
    { id: 8, name: 'Dr.Paul Richard', specialty: 'Dermatology', earned: '$3200.00', location: 'California, USA', status: false },
    { id: 9, name: 'Dr.John Gibbs', specialty: 'Dental', earned: '$3500.00', location: 'Oklahoma, USA', status: false },
    { id: 10, name: 'Dr.Olga Barlow', specialty: 'Dental', earned: '$3500.00', location: 'Montana, USA', status: false }
  ]);

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

  // const toggleStatus = (id) => {
  //   setDoctors(doctors.map(doc => 
  //     doc.id === id ? { ...doc, status: !doc.status } : doc
  //   ));
  // };


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
          {/* Breadcrumb */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">List of Doctors</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="text-blue-600 hover:underline cursor-pointer">Dashboard</span>
              <span>/</span>
              <span>List of Doctors Verifications</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Doctor Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Speciality</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Member Since</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Earned</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                            {doctor.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{doctor.specialty}</td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-600">7 Sep 2019</p>
                      <p className="text-xs text-gray-500">10.00 AM</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{doctor.earned}</td>
                    <td className="py-3 px-4">
                      <button
                        // onClick={() => toggleStatus(doctor.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                          doctor.status ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                            doctor.status ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-600">Showing 1 to 10 of 12 entries</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
                  Previous
                </button>
                <button className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">1</button>
                <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">2</button>
                <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">3</button>
                <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

