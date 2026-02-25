"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { upsertSiteConfig, upsertProfile, uploadImageAction } from "../actions";
import { useState } from "react";

interface SiteConfig {
    name: string; university: string; shortName: string; description: string;
    address: string; phone: string; email: string; logo?: string;
    socialMedia: { instagram: string; facebook: string; youtube: string; };
    mapUrl: string;
}

interface ProfileData {
    sejarah: string; visi: string; misi: string[];
    tujuan: string; motto: string;
    akreditasi: { grade: string; sk: string; validUntil: string; description: string; };
    dekanName: string;
    sambutan: string; dekanImage?: string;
    stats: { students: string; studyPrograms: string; partners: string; yearsStanding: string; successfulAlumni: string; };
}

export default function SettingsClient({
    siteConfig, profile,
}: {
    siteConfig: SiteConfig;
    profile: ProfileData;
}) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [dekanFile, setDekanFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSiteConfig(formData: FormData) {
        setSaving(true);
        try {
            // Upload logo if selected
            if (logoFile) {
                const uploadFd = new FormData();
                uploadFd.append("file", logoFile);
                uploadFd.append("folder", "site");
                const logoUrl = await uploadImageAction(uploadFd);
                await upsertSiteConfig("logo", logoUrl);
                setLogoFile(null);
            }

            const fields = ["name", "university", "shortName", "description", "address", "phone", "email", "instagram", "facebook", "youtube", "mapUrl"];
            for (const key of fields) {
                const value = formData.get(key) as string ?? "";
                await upsertSiteConfig(key, value);
            }
            toast.success("Konfigurasi situs berhasil disimpan");
        } catch (e) {
            toast.error("Gagal menyimpan");
        } finally {
            setSaving(false);
        }
    }

    async function handleProfile(formData: FormData) {
        setSaving(true);
        try {
            // Upload foto dekan if selected
            if (dekanFile) {
                const uploadFd = new FormData();
                uploadFd.append("file", dekanFile);
                uploadFd.append("folder", "profile");
                const dekanUrl = await uploadImageAction(uploadFd);
                await upsertProfile("dekan_image", dekanUrl);
                setDekanFile(null);
            }

            const profileFields = ["sejarah", "visi", "tujuan", "motto", "dekan_name", "akreditasi_grade", "akreditasi_sk", "akreditasi_validUntil", "akreditasi_description", "sambutan", "stats_students", "stats_study_programs", "stats_partners", "stats_years", "stats_alumni"];
            for (const key of profileFields) {
                const value = formData.get(key) as string ?? "";
                // Handle stats fields with default "0"
                if (key.startsWith("stats_")) {
                    await upsertProfile(key, value || "0");
                } else {
                    await upsertProfile(key, value);
                }
            }

            // Misi as JSON array
            const misiText = formData.get("misi") as string ?? "";
            const misiArray = misiText.split("\n").filter(s => s.trim());
            await upsertProfile("misi", JSON.stringify(misiArray));

            toast.success("Profil berhasil disimpan");
        } catch (e) {
            toast.error("Gagal menyimpan profil");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Pengaturan</h1><p className="text-muted-foreground text-sm">Pengaturan situs dan profil fakultas</p></div>

            <Tabs defaultValue="site">
                <TabsList><TabsTrigger value="site">Konfigurasi Situs</TabsTrigger><TabsTrigger value="profile">Profil Fakultas</TabsTrigger></TabsList>

                {/* TAB: Site Config */}
                <TabsContent value="site">
                    <Card>
                        <CardHeader><CardTitle>Konfigurasi Website</CardTitle></CardHeader>
                        <CardContent>
                            <form action={handleSiteConfig} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-8 mb-6 p-4 border rounded-xl bg-muted/30">
                                    <div className="space-y-4">
                                        <Label className="text-base">Logo Website</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-24 rounded-lg border bg-background overflow-hidden flex items-center justify-center p-2">
                                                {logoFile ? (
                                                    <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                                ) : siteConfig.logo ? (
                                                    <img src={siteConfig.logo} alt="Current Logo" className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                                />
                                                <p className="text-xs text-muted-foreground">Format PNG, JPG atau SVG. Maks 2MB.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Nama</Label><Input name="name" defaultValue={siteConfig.name} /></div>
                                    <div><Label>Universitas</Label><Input name="university" defaultValue={siteConfig.university} /></div>
                                    <div><Label>Singkatan</Label><Input name="shortName" defaultValue={siteConfig.shortName} /></div>
                                </div>
                                <div><Label>Deskripsi</Label><Textarea name="description" rows={3} defaultValue={siteConfig.description} /></div>
                                <div><Label>Alamat</Label><Textarea name="address" rows={2} defaultValue={siteConfig.address} /></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Telepon</Label><Input name="phone" defaultValue={siteConfig.phone} /></div>
                                    <div><Label>Email</Label><Input name="email" defaultValue={siteConfig.email} /></div>
                                </div>
                                <h4 className="font-semibold text-sm mt-4">Media Sosial</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Instagram</Label><Input name="instagram" defaultValue={siteConfig.socialMedia.instagram} /></div>
                                    <div><Label>Facebook</Label><Input name="facebook" defaultValue={siteConfig.socialMedia.facebook} /></div>
                                    <div><Label>YouTube</Label><Input name="youtube" defaultValue={siteConfig.socialMedia.youtube} /></div>
                                </div>
                                <h4 className="font-semibold text-sm mt-4">Integrasi Peta</h4>
                                <div className="space-y-2">
                                    <Label>Google Maps Embed URL</Label>
                                    <Input
                                        name="mapUrl"
                                        defaultValue={siteConfig.mapUrl}
                                        placeholder="https://www.google.com/maps/embed?..."
                                        className={siteConfig.mapUrl && !siteConfig.mapUrl.includes("/embed") ? "border-red-500 bg-red-50" : ""}
                                    />
                                    <div className="text-[10px] space-y-1">
                                        <p className="text-muted-foreground">
                                            Masukkan URL dari menu <span className="font-semibold">Share &gt; Embed a map</span> di Google Maps.
                                        </p>
                                        {siteConfig.mapUrl && !siteConfig.mapUrl.includes("/embed") && (
                                            <p className="text-red-500 font-medium">
                                                ⚠️ Peringatan: URL yang Anda masukkan sepertinya bukan URL Embed. Peta tidak akan muncul jika menggunakan URL biasa.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" className="gap-2" disabled={saving}>
                                    {saving ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: Profile */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader><CardTitle>Profil Fakultas</CardTitle></CardHeader>
                        <CardContent>
                            <form action={handleProfile} className="space-y-6">
                                <div><Label>Sejarah</Label><Textarea name="sejarah" rows={5} defaultValue={profile.sejarah} /></div>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <Label>Foto Dekan</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 h-32 rounded-full border bg-muted overflow-hidden flex items-center justify-center">
                                                {dekanFile ? (
                                                    <img src={URL.createObjectURL(dekanFile)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : profile.dekanImage ? (
                                                    <img src={profile.dekanImage} alt="Dekan" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-12 h-12 text-muted-foreground/30" />
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setDekanFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Visi</Label>
                                        <Textarea name="visi" rows={4} defaultValue={profile.visi} />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nama Dekan</Label>
                                        <Input name="dekan_name" defaultValue={profile.dekanName} placeholder="Contoh: Dr. Ali Dahwir, S.H., M.H." />
                                    </div>
                                </div>
                                <div><Label>Sambutan Dekan</Label><Textarea name="sambutan" rows={5} defaultValue={profile.sambutan} /></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Tujuan</Label><Textarea name="tujuan" rows={5} defaultValue={profile.tujuan} placeholder="Masukkan tujuan fakultas/universitas..." /></div>
                                    <div><Label>Motto Fakultas</Label><Textarea name="motto" rows={5} defaultValue={profile.motto} placeholder="Masukkan motto fakultas..." /></div>
                                </div>

                                <h4 className="font-semibold">Statistik Kampus (Halaman Profil)</h4>
                                <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-xl bg-muted/30">
                                    <div><Label>Total Mahasiswa</Label><Input type="number" name="stats_students" defaultValue={profile.stats.students} /></div>
                                    <div><Label>Total Program Studi</Label><Input type="number" name="stats_study_programs" defaultValue={profile.stats.studyPrograms} /></div>
                                    <div><Label>Mitra Industri</Label><Input type="number" name="stats_partners" defaultValue={profile.stats.partners} /></div>
                                    <div><Label>Tahun Berdiri</Label><Input type="number" name="stats_years" defaultValue={profile.stats.yearsStanding} /></div>
                                    <div><Label>Alumni Sukses</Label><Input type="number" name="stats_alumni" defaultValue={profile.stats.successfulAlumni} /></div>
                                </div>

                                <div><Label>Misi (satu per baris)</Label><Textarea name="misi" rows={6} defaultValue={profile.misi.join("\n")} /></div>

                                <h4 className="font-semibold">Akreditasi</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Grade</Label><Input name="akreditasi_grade" defaultValue={profile.akreditasi.grade} /></div>
                                    <div><Label>SK</Label><Input name="akreditasi_sk" defaultValue={profile.akreditasi.sk} /></div>
                                    <div><Label>Berlaku Sampai</Label><Input name="akreditasi_validUntil" defaultValue={profile.akreditasi.validUntil} /></div>
                                </div>
                                <div><Label>Deskripsi Akreditasi</Label><Textarea name="akreditasi_description" rows={2} defaultValue={profile.akreditasi.description} /></div>

                                <Button type="submit" className="gap-2" disabled={saving}>
                                    {saving ? "Menyimpan..." : <><Save className="w-4 h-4" /> Simpan</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
