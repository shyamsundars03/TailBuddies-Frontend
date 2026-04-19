import React from 'react';
import { Pill, FileText, Activity, Download, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface PrescriptionViewProps {
    prescription: any;
    appointment: any;
    onDownload: () => void;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({ prescription, appointment, onDownload }) => {
    if (!prescription) return null;


console.log("reoer", prescription)


    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-[#002B49] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Prescription Details</h2>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">ID: {prescription.prescriptionId}</p>
                    </div>
                </div>
                <button 
                    onClick={onDownload}
                    className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg active:scale-95"
                >
                    <Download size={16} /> Download PDF
                </button>
            </div>

            <div className="p-8 space-y-10">
                {/* Vitals */}
                <section>
                    <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-blue-500" /> Patient Vitals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoItem label="Temperature" value={prescription.vitals?.temperature ? `${prescription.vitals.temperature}°C` : 'N/A'} />
                        <InfoItem label="Pulse" value={prescription.vitals?.pulse ? `${prescription.vitals.pulse} BPM` : 'N/A'} />
                        <InfoItem label="Respiration" value={prescription.vitals?.respiration ? `${prescription.vitals.respiration} BRPM` : 'N/A'} />
                    </div>
                </section>

                {/* Observations */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Clinical Findings</h3>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            {prescription.clinicalFindings}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Diagnosis</h3>
                        <p className="text-xs font-black text-blue-950 leading-relaxed bg-blue-50/30 p-4 rounded-2xl border border-blue-100">
                            {prescription.diagnosis}
                        </p>
                    </div>
                </section>

                {/* Medications */}
                <section>
                    <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Pill size={14} className="text-blue-500" /> Prescribed Medications
                    </h3>
                    <div className="bg-gray-50/20 rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100/50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Medicine</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Dosage</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Frequency</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.medications?.map((med: any, idx: number) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-100/30 transition">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black text-gray-800">{med.name}</p>
                                            {med.notes && <p className="text-[10px] text-gray-400 font-bold mt-1 italic">{med.notes}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{med.dosage}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{med.frequency}</td>
                                        <td className="px-6 py-4 text-xs font-black text-blue-600">{med.duration}</td>
                                    </tr>
                                ))}
                                {(!prescription.medications || prescription.medications.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-xs font-bold text-gray-400 italic">No medications prescribed</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Footer Notes */}
                {(prescription.vetNotes || prescription.followUpDate) && (
                    <section className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                        {prescription.vetNotes && (
                            <div className="flex-1">
                                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-2">Doctor's Advice</h3>
                                <p className="text-xs font-medium text-gray-500 italic">"{prescription.vetNotes}"</p>
                            </div>
                        )}
                        {prescription.followUpDate && (
                            <div className="shrink-0 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                <Calendar size={18} className="text-emerald-600" />
                                <div>
                                    <p className="text-[9px] font-black text-emerald-900/60 uppercase tracking-widest">Follow-up Date</p>
                                    <p className="text-xs font-black text-emerald-700">{new Date(prescription.followUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xs font-black text-gray-700 uppercase">{value}</p>
        </div>
    );
}
