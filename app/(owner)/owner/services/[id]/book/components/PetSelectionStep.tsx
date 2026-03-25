import { useEffect, useState } from "react"
import { ChevronDown, Plus, Loader2, X } from "lucide-react"
import { AddPetModal } from "@/components/owner/AddPetModal"
import { cn } from "@/lib/utils/utils"
import { userPetApi } from "@/lib/api/user/pet.api"
import { toast } from "sonner"

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
    const [pets, setPets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPets = async () => {
        setIsLoading(true)
        const response = await userPetApi.getOwnerPets(1, 50)
        if (response.success) {
            setPets(response.data.pets || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchPets()
    }, [])

    const [symptomInput, setSymptomInput] = useState("")

    const addSymptom = () => {
        const trimmed = symptomInput.trim()
        if (!trimmed) return

        // Case-insensitive duplicate check
        const isDuplicate = data.symptoms.some(
            (s: string) => s.toLowerCase() === trimmed.toLowerCase()
        )

        if (isDuplicate) {
            toast.error("This symptom is already added")
            return
        }

        setData({ ...data, symptoms: [...data.symptoms, trimmed] })
        setSymptomInput("")
    }

    const removeSymptom = (symptomToRemove: string) => {
        setData({
            ...data,
            symptoms: data.symptoms.filter((s: string) => s !== symptomToRemove)
        })
    }

    const handleSavePet = async (petData: any, pictureFile: File | null) => {
        try {
            const formData = new FormData();
            
            // Basic fields
            formData.append('name', petData.name);
            formData.append('species', petData.species);
            formData.append('breed', petData.breed);
            formData.append('gender', petData.gender);
            formData.append('age', petData.age);
            formData.append('dob', petData.dob);
            formData.append('weight', petData.weight);
            
            if (pictureFile) {
                formData.append('picture', pictureFile);
            }

            if (petData.vaccinations) {
                formData.append('vaccinations', JSON.stringify(petData.vaccinations));
            }

            const response = await userPetApi.addPet(formData);
            
            if (response.success) {
                toast.success("Pet added successfully!");
                await fetchPets(); // Refresh the list
                // Find the new pet (usually the last one if sorted by createdAt desc)
                // Or just assume the API returns the new pet
                if (response.data && response.data._id) {
                    setData({ ...data, petId: response.data._id });
                }
                setIsAddPetModalOpen(false);
            } else {
                toast.error(response.error || "Failed to add pet");
            }
        } catch (error) {
            toast.error("An unexpected error occurred while saving pet");
        }
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
                                <option key={pet._id} value={pet._id}>{pet.name}</option>
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={symptomInput}
                            onChange={(e) => setSymptomInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSymptom()}
                            placeholder="Type a symptom..."
                            className="flex-1 bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <button
                            onClick={addSymptom}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100"
                        >
                            Add
                        </button>
                    </div>
                    
                    {data.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.symptoms.map((symptom: string) => (
                                <span 
                                    key={symptom}
                                    className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 border border-blue-100 group animate-in zoom-in-95 duration-200"
                                >
                                    {symptom}
                                    <button 
                                        onClick={() => removeSymptom(symptom)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddPetModal isOpen={isAddPetModalOpen} onClose={() => setIsAddPetModalOpen(false)} onSave={handleSavePet} />
        </div>
    )
}
