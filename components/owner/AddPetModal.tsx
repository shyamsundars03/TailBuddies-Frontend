"use client"

import { useState, useEffect } from "react"
import { X, Plus, Upload, Calendar, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { petFormSchema } from "../../lib/validation/owner/pet.schema"
import { toast } from "sonner"

interface AddPetModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any, picture: File | null) => void
    isSubmitting?: boolean
    initialData?: any
}

export function AddPetModal({ isOpen, onClose, onSave, isSubmitting = false, initialData }: AddPetModalProps) {
    const defaultState = {
        name: "",
        species: "",
        breed: "",
        gender: "Male",
        age: "",
        dob: "",
        weight: "",
        vaccinated: "NO",
        vaccinations: [
            { vaccinationName: "", takenDate: "", dueDate: "", certificate: null as File | null }
        ]
    }

    const [formData, setFormData] = useState(defaultState)
    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [breedData, setBreedData] = useState<{ dogs: string[], cats: string[] }>({ dogs: [], cats: [] })

    // Fetch breeds data from Cloudinary on mount
    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await fetch("https://res.cloudinary.com/dhezzaec7/raw/upload/breeds.json_buyf04.txt")
                if (response.ok) {
                    const data = await response.json()
                    setBreedData(data)
                }
            } catch (error) {
                console.error("Failed to fetch breeds:", error)
            }
        }
        fetchBreeds()
    }, [])

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    species: initialData.species || "",
                    breed: initialData.breed || "",
                    gender: initialData.gender || "",
                    age: initialData.age || "",
                    dob: initialData.dob || "",
                    weight: initialData.weight || "",
                    vaccinated: initialData.isVaccinated || (initialData.vaccinations?.length > 0 ? "YES" : "NO"),
                    vaccinations: initialData.vaccinations?.length > 0 
                        ? initialData.vaccinations.map((v: any) => ({
                            vaccinationName: v.vaccinationName || v.name || "",
                            takenDate: v.takenDate || "",
                            dueDate: v.dueDate || "",
                            certificate: null
                          }))
                        : defaultState.vaccinations
                })
            } else {
                setFormData(defaultState)
            }
            setPictureFile(null)
            setErrors({})
            setTouched({})
        }
    }, [isOpen, initialData])

    if (!isOpen) return null

    const validateField = (name: string, value: any, updatedFormData: any) => {
        const result = petFormSchema.safeParse(updatedFormData);

        if (!result.success) {
            const zError = result.error as any;
            const error = zError.issues.find((err: any) => err.path.join('.') === name) ||
                zError.issues.find((err: any) => err.path[0] === name);
            setErrors(prev => ({ ...prev, [name]: error ? error.message : "" }));
        } else {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }

    const handleBlur = (name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, (formData as any)[name], formData);
    }

    const handleSave = () => {
        // Mark all fields as touched for validation
        const newTouched: Record<string, boolean> = {
            name: true, species: true, breed: true, age: true, dob: true, weight: true
        }
        if (formData.vaccinated === "YES") {
            formData.vaccinations.forEach((v, index) => {
                newTouched[`vaccinations.${index}.vaccinationName`] = true;
                newTouched[`vaccinations.${index}.takenDate`] = true;
                newTouched[`vaccinations.${index}.dueDate`] = true;
            })
        }
        setTouched(newTouched);

        const dataToValidate = { ...formData };
        if (dataToValidate.vaccinated === "NO") {
            delete (dataToValidate as any).vaccinations;
        }

        const result = petFormSchema.safeParse(dataToValidate)
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            const zError = result.error as any;
            zError.issues.forEach((err: any) => {
                newErrors[err.path.join('.')] = err.message;
            });
            setErrors(newErrors);
            toast.error("Please fix the errors in the form before saving");
            return
        }

        onSave(dataToValidate, pictureFile)
    }

    const addVaccination = () => {
        setFormData(prev => ({
            ...prev,
            vaccinations: [...prev.vaccinations, { vaccinationName: "", takenDate: "", dueDate: "", certificate: null as File | null }]
        }))
    }

    const removeVaccination = (index: number) => {
        if (formData.vaccinations.length > 1) {
            setFormData(prev => ({
                ...prev,
                vaccinations: prev.vaccinations.filter((_, i) => i !== index)
            }))
        }
    }

    const updateVaccination = (index: number, field: string, value: string | File | null) => {
        const newVaccinations = [...formData.vaccinations];
        (newVaccinations[index] as any)[field] = value;
        const newFormData = { ...formData, vaccinations: newVaccinations }
        setFormData(newFormData)
        if (typeof value === 'string' && touched[`vaccinations.${index}.${field}`]) {
            validateField(`vaccinations.${index}.${field}`, value, newFormData);
        }
    }

    const getErrorText = (name: string) => {
        if (touched[name] && errors[name]) {
            return (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle size={10} /> {errors[name]}
                </p>
            )
        }
        return null;
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
                                className={cn(
                                    "w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-black  text-sm",
                                    touched.name && errors.name ? "border-red-300" : "border-gray-200"
                                )}
                                value={formData.name}
                                onChange={(e) => {
                                    const newData = { ...formData, name: e.target.value }
                                    setFormData(newData)
                                    if (touched.name) validateField('name', e.target.value, newData)
                                }}
                                onBlur={() => handleBlur('name')}
                            />
                            {getErrorText('name')}
                        </div>

                        {/* Pet Species */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Species</label>
                            <select
                                className={cn(
                                    "w-full px-4 py-3  text-black    bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm appearance-none",
                                    touched.species && errors.species ? "border-red-300" : "border-gray-200"
                                )}
                                value={formData.species}
                                onChange={(e) => {
                                    const newData = { ...formData, species: e.target.value, breed: "" }
                                    setFormData(newData)
                                    if (touched.species) validateField('species', e.target.value, newData)
                                }}
                                onBlur={() => handleBlur('species')}
                            >
                                <option value="">Select Species</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                
                            </select>
                            {getErrorText('species')}
                        </div>

                        {/* Pet Breed */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Breed</label>
                            <select
                                className={cn(
                                    "w-full px-4 py-3  text-black    bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm appearance-none",
                                    touched.breed && errors.breed ? "border-red-300" : "border-gray-200"
                                )}
                                value={formData.breed}
                                onChange={(e) => {
                                    const newData = { ...formData, breed: e.target.value }
                                    setFormData(newData)
                                    if (touched.breed) validateField('breed', e.target.value, newData)
                                }}
                                onBlur={() => handleBlur('breed')}
                            >
                                <option value="">Select Breed</option>
                                {formData.species.toLowerCase() === "dog" && breedData.dogs.map(breed => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                                {formData.species.toLowerCase() === "cat" && breedData.cats.map(breed => (
                                    <option key={breed} value={breed}>{breed}</option>
                                ))}
                            </select>
                            {getErrorText('breed')}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Gender</label>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2  text-black   cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="w-4  text-black    h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.gender === "Male"}
                                        onChange={() => setFormData({ ...formData, gender: "Male" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="w-4 h-4   text-black    text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={formData.gender === "Female"}
                                        onChange={() => setFormData({ ...formData, gender: "Female" })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Female</span>
                                </label>
                            </div>
                        </div>

                        {/* Pet Age */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Age (Years)</label>
                            <input
                                type="text"
                                placeholder="Enter age in years (e.g. 2)"
                                className={cn(
                                    "w-full px-4  text-black    py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm",
                                    touched.age && errors.age ? "border-red-300" : "border-gray-200"
                                )}
                                value={formData.age}
                                onChange={(e) => {
                                    const newData = { ...formData, age: e.target.value }
                                    setFormData(newData)
                                    if (touched.age) validateField('age', e.target.value, newData)
                                }}
                                onBlur={() => handleBlur('age')}
                            />
                            {getErrorText('age')}
                        </div>

                        {/* Pet DOB */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet DOB</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className={cn(
                                        "w-full px-4  text-black    py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm",
                                        touched.dob && errors.dob ? "border-red-300" : "border-gray-200"
                                    )}
                                    value={formData.dob}
                                    onChange={(e) => {
                                        const newData = { ...formData, dob: e.target.value }
                                        setFormData(newData)
                                        if (touched.dob) validateField('dob', e.target.value, newData)
                                    }}
                                    onBlur={() => handleBlur('dob')}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                            {getErrorText('dob')}
                        </div>

                        {/* Pet Weight */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Weight (kg)</label>
                            <input
                                type="text"
                                placeholder="Enter weight in kg (e.g. 15)"
                                className={cn(
                                    "w-full px-4 py-3  text-black    bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm",
                                    touched.weight && errors.weight ? "border-red-300" : "border-gray-200"
                                )}
                                value={formData.weight}
                                onChange={(e) => {
                                    const newData = { ...formData, weight: e.target.value }
                                    setFormData(newData)
                                    if (touched.weight) validateField('weight', e.target.value, newData)
                                }}
                                onBlur={() => handleBlur('weight')}
                            />
                            {getErrorText('weight')}
                        </div>

                        {/* Pet Picture */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Pet Picture</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <span className="text-sm text-gray-500">Choose File</span>
                                    <span className="text-xs text-gray-700 italic truncate max-w-[150px]">
                                        {pictureFile ? pictureFile.name : "No file chosen"}
                                    </span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setPictureFile(e.target.files[0])
                                            }
                                        }}
                                    />
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
                                        className="w-4 h-4  text-black   text-blue-600 focus:ring-blue-500 border-gray-300"
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

                        {/* Empty spacing for layout balance if vaccinated is NO */}
                        {formData.vaccinated === "NO" && <div></div>}
                    </div>

                    {formData.vaccinated === "YES" && (
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-700 text-lg">Vaccination Details</h4>
                            {formData.vaccinations.map((vaccine, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                    {/* Vaccination Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600">Vaccination Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter vaccination name"
                                            className={cn(
                                                "w-full px-4 py-3  text-black    bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm",
                                                touched[`vaccinations.${index}.vaccinationName`] && errors[`vaccinations.${index}.vaccinationName`] ? "border-red-300" : "border-gray-200"
                                            )}
                                            value={vaccine.vaccinationName}
                                            onChange={(e) => updateVaccination(index, 'vaccinationName', e.target.value)}
                                            onBlur={() => handleBlur(`vaccinations.${index}.vaccinationName`)}
                                        />
                                        {getErrorText(`vaccinations.${index}.vaccinationName`)}
                                    </div>

                                    {/* Certificate */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600">Certificate</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span className="text-sm text-gray-500">Choose File</span>
                                                <span className="text-xs text-gray-400 italic truncate max-w-[100px]">
                                                    {vaccine.certificate ? (vaccine.certificate as File).name : "No file chosen"}
                                                </span>
                                                <input 
                                                    type="file" 
                                                    className="hidden"
                                                    accept="application/pdf, image/jpeg, image/png"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            updateVaccination(index, 'certificate', e.target.files[0])
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Taken Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600">TakenDate</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className={cn(
                                                    "w-full px-4 py-3  text-black    bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm",
                                                    touched[`vaccinations.${index}.takenDate`] && errors[`vaccinations.${index}.takenDate`] ? "border-red-300" : "border-gray-200"
                                                )}
                                                value={vaccine.takenDate}
                                                onChange={(e) => updateVaccination(index, 'takenDate', e.target.value)}
                                                onBlur={() => handleBlur(`vaccinations.${index}.takenDate`)}
                                            />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                        </div>
                                        {getErrorText(`vaccinations.${index}.takenDate`)}
                                    </div>

                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600">DueDate</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className={cn(
                                                    "w-full px-4 py-3  text-black     bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm",
                                                    touched[`vaccinations.${index}.dueDate`] && errors[`vaccinations.${index}.dueDate`] ? "border-red-300" : "border-gray-200"
                                                )}
                                                value={vaccine.dueDate}
                                                onChange={(e) => updateVaccination(index, 'dueDate', e.target.value)}
                                                onBlur={() => handleBlur(`vaccinations.${index}.dueDate`)}
                                            />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                        </div>
                                        {getErrorText(`vaccinations.${index}.dueDate`)}
                                    </div>

                                    {/* Action Buttons (Add More / Remove) */}
                                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                        {index === formData.vaccinations.length - 1 && (
                                            <button
                                                onClick={addVaccination}
                                                className="px-4 py-1.5 bg-yellow-400/20 text-yellow-700 font-bold rounded-lg text-xs hover:bg-yellow-400/30 transition shadow-sm active:scale-95 flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Add More
                                            </button>
                                        )}
                                        {formData.vaccinations.length > 1 && (
                                            <button
                                                onClick={() => removeVaccination(index)}
                                                className="px-4 py-1.5 bg-red-100 text-red-600 font-bold rounded-lg text-xs hover:bg-red-200 transition shadow-sm active:scale-95 flex items-center gap-1"
                                            >
                                                <X size={14} /> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition active:scale-95 shadow-sm disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-10 py-2.5 bg-yellow-400 text-black font-bold rounded-xl text-sm hover:bg-yellow-500 transition active:scale-95 shadow-md disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}
