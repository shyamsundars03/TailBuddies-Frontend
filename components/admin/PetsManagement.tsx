"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { adminPetApi } from '../../lib/api/admin/pet.api';
import { toast } from 'sonner';
import { Pagination } from '../common/ui/Pagination';

export function PetsManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialSearch = searchParams.get('search') || "";
    const initialPage = parseInt(searchParams.get('page') || "1");

    const [pets, setPets] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPets, setTotalPets] = useState(0);
    const limit = 10;

    const loadPets = useCallback(async (page: number, search: string) => {
        setIsLoading(true);
        const response = await adminPetApi.getAllPets(page, limit, search);
        if (response.success) {
            setPets(response.data.pets || response.data);
            setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1);
            setTotalPets(response.data.total || 0);
        } else {
            toast.error(response.error || "Failed to load pets");
        }
        setIsLoading(false);
    }, [limit]);

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (currentPage > 1) params.set('page', currentPage.toString());
        
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [debouncedSearchTerm, currentPage, pathname, router]);

    // Load data
    useEffect(() => {
        loadPets(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, loadPets]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="font-inter">
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
                    <h2 className="text-xl font-bold text-blue-900/80">Pets List</h2>
                    <div className="flex items-center justify-end">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 text-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pet Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gender</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400 font-semibold">Loading pets...</td>
                                </tr>
                            ) : pets.length > 0 ? (
                                pets.map((pet) => (
                                    <tr key={pet._id} className="border-b border-gray-100 hover:bg-gray-50 text-black">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                    {pet.picture ? (
                                                        <img src={pet.picture} alt={pet.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-500 text-xs text-black font-semibold">🐕</span>
                                                    )}
                                                </div>
                                                <span
                                                    onClick={() => router.push(`/admin/petsManagement/${pet._id}`)}
                                                    className="text-sm text-blue-600 font-bold hover:underline cursor-pointer"
                                                >
                                                    {pet.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-bold">{pet.age}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-bold">{pet.gender || "N/A"}</td>
                                        <td className="py-3 px-4 font-bold">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                                    👤
                                                </div>
                                                <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">
                                                    {pet.ownerId?.username || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-bold">{pet.ownerId?.phone || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400 font-bold italic">
                                        No pets found.
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/30">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={totalPets}
                        entriesPerPage={limit}
                    />
                </div>
            </div>
        </div>
    );
}
