"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    upsertContactInfo,
    createSocialMedia, updateSocialMedia, deleteSocialMedia,
    createCampusAccess, updateCampusAccess, deleteCampusAccess,
} from "../actions";

interface ContactInfoMap {
    name: string; address: string; city: string; province: string; postalCode: string;
    phone: string; fax: string; email: string; website: string; operatingHours: string; mapUrl: string;
}
interface SocialMediaItem { id: number; platform: string; url: string; username: string | null; icon: string | null; order: number; }
interface CampusAccessItem { id: number; name: string; description: string; icon: string | null; order: number; }

export default function KontakClient({
    contactInfo, socialMedia, campusAccess,
}: {
    contactInfo: ContactInfoMap;
    socialMedia: SocialMediaItem[];
    campusAccess: CampusAccessItem[];
}) {
    const [smOpen, setSmOpen] = useState(false);
    const [smEditing, setSmEditing] = useState<SocialMediaItem | null>(null);
    const [caOpen, setCaOpen] = useState(false);
    const [caEditing, setCaEditing] = useState<CampusAccessItem | null>(null);

    async function handleContactSubmit(formData: FormData) {
        try {
            const fields = ["name", "address", "city", "province", "postalCode", "phone", "fax", "email", "website", "operatingHours", "mapUrl"];
            for (const field of fields) {
                const value = formData.get(field) as string;
                if (value !== undefined) await upsertContactInfo(field, value);
            }
            toast.success("Info kontak berhasil disimpan");
        } catch (e) { toast.error("Gagal menyimpan info kontak"); }
    }

    async function handleSmSubmit(formData: FormData) {
        const payload = {
            platform: formData.get("platform") as string,
            url: formData.get("url") as string,
            username: formData.get("username") as string || undefined,
            icon: formData.get("icon") as string || undefined,
            order: Number(formData.get("order")) || 0,
        };
        try {
            if (smEditing) { await updateSocialMedia(smEditing.id, payload); toast.success("Media sosial diupdate"); }
            else { await createSocialMedia(payload); toast.success("Media sosial ditambahkan"); }
            setSmOpen(false); setSmEditing(null);
        } catch (e) { toast.error("Gagal menyimpan"); }
    }

    async function handleSmDelete(id: number) {
        if (!confirm("Yakin hapus?")) return;
        try { await deleteSocialMedia(id); toast.success("Dihapus"); } catch (e) { toast.error("Gagal menghapus"); }
    }

    async function handleCaSubmit(formData: FormData) {
        const payload = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            icon: formData.get("icon") as string || undefined,
            order: Number(formData.get("order")) || 0,
        };
        try {
            if (caEditing) { await updateCampusAccess(caEditing.id, payload); toast.success("Akses kampus diupdate"); }
            else { await createCampusAccess(payload); toast.success("Akses kampus ditambahkan"); }
            setCaOpen(false); setCaEditing(null);
        } catch (e) { toast.error("Gagal menyimpan"); }
    }

    async function handleCaDelete(id: number) {
        if (!confirm("Yakin hapus?")) return;
        try { await deleteCampusAccess(id); toast.success("Dihapus"); } catch (e) { toast.error("Gagal menghapus"); }
    }

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Kelola Kontak</h1><p className="text-muted-foreground text-sm">Info kontak, media sosial, dan aksesibilitas kampus</p></div>

            <Tabs defaultValue="info">
                <TabsList><TabsTrigger value="info">Info Kontak</TabsTrigger><TabsTrigger value="sosmed">Media Sosial</TabsTrigger><TabsTrigger value="akses">Akses Kampus</TabsTrigger></TabsList>

                {/* TAB 1: Contact Info */}
                <TabsContent value="info">
                    <Card>
                        <CardHeader><CardTitle>Informasi Kontak</CardTitle></CardHeader>
                        <CardContent>
                            <form action={handleContactSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Nama Institusi</Label><Input name="name" defaultValue={contactInfo.name} /></div>
                                    <div><Label>Email</Label><Input name="email" defaultValue={contactInfo.email} /></div>
                                </div>
                                <div><Label>Alamat</Label><Textarea name="address" rows={2} defaultValue={contactInfo.address} /></div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Kota</Label><Input name="city" defaultValue={contactInfo.city} /></div>
                                    <div><Label>Provinsi</Label><Input name="province" defaultValue={contactInfo.province} /></div>
                                    <div><Label>Kode Pos</Label><Input name="postalCode" defaultValue={contactInfo.postalCode} /></div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Telepon</Label><Input name="phone" defaultValue={contactInfo.phone} /></div>
                                    <div><Label>Fax</Label><Input name="fax" defaultValue={contactInfo.fax} /></div>
                                    <div><Label>Website</Label><Input name="website" defaultValue={contactInfo.website} /></div>
                                </div>
                                <div><Label>Jam Operasional</Label><Input name="operatingHours" defaultValue={contactInfo.operatingHours} /></div>
                                <div><Label>URL Embed Peta</Label><Textarea name="mapUrl" rows={2} defaultValue={contactInfo.mapUrl} /></div>
                                <Button type="submit" className="gap-2"><Save className="w-4 h-4" /> Simpan</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: Social Media */}
                <TabsContent value="sosmed">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={smOpen} onOpenChange={(v) => { setSmOpen(v); if (!v) setSmEditing(null); }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>{smEditing ? "Edit" : "Tambah"} Media Sosial</DialogTitle></DialogHeader>
                                    <form action={handleSmSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label>Platform *</Label><Input name="platform" required defaultValue={smEditing?.platform} placeholder="Instagram" /></div>
                                            <div><Label>Icon</Label><Input name="icon" defaultValue={smEditing?.icon ?? ""} placeholder="instagram" /></div>
                                        </div>
                                        <div><Label>URL *</Label><Input name="url" required defaultValue={smEditing?.url} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label>Username</Label><Input name="username" defaultValue={smEditing?.username ?? ""} /></div>
                                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={smEditing?.order ?? 0} /></div>
                                        </div>
                                        <Button type="submit" className="w-full">Simpan</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table>
                                <TableHeader><TableRow><TableHead>Platform</TableHead><TableHead className="hidden md:table-cell">URL</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {socialMedia.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>
                                        : socialMedia.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.platform}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[250px] truncate">{item.url}</TableCell>
                                                <TableCell><div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSmEditing(item); setSmOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleSmDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                                </div></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 3: Campus Access */}
                <TabsContent value="akses">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={caOpen} onOpenChange={(v) => { setCaOpen(v); if (!v) setCaEditing(null); }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>{caEditing ? "Edit" : "Tambah"} Akses Kampus</DialogTitle></DialogHeader>
                                    <form action={handleCaSubmit} className="space-y-4">
                                        <div><Label>Nama *</Label><Input name="name" required defaultValue={caEditing?.name} placeholder="Angkutan Kota" /></div>
                                        <div><Label>Deskripsi *</Label><Textarea name="description" rows={3} required defaultValue={caEditing?.description} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label>Icon</Label><Input name="icon" defaultValue={caEditing?.icon ?? ""} placeholder="bus" /></div>
                                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={caEditing?.order ?? 0} /></div>
                                        </div>
                                        <Button type="submit" className="w-full">Simpan</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table>
                                <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead className="hidden md:table-cell">Deskripsi</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {campusAccess.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>
                                        : campusAccess.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[300px] truncate">{item.description}</TableCell>
                                                <TableCell><div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCaEditing(item); setCaOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleCaDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                                </div></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
