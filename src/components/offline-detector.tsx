"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner";

export function OfflineDetector() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Koneksi internet kembali normal", {
                icon: <Wifi className="w-4 h-4 text-emerald-500" />,
            });
        };
        const handleOffline = () => {
            setIsOffline(true);
            toast.error("Koneksi internet terputus. Beberapa fitur mungkin tidak tersedia.", {
                icon: <WifiOff className="w-4 h-4 text-brand-red" />,
                duration: 10000,
            });
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check initial state
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-brand-red text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-3 border border-white/20">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
                    <WifiOff className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs font-bold leading-none">Sedang Offline</p>
                    <p className="text-[10px] opacity-80 mt-1">Cek koneksi internet Anda</p>
                </div>
            </div>
        </div>
    );
}
