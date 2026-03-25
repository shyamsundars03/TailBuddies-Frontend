"use client"

import { AiAssistant } from "@/components/common/AiAssistant"
import Link from "next/link"

export default function OwnerAiAssistantPage() {
    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col">
            <div className="mb-8 shrink-0">
                <h1 className="text-3xl font-bold text-blue-950 mb-1">AI - Assistent</h1>
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    
                    <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-blue-600/60 font-medium tracking-tight uppercase font-black">Ai Assistent</span>
                </nav>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <AiAssistant />
            </div>
        </div>
    )
}
