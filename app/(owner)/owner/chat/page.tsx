"use client"
import { useState, useEffect } from "react"
import { Search, Phone, MessageSquare, Video, MoreVertical, Pin, CheckCheck, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils/utils"

export default function ChatListPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")

    const chats = [
        {
            id: "chat_001",
            name: "Adrian Marshall",
            lastMessage: "Have you called them?",
            time: "Just Now",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
            status: "read",
            isPinned: true
        },
        {
            id: "chat_002",
            name: "Dr Joseph Boyd",
            lastMessage: "Video",
            time: "Yesterday",
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100",
            status: "delivered",
            isPinned: true,
            isVideo: true
        },
        {
            id: "chat_003",
            name: "Dr Edalin Hendry",
            lastMessage: "Prescription.doc",
            time: "10:20 PM",
            avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100",
            status: "read",
            isPinned: true,
            isFile: true
        }
    ]

    const aiChats = [
        {
            id: "ai_001",
            name: "TailBuddies",
            lastMessage: "Have you called them?",
            time: "Just Now",
            avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100&h=100",
            badge: 2
        }
    ]

    return (
        <div className="space-y-6 pb-12">
            {/* Header / Breadcrumb */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#002B49] mb-1">Chat / Call</h1>
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-blue-600/60 font-medium">Chat / Call</span>
                </nav>
            </div>

            {/* Main Chat Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="p-8 space-y-8">
                    
                    {/* All Chats Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#002B49] uppercase tracking-tight">All Chats</h2>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all text-black"
                            />
                        </div>

                        {/* Chat List */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Chat</h3>
                            <div className="space-y-2">
                                {chats.map((chat) => (
                                    <ChatCard key={chat.id} chat={chat} onClick={() => router.push(`/owner/chat/${chat.id}`)} />
                                ))}
                            </div>
                        </div>

                        {/* AI Chat List */}
                        <div className="space-y-3 pt-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">AI Chat</h3>
                            <div className="space-y-2">
                                {aiChats.map((chat) => (
                                    <ChatCard key={chat.id} chat={chat} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function ChatCard({ chat, onClick }: { chat: any; onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="group flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl hover:bg-blue-50/30 hover:border-blue-100 transition-all cursor-pointer shadow-sm relative overflow-hidden"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden ring-4 ring-gray-50 shrink-0">
                    <Image src={chat.avatar} alt={chat.name} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[#002B49] text-base truncate mb-0.5">{chat.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate font-medium">
                        {chat.isVideo && <Video size={14} className="text-blue-500 shrink-0" />}
                        {chat.isFile && <FileIcon size={14} className="text-blue-500 shrink-0" />}
                        <span className="truncate">{chat.lastMessage}</span>
                    </div>
                </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2 shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">{chat.time}</span>
                <div className="flex items-center gap-2">
                    {chat.isPinned && <Pin size={14} className="text-blue-900/60 rotate-45" />}
                    {chat.status === 'read' && <CheckCheck size={16} className="text-emerald-500" />}
                    {chat.status === 'delivered' && <CheckCheck size={16} className="text-gray-300" />}
                    {chat.badge && (
                        <span className="bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                            {chat.badge}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function FileIcon({ size, className }: { size: number; className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}
