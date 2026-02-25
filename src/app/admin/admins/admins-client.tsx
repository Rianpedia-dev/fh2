"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Shield,
    ShieldAlert,
    UserPlus,
    Trash2,
    Key,
    UserCog,
    CheckCircle2,
    XCircle,
    Lock
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminStatus
} from "@/lib/actions/admin-actions";

const MENU_OPTIONS = [
    { id: "berita", title: "Berita" },
    { id: "dosen", title: "Civitas" },
    { id: "galeri", title: "Galeri" },
    { id: "hero", title: "Hero Slider" },
    { id: "testimonial", title: "Testimonial" },
    { id: "partner", title: "Partner" },
    { id: "kontak", title: "Kontak" },
    { id: "pmb", title: "PMB" },
    { id: "settings", title: "Pengaturan" },
];

export default function AdminsClient({ initialData }: { initialData: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredAdmins = initialData.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleToggleStatus(id: number, currentStatus: boolean) {
        try {
            const res = await toggleAdminStatus(id, !currentStatus);
            if (res.error) toast.error(res.error);
            else toast.success("Status admin berhasil diperbarui.");
        } catch (e) {
            toast.error("Terjadi kesalahan.");
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Apakah Anda yakin ingin menghapus admin ini?")) return;
        try {
            const res = await deleteAdminUser(id);
            if (res.error) toast.error(res.error);
            else toast.success("Admin berhasil dihapus.");
        } catch (e) {
            toast.error("Terjadi kesalahan.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kelola Admin & Staf</h1>
                    <p className="text-muted-foreground">Tambah, edit, dan atur hak akses menu untuk setiap admin.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="bg-brand-red hover:bg-brand-red/90 text-white rounded-xl h-11 px-6">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tambah Admin Baru
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau email..."
                        className="pl-9 rounded-xl border-border bg-card"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Nama</TableHead>
                            <TableHead className="font-bold">Email</TableHead>
                            <TableHead className="font-bold">Peran</TableHead>
                            <TableHead className="font-bold">Izin Menu</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right font-bold">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAdmins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                                    Tidak ada data admin ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAdmins.map((admin) => {
                                const permissions = admin.permissions ? JSON.parse(admin.permissions as string) as string[] : [];

                                return (
                                    <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={admin.role === "superadmin" ? "default" : "secondary"} className="rounded-lg capitalize font-medium">
                                                {admin.role === "superadmin" ? <ShieldAlert className="mr-1 h-3 w-3" /> : <UserCog className="mr-1 h-3 w-3" />}
                                                {admin.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {admin.role === "superadmin" ? (
                                                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Semua Akses</Badge>
                                                ) : permissions.length > 0 ? (
                                                    permissions.map(p => (
                                                        <Badge key={p} variant="outline" className="text-[10px] capitalize">{p}</Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Tanpa Izin</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {admin.isActive ? (
                                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                                    <XCircle className="mr-1 h-3 w-3" /> Nonaktif
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                                                    <DropdownMenuLabel>Menu Aksi</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setEditingAdmin(admin)} className="cursor-pointer">
                                                        <UserCog className="mr-2 h-4 w-4" /> Ubah Data / Izin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                                                        className="cursor-pointer"
                                                    >
                                                        {admin.isActive ? <Lock className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                                        {admin.isActive ? "Nonaktifkan" : "Aktifkan"} Akun
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(admin.id)}
                                                        className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Permanen
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Tambah Admin */}
            <AdminFormModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Tambah Admin Baru"
            />

            {/* Modal Edit Admin */}
            {editingAdmin && (
                <AdminFormModal
                    isOpen={!!editingAdmin}
                    onClose={() => setEditingAdmin(null)}
                    admin={editingAdmin}
                    title="Edit Admin / Izin Akses"
                />
            )}
        </div>
    );
}

function AdminFormModal({ isOpen, onClose, admin, title }: { isOpen: boolean, onClose: () => void, admin?: any, title: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState<string[]>(
        admin?.permissions ? JSON.parse(admin.permissions as string) : []
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append("permissions", JSON.stringify(permissions));

        try {
            const res = admin
                ? await updateAdminUser(admin.id, formData)
                : await createAdminUser(formData);

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(admin ? "Admin diperbarui." : "Admin ditambahkan.");
                onClose();
            }
        } catch (e) {
            toast.error("Gagal memproses data.");
        } finally {
            setIsLoading(false);
        }
    }

    const togglePermission = (id: string) => {
        setPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <form onSubmit={onSubmit}>
                    <div className="bg-brand-red p-6 text-white">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                            </div>
                            <DialogDescription className="text-white/80">
                                {admin ? "Ubah informasi profil dan hak akses menu admin ini." : "Buat akun admin baru dengan hak akses yang bisa dibatasi."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-card">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" defaultValue={admin?.name} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Login</Label>
                            <Input id="email" name="email" type="email" defaultValue={admin?.email} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {admin ? "Password Baru (Kosongkan jika tidak diganti)" : "Password Login"}
                            </Label>
                            <Input id="password" name="password" type="password" required={!admin} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Peran (Role)</Label>
                            <Select name="role" defaultValue={admin?.role || "staff"}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Pilih Peran" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="staff">Staff Admin (Terbatas)</SelectItem>
                                    <SelectItem value="superadmin">Super Admin (Penuh)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-2 border-t border-border">
                            <Label className="text-sm font-bold mb-3 block">Izinkan Akses Menu (Hanya untuk Staff Admin):</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {MENU_OPTIONS.map((menu) => (
                                    <div
                                        key={menu.id}
                                        onClick={() => togglePermission(menu.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
                                            permissions.includes(menu.id)
                                                ? "bg-brand-red/5 border-brand-red/30 text-brand-red shadow-sm"
                                                : "bg-muted/30 border-border text-muted-foreground grayscale"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                            permissions.includes(menu.id) ? "bg-brand-red border-brand-red" : "bg-white border-muted-foreground/30"
                                        )}>
                                            {permissions.includes(menu.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                                        </div>
                                        <span className="text-xs font-medium">{menu.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 p-4 gap-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">Batal</Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand-red hover:bg-brand-red/90 text-white rounded-xl px-8">
                            {isLoading ? "Menyimpan..." : (admin ? "Simpan Perubahan" : "Tambah Admin")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
