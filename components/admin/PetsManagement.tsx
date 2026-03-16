"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Pet } from "../../lib/types/admin/admin.types";
import Link from "next/link"
import { useRouter } from 'next/navigation';

interface PetsManagementProps {
    initialPets?: Pet[];
}

const DUMMY_PETS: Pet[] = [
    {
        id: '1',
        petId: 'PET-001',
        name: 'Max',
        age: '1 Year 8 Months',
        ownerName: 'Hendrika',
        isBlocked: false,
        phone: '+1 234 567 8901',
        lastVisit: '2024-01-10',
        paid: '$150.00',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
        id: '2',
        petId: 'PET-002',
        name: 'Bella',
        age: '2 Years',
        ownerName: 'John Doe',
        isBlocked: true,
        phone: '+1 234 567 8902',
        lastVisit: '2024-02-15',
        paid: '$200.00',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
        id: '3',
        petId: 'PET-003',
        name: 'Charlie',
        age: '3 Years 2 Months',
        ownerName: 'Sarah Smith',
        isBlocked: false,
        phone: '+1 234 567 8903',
        lastVisit: '2024-03-01',
        paid: '$120.00'
    }
];

export function PetsManagement({ initialPets = [] }: PetsManagementProps) {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>(initialPets.length > 0 ? initialPets : DUMMY_PETS);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleBlockStatus = (id: string) => {
        setPets(pets.map(pet =>
            pet.id === id ? { ...pet, isBlocked: !pet.isBlocked } : pet
        ));
    };

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.petId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Pets</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">List of Pets</span>
                </div>
            </div>
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Visit</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Paid
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPets.length > 0 ? (
                                filteredPets.map((pet) => (
                                    <tr key={pet.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{pet.petId}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {pet.image ? (
                                                        <img src={pet.image} alt={pet.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">🐕</span>
                                                    )}
                                                </div>
                                                <span
                                                    onClick={() => router.push(`/admin/petsManagement/${pet.id}`)}
                                                    className="text-sm text-blue-600 font-medium hover:underline cursor-pointer"
                                                >
                                                    {pet.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{pet.age}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                                    👤
                                                </div>
                                                <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                                    {pet.ownerName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleBlockStatus(pet.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${pet.isBlocked ? 'bg-red-500' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${pet.isBlocked ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{pet.phone}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{pet.lastVisit || 'N/A'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-semibold">{pet.paid}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-gray-400">
                                        No pets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
