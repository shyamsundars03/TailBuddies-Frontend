"use client"
import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, MoreVertical, Mic, Paperclip, Send, Play, Video, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

export default function DoctorChatDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [message, setMessage] = useState("")

    const messages = [
        {
            id: 1,
            sender: "user",
            text: "Hello Doctor, my pet is having skin irritation since morning.",
            time: "8:16 PM",
            senderName: "Charlene Reed",
            senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: "divider_1",
            type: "divider",
            text: "Today, March 25"
        },
        {
            id: 2,
            sender: "peer",
            text: "I see. Have you noticed any redness or hair loss in that area?",
            time: "9:45 AM",
            senderName: "Dr. Arun",
            senderAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100",
            status: "read"
        },
        {
            id: 3,
            sender: "user",
            text: "Yes, there is some redness and he keeps scratching it.",
            time: "9:47 AM",
            senderName: "Charlene Reed",
            senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
        }
    ]

    return (
        <div className="flex flex-col h-[750px] bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
            
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 font-black hover:bg-gray-100 transition shadow-sm active:scale-90"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-blue-50 relative">
                            <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" alt="Peer" width={48} height={48} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#002B49] text-lg leading-tight">Charlene Reed</h3>
                            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-xl">
                        <Search size={20} />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-xl">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/20">
                {messages.map((msg) => {
                    if (msg.type === 'divider') {
                        return (
                            <div key={msg.id} className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="px-5 py-1.5 bg-blue-50 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] rounded-full shadow-sm">
                                    {msg.text}
                                </span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>
                        )
                    }

                    const isPeer = msg.sender === 'peer'
                    return (
                        <div key={msg.id} className={cn(
                            "flex items-end gap-3 max-w-[85%]",
                            isPeer ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}>
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                                <Image src={msg.senderAvatar || "/placeholder.svg"} alt={msg.senderName || "User"} width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className={cn(
                                "flex flex-col gap-1",
                                isPeer ? "items-end" : "items-start"
                            )}>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className="text-[11px] font-black text-[#002B49]">{msg.senderName || "User"}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{msg.time}</span>
                                </div>

                                {/* Message Bubble */}
                                <div className={cn(
                                    "p-4 rounded-[2rem] shadow-sm relative",
                                    isPeer ? "bg-[#F3F8FF] text-[#002B49] rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                                )}>
                                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Bar */}
            <div className="p-6 border-t border-gray-50 bg-white">
                <div className="flex items-center gap-4">
                    <button className="p-3 text-gray-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-2xl">
                        <MoreVertical size={20} />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-2xl">
                        <Mic size={20} />
                    </button>
                    
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full pl-6 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all text-black"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:scale-110 transition active:scale-95">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
