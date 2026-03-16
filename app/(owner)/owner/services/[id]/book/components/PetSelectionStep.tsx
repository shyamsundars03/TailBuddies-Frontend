"use client"

import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { AddPetModal } from "@/components/owner/AddPetModal"
import { cn } from "@/lib/utils/utils"

const SYMPTOMS_OPTIONS = [
    { id: "itching", label: "Itching" },
    { id: "redness", label: "Redness" },
    { id: "hairloss", label: "Hair loss" },
    { id: "skinrashes", label: "Skin rashes" },
    { id: "fever", label: "Fever" },
    { id: "vomiting", label: "Vomiting" }
]

export function PetSelectionStep({ data, setData }: { data: any, setData: any }) {
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false)
    const [pets] = useState([
        { id: "1", name: "Bruno (Dog)" },
        { id: "2", name: "Luna (Cat)" }
    ])

    const toggleSymptom = (id: string) => {
        const newSymptoms = data.symptoms.includes(id)
            ? data.symptoms.filter((s: string) => s !== id)
            : [...data.symptoms, id]
        setData({ ...data, symptoms: newSymptoms })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-blue-950">Select Your Pet</h2>
                    <p className="text-xs text-gray-400 font-medium">Choose which pet needs the consultation</p>
                </div>
                <button
                    onClick={() => setIsAddPetModalOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                    <Plus size={14} />
                    Add Pet
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest ml-1">Select Your Pet</label>
                    <div className="relative group">
                        <select
                            value={data.petId}
                            onChange={(e) => setData({ ...data, petId: e.target.value })}
                            className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3.5 text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:border-blue-200"
                        >
                            <option value="">Select Pet</option>
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest ml-1">Problem Description</label>
                    <textarea
                        value={data.problemDescription}
                        onChange={(e) => setData({ ...data, problemDescription: e.target.value })}
                        placeholder="Describe the issue your pet is facing..."
                        rows={4}
                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest ml-1">Symptoms</label>
                    <div className="flex flex-wrap gap-2">
                        {SYMPTOMS_OPTIONS.map((symptom) => (
                            <button
                                key={symptom.id}
                                onClick={() => toggleSymptom(symptom.id)}
                                className={cn(
                                    "px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 flex items-center gap-2 shadow-sm",
                                    data.symptoms.includes(symptom.id)
                                        ? "bg-yellow-400 border-yellow-400 text-blue-950 shadow-yellow-100"
                                        : "bg-white border-gray-100 text-gray-400 hover:border-yellow-200"
                                )}
                            >
                                <div className={cn(
                                    "w-3 h-3 rounded border flex items-center justify-center transition-all",
                                    data.symptoms.includes(symptom.id) ? "bg-blue-950 border-blue-950" : "border-gray-300"
                                )}>
                                    {data.symptoms.includes(symptom.id) && <div className="w-1 h-1 bg-white rounded-full"></div>}
                                </div>
                                {symptom.label}
                            </button>
                        ))}
                        <button className="bg-yellow-400/20 text-yellow-600 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-yellow-400/30 transition-colors shadow-sm">
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)} onSave={() => { }} />
        </div>
    )
}
