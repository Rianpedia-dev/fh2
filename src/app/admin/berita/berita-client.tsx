"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadImageAction
} from "../actions";

interface Announcement {
    id: number;
    title: string;
    excerpt: string | null;
    content: string | null;
    date: string | null;
    category: string | null;
    imageUrl: string | null;
}

export default function BeritaClient({ data }: { data: Announcement[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Announcement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setUploading(true);
        try {
            let imageUrl = editing?.imageUrl || "";

            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    toast.error("Ukuran gambar maksimal 2MB");
                    setUploading(false);
                    return;
                }
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("folder", "news");
                imageUrl = await uploadImageAction(uploadFormData);
            }

            const contentField = formData.get("content") as string;
            const payload = {
                title: formData.get("title") as string,
                excerpt: contentField || undefined,
                content: contentField || undefined,
                date: formData.get("date") as string || undefined,
                category: formData.get("category") as string || undefined,
                imageUrl: imageUrl || undefined,
            };

            if (editing) {
                await updateAnnouncement(editing.id, payload);
                toast.success("Berita berhasil diupdate");
            } else {
                await createAnnouncement(payload);
                toast.success("Berita berhasil ditambahkan");
            }
            setOpen(false);
            setEditing(null);
            setFile(null);
        } catch (e) {
            toast.error("Gagal menyimpan berita");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin hapus berita ini?")) return;
        try {
            await deleteAnnouncement(id);
            toast.success("Berita berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus berita");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kelola Berita</h1>
                    <p className="text-muted-foreground text-sm">Berita & Pengumuman ({data.length})</p>
                </div>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setFile(null); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Berita" : "Tambah Berita"}</DialogTitle>
                        </DialogHeader>
                        <form action={handleSubmit} className="flex flex-col max-h-[85vh]">
                            <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                <div><Label>Judul *</Label><Input name="title" required defaultValue={editing?.title} maxLength={100} placeholder="Maksimal 100 karakter" /></div>
                                <div><Label>Konten *</Label><Textarea name="content" rows={8} required defaultValue={editing?.content ?? editing?.excerpt ?? ""} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Tanggal</Label><Input name="date" defaultValue={editing?.date ?? ""} placeholder="20 Feb 2026" /></div>
                                    <div><Label>Kategori</Label><Input name="category" defaultValue={editing?.category ?? "Berita"} /></div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gambar {editing ? "(Kosongkan jika tidak ingin ganti)" : ""}</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    {(file || editing?.imageUrl) && (
                                        <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border">
                                            <img
                                                src={file ? URL.createObjectURL(file) : editing?.imageUrl!}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t flex flex-col gap-2">
                                <Button type="submit" className="w-full" disabled={uploading}>
                                    {uploading ? "Sedang menyimpan..." : "Simpan Berita"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead className="hidden md:table-cell">Kategori</TableHead>
                            <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                            <TableHead className="w-24">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>
                        ) : data.map((item, i) => (
                            <TableRow key={item.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.date}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(item); setOpen(true); }}>
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
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
