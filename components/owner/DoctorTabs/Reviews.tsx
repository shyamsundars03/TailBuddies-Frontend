"use client"

import { Star, MessageSquare } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

export function Reviews() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-10 bg-blue-50/30 rounded-3xl p-8 border border-blue-100/50">
                <div className="text-center space-y-2">
                    <p className="text-4xl font-black text-blue-950">4.8</p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Rating</p>
                </div>

                <div className="flex-1 space-y-3">
                    {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} className="flex items-center gap-4 group">
                            <span className="text-[10px] font-black text-blue-950 w-2 uppercase">{star}</span>
                            <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000 group-hover:bg-blue-500"
                                    style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '5%' }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 w-8 text-right uppercase">{star === 5 ? '85%' : star === 4 ? '10%' : '5%'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <ReviewItem
                    user="Kelly"
                    date="11 Mar 2025"
                    rating={4}
                    comment="I recently completed a series of dental treatments with Dr.Edalin Hendry, and I couldn't be more pleased with the results. From my very first appointment, Dr. Edalin Hendry and their team made me feel completely at ease, addressing all of my concerns with patience and understanding."
                    reply={{
                        doctor: "Dr Edalin Hendry",
                        date: "2 days ago",
                        text: "Thank you so much for taking the time to share your experience at our dental clinic. We are deeply touched by your kind words and thrilled to hear about the positive impact of your treatment."
                    }}
                />
                <ReviewItem
                    user="Samuel"
                    date="05 Mar 2025"
                    rating={5}
                    comment="From my first consultation through to the completion of my treatment, Dr. Edalin Hendry, my dentist, has been nothing short of extraordinary. Dental visits have always been a source of anxiety for me, but Dr. Edalin Hendry's office provided an atmosphere of calm."
                />
            </div>

            <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all uppercase tracking-[0.2em]">
                Show All Reviews
            </button>
        </div>
    )
}

function ReviewItem({ user, date, rating, comment, reply }: any) {
    return (
        <div className="bg-white border border-gray-50 rounded-3xl p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-500 group">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-black text-lg shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                        {user[0]}
                    </div>
                    <div>
                        <h4 className="font-black text-blue-950 text-sm uppercase tracking-tight">{user}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{date}</p>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star
                            key={i}
                            size={14}
                            className={cn(i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100")}
                        />
                    ))}
                </div>
            </div>

            <p className="text-gray-500 text-xs font-medium leading-relaxed italic">"{comment}"</p>

            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    <MessageSquare size={14} />
                    Reply
                </button>
            </div>

            {reply && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=100&h=100"
                                alt={reply.doctor}
                                width={32}
                                height={32}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-blue-900 uppercase">{reply.doctor}</h5>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{reply.date}</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{reply.text}</p>
                </div>
            )}
        </div>
    )
}
