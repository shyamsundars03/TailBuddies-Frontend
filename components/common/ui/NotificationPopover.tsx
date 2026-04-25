"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Check, Clock, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { notificationApi } from "@/lib/api/notification.api"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Notification {
    _id: string
    title: string
    message: string
    createdAt: string
    status: 'unread' | 'read'
    link?: string
    type: string
}

export function NotificationPopover({ onClose }: { onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread')
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true)
        const response = await notificationApi.getNotifications(activeTab === 'unread' ? 'unread' : undefined)
        if (response.success) {
            setNotifications(response.notifications || [])
        }
        setIsLoading(false)
    }, [activeTab])

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    const markAllRead = async () => {
        const response = await notificationApi.markAllAsRead()
        if (response.success) {
            setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
            if (activeTab === 'unread') setNotifications([])
        }
    }

    const markAsRead = async (id: string) => {
        const response = await notificationApi.markAsRead(id)
        if (response.success) {
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n))
            if (activeTab === 'unread') {
                setNotifications(prev => prev.filter(n => n._id !== id))
            }
        }
    }

    return (
        <div className="absolute top-12 right-0 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
                <div>
                    <h3 className="font-black text-[#002B49] text-sm uppercase tracking-widest">Notifications</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        {notifications.filter(n => n.status === 'unread').length} New Messages
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
            <div className="max-h-[400px] overflow-y-auto bg-white min-h-[100px]">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="mx-auto animate-spin text-blue-600 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Loading...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((n) => (
                            <div key={n._id} className={cn(
                                "p-5 hover:bg-gray-50/50 transition-colors group relative",
                                n.status === 'unread' && "bg-blue-50/30"
                            )}>
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white",
                                        n.status === 'read' ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-blue-600"
                                    )}>
                                        <Bell size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-black text-[#002B49] text-xs truncate uppercase tracking-tight">{n.title}</h4>
                                            {n.status === 'unread' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                <Clock size={10} />
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </div>
                                            {n.link && (
                                                <Link 
                                                    href={n.link} 
                                                    onClick={() => markAsRead(n._id)}
                                                    className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {n.status === 'unread' && (
                                    <button 
                                        onClick={() => markAsRead(n._id)}
                                        className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-all"
                                        title="Mark as read"
                                    >
                                        <Check size={12} strokeWidth={3} />
                                    </button>
                                )}
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
