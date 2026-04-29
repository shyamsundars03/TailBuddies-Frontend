"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2, Minimize2, Settings, Users, MessageSquare, XCircle, Activity, Play, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface VideoCallProps {
    appId: string
    channelName: string
    token: string
    uid: string | number
    localName?: string
    remoteName?: string
    onEndCall: () => void
    minimized?: boolean
    onExpand?: () => void
}

interface CallLog {
    id: string
    message: string
    time: string
    type: 'join' | 'leave' | 'info'
}

export function VideoCall({ appId, channelName, token, uid, localName = "You", remoteName = "Participant", onEndCall, minimized = false, onExpand }: VideoCallProps) {
    const [hasStarted, setHasStarted] = useState(false)
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isJoining, setIsJoining] = useState(false)
    const [joinStatus, setJoinStatus] = useState("Initializing...")
    const [joinError, setJoinError] = useState<string | null>(null)
    const [callLogs, setCallLogs] = useState<CallLog[]>([])
    const [showLogs, setShowLogs] = useState(false)

    const clientRef = useRef<IAgoraRTCClient | null>(null)
    const tracksRef = useRef<{
        videoTrack: ICameraVideoTrack | null
        audioTrack: IMicrophoneAudioTrack | null
    }>({ videoTrack: null, audioTrack: null })
    
    const localVideoRef = useRef<HTMLDivElement>(null)
    const callContainerRef = useRef<HTMLDivElement>(null)
    const isMounted = useRef(true)
    const initStartedRef = useRef(false)

    const addLog = useCallback((message: string, type: 'join' | 'leave' | 'info' = 'info') => {
        const now = new Date()
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setCallLogs(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            message,
            time,
            type
        }, ...prev].slice(0, 50))
    }, [])

    const stringToUid = (uidValue: any): number => {
        if (typeof uidValue === 'number') return uidValue >>> 0;
        if (!uidValue || uidValue === '0') return 0;
        if (typeof uidValue === 'string' && /^\d+$/.test(uidValue) && uidValue.length < 10) {
            return parseInt(uidValue, 10) >>> 0;
        }
        let hash = 0;
        const str = String(uidValue);
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return (hash >>> 0);
    }

    const stopTracks = () => {
        if (tracksRef.current.videoTrack) {
            tracksRef.current.videoTrack.stop();
            tracksRef.current.videoTrack.close();
            tracksRef.current.videoTrack = null;
        }
        if (tracksRef.current.audioTrack) {
            tracksRef.current.audioTrack.stop();
            tracksRef.current.audioTrack.close();
            tracksRef.current.audioTrack = null;
        }
    }

    const startCall = async () => {
        if (initStartedRef.current) return;
        initStartedRef.current = true;
        setHasStarted(true);
        setIsJoining(true);
        setJoinError(null);

        let agoraClient: IAgoraRTCClient | null = null;

        try {
            if (!appId || !channelName || !token) {
                throw new Error("Missing required Agora configuration");
            }

            const numericUid = stringToUid(uid);
            agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
            clientRef.current = agoraClient;

            agoraClient.on("user-published", async (user, mediaType) => {
                await agoraClient?.subscribe(user, mediaType)
                if (mediaType === "video") {
                    setRemoteUsers((prev) => {
                        if (prev.find(u => u.uid === user.uid)) return prev;
                        addLog(`${remoteName} joined the call`, 'join');
                        return [...prev, user];
                    })
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play()
                }
            })

            agoraClient.on("user-unpublished", (user, mediaType) => {
                if (mediaType === 'video') {
                    setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid))
                }
            })

            agoraClient.on("user-left", (user) => {
                setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid))
                addLog(`${remoteName} left the call`, 'leave');
            })

            setJoinStatus("Joining channel...")
            await agoraClient.join(appId, channelName, token, Number(numericUid));
            addLog(`You joined as ${localName}`, 'join');

            setJoinStatus("Accessing camera...")
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
            tracksRef.current = { audioTrack, videoTrack };
            
            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current)
            }
            
            await agoraClient.publish([audioTrack, videoTrack])
            setIsJoining(false)
            
        } catch (error: any) {
            console.error("Agora init error:", error)
            setJoinError(error?.message || "Failed to connect")
            initStartedRef.current = false;
        }
    }

    const handleEndCall = async () => {
        stopTracks();
        if (clientRef.current) {
            await clientRef.current.leave();
        }
        initStartedRef.current = false;
        setHasStarted(false);
        setRemoteUsers([]);
        onEndCall();
    }

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            stopTracks();
            if (clientRef.current) {
                clientRef.current.leave().catch(console.error);
                clientRef.current.removeAllListeners();
            }
            clientRef.current = null;
        };
    }, []);

    const toggleMic = async () => {
        if (tracksRef.current.audioTrack) {
            const nextState = !isMuted;
            await tracksRef.current.audioTrack.setEnabled(!nextState)
            setIsMuted(nextState)
            addLog(nextState ? "Microphone muted" : "Microphone unmuted");
        }
    }

    const toggleVideo = async () => {
        if (tracksRef.current.videoTrack) {
            const nextState = !isVideoOff;
            await tracksRef.current.videoTrack.setEnabled(!nextState)
            setIsVideoOff(nextState)
            addLog(nextState ? "Video stopped" : "Video started");
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            callContainerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const mainRemoteUser = remoteUsers[0];

    // If minimized and call has started, show floating window
    if (minimized && hasStarted) {
        return (
            <motion.div 
                layoutId="video-call-container"
                drag
                dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
                className="fixed bottom-10 right-10 w-72 h-48 bg-slate-900 rounded-3xl shadow-2xl border-2 border-white/10 z-[9999] overflow-hidden cursor-move group"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {mainRemoteUser ? (
                    <RemoteVideoPlayer user={mainRemoteUser} name={remoteName} isMinimized />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                        <Users size={24} className="text-white/10" />
                    </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={onExpand} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors">
                        <ExternalLink size={18} />
                    </button>
                    <button onClick={handleEndCall} className="p-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white transition-colors">
                        <PhoneOff size={18} />
                    </button>
                </div>

                <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">{remoteName}</span>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div 
            layoutId="video-call-container"
            ref={callContainerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative bg-[#020617] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col transition-all duration-500",
                isFullscreen ? "h-screen w-screen rounded-none" : "h-[650px] w-full border border-white/5",
                minimized && "hidden" // Parent page handles the absolute floating if not using the above return
            )}
        >
            {!hasStarted ? (
                /* Start Screen */
                <div className="flex-1 flex flex-col items-center justify-center bg-[#020617] space-y-8 p-12 text-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Video size={48} className="text-blue-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#020617] animate-pulse" />
                    </div>
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-3xl font-black text-white tracking-tight">Ready to Start?</h2>
                        <p className="text-sm font-medium text-white/40 leading-relaxed uppercase tracking-widest">
                            Consultation with {remoteName}
                        </p>
                    </div>
                    <button 
                        onClick={startCall}
                        className="group flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-3xl transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
                    >
                        <Play size={18} className="fill-current" />
                        Start Consultation
                    </button>
                </div>
            ) : (
                /* Call Screen */
                <>
                    <div className="flex-1 relative min-h-0 bg-slate-950">
                        {mainRemoteUser ? (
                            <div className="w-full h-full relative">
                                <RemoteVideoPlayer user={mainRemoteUser} name={remoteName} />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 space-y-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-blue-500/5 flex items-center justify-center animate-pulse">
                                        <Users size={56} className="text-blue-500/20" />
                                    </div>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/10 border-t-blue-500/40 animate-spin" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-white/40 tracking-tight uppercase">Waiting for {remoteName}</h3>
                                    <p className="text-[10px] font-black text-blue-500/30 uppercase tracking-[0.3em]">Establishing secure P2P link</p>
                                </div>
                            </div>
                        )}

                        {/* Local Video PIP */}
                        <motion.div 
                            drag
                            dragConstraints={callContainerRef}
                            initial={{ x: 20, y: 20 }}
                            className={cn(
                                "absolute bottom-8 right-8 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 z-40 cursor-grab active:cursor-grabbing",
                                isVideoOff && "bg-slate-800"
                            )}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div ref={localVideoRef} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                <div className={cn("w-2 h-2 rounded-full animate-pulse", isVideoOff ? "bg-red-500" : "bg-emerald-500")} />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{localName}</span>
                            </div>
                            {isVideoOff && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                                    <VideoOff className="text-white/20" size={32} />
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Camera Off</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Logs Overlay */}
                        <AnimatePresence>
                            {showLogs && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="absolute top-8 left-8 w-72 max-h-80 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden z-30"
                                >
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Call Logs</span>
                                        <Activity size={14} className="text-blue-500 animate-pulse" />
                                    </div>
                                    <div className="p-4 space-y-4 overflow-y-auto max-h-64 custom-scrollbar">
                                        {callLogs.map(log => (
                                            <div key={log.id} className="flex gap-3 text-[10px]">
                                                <span className="text-white/20 font-mono shrink-0">{log.time}</span>
                                                <span className={cn(
                                                    "font-medium",
                                                    log.type === 'join' ? "text-emerald-400" :
                                                    log.type === 'leave' ? "text-rose-400" : "text-white/60"
                                                )}>{log.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Connecting Overlay */}
                        <AnimatePresence>
                            {isJoining && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl"
                                >
                                    <div className="flex flex-col items-center gap-8 max-w-md w-full p-8 text-center">
                                        {!joinError ? (
                                            <>
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Video className="text-blue-500" size={32} />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h2 className="text-2xl font-black text-white tracking-tight">Initializing Call</h2>
                                                    <p className="text-blue-400 text-sm font-bold">{joinStatus}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                                    <XCircle className="text-red-500" size={40} />
                                                </div>
                                                <h2 className="text-2xl font-black text-white tracking-tight">Connection Failed</h2>
                                                <p className="text-red-400/80 text-sm font-medium">{joinError}</p>
                                                <button onClick={() => { setHasStarted(false); setIsJoining(false); }} className="w-full py-4 bg-white/5 text-white/60 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10 transition">Go Back</button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls Bar */}
                    <div className="h-28 bg-[#020617]/80 backdrop-blur-3xl border-t border-white/5 px-10 flex items-center justify-between z-50">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowLogs(!showLogs)}>
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", showLogs ? "bg-blue-500/10 text-blue-500" : "bg-white/5 text-white/40")}>
                                <Activity size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Consultation</span>
                                <span className="text-xs font-bold text-white/60">Live Logs</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <ControlButton onClick={toggleMic} active={!isMuted} icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />} label={isMuted ? "Unmute" : "Mute"} />
                            <button onClick={handleEndCall} className="w-16 h-16 rounded-[1.5rem] bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-all shadow-2xl shadow-rose-500/30 active:scale-90"><PhoneOff size={28} /></button>
                            <ControlButton onClick={toggleVideo} active={!isVideoOff} icon={isVideoOff ? <VideoOff size={22} /> : <Video size={22} />} label={isVideoOff ? "Video On" : "Video Off"} />
                        </div>

                        <div className="flex items-center gap-4">
                            <ControlButton onClick={toggleFullscreen} active={isFullscreen} icon={isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />} label="View" />
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    )
}

function ControlButton({ onClick, active, icon, label }: { onClick: () => void, active: boolean, icon: React.ReactNode, label: string }) {
    return (
        <button onClick={onClick} className="group flex flex-col items-center gap-3">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90", active ? "bg-white/5 text-white hover:bg-white/10" : "bg-amber-500 text-white")}>
                {icon}
            </div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
        </button>
    )
}

function RemoteVideoPlayer({ user, name, isMinimized = false }: { user: IAgoraRTCRemoteUser, name: string, isMinimized?: boolean }) {
    const videoRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (user.videoTrack && videoRef.current) {
            user.videoTrack.play(videoRef.current)
        }
    }, [user.videoTrack])

    return (
        <div className="relative w-full h-full bg-slate-950">
            <div ref={videoRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
            
            {!isMinimized && (
                <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{name}</span>
                </div>
            )}

            {!user.hasVideo && (
                <div className="absolute inset-0 bg-[#020617] flex flex-col items-center justify-center space-y-6">
                    <Users size={isMinimized ? 24 : 56} className="text-white/10" />
                    {!isMinimized && <p className="text-sm font-bold text-white/40 uppercase tracking-[0.3em]">{name} turned off video</p>}
                </div>
            )}
        </div>
    )
}
