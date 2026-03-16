"use client"

import { useState } from "react"
import { X, Plus, Upload, Calendar } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface AddPetModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
}

export function AddPetModal({ isOpen, onClose, onSave }: AddPetModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        species: "",
        breed: "",
        gender: "Male",
        age: "",
        dob: "",
        weight: "",
        vaccinated: "YES",
        vaccinationName: "",
        takenDate: "",
        dueDate: "",
    })

    if (!isOpen) return null

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800">Pet Information</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Pet Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Name</label>
                            <input
                                type="text"
                                placeholder="Enter pet name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Pet Species */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Species</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm appearance-none"
                                value={formData.species}
                                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                            >
                                <option value="">Select Species</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                            </select>
                        </div>

                        {/* Pet Breed */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Breed</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm appearance-none"
                                value={formData.breed}
                                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            >
                                <option value="">Select Breed</option>
                                <option value="Golden Retriever">Golden Retriever</option>
                                <option value="German Shepherd">German Shepherd</option>
                                <option value="Persian">Persian</option>
                            </select>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Gender</label>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.gender === "Male"}
                                        onChange={() => setFormData({ ...formData, gender: "Male" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.gender === "Female"}
                                        onChange={() => setFormData({ ...formData, gender: "Female" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Pet Age */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Age</label>
                            <input
                                type="text"
                                placeholder="Enter pet age"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>

                        {/* Pet DOB */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet DOB</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Pet Weight */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Weight</label>
                            <input
                                type="text"
                                placeholder="Enter pet weight"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>

                        {/* Pet Picture */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Picture</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <span className="text-sm text-gray-500">Choose File</span>
                                    <span className="text-xs text-gray-400 italic">No file chosen</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Vaccinated */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Vaccinated</label>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="vaccinated"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.vaccinated === "YES"}
                                        onChange={() => setFormData({ ...formData, vaccinated: "YES" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">YES</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="vaccinated"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.vaccinated === "NO"}
                                        onChange={() => setFormData({ ...formData, vaccinated: "NO" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">NO</span>
                                </label>
                            </div>
                        </div>

                        {/* Empty spacing for layout balance if needed */}
                        <div></div>

                        {/* Vaccination Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Vaccination Name</label>
                            <input
                                type="text"
                                placeholder="Enter vaccination name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                value={formData.vaccinationName}
                                onChange={(e) => setFormData({ ...formData, vaccinationName: e.target.value })}
                            />
                        </div>

                        {/* Taken Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">TakenDate</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                    value={formData.takenDate}
                                    onChange={(e) => setFormData({ ...formData, takenDate: e.target.value })}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">DueDate</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Certificate */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Certificate</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <span className="text-sm text-gray-500">Choose File</span>
                                    <span className="text-xs text-gray-400 italic">No file chosen</span>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (Add More / Remove) */}
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-500 transition shadow-sm active:scale-95">
                            Add More
                        </button>
                        <button className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-500 transition shadow-sm active:scale-95">
                            Remove
                        </button>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-yellow-400 text-black font-bold rounded-xl text-sm hover:bg-yellow-500 transition active:scale-95 shadow-md"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-2.5 bg-yellow-400 text-black font-bold rounded-xl text-sm hover:bg-yellow-500 transition active:scale-95 shadow-md"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
