
"use client";
import React, { useState } from 'react';
import { User, Search } from 'lucide-react';

export default function PetManagementPage() {
  const [pets, setPets] = useState([
    { id: 1, petId: '#PT1001', petName: 'Bruno', age: 2, ownerName: 'Charlene Reed', ownerImage: '👤', blockStatus: false, phone: '8208329170', lastVisit: '20 Oct 2019', paid: '$100.01' },
    { id: 2, petId: '#PT1001', petName: 'Max', age: 3, ownerName: 'Travis Trimble', ownerImage: '👤', blockStatus: false, phone: '2077269974', lastVisit: '22 Oct 2019', paid: '$200.00' },
    { id: 3, petId: '#PT1001', petName: 'Marty', age: 2, ownerName: 'Carl Kelly', ownerImage: '👤', blockStatus: false, phone: '2607247769', lastVisit: '21 Oct 2019', paid: '$250.00' },
    { id: 4, petId: '#PT1001', petName: 'Shadow', age: 2, ownerName: 'Michelle Fairfax', ownerImage: '👤', blockStatus: false, phone: '5043868473', lastVisit: '21 Sep 2019', paid: '$130.00' },
    { id: 5, petId: '#PT1001', petName: 'Oleum', age: 3, ownerName: 'Gina Moore', ownerImage: '👤', blockStatus: false, phone: '9508297887', lastVisit: '18 Sep 2019', paid: '$230.00' },
    { id: 6, petId: '#PT1001', petName: 'Bella', age: 1, ownerName: 'Elise Giles', ownerImage: '👤', blockStatus: false, phone: '3133864582', lastVisit: '18 Sep 2019', paid: '$330.01' },
    { id: 7, petId: '#PT1001', petName: 'Blocky', age: 5, ownerName: 'Jean Gardner', ownerImage: '👤', blockStatus: false, phone: '7072200469', lastVisit: '19 Sep 2019', paid: '$250.01' },
    { id: 8, petId: '#PT1001', petName: 'Jimmy', age: 1, ownerName: 'Daniel Griffing', ownerImage: '👤', blockStatus: false, phone: '9737793697', lastVisit: '7 Sep 2019', paid: '$150.01' },
    { id: 9, petId: '#PT1001', petName: 'Andrew', age: 1, ownerName: 'Walter Robertson', ownerImage: '👤', blockStatus: false, phone: '8003566465', lastVisit: '11 Sep 2019', paid: '$100.01' },
    { id: 10, petId: '#PT1001', petName: 'Robert', age: 1, ownerName: 'Robert Rhodes', ownerImage: '👤', blockStatus: false, phone: '8582906365', lastVisit: '12 Sep 2019', paid: '$120.01' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

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

  // const toggleBlockStatus = (id) => {
  //   setPets(pets.map(pet => 
  //     pet.id === id ? { ...pet, blockStatus: !pet.blockStatus } : pet
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
          {/* Breadcrumb */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">List of Pets</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="text-blue-600 hover:underline cursor-pointer">Dashboard</span>
              <span>/</span>
              <span>List of Pets</span>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-end">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pet ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pet Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Block Status
                      <span className="ml-2 text-gray-400">⇅</span>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Visit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Paid
                      <span className="ml-2 text-gray-400">⇅</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((pet) => (
                    <tr key={pet.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">{pet.petId}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">🐕</span>
                          </div>
                          <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                            {pet.petName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{pet.age}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                            {pet.ownerImage}
                          </div>
                          <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                            {pet.ownerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          // onClick={() => toggleBlockStatus(pet.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            pet.blockStatus ? 'bg-red-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              pet.blockStatus ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{pet.phone}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{pet.lastVisit}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{pet.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}