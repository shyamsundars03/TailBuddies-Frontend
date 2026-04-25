import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface Message {
    senderId: string;
    senderRole: 'owner' | 'doctor';
    message: string;
    timestamp: Date;
}

interface ConsultationChatProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    currentUserId: string;
    isReadOnly: boolean;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = ({
    messages,
    onSendMessage,
    currentUserId,
    isReadOnly
}) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim() && !isReadOnly) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShieldCheck size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-blue-950 uppercase tracking-tight">Consultation Chat</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {isReadOnly ? 'Read-only mode' : 'Active Channel'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300">
                        <User size={48} className="mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest italic">No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={idx} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-xs",
                                    isMe 
                                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm" 
                                        : "bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm"
                                )}>
                                    <p className="font-medium leading-relaxed break-words">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 px-1">
                                    {isMe ? 'You' : msg.senderRole} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        disabled={isReadOnly}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isReadOnly ? "Chat disabled after consultation" : "Type your message here..."}
                        className="flex-1 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        disabled={isReadOnly}
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl shadow-md transition active:scale-95 shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
                {!isReadOnly && (
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-2 ml-1">
                        Chat will be disabled after session end
                    </p>
                )}
            </div>
        </div>
    );
};
