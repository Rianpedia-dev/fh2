"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    createPmbTrack, updatePmbTrack, deletePmbTrack,
    createPmbClass, updatePmbClass, deletePmbClass,
    createPmbTeamMember, updatePmbTeamMember, deletePmbTeamMember,
    createPmbRequirement, updatePmbRequirement, deletePmbRequirement,
    createPmbFeeCategory, updatePmbFeeCategory, deletePmbFeeCategory,
    createPmbFeeItem, updatePmbFeeItem, deletePmbFeeItem,
    uploadImageAction
} from "../actions";

interface Track { id: number; trackId: string; title: string; description: string | null; order: number; }
interface PClass { id: number; title: string; type: string; description: string | null; schedule: string | null; duration: string | null; icon: string | null; order: number; }
interface Team { id: number; name: string; role: string; phone: string; email: string; image: string | null; order: number; }
interface Requirement { id: number; studentType: string; requirement: string; order: number; }
interface FeeCategory { id: number; title: string; studentType: string; total: string | null; order: number; }
interface FeeItem { id: number; categoryId: number; label: string; amount: string; order: number; }

export default function PmbClient({
    tracks, classes, team, requirements, feeCategories, feeItems,
}: {
    tracks: Track[]; classes: PClass[]; team: Team[];
    requirements: Requirement[]; feeCategories: FeeCategory[]; feeItems: FeeItem[];
}) {
    // Track state
    const [tOpen, setTOpen] = useState(false);
    const [tEdit, setTEdit] = useState<Track | null>(null);
    // Class state
    const [cOpen, setCOpen] = useState(false);
    const [cEdit, setCEdit] = useState<PClass | null>(null);
    // Team state
    const [mOpen, setMOpen] = useState(false);
    const [mEdit, setMEdit] = useState<Team | null>(null);
    const [mFile, setMFile] = useState<File | null>(null);
    const [mUploading, setMUploading] = useState(false);
    // Requirement state
    const [rOpen, setROpen] = useState(false);
    const [rEdit, setREdit] = useState<Requirement | null>(null);
    // Fee Category state
    const [fcOpen, setFcOpen] = useState(false);
    const [fcEdit, setFcEdit] = useState<FeeCategory | null>(null);
    // Fee Item state
    const [fiOpen, setFiOpen] = useState(false);
    const [fiEdit, setFiEdit] = useState<FeeItem | null>(null);

    // ========== TRACKS ==========
    async function handleTrack(fd: FormData) {
        const p = { trackId: fd.get("trackId") as string, title: fd.get("title") as string, description: fd.get("description") as string || undefined, order: Number(fd.get("order")) || 0 };
        try { if (tEdit) { await updatePmbTrack(tEdit.id, p); toast.success("Diupdate"); } else { await createPmbTrack(p); toast.success("Ditambahkan"); } setTOpen(false); setTEdit(null); } catch { toast.error("Gagal"); }
    }
    async function delTrack(id: number) { if (!confirm("Hapus?")) return; try { await deletePmbTrack(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    // ========== CLASSES ==========
    async function handleClass(fd: FormData) {
        const p = { title: fd.get("title") as string, type: fd.get("type") as string, description: fd.get("description") as string || undefined, schedule: fd.get("schedule") as string || undefined, duration: fd.get("duration") as string || undefined, icon: fd.get("icon") as string || undefined, order: Number(fd.get("order")) || 0 };
        try { if (cEdit) { await updatePmbClass(cEdit.id, p); toast.success("Diupdate"); } else { await createPmbClass(p); toast.success("Ditambahkan"); } setCOpen(false); setCEdit(null); } catch { toast.error("Gagal"); }
    }
    async function delClass(id: number) { if (!confirm("Hapus?")) return; try { await deletePmbClass(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    // ========== TEAM ==========
    async function handleTeam(fd: FormData) {
        setMUploading(true);
        try {
            let imageUrl = mEdit?.image || "";
            if (mFile) {
                if (mFile.size > 1 * 1024 * 1024) {
                    toast.error("Ukuran foto maksimal 1MB");
                    setMUploading(false);
                    return;
                }
                const uploadFormData = new FormData();
                uploadFormData.append("file", mFile);
                uploadFormData.append("folder", "pmb");
                imageUrl = await uploadImageAction(uploadFormData);
            }

            const p = {
                name: fd.get("name") as string,
                role: fd.get("role") as string,
                phone: fd.get("phone") as string,
                email: fd.get("email") as string,
                image: imageUrl || undefined,
                order: Number(fd.get("order")) || 0
            };

            if (mEdit) {
                await updatePmbTeamMember(mEdit.id, p);
                toast.success("Diupdate");
            } else {
                await createPmbTeamMember(p);
                toast.success("Ditambahkan");
            }
            setMOpen(false);
            setMEdit(null);
            setMFile(null);
        } catch {
            toast.error("Gagal");
        } finally {
            setMUploading(false);
        }
    }
    async function delTeam(id: number) { if (!confirm("Hapus?")) return; try { await deletePmbTeamMember(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    // ========== REQUIREMENTS ==========
    async function handleReq(fd: FormData) {
        const p = { studentType: fd.get("studentType") as string, requirement: fd.get("requirement") as string, order: Number(fd.get("order")) || 0 };
        try { if (rEdit) { await updatePmbRequirement(rEdit.id, p); toast.success("Diupdate"); } else { await createPmbRequirement(p); toast.success("Ditambahkan"); } setROpen(false); setREdit(null); } catch { toast.error("Gagal"); }
    }
    async function delReq(id: number) { if (!confirm("Hapus?")) return; try { await deletePmbRequirement(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    // ========== FEE CATEGORIES ==========
    async function handleFeeCat(fd: FormData) {
        const p = { title: fd.get("title") as string, studentType: fd.get("studentType") as string, total: fd.get("total") as string || undefined, order: Number(fd.get("order")) || 0 };
        try { if (fcEdit) { await updatePmbFeeCategory(fcEdit.id, p); toast.success("Diupdate"); } else { await createPmbFeeCategory(p); toast.success("Ditambahkan"); } setFcOpen(false); setFcEdit(null); } catch { toast.error("Gagal"); }
    }
    async function delFeeCat(id: number) { if (!confirm("Hapus kategori dan semua item di dalamnya?")) return; try { await deletePmbFeeCategory(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    // ========== FEE ITEMS ==========
    async function handleFeeItem(fd: FormData) {
        const p = { categoryId: Number(fd.get("categoryId")), label: fd.get("label") as string, amount: fd.get("amount") as string, order: Number(fd.get("order")) || 0 };
        try { if (fiEdit) { await updatePmbFeeItem(fiEdit.id, p); toast.success("Diupdate"); } else { await createPmbFeeItem(p); toast.success("Ditambahkan"); } setFiOpen(false); setFiEdit(null); } catch { toast.error("Gagal"); }
    }
    async function delFeeItem(id: number) { if (!confirm("Hapus?")) return; try { await deletePmbFeeItem(id); toast.success("Dihapus"); } catch { toast.error("Gagal"); } }

    const crudBtn = (onEdit: () => void, onDelete: () => void) => (
        <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Pencil className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={onDelete}><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Kelola PMB</h1><p className="text-muted-foreground text-sm">Penerimaan Mahasiswa Baru — semua data</p></div>

            <Tabs defaultValue="tracks">
                <TabsList className="flex-wrap h-auto gap-1">
                    <TabsTrigger value="tracks">Jalur</TabsTrigger>
                    <TabsTrigger value="classes">Kelas</TabsTrigger>
                    <TabsTrigger value="fees">Biaya</TabsTrigger>
                    <TabsTrigger value="requirements">Syarat</TabsTrigger>
                    <TabsTrigger value="team">Tim PMB</TabsTrigger>
                </TabsList>

                {/* TAB: TRACKS */}
                <TabsContent value="tracks">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={tOpen} onOpenChange={(v) => { setTOpen(v); if (!v) setTEdit(null); }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Jalur</Button></DialogTrigger>
                                <DialogContent><DialogHeader><DialogTitle>{tEdit ? "Edit" : "Tambah"} Jalur</DialogTitle></DialogHeader>
                                    <form action={handleTrack} className="flex flex-col max-h-[85vh]">
                                        <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                            <div><Label>ID Jalur *</Label><Input name="trackId" required defaultValue={tEdit?.trackId} placeholder="reguler" /></div>
                                            <div><Label>Nama *</Label><Input name="title" required defaultValue={tEdit?.title} /></div>
                                            <div><Label>Deskripsi</Label><Textarea name="description" rows={2} defaultValue={tEdit?.description ?? ""} /></div>
                                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={tEdit?.order ?? 0} /></div>
                                        </div>
                                        <div className="pt-4 mt-2 border-t">
                                            <Button type="submit" className="w-full">Simpan</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nama</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>{tracks.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow> : tracks.map(t => (
                                    <TableRow key={t.id}><TableCell>{t.trackId}</TableCell><TableCell className="font-medium">{t.title}</TableCell><TableCell>{crudBtn(() => { setTEdit(t); setTOpen(true); }, () => delTrack(t.id))}</TableCell></TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: CLASSES */}
                <TabsContent value="classes">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={cOpen} onOpenChange={(v) => { setCOpen(v); if (!v) setCEdit(null); }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Kelas</Button></DialogTrigger>
                                <DialogContent><DialogHeader><DialogTitle>{cEdit ? "Edit" : "Tambah"} Kelas</DialogTitle></DialogHeader>
                                    <form action={handleClass} className="flex flex-col max-h-[85vh]">
                                        <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                            <div><Label>Nama *</Label><Input name="title" required defaultValue={cEdit?.title} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Tipe *</Label><Input name="type" required defaultValue={cEdit?.type} placeholder="reguler / karyawan" /></div>
                                                <div><Label>Icon</Label><Input name="icon" defaultValue={cEdit?.icon ?? "sun"} /></div>
                                            </div>
                                            <div><Label>Deskripsi</Label><Textarea name="description" rows={2} defaultValue={cEdit?.description ?? ""} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>Jadwal</Label><Input name="schedule" defaultValue={cEdit?.schedule ?? ""} /></div>
                                                <div><Label>Durasi</Label><Input name="duration" defaultValue={cEdit?.duration ?? ""} /></div>
                                            </div>
                                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={cEdit?.order ?? 0} /></div>
                                        </div>
                                        <div className="pt-4 mt-2 border-t">
                                            <Button type="submit" className="w-full">Simpan</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead className="hidden md:table-cell">Tipe</TableHead><TableHead className="hidden md:table-cell">Jadwal</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>{classes.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow> : classes.map(c => (
                                    <TableRow key={c.id}><TableCell className="font-medium">{c.title}</TableCell><TableCell className="hidden md:table-cell">{c.type}</TableCell><TableCell className="hidden md:table-cell">{c.schedule}</TableCell><TableCell>{crudBtn(() => { setCEdit(c); setCOpen(true); }, () => delClass(c.id))}</TableCell></TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: FEES */}
                <TabsContent value="fees">
                    <div className="space-y-6">
                        {/* Fee Categories */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Kategori Biaya</h3>
                                <Dialog open={fcOpen} onOpenChange={(v) => { setFcOpen(v); if (!v) setFcEdit(null); }}>
                                    <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-3.5 h-3.5" /> Tambah Kategori</Button></DialogTrigger>
                                    <DialogContent><DialogHeader><DialogTitle>{fcEdit ? "Edit" : "Tambah"} Kategori Biaya</DialogTitle></DialogHeader>
                                        <form action={handleFeeCat} className="flex flex-col max-h-[85vh]">
                                            <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                                <div><Label>Judul *</Label><Input name="title" required defaultValue={fcEdit?.title} /></div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>Tipe Mahasiswa *</Label><Input name="studentType" required defaultValue={fcEdit?.studentType} placeholder="murni / transisi" /></div>
                                                    <div><Label>Total</Label><Input name="total" defaultValue={fcEdit?.total ?? ""} placeholder="Rp 5.000.000" /></div>
                                                </div>
                                                <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={fcEdit?.order ?? 0} /></div>
                                            </div>
                                            <div className="pt-4 mt-2 border-t">
                                                <Button type="submit" className="w-full">Simpan</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="border rounded-xl overflow-hidden">
                                <Table><TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Tipe</TableHead><TableHead className="hidden md:table-cell">Total</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                    <TableBody>{feeCategories.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Belum ada data</TableCell></TableRow> : feeCategories.map(fc => (
                                        <TableRow key={fc.id}><TableCell className="font-medium">{fc.title}</TableCell><TableCell>{fc.studentType}</TableCell><TableCell className="hidden md:table-cell">{fc.total ?? "-"}</TableCell><TableCell>{crudBtn(() => { setFcEdit(fc); setFcOpen(true); }, () => delFeeCat(fc.id))}</TableCell></TableRow>
                                    ))}</TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Fee Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Rincian Item Biaya</h3>
                                <Dialog open={fiOpen} onOpenChange={(v) => { setFiOpen(v); if (!v) setFiEdit(null); }}>
                                    <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="w-3.5 h-3.5" /> Tambah Item</Button></DialogTrigger>
                                    <DialogContent><DialogHeader><DialogTitle>{fiEdit ? "Edit" : "Tambah"} Item Biaya</DialogTitle></DialogHeader>
                                        <form action={handleFeeItem} className="flex flex-col max-h-[85vh]">
                                            <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                                <div><Label>Kategori ID *</Label>
                                                    <select name="categoryId" required defaultValue={fiEdit?.categoryId ?? ""} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                                                        <option value="">Pilih Kategori</option>
                                                        {feeCategories.map(fc => <option key={fc.id} value={fc.id}>{fc.title} ({fc.studentType})</option>)}
                                                    </select>
                                                </div>
                                                <div><Label>Label *</Label><Input name="label" required defaultValue={fiEdit?.label} /></div>
                                                <div><Label>Jumlah *</Label><Input name="amount" required defaultValue={fiEdit?.amount} placeholder="Rp 500.000" /></div>
                                                <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={fiEdit?.order ?? 0} /></div>
                                            </div>
                                            <div className="pt-4 mt-2 border-t">
                                                <Button type="submit" className="w-full">Simpan</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="border rounded-xl overflow-hidden">
                                <Table><TableHeader><TableRow><TableHead>Label</TableHead><TableHead>Jumlah</TableHead><TableHead className="hidden md:table-cell">Kategori</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                    <TableBody>{feeItems.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Belum ada data</TableCell></TableRow> : feeItems.map(fi => (
                                        <TableRow key={fi.id}><TableCell className="font-medium">{fi.label}</TableCell><TableCell>{fi.amount}</TableCell><TableCell className="hidden md:table-cell">{feeCategories.find(fc => fc.id === fi.categoryId)?.title ?? fi.categoryId}</TableCell><TableCell>{crudBtn(() => { setFiEdit(fi); setFiOpen(true); }, () => delFeeItem(fi.id))}</TableCell></TableRow>
                                    ))}</TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: REQUIREMENTS */}
                <TabsContent value="requirements">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={rOpen} onOpenChange={(v) => { setROpen(v); if (!v) setREdit(null); }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Syarat</Button></DialogTrigger>
                                <DialogContent><DialogHeader><DialogTitle>{rEdit ? "Edit" : "Tambah"} Syarat</DialogTitle></DialogHeader>
                                    <form action={handleReq} className="flex flex-col max-h-[85vh]">
                                        <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                            <div><Label>Tipe Mahasiswa *</Label><Input name="studentType" required defaultValue={rEdit?.studentType} placeholder="murni / transisi" /></div>
                                            <div><Label>Syarat *</Label><Textarea name="requirement" rows={3} required defaultValue={rEdit?.requirement} /></div>
                                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={rEdit?.order ?? 0} /></div>
                                        </div>
                                        <div className="pt-4 mt-2 border-t">
                                            <Button type="submit" className="w-full">Simpan</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table><TableHeader><TableRow><TableHead>Tipe</TableHead><TableHead>Syarat</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>{requirements.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow> : requirements.map(r => (
                                    <TableRow key={r.id}><TableCell>{r.studentType}</TableCell><TableCell className="font-medium max-w-[300px] truncate">{r.requirement}</TableCell><TableCell>{crudBtn(() => { setREdit(r); setROpen(true); }, () => delReq(r.id))}</TableCell></TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: TEAM */}
                <TabsContent value="team">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={mOpen} onOpenChange={(v) => { setMOpen(v); if (!v) { setMEdit(null); setMFile(null); } }}>
                                <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah Anggota</Button></DialogTrigger>
                                <DialogContent><DialogHeader><DialogTitle>{mEdit ? "Edit" : "Tambah"} Anggota Tim</DialogTitle></DialogHeader>
                                    <form action={handleTeam} className="flex flex-col max-h-[85vh]">
                                        <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                            <div><Label>Nama *</Label><Input name="name" required defaultValue={mEdit?.name} /></div>
                                            <div><Label>Jabatan *</Label><Input name="role" required defaultValue={mEdit?.role} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><Label>HP *</Label><Input name="phone" required defaultValue={mEdit?.phone} pattern="^[0-9+\-\s]+$" placeholder="Hanya angka, +, -, spasi" /></div>
                                                <div><Label>Email *</Label><Input name="email" type="email" required defaultValue={mEdit?.email} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Foto {mEdit ? "(Ganti)" : ""}</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setMFile(e.target.files?.[0] || null)}
                                                    />
                                                </div>
                                                <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={mEdit?.order ?? 0} /></div>
                                            </div>
                                            {(mFile || mEdit?.image) && (
                                                <div className="mt-2 relative aspect-square w-24 mx-auto rounded-lg overflow-hidden border">
                                                    <img
                                                        src={mFile ? URL.createObjectURL(mFile) : mEdit?.image!}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 mt-2 border-t">
                                            <Button type="submit" className="w-full" disabled={mUploading}>
                                                {mUploading ? "Sedang menyimpan..." : "Simpan Anggota"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead className="hidden md:table-cell">Jabatan</TableHead><TableHead className="hidden md:table-cell">HP</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                                <TableBody>{team.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow> : team.map(m => (
                                    <TableRow key={m.id}><TableCell className="font-medium">{m.name}</TableCell><TableCell className="hidden md:table-cell">{m.role}</TableCell><TableCell className="hidden md:table-cell">{m.phone}</TableCell><TableCell>{crudBtn(() => { setMEdit(m); setMOpen(true); }, () => delTeam(m.id))}</TableCell></TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
