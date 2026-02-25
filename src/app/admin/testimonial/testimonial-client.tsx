"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { createTestimonial, updateTestimonial, deleteTestimonial, uploadImageAction } from "../actions";

interface Testimonial {
    id: number; name: string; role: string; content: string;
    image: string | null; rating: number;
}

export default function TestimonialClient({ data }: { data: Testimonial[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setUploading(true);
        try {
            let imageUrl = editing?.image || "";

            if (file) {
                if (file.size > 500 * 1024) {
                    toast.error("Ukuran foto maksimal 500KB");
                    setUploading(false);
                    return;
                }
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("folder", "testimonial");
                imageUrl = await uploadImageAction(uploadFormData);
            }

            const payload = {
                name: formData.get("name") as string,
                role: formData.get("role") as string,
                content: formData.get("content") as string,
                image: imageUrl || undefined,
                rating: Number(formData.get("rating")) || 5,
            };

            if (editing) {
                await updateTestimonial(editing.id, payload);
                toast.success("Testimonial diupdate");
            } else {
                await createTestimonial(payload);
                toast.success("Testimonial ditambahkan");
            }
            setOpen(false);
            setEditing(null);
            setFile(null);
        } catch (e) {
            toast.error("Gagal menyimpan testimonial");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin hapus testimonial ini?")) return;
        try {
            await deleteTestimonial(id);
            toast.success("Testimonial dihapus");
        } catch (e) {
            toast.error("Gagal menghapus");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">Kelola Testimonial</h1><p className="text-muted-foreground text-sm">Testimoni Alumni ({data.length})</p></div>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setFile(null); } }}>
                    <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button></DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "Tambah Testimonial"}</DialogTitle></DialogHeader>
                        <form action={handleSubmit} className="flex flex-col max-h-[85vh]">
                            <div className="flex-grow overflow-y-auto pr-4 space-y-4 py-2">
                                <div><Label>Nama *</Label><Input name="name" required defaultValue={editing?.name} /></div>
                                <div><Label>Peran / Status *</Label><Input name="role" required defaultValue={editing?.role} maxLength={100} placeholder="Alumni 2018 - Advokat" /></div>
                                <div><Label>Konten *</Label><Textarea name="content" rows={4} required defaultValue={editing?.content} maxLength={1000} placeholder="Maksimal 1000 karakter" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Foto {editing ? "(Ganti foto)" : ""}</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <div><Label>Rating (1-5)</Label><Input name="rating" type="number" min="1" max="5" defaultValue={editing?.rating ?? 5} /></div>
                                </div>
                                {(file || editing?.image) && (
                                    <div className="mt-2 relative aspect-square w-20 mx-auto rounded-full overflow-hidden border">
                                        <img
                                            src={file ? URL.createObjectURL(file) : editing?.image!}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 mt-2 border-t">
                                <Button type="submit" className="w-full" disabled={uploading}>
                                    {uploading ? "Sedang menyimpan..." : "Simpan Testimonial"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Nama</TableHead><TableHead className="hidden md:table-cell">Peran</TableHead><TableHead className="hidden md:table-cell">Rating</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {data.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>
                            : data.map((item, i) => (
                                <TableRow key={item.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{item.role}</TableCell>
                                    <TableCell className="hidden md:table-cell"><div className="flex">{Array.from({ length: item.rating }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div></TableCell>
                                    <TableCell><div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(item); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div></TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
