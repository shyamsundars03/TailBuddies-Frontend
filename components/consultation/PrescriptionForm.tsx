import React, { useState, useEffect, useMemo } from 'react';
import { Pill, Plus, Trash2, Save, FileText, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
}

interface PrescriptionFormProps {
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    initialData?: any;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onSubmit, isSubmitting, initialData }) => {
    const [formData, setFormData] = useState({
        vitals: {
            temperature: initialData?.vitals?.temperature || '',
            pulse: initialData?.vitals?.pulse || '',
            respiration: initialData?.vitals?.respiration || ''
        },
        clinicalFindings: initialData?.clinicalFindings || '',
        diagnosis: initialData?.diagnosis || '',
        vetNotes: initialData?.vetNotes || '',
        symptoms: (initialData?.symptoms || []) as string[],
        medications: (initialData?.medications || []) as Medication[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Word count helper
    const getWordCount = (str: string) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    // Validation Logic
    const validateField = (name: string, value: any) => {
        let error = '';

        if (['clinicalFindings', 'diagnosis', 'vetNotes'].includes(name)) {
            const words = getWordCount(value as string);
            if (words > 100) error = `Exceeds 100 word limit (${words}/100)`;
        } else if (['temperature', 'pulse', 'respiration'].includes(name)) {
            if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
                error = 'Must be a positive number';
            }
        }

        setErrors(prev => {
            const next = { ...prev };
            if (error) next[name] = error;
            else delete next[name];
            return next;
        });
    };

    const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

    // Update form if initialData changes (e.g. after first save)
    useEffect(() => {
        if (initialData) {
            setFormData({
                vitals: {
                    temperature: initialData.vitals?.temperature || '',
                    pulse: initialData.vitals?.pulse || '',
                    respiration: initialData.vitals?.respiration || ''
                },
                clinicalFindings: initialData.clinicalFindings || '',
                diagnosis: initialData.diagnosis || '',
                vetNotes: initialData.vetNotes || '',
                symptoms: initialData.symptoms || [],
                medications: initialData.medications || []
            });
        }
    }, [initialData]);

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
        }));
    };

    const removeMedication = (index: number) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index)
        }));
    };

    const updateMedication = (index: number, field: keyof Medication, value: string) => {
        setFormData(prev => {
            const newList = [...prev.medications];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, medications: newList };
        });
    };

    const isFormValid = useMemo(() => {
        if (hasErrors) return false;
        if (!formData.clinicalFindings.trim()) return false;
        if (!formData.diagnosis.trim()) return false;
        if (!formData.vetNotes.trim()) return false;

        // If medicines are added, ensure they have at least name, dosage, and frequency
        if (formData.medications.length > 0) {
            const hasEmptyMedicine = formData.medications.some(med =>
                !med.name.trim() || !med.dosage.trim() || !med.frequency.trim() || !med.duration.trim()
            );
            if (hasEmptyMedicine) return false;
        }

        return true;
    }, [formData, hasErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <FileText size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight leading-none mb-1">Electronic Prescription</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Digital Medical Record</p>
                </div>
            </div>

            {/* Vitals Section */}
            <section className="space-y-4">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" /> Patient Vitals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                        label="Temperature (°C)"
                        value={formData.vitals.temperature}
                        error={formData.vitals.temperature && (isNaN(Number(formData.vitals.temperature)) || Number(formData.vitals.temperature) <= 0) ? "Must be a valid number" : errors.temperature}
                        onChange={(v) => {
                            setFormData(p => ({ ...p, vitals: { ...p.vitals, temperature: v } }));
                            validateField('temperature', v);
                        }}
                        placeholder="e.g. 38.5"
                    />
                    <InputField
                        label="Pulse (BPM)"
                        value={formData.vitals.pulse}
                        error={formData.vitals.pulse && (isNaN(Number(formData.vitals.pulse)) || Number(formData.vitals.pulse) <= 0) ? "Must be a valid number" : errors.pulse}
                        onChange={(v) => {
                            setFormData(p => ({ ...p, vitals: { ...p.vitals, pulse: v } }));
                            validateField('pulse', v);
                        }}
                        placeholder="e.g. 80"
                    />
                    <InputField
                        label="Respiration (BRPM)"
                        value={formData.vitals.respiration}
                        error={formData.vitals.respiration && (isNaN(Number(formData.vitals.respiration)) || Number(formData.vitals.respiration) <= 0) ? "Must be a valid number" : errors.respiration}
                        onChange={(v) => {
                            setFormData(p => ({ ...p, vitals: { ...p.vitals, respiration: v } }));
                            validateField('respiration', v);
                        }}
                        placeholder="e.g. 24"
                    />
                </div>
            </section>

            {/* Symptoms Section */}
            <section className="space-y-4">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Symptoms & Signs</h3>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Presenting Symptoms (Comma separated)</label>
                    <textarea
                        value={formData.symptoms.join(', ')}
                        onChange={(e) => {
                            const syms = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            setFormData(p => ({ ...p, symptoms: syms }));
                        }}
                        placeholder="e.g. Fever, Coughing, Loss of appetite..."
                        className="w-full text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500/50 transition shadow-sm resize-none"
                        rows={2}
                    />
                </div>
            </section>

            {/* Findings & Diagnosis */}
            <section className="space-y-4">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Observations</h3>
                <div className="space-y-4">
                    <TextAreaField
                        label="Clinical Findings"
                        value={formData.clinicalFindings}
                        error={errors.clinicalFindings}
                        maxWords={100}
                        onChange={(v) => {
                            setFormData(p => ({ ...p, clinicalFindings: v }));
                            validateField('clinicalFindings', v);
                        }}
                        placeholder="Detailed observations during examination..."
                    />
                    <TextAreaField
                        label="Diagnosis"
                        value={formData.diagnosis}
                        error={errors.diagnosis}
                        maxWords={100}
                        onChange={(v) => {
                            setFormData(p => ({ ...p, diagnosis: v }));
                            validateField('diagnosis', v);
                        }}
                        placeholder="Final medical conclusion..."
                    />
                </div>
            </section>

            {/* Medications */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                        <Pill size={14} className="text-blue-500" /> Medications
                    </h3>
                    <button
                        type="button"
                        onClick={addMedication}
                        className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition shadow-sm"
                    >
                        <Plus size={14} /> Add Medicine
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.medications.length === 0 ? (
                        <p className="text-xs text-gray-400 italic font-medium py-4 text-center border border-dashed border-gray-100 rounded-2xl">No medications added yet</p>
                    ) : (
                        formData.medications.map((med, idx) => (
                            <div key={idx} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                                <button
                                    type="button"
                                    onClick={() => removeMedication(idx)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InputField 
                                        label="Medicine Name" 
                                        value={med.name} 
                                        onChange={(v) => updateMedication(idx, 'name', v)} 
                                        error={!med.name.trim() ? "Required" : ""}
                                    />
                                    <InputField 
                                        label="Dosage" 
                                        value={med.dosage} 
                                        onChange={(v) => updateMedication(idx, 'dosage', v)} 
                                        placeholder="Enter number" 
                                        error={med.dosage && (isNaN(Number(med.dosage)) || Number(med.dosage) < 0) ? "Must be a valid number" : (!med.dosage.trim() ? "Required" : "")}
                                    />
                                    <InputField 
                                        label="Frequency" 
                                        value={med.frequency} 
                                        onChange={(v) => updateMedication(idx, 'frequency', v)} 
                                        placeholder="Enter number" 
                                        error={med.frequency && (isNaN(Number(med.frequency)) || Number(med.frequency) < 0) ? "Must be a valid number" : (!med.frequency.trim() ? "Required" : "")}
                                    />
                                    <InputField 
                                        label="Duration" 
                                        value={med.duration} 
                                        onChange={(v) => updateMedication(idx, 'duration', v)} 
                                        placeholder="Enter number" 
                                        error={med.duration && (isNaN(Number(med.duration)) || Number(med.duration) < 0) ? "Must be a valid number" : (!med.duration.trim() ? "Required" : "")}
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputField label="Instructions / Notes" value={med.notes || ''} onChange={(v) => updateMedication(idx, 'notes', v)} placeholder="e.g. After food" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <TextAreaField
                label="Veterinary Notes (For Owner)"
                value={formData.vetNotes}
                error={errors.vetNotes}
                maxWords={100}
                onChange={(v) => {
                    setFormData(p => ({ ...p, vetNotes: v }));
                    validateField('vetNotes', v);
                }}
                placeholder="Additional instructions or advice for the pet owner..."
            />

            <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="flex items-center gap-3 px-10 py-4 bg-[#002B49] hover:bg-[#001B39] disabled:bg-gray-200 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-xl active:scale-95"
                >
                    {isSubmitting ? "Saving..." : <><Save size={18} /> Complete Appointment</>}
                </button>
            </div>
        </form>
    );
};

function InputField({ label, value, onChange, placeholder, error, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, error?: string, type?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none transition shadow-sm",
                    error ? "border-red-500 text-red-900 focus:ring-red-500/10" : "border-gray-100 text-gray-700 focus:ring-blue-500/10 focus:border-blue-500/50"
                )}
            />
            {error && (
                <p className="text-[9px] font-bold text-red-500 flex items-center gap-1 ml-1 uppercase tracking-wider">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder, error, maxWords }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, error?: string, maxWords?: number }) {
    const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                {maxWords && (
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        wordCount > maxWords ? "text-red-500" : "text-gray-300"
                    )}>
                        {wordCount} / {maxWords} Words
                    </span>
                )}
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={cn(
                    "w-full bg-gray-50 border rounded-xl px-4 py-3 text-xs font-bold outline-none transition shadow-sm resize-none",
                    error ? "border-red-500 text-red-900 focus:ring-red-500/10" : "border-gray-100 text-gray-700 focus:ring-blue-500/10 focus:border-blue-500/50"
                )}
            />
            {error && (
                <p className="text-[9px] font-bold text-red-500 flex items-center gap-1 ml-1 uppercase tracking-wider">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    );
}
