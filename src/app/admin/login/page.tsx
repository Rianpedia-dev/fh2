"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, ShieldCheck, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-navy/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-[450px] relative z-10">
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-20 h-20 mb-4 group">
                        <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-xl group-hover:bg-brand-red/30 transition-all duration-500"></div>
                        <Image
                            src="/logofh.png"
                            alt="Logo FH UNPAL"
                            fill
                            className="object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center justify-center gap-2">
                            PANEL <span className="text-brand-red">ADMIN</span>
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-1">
                            Fakultas Hukum Universitas Palembang
                        </p>
                    </div>
                </div>

                <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-brand-red via-brand-red/80 to-brand-navy" />

                    <CardHeader className="space-y-1 pt-8">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Lock className="w-5 h-5 text-brand-red" />
                            Security Login
                        </CardTitle>
                        <CardDescription>
                            Gunakan kredensial administrator anda untuk melanjutkan.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground/70">Email Access</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-brand-red transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@fhunpal.ac.id"
                                        required
                                        className="pl-10 h-11 bg-muted/30 border-border/50 focus:border-brand-red/50 focus:ring-brand-red/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground/70">Encrypted Password</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50 group-focus-within:text-brand-red transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="pl-10 h-11 bg-muted/30 border-border/50 focus:border-brand-red/50 focus:ring-brand-red/10 transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pb-8 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-11 bg-brand-red hover:bg-brand-red/90 text-white font-bold transition-all duration-300 shadow-lg shadow-brand-red/20 group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Authorized Access
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        System Secure
                    </div>
                    <div className="w-px h-3 bg-border/50"></div>
                    <div suppressHydrationWarning>FH UNPAL &copy; {new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    );
}
