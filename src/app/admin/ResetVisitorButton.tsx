"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetViewsAction } from "./actions";

export function ResetVisitorButton() {
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        if (!window.confirm("Apakah Anda yakin ingin mereset jumlah pengunjung menjadi nol?")) {
            return;
        }

        setLoading(true);
        try {
            await resetViewsAction();
        } catch (error) {
            console.error(error);
            alert("Gagal mereset jumlah pengunjung");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            onClick={handleReset}
            disabled={loading}
            title="Reset Jumlah Pengunjung"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
    );
}
