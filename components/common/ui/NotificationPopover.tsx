"use client"

import { useState } from "react"
import { Bell, Check, Trash2, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface Notification {
    id: string
    title: string
    message: string
    time: string
    isRead: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "Appointment Confirmed",
        message: "Your appointment with Dr. Sarah Smith at 2:30 PM is confirmed.",
        time: "10 mins ago",
        isRead: false
    },
    {
        id: "2",
        title: "Payment Received",
        message: "Successfully processed ₹500 for your last consultation.",
        time: "1 hour ago",
        isRead: false
    },
    {
        id: "3",
        title: "Vaccination Reminder",
        message: "Buddy's annual rabies vaccination is due next week.",
        time: "2 hours ago",
        isRead: true
    },
    {
        id: "4",
        title: "New Message",
        message: "Dr. James sent you a follow-up message about the prescription.",
        time: "5 hours ago",
        isRead: true
    }
]

export function NotificationPopover({ onClose }: { onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread')
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

    const filteredNotifications = activeTab === 'unread' 
        ? notifications.filter(n => !n.isRead) 
        : notifications

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    return (
        <div className="absolute top-12 right-0 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
                <div>
                    <h3 className="font-black text-[#002B49] text-sm uppercase tracking-widest">Notifications</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        {notifications.filter(n => !n.isRead).length} New Messages
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={markAllRead}
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors"
                        title="Mark all as read"
                    >
                        <Check size={16} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 text-gray-400 rounded-xl transition-colors"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="p-2 flex gap-1 bg-gray-50/50">
                <button 
                    onClick={() => setActiveTab('unread')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'unread' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Unread
                </button>
                <button 
                    onClick={() => setActiveTab('all')}
                    className={cn(
                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === 'all' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    All
                </button>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto bg-white">
                {filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {filteredNotifications.map((n) => (
                            <div key={n.id} className={cn(
                                "p-5 hover:bg-gray-50/50 transition-colors group relative",
                                !n.isRead && "bg-blue-50/30"
                            )}>
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white",
                                        n.isRead ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-600"
                                    )}>
                                        <Bell size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-black text-[#002B49] text-xs truncate uppercase tracking-tight">{n.title}</h4>
                                            {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            <Clock size={10} />
                                            {n.time}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => deleteNotification(n.id)}
                                    className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <Bell className="mx-auto mb-3 opacity-20" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed"> No notifications yet</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                <button className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline transition-all">
                    View All Activity
                </button>
            </div>
        </div>
    )
}
