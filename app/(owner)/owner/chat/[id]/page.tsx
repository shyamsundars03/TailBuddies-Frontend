"use client"
import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, MoreVertical, Mic, Paperclip, Send, Play, Video, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

export default function ChatDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [message, setMessage] = useState("")

    const messages = [
        {
            id: 1,
            sender: "user",
            text: "Hello Doctor, could you tell a diet plan that suits for me?",
            time: "8:16 PM",
            senderName: "Andrea Kearns",
            senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
        },
        {
            id: "divider_1",
            type: "divider",
            text: "Today, March 25"
        },
        {
            id: 2,
            sender: "peer",
            type: "audio",
            duration: "0:05",
            time: "9:45 AM",
            senderName: "Edalin Hendry",
            senderAvatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100",
            status: "read"
        },
        {
            id: 3,
            sender: "user",
            type: "link",
            url: "https://www.youtube.com/watch?v=GCmL3mS0Psk",
            thumbnail: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400&h=200",
            title: "DIET",
            description: "APPLE CARROT JUICE",
            time: "9:47 AM",
            senderName: "Andrea Kearns",
            senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
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
                            <Image src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100" alt="Peer" width={48} height={48} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#002B49] text-lg leading-tight">Dr Edalin Hendry</h3>
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

                    const isUser = msg.sender === 'user'
                    return (
                        <div key={msg.id} className={cn(
                            "flex items-end gap-3 max-w-[85%]",
                            isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}>
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                                <Image src={msg.senderAvatar} alt={msg.senderName} width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className={cn(
                                "flex flex-col gap-1",
                                isUser ? "items-end" : "items-start"
                            )}>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <span className="text-[11px] font-black text-[#002B49]">{msg.senderName}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{msg.time}</span>
                                </div>

                                {/* Message Bubble */}
                                <div className={cn(
                                    "p-4 rounded-[2rem] shadow-sm relative",
                                    isUser ? "bg-[#F3F8FF] text-[#002B49] rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                                )}>
                                    {msg.type === 'audio' ? (
                                        <div className="flex items-center gap-4 min-w-[200px]">
                                            <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition">
                                                <Play size={18} fill="currentColor" />
                                            </button>
                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex gap-0.5 items-end">
                                                    {[...Array(24)].map((_, i) => (
                                                        <div key={i} className="w-0.5 bg-blue-200 rounded-full" style={{ height: `${Math.random() * 16 + 4}px` }} />
                                                    ))}
                                                </div>
                                                <p className="text-[10px] font-black text-blue-900/40">{msg.duration}</p>
                                            </div>
                                        </div>
                                    ) : msg.type === 'link' ? (
                                        <div className="space-y-3 max-w-[300px]">
                                            <p className="text-[11px] font-bold text-blue-600 underline truncate">{msg.url}</p>
                                            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition hover:shadow-md cursor-pointer group/link">
                                                <div className="relative aspect-video">
                                                    <Image src={msg.thumbnail} alt={msg.title} fill className="object-cover group-hover/link:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-opacity">
                                                        <Play size={32} className="text-white fill-white shadow-2xl" />
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-blue-50/50">
                                                    <h5 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">{msg.title}</h5>
                                                    <p className="text-sm font-black text-[#002B49] leading-tight">{msg.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                    )}
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
