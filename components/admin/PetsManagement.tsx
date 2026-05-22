"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { adminPetApi } from '@/lib/api/admin';
import { Pet } from '@/lib/types/admin/admin.types';
import { toast } from 'sonner';
import { Pagination } from '../common/ui/Pagination';
import { SearchInput } from '../common/ui/SearchInput';
import { DataTable, Column } from '../common/ui/DataTable';
import { ADMIN_ROUTES } from '../../lib/constants';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function PetsManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialSearch = searchParams.get('search') || "";
    const initialPage = parseInt(searchParams.get('page') || "1");

    const [pets, setPets] = useState<Pet[]>([]);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPets, setTotalPets] = useState(0);
    const limit = 10;

    const loadPets = useCallback(async (page: number, search: string) => {
        setIsLoading(true);
        const response = await adminPetApi.getAllPets({ page, limit, search });
        if (response.success && response.data) {
            const items = response.data.items || [];
            setPets(items);
            setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1);
            setTotalPets(response.data.total || 0);
        } else {
            setPets([]);
            setTotalPages(1);
            setTotalPets(0);
            toast.error(response.error || "Failed to load pets");
        }
        setIsLoading(false);
    }, [limit]);

    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (currentPage > 1) params.set('page', currentPage.toString());
        
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [debouncedSearchTerm, currentPage, pathname, router]);

    // Reset to page 1 on search
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    // Load data
    useEffect(() => {
        loadPets(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, loadPets]);

    const columns: Column<Pet>[] = [
        {
            header: "Pet Name",
            accessor: (pet) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {pet.picture ? (
                            <Image src={pet.picture} alt={pet.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 text-xs font-semibold">🐕</span>
                        )}
                    </div>
                    <span
                        onClick={() => router.push(ADMIN_ROUTES.PET_DETAILS(pet._id))}
                        className="text-sm text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                        {pet.name}
                    </span>
                </div>
            )
        },
        { header: "Age", accessor: "age", className: "text-gray-700 font-bold" },
        { header: "Gender", accessor: (pet) => pet.gender || "N/A", className: "text-gray-700 font-bold" },
        {
            header: "Owner Name",
            accessor: (pet) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        👤
                    </div>
                    <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">
                        {pet.ownerId?.username || "N/A"}
                    </span>
                </div>
            )
        },
        { header: "Phone", accessor: (pet) => pet.ownerId?.phone || "N/A", className: "text-gray-700 font-bold" }
    ];

    return (
        <div className="font-inter">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Pets</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href={ADMIN_ROUTES.DASHBOARD} className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">List of Pets</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-blue-900/80">Pets List</h2>
                    <SearchInput
                        placeholder="Search pets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        containerClassName="w-full sm:w-64"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={pets}
                    keyExtractor={(pet) => pet._id}
                    isLoading={isLoading}
                    emptyMessage="No pets found in the database."
                    className="border-0 shadow-none rounded-none"
                    onRowClick={(pet) => router.push(ADMIN_ROUTES.PET_DETAILS(pet._id))}
                />

                <div className="px-6 py-4 bg-gray-50/30">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalEntries={totalPets}
                        entriesPerPage={limit}
                    />
                </div>
            </div>
        </div>
    );
}
