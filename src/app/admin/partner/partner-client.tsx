"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createPartner, updatePartner, deletePartner, uploadImageAction } from "../actions";

interface Partner {
    id: number; name: string; logo: string | null; url: string | null; order: number;
}

export default function PartnerClient({ data }: { data: Partner[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Partner | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setUploading(true);
        try {
            let logoUrl = editing?.logo || "";

            if (file) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("folder", "partner");
                logoUrl = await uploadImageAction(uploadFormData);
            }

            const payload = {
                name: formData.get("name") as string,
                logo: logoUrl || undefined,
                url: formData.get("url") as string || undefined,
                order: Number(formData.get("order")) || 0,
            };
            if (editing) {
                await updatePartner(editing.id, payload);
                toast.success("Partner diupdate");
            } else {
                await createPartner(payload);
                toast.success("Partner ditambahkan");
            }
            setOpen(false);
            setEditing(null);
            setFile(null);
        } catch (e) {
            toast.error("Gagal menyimpan partner");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin hapus partner ini?")) return;
        try {
            await deletePartner(id);
            toast.success("Partner dihapus");
        } catch (e) {
            toast.error("Gagal menghapus");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold">Kelola Partner</h1><p className="text-muted-foreground text-sm">Mitra &amp; Kerjasama ({data.length})</p></div>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setFile(null); } }}>
                    <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button></DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>{editing ? "Edit Partner" : "Tambah Partner"}</DialogTitle></DialogHeader>
                        <form action={handleSubmit} className="space-y-4">
                            <div><Label>Nama *</Label><Input name="name" required defaultValue={editing?.name} /></div>
                            <div className="space-y-2">
                                <Label>Logo {editing ? "(Ganti logo)" : ""}</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            {(file || editing?.logo) && (
                                <div className="mt-2 relative aspect-[3/1] w-48 mx-auto rounded-lg overflow-hidden border bg-white flex items-center justify-center p-2">
                                    <img
                                        src={file ? URL.createObjectURL(file) : editing?.logo!}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            )}
                            <div><Label>URL Website</Label><Input name="url" defaultValue={editing?.url ?? ""} /></div>
                            <div><Label>Urutan</Label><Input name="order" type="number" defaultValue={editing?.order ?? 0} /></div>
                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? "Sedang menyimpan..." : "Simpan"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Nama</TableHead><TableHead className="hidden md:table-cell">Website</TableHead><TableHead className="w-24">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {data.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>
                            : data.map((item, i) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">{item.url ?? "-"}</TableCell>
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
