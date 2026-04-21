"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { 
    Mic, 
    Send, 
    MoreVertical, 
    ChevronLeft, 
    ChevronRight, 
    Star, 
    Calendar,
    Minus,
    X,
    Maximize2,
    Loader2,
    MessageSquare,
    CheckCircle2,
    Search,
    Stethoscope,
    HeartPulse
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"
import { userPetApi } from "@/lib/api/user/pet.api"
import { aiApi } from "@/lib/api/ai.api"
import ReactMarkdown from 'react-markdown'

const CATEGORIES = [
    "Skin Related", "Digestion", "Dental", "Muscle/Joint", 
    "Eye Care", "Ear Health", "Behavioral", "Nutrition", 
    "Vaccination", "General Checkup", "Unsure"
]

type ChatStep = 'welcome' | 'category' | 'pet' | 'description' | 'analyzing' | 'results'

interface AssistantState {
    step: ChatStep
    category: string
    petId: string
    description: string
    carePlan: string
    identifiedSpecialty: string
    suggestedDoctors: any[]
}

const STORAGE_KEY = 'tb_ai_assistant_state'

export function AiAssistant({ 
    isPopup = false, 
    onMinimize, 
    onClose 
}: { 
    isPopup?: boolean
    onMinimize?: () => void
    onClose?: () => void
}) {
    // Initial state
    const [state, setState] = useState<AssistantState>({
        step: 'welcome',
        category: '',
        petId: '',
        description: '',
        carePlan: '',
        identifiedSpecialty: '',
        suggestedDoctors: []
    })
    
    const [pets, setPets] = useState<any[]>([])
    const [isLoadingPets, setIsLoadingPets] = useState(false)
    const [activeResultTab, setActiveResultTab] = useState<'doctors' | 'careplan'>('doctors')
    const [error, setError] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Persist state
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setState(parsed)
            } catch (e) {
                console.error("Failed to parse saved state", e)
            }
        }
    }, [])

    useEffect(() => {
        if (state.step !== 'welcome' && state.step !== 'analyzing') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        }
    }, [state])

    // Load pets when needed
    const loadPets = useCallback(async () => {
        setIsLoadingPets(true)
        const response = await userPetApi.getOwnerPets(1, 20)
        if (response.success) {
            setPets(response.data.pets || [])
        }
        setIsLoadingPets(false)
    }, [])

    useEffect(() => {
        if (state.step === 'pet') {
            loadPets()
        }
    }, [state.step, loadPets])

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY)
        setState({
            step: 'welcome',
            category: '',
            petId: '',
            description: '',
            carePlan: '',
            identifiedSpecialty: '',
            suggestedDoctors: []
        })
        if (onClose) onClose()
    }

    const analyzeProblem = async () => {
        setState(prev => ({ ...prev, step: 'analyzing' }))
        setError(null)

        try {
            const response = await aiApi.analyzeIssue(
                state.category,
                state.petId,
                state.description
            );

            if (response.success) {
                const { identifiedSpecialty, carePlan, suggestedDoctors } = response.data;
                setState(prev => ({
                    ...prev,
                    step: 'results',
                    identifiedSpecialty,
                    carePlan,
                    suggestedDoctors
                }))
            } else {
                setError(response.message || "Failed to analyze problem.");
                setState(prev => ({ ...prev, step: 'description' }))
            }
        } catch (err: any) {
            setError("Something went wrong while communicating with the AI. Please try again.")
            setState(prev => ({ ...prev, step: 'description' }))
        }
    }

    return (
        <div className={cn(
            "flex flex-col bg-white overflow-hidden transition-all duration-300",
            isPopup ? "fixed bottom-6 right-6 w-[480px] h-[650px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,43,73,0.15)] z-50 border border-gray-100" : "h-full rounded-[2.5rem] border border-gray-100 shadow-sm"
        )}>
            {/* Header */}
            <div className="p-7 pb-5 bg-white border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center relative shadow-sm">
                        <Image src="/favicon.ico" alt="Logo" width={28} height={28} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-[#002B49] uppercase tracking-widest leading-none mb-1">TailBuddies AI</h1>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Assistant</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    {onMinimize && (
                        <button onClick={onMinimize} className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-blue-600 active:scale-90">
                            <Minus size={20} strokeWidth={3} />
                        </button>
                    )}
                    <button onClick={handleReset} className="p-2.5 hover:bg-rose-50 rounded-xl transition-all text-gray-400 hover:text-rose-600 active:scale-90">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20 scroll-smooth" ref={scrollRef}>
                {/* Step 1: Welcome */}
                <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                         <Image src="/favicon.ico" alt="TB" width={24} height={24} />
                    </div>
                    <div className="space-y-3 max-w-[85%]">
                        <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-gray-50 border-b-2 border-r-2">
                            <p className="text-sm text-[#002B49] font-bold leading-relaxed">
                                👋 Welcome to TailBuddies AI Assistant! What can I help you with today?
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step Options (10 Sugesstions) */}
                {(state.step === 'welcome' || state.step === 'category') && (
                    <div className="pl-13 grid grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        {CATEGORIES.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setState(prev => ({ ...prev, category: cat, step: 'pet' }))}
                                className={cn(
                                    "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center border-2 shadow-sm active:scale-95",
                                    state.category === cat 
                                        ? "bg-[#002B49] text-white border-[#002B49]" 
                                        : "bg-white text-gray-500 border-gray-50 hover:border-blue-200 hover:text-blue-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Pet Selection */}
                {state.petId && (
                     <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-blue-600 text-white px-5 py-3 rounded-3xl rounded-tr-none shadow-lg text-sm font-bold">
                            I need help regarding {pets.find(p => p._id === state.petId)?.name || 'my pet'}.
                        </div>
                    </div>
                )}

                {state.step === 'pet' && (
                    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                             <Image src="/favicon.ico" alt="TB" width={24} height={24} />
                        </div>
                        <div className="space-y-4 w-full">
                            <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-gray-50 border-b-2 border-r-2">
                                <p className="text-sm text-[#002B49] font-bold leading-relaxed">
                                    Great! Which pet are you consulting for?
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 max-w-[90%]">
                                {isLoadingPets ? (
                                    <Loader2 className="animate-spin text-blue-600" size={20} />
                                ) : pets.length > 0 ? (
                                    pets.map(p => (
                                        <button 
                                            key={p._id}
                                            onClick={() => setState(prev => ({ ...prev, petId: p._id, step: 'description' }))}
                                            className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-50 rounded-2xl hover:border-blue-200 transition-all shadow-sm active:scale-95"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <Image src={p.picture || p.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1"} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic">No pets found. Please add a pet first.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Description */}
                {state.description && state.step === 'results' && (
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white px-5 py-3 rounded-3xl rounded-tr-none shadow-lg text-sm font-bold max-w-[80%] leading-relaxed">
                            {state.description}
                        </div>
                    </div>
                )}

                {state.step === 'description' && (
                    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                             <Image src="/favicon.ico" alt="TB" width={24} height={24} />
                        </div>
                        <div className="space-y-4 w-full">
                            <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-gray-50 border-b-2 border-r-2">
                                <p className="text-sm text-[#002B49] font-bold leading-relaxed">
                                    Last thing—describe what is happening with {pets.find(p => p._id === state.petId)?.name}?
                                </p>
                            </div>
                            <div className="relative group">
                                <textarea 
                                    className="w-full h-32 bg-white border-2 border-gray-50 rounded-3xl p-5 text-sm font-medium focus:outline-none focus:border-blue-500 shadow-sm transition-all text-black"
                                    placeholder="Type pet's symptoms or behavior..."
                                    value={state.description}
                                    onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <button 
                                    disabled={!state.description.trim()}
                                    onClick={analyzeProblem}
                                    className="absolute bottom-4 right-4 bg-[#002B49] text-white p-3 rounded-2xl shadow-xl hover:bg-blue-900 transition-all disabled:opacity-50 disabled:grayscale active:scale-90"
                                >
                                    <Send size={18} strokeWidth={3} />
                                </button>
                            </div>
                            {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pl-2">⚠️ {error}</p>}
                        </div>
                    </div>
                )}

                {/* Analyzing State */}
                {state.step === 'analyzing' && (
                     <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" strokeWidth={3} />
                            <HeartPulse className="absolute inset-0 m-auto text-blue-100" size={24} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Analyzing symptoms...</p>
                    </div>
                )}

                {/* Step 5: Results */}
                {state.step === 'results' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                         <div className="flex items-start gap-4">
                            <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                                <Image src="/favicon.ico" alt="TB" width={24} height={24} />
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl rounded-tl-none shadow-sm w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Analysis Complete</span>
                                </div>
                                <p className="text-sm text-emerald-950 font-bold leading-relaxed">
                                    I've analyzed the symptoms. We recommend consulting a <span className="text-blue-600 underline underline-offset-4">{state.identifiedSpecialty}</span>.
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-[2rem] p-2 flex gap-2 border border-gray-100 shadow-sm">
                            <button 
                                onClick={() => setActiveResultTab('doctors')}
                                className={cn(
                                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    activeResultTab === 'doctors' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-400 hover:text-blue-600"
                                )}
                            >
                                <Stethoscope size={14} />
                                Doctors
                            </button>
                            <button 
                                onClick={() => setActiveResultTab('careplan')}
                                className={cn(
                                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    activeResultTab === 'careplan' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-400 hover:text-blue-600"
                                )}
                            >
                                <ClipboardList className="w-3.5 h-3.5" />
                                Care Plan
                            </button>
                        </div>

                        {/* Results Body */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 min-h-[300px]">
                            {activeResultTab === 'doctors' ? (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Search size={12} className="text-blue-600" />
                                        Recommended {state.identifiedSpecialty}s
                                    </h4>
                                    <div className="grid gap-4">
                                        {state.suggestedDoctors.length > 0 ? (
                                            state.suggestedDoctors.slice(0, 4).map(doc => (
                                                <div key={doc._id} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-50 flex items-center gap-4 hover:border-blue-200 transition-colors cursor-pointer group">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                                                        <Image src={doc.userId?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"} alt={doc.userId?.username} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{doc.profile?.specialtyId?.name || "Specialist"}</span>
                                                        <h5 className="font-extrabold text-[#002B49] truncate">{doc.userId?.username}</h5>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase">📍 {doc.clinicInfo?.address?.city || 'N/A'}</span>
                                                            <span className="text-[9px] font-black text-emerald-500 uppercase">₹{doc.profile?.consultationFees}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-400 italic text-center py-8">No specific specialists found at the moment.</p>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => window.location.href = '/owner/services'}
                                        className="w-full py-4 mt-2 bg-gray-50 text-[10px] font-black uppercase text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all tracking-widest border border-blue-100"
                                    >
                                        View All Doctors
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Calendar size={12} className="text-blue-600" />
                                        One-Week Care Plan
                                    </h4>
                                    <div className="prose prose-sm prose-blue max-w-none prose-p:text-[13px] prose-p:leading-relaxed prose-p:text-gray-600 prose-li:text-[13px] prose-strong:text-blue-900 border-l-2 border-blue-100 pl-4 font-black text-gray-500   ">
                                        <ReactMarkdown>{state.carePlan}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Overlay for active typing if needed */}
            {(state.step === 'welcome' || state.step === 'results') && (
                 <div className="p-6 bg-white border-t border-gray-50 shrink-0">
                    <div className="flex items-center gap-4 opacity-50 pointer-events-none">
                         <div className="flex-1 relative">
                            <input 
                                type="text"
                                placeholder="Assistant flow in progress..."
                                className="w-full pl-6 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-medium transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ClipboardList(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M9 12h6" />
            <path d="M9 16h6" />
            <path d="M9 8h6" />
        </svg>
    )
}
