import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
    let status = "Checking...";
    let dbInfo = "";
    let sampleData = "";

    try {
        // Cek koneksi dan ambil info user/host saat ini dari MySQL
        const [info]: any = await db.execute(sql`SELECT USER() as user, DATABASE() as db`);
        dbInfo = JSON.stringify(info, null, 2);
        status = "✅ Connected to Database";

        // Cek satu contoh data dari tabel profile yang benar
        try {
            const [data]: any = await db.execute(sql`SELECT * FROM profile LIMIT 1`);
            sampleData = JSON.stringify(data, null, 2);

            // Tambahan: Cek jumlah tabel
            const [tables]: any = await db.execute(sql`SHOW TABLES`);
            status += ` (${tables.length} Tables Detected)`;
        } catch (dataErr: any) {
            sampleData = "Gagal mengambil data contoh: " + dataErr.message;
        }

    } catch (e: any) {
        status = "❌ Connection Failed";
        dbInfo = JSON.stringify({
            message: e.message,
            code: e.code,
            errno: e.errno,
            syscall: e.syscall,
            hostname: e.hostname
        }, null, 2);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Database Debugger</h1>
            <hr />
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Current Env DATABASE_URL:</strong> {process.env.DATABASE_URL ? "Defined (Hidden for safety)" : "NOT DEFINED"}</p>
            <p><strong>DB Connection Info:</strong></p>
            <pre style={{ background: '#f4f4f4', padding: '10px' }}>{dbInfo}</pre>
            <p><strong>Sample Row from profile:</strong></p>
            <pre style={{ background: '#f4f4f4', padding: '10px' }}>{sampleData}</pre>
            <hr />
            <p>Jika info di atas tidak sesuai dengan kredensial baru Anda, berarti Hostinger masih menggunakan cache env lama.</p>
        </div>
    );
}
