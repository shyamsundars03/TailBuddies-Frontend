import React, { useState } from 'react';
import { Pill, Plus, Trash2, Save, FileText, Activity } from 'lucide-react';
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
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState({
        vitals: {
            temperature: '',
            pulse: '',
            respiration: ''
        },
        clinicalFindings: '',
        diagnosis: '',
        vetNotes: '',
        medications: [] as Medication[]
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                        onChange={(v) => setFormData(p => ({ ...p, vitals: { ...p.vitals, temperature: v } }))} 
                        placeholder="e.g. 38.5"
                    />
                    <InputField 
                        label="Pulse (BPM)" 
                        value={formData.vitals.pulse} 
                        onChange={(v) => setFormData(p => ({ ...p, vitals: { ...p.vitals, pulse: v } }))} 
                        placeholder="e.g. 80"
                    />
                    <InputField 
                        label="Respiration (BRPM)" 
                        value={formData.vitals.respiration} 
                        onChange={(v) => setFormData(p => ({ ...p, vitals: { ...p.vitals, respiration: v } }))} 
                        placeholder="e.g. 24"
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
                        onChange={(v) => setFormData(p => ({ ...p, clinicalFindings: v }))} 
                        placeholder="Detailed observations during examination..."
                    />
                    <TextAreaField 
                        label="Diagnosis" 
                        value={formData.diagnosis} 
                        onChange={(v) => setFormData(p => ({ ...p, diagnosis: v }))} 
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
                                    <InputField label="Medicine Name" value={med.name} onChange={(v) => updateMedication(idx, 'name', v)} />
                                    <InputField label="Dosage" value={med.dosage} onChange={(v) => updateMedication(idx, 'dosage', v)} placeholder="e.g. 1 tablet" />
                                    <InputField label="Frequency" value={med.frequency} onChange={(v) => updateMedication(idx, 'frequency', v)} placeholder="e.g. 2 times/day" />
                                    <InputField label="Duration" value={med.duration} onChange={(v) => updateMedication(idx, 'duration', v)} placeholder="e.g. 5 days" />
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
                onChange={(v) => setFormData(p => ({ ...p, vetNotes: v }))} 
                placeholder="Additional instructions or advice for the pet owner..."
            />

            <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !formData.clinicalFindings || !formData.diagnosis}
                    className="flex items-center gap-3 px-10 py-4 bg-[#002B49] hover:bg-[#001B39] disabled:bg-gray-200 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-xl active:scale-95"
                >
                    {isSubmitting ? "Saving..." : <><Save size={18} /> Complete Appointment</>}
                </button>
            </div>
        </form>
    );
};

function InputField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
            <input 
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition shadow-sm"
            />
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
            <textarea 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition shadow-sm resize-none"
            />
        </div>
    );
}
