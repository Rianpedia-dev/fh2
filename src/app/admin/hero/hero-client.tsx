"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createHeroSlide, updateHeroSlide, deleteHeroSlide, uploadImageAction } from "../actions";

interface HeroSlide {
    id: number; imageUrl: string; order: number;
}

export default function HeroClient({ data }: { data: HeroSlide[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<HeroSlide | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setUploading(true);
        try {
            let imageUrl = editing?.imageUrl || "";

            if (file) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("folder", "hero");
                imageUrl = await uploadImageAction(uploadFormData);
            } else if (!editing && !file) {
                toast.error("Gambar wajib diisi");
                setUploading(false);
                return;
            }

            const payload = {
                imageUrl,
                order: Number(formData.get("order")) || 0,
                isActive: true, // Auto active
            };

            if (editing) {
                await updateHeroSlide(editing.id, payload);
                toast.success("Slide diupdate");
            } else {
                await createHeroSlide(payload);
                toast.success("Slide ditambahkan");
            }
            setOpen(false);
            setEditing(null);
            setFile(null);
        } catch (e) {
            toast.error("Gagal menyimpan slide");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin hapus slide ini?")) return;
        try {
            await deleteHeroSlide(id);
            toast.success("Slide dihapus");
        } catch (e) {
            toast.error("Gagal menghapus slide");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">Hero Slider</h1><p className="text-muted-foreground text-sm">Slider utama homepage ({data.length})</p></div>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setFile(null); } }}>
                    <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button></DialogTrigger>
                    <DialogContent className="max-w-lg bg-card border-brand-red/20">
                        <DialogHeader><DialogTitle>{editing ? "Edit Slide" : "Tambah Slide"}</DialogTitle></DialogHeader>
                        <form action={handleSubmit} className="flex flex-col max-h-[85vh]">
                            <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Gambar {editing ? "(Kosongkan jika tidak ingin ganti)" : "*"}</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            required={!editing}
                                            className="cursor-pointer file:bg-brand-red file:text-white file:border-0 file:rounded-md file:px-2 file:py-0.5 file:mr-2 hover:file:bg-brand-red/80 transition-all border-dashed"
                                        />
                                        {(file || editing?.imageUrl) && (
                                            <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border-2 border-brand-red/10 shadow-lg">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : editing?.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Urutan Tampil</Label>
                                        <Input
                                            name="order"
                                            type="number"
                                            defaultValue={editing?.order ?? 0}
                                            placeholder="Contoh: 1, 2, 3..."
                                            className="bg-muted/50 border-brand-red/10 focus:border-brand-red/50 transition-colors"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">* Angka lebih kecil akan muncul lebih dulu</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t">
                                <Button type="submit" className="w-full h-12 text-base font-bold bg-brand-red hover:bg-brand-red/90 shadow-[0_4px_20px_rgba(185,28,28,0.3)] transition-all active:scale-[0.98]" disabled={uploading}>
                                    {uploading ? "Sedang menyimpan..." : "Simpan Slide"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border border-brand-red/10 rounded-xl overflow-hidden shadow-xl bg-card">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-16 text-center">Urutan</TableHead>
                            <TableHead>Preview Gambar</TableHead>
                            <TableHead className="w-24 text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">Belum ada slide hero</TableCell></TableRow>
                            : [...data].sort((a, b) => a.order - b.order).map((item, i) => (
                                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="text-center font-bold text-brand-red">{item.order}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-brand-red/10 shadow-md">
                                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.imageUrl}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-center">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-brand-red/10 hover:text-brand-red transition-all" onClick={() => { setEditing(item); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-500/10 transition-all" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
