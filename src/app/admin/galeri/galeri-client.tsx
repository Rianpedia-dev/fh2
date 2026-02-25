"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem, uploadImageAction } from "../actions";

interface GalleryItem {
    id: number;
    title: string;
    description: string | null;
    filePath: string;
    thumbnailPath: string | null;
    mediaType: string;
    categoryName: string | null;
}

export default function GaleriClient({ data }: { data: GalleryItem[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [mediaType, setMediaType] = useState<string>("image");

    async function handleSubmit(formData: FormData) {
        setUploading(true);
        try {
            let filePath = editing?.filePath || "";
            let thumbnailPath = editing?.thumbnailPath || "";

            if (mediaType === 'image') {
                if (file) {
                    if (file.size > 3 * 1024 * 1024) {
                        toast.error("Ukuran gambar maksimal 3MB");
                        setUploading(false);
                        return;
                    }
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", file);
                    uploadFormData.append("folder", "galeri");
                    filePath = await uploadImageAction(uploadFormData);
                } else if (!editing) {
                    toast.error("File gambar wajib diisi");
                    setUploading(false);
                    return;
                }
            } else {
                filePath = formData.get("filePath") as string || filePath;
                if (!filePath && !editing) {
                    toast.error("URL Video wajib diisi");
                    setUploading(false);
                    return;
                }
                if (filePath && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(filePath)) {
                    toast.error("Format URL YouTube tidak valid");
                    setUploading(false);
                    return;
                }
            }

            if (thumbFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", thumbFile);
                uploadFormData.append("folder", "galeri");
                thumbnailPath = await uploadImageAction(uploadFormData);
            }

            const payload = {
                title: formData.get("title") as string,
                filePath: filePath,
                thumbnailPath: thumbnailPath || undefined,
                mediaType: mediaType,
                categoryName: formData.get("categoryName") as string || undefined,
            };

            if (editing) {
                await updateGalleryItem(editing.id, payload);
                toast.success("Galeri berhasil diupdate");
            } else {
                await createGalleryItem(payload);
                toast.success("Galeri berhasil ditambahkan");
            }
            setOpen(false);
            setEditing(null);
            setFile(null);
            setThumbFile(null);
            setMediaType("image");
        } catch (e) {
            toast.error("Gagal menyimpan galeri");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Yakin hapus item galeri ini?")) return;
        try {
            await deleteGalleryItem(id);
            toast.success("Item galeri berhasil dihapus");
        } catch (e) {
            toast.error("Gagal menghapus item galeri");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kelola Galeri</h1>
                    <p className="text-muted-foreground text-sm">Foto &amp; Video ({data.length})</p>
                </div>
                <Dialog open={open} onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) {
                        setEditing(null);
                        setFile(null);
                        setThumbFile(null);
                        setMediaType("image");
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Tambah</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-brand-red/20 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {editing ? <Pencil className="w-5 h-5 text-brand-red" /> : <Plus className="w-5 h-5 text-brand-red" />}
                                {editing ? "Edit Galeri" : "Tambah Galeri"}
                            </DialogTitle>
                        </DialogHeader>
                        <form action={handleSubmit} className="flex flex-col max-h-[85vh]">
                            <div className="flex-grow overflow-y-auto pr-4 space-y-6 py-2">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tipe Media</Label>
                                            <Select
                                                value={mediaType}
                                                onValueChange={(v) => setMediaType(v)}
                                            >
                                                <SelectTrigger className="bg-muted/50 border-brand-red/10 focus:border-brand-red/50 transition-colors">
                                                    <SelectValue placeholder="Pilih tipe" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="image">
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon className="w-4 h-4" />
                                                            <span>Image (Foto)</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="video">
                                                        <div className="flex items-center gap-2">
                                                            <VideoIcon className="w-4 h-4" />
                                                            <span>Video (YouTube)</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kategori</Label>
                                            <Input
                                                name="categoryName"
                                                defaultValue={editing?.categoryName ?? ""}
                                                placeholder="Contoh: Kegiatan, Fasilitas"
                                                className="bg-muted/50 border-brand-red/10 focus:border-brand-red/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Judul *</Label>
                                        <Input
                                            name="title"
                                            required
                                            defaultValue={editing?.title}
                                            placeholder="Masukkan judul galeri"
                                            className="bg-muted/50 border-brand-red/10 focus:border-brand-red/50 transition-colors"
                                        />
                                    </div>


                                    <div className="p-4 rounded-xl bg-muted/30 border border-brand-red/5">
                                        <div className="space-y-3">
                                            {mediaType === 'image' ? (
                                                <>
                                                    <Label className="flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-brand-red" />
                                                        Upload Gambar {editing ? "(Ganti)" : "*"}
                                                    </Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                        className="cursor-pointer file:bg-brand-red file:text-white file:border-0 file:rounded-md file:px-2 file:py-0.5 file:mr-2 hover:file:bg-brand-red/80 transition-all border-dashed"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <Label className="flex items-center gap-2">
                                                        <VideoIcon className="w-4 h-4 text-brand-red" />
                                                        URL Video (YouTube) *
                                                    </Label>
                                                    <Input
                                                        name="filePath"
                                                        defaultValue={editing?.filePath}
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                        className="bg-background border-brand-red/10 focus:border-brand-red/50 transition-colors"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {(file || (editing?.filePath && mediaType === 'image')) && (
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preview Utama</Label>
                                            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-brand-red/10 shadow-lg group/preview">
                                                <img
                                                    src={file ? URL.createObjectURL(file) : editing?.filePath!}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t">
                                <Button type="submit" className="w-full h-12 text-base font-bold bg-brand-red hover:bg-brand-red/90 shadow-[0_4px_20px_rgba(185,28,28,0.3)] transition-all active:scale-[0.98]" disabled={uploading}>
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Menyimpan...</span>
                                        </div>
                                    ) : (editing ? "Simpan Perubahan" : "Simpan Galeri")}
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
                            <TableHead className="hidden md:table-cell">Tipe</TableHead>
                            <TableHead className="hidden md:table-cell">Kategori</TableHead>
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
                                <TableCell className="hidden md:table-cell">{item.mediaType}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.categoryName ?? "-"}</TableCell>
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
