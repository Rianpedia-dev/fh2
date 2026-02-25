import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

// ============================================================
// 1. ANNOUNCEMENTS (Berita & Pengumuman)
// ============================================================
export const announcements = pgTable("announcements", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    date: varchar("date", { length: 50 }),
    category: varchar("category", { length: 100 }).default("Berita"),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================
// 2. LECTURERS (Dosen)
// ============================================================
export const lecturers = pgTable("lecturers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nidn: varchar("nidn", { length: 50 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    specialization: varchar("specialization", { length: 500 }).notNull(),
    education: varchar("education", { length: 500 }).notNull(),
    email: varchar("email", { length: 255 }),
    imageUrl: varchar("image_url", { length: 500 }),
});

// ============================================================
// 3. STAFF (Tenaga Kependidikan)
// ============================================================
export const staff = pgTable("staff", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
});

// ============================================================
// 4. ORGANIZATIONS (Organisasi Mahasiswa)
// ============================================================
export const organizations = pgTable("organizations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: varchar("image_url", { length: 500 }),
});

// ============================================================
// 5. GALLERY (Galeri Media)
// ============================================================
export const gallery = pgTable("gallery", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    filePath: varchar("file_path", { length: 500 }).notNull(),
    thumbnailPath: varchar("thumbnail_path", { length: 500 }),
    mediaType: varchar("media_type", { length: 20 }).notNull().default("image"),
    categoryName: varchar("category_name", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================
// 6. HERO SLIDES (Slider Homepage)
// ============================================================
export const heroSlides = pgTable("hero_slides", {
    id: serial("id").primaryKey(),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    title: varchar("title", { length: 500 }),
    subtitle: text("subtitle"),
    buttonText: varchar("button_text", { length: 100 }),
    buttonLink: varchar("button_link", { length: 500 }),
    order: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
});

// ============================================================
// 7. PMB TIMELINE
// ============================================================
export const pmbTimeline = pgTable("pmb_timeline", {
    id: serial("id").primaryKey(),
    step: integer("step").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    date: varchar("date", { length: 100 }),
});

// ============================================================
// 8. TUITION FEES (Biaya Kuliah Umum)
// ============================================================
export const tuitionFees = pgTable("tuition_fees", {
    id: serial("id").primaryKey(),
    category: varchar("category", { length: 100 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 100 }).notNull(),
    description: text("description"),
});

// ============================================================
// 9. PROFILE (Profil Fakultas — Key-Value)
// ============================================================
export const profile = pgTable("profile", {
    id: serial("id").primaryKey(),
    key: varchar("profile_key", { length: 191 }).notNull().unique(),
    value: text("profile_value").notNull(),
});

// ============================================================
// 10. SITE CONFIG (Konfigurasi Situs — Key-Value)
// ============================================================
export const siteConfig = pgTable("site_config", {
    id: serial("id").primaryKey(),
    key: varchar("config_key", { length: 191 }).notNull().unique(),
    value: text("config_value").notNull(),
});

// ============================================================
// 11. SITE STATS (Statistik Pengunjung)
// ============================================================
export const siteStats = pgTable("site_stats", {
    id: serial("id").primaryKey(),
    views: integer("views").notNull().default(0),
});

// ============================================================
// 12. TESTIMONIALS (Testimoni Alumni)
// ============================================================
export const testimonials = pgTable("testimonials", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    content: text("content").notNull(),
    image: varchar("image", { length: 500 }),
    rating: integer("rating").notNull().default(5),
    createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================
// 13. PARTNERS (Mitra / Kerjasama)
// ============================================================
export const partners = pgTable("partners", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    logo: varchar("logo", { length: 500 }),
    url: varchar("url", { length: 500 }),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 14. CONTACT INFO (Info Kontak — Key-Value)
// ============================================================
export const contactInfo = pgTable("contact_info", {
    id: serial("id").primaryKey(),
    key: varchar("contact_key", { length: 191 }).notNull().unique(),
    value: text("contact_value").notNull(),
});

// ============================================================
// 15. SOCIAL MEDIA (Media Sosial)
// ============================================================
export const socialMedia = pgTable("social_media", {
    id: serial("id").primaryKey(),
    platform: varchar("platform", { length: 100 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    username: varchar("username", { length: 255 }),
    icon: varchar("icon", { length: 50 }),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 16. CAMPUS ACCESS (Aksesibilitas Kampus)
// ============================================================
export const campusAccess = pgTable("campus_access", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 50 }),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 17. PMB TRACKS (Jalur Pendaftaran)
// ============================================================
export const pmbTracks = pgTable("pmb_tracks", {
    id: serial("id").primaryKey(),
    trackId: varchar("track_id", { length: 50 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 18. PMB CLASSES (Jenis Kelas)
// ============================================================
export const pmbClasses = pgTable("pmb_classes", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    description: text("description"),
    schedule: varchar("schedule", { length: 255 }),
    duration: varchar("duration", { length: 100 }),
    icon: varchar("icon", { length: 50 }).default("sun"),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 19. PMB FEE CATEGORIES (Kategori Biaya PMB)
// ============================================================
export const pmbFeeCategories = pgTable("pmb_fee_categories", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    studentType: varchar("student_type", { length: 50 }).notNull(),
    total: varchar("total", { length: 100 }),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 20. PMB FEE ITEMS (Rincian Item Biaya PMB)
// ============================================================
export const pmbFeeItems = pgTable("pmb_fee_items", {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id").notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 100 }).notNull(),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 21. PMB REQUIREMENTS (Syarat Pendaftaran)
// ============================================================
export const pmbRequirements = pgTable("pmb_requirements", {
    id: serial("id").primaryKey(),
    studentType: varchar("student_type", { length: 50 }).notNull(),
    requirement: text("requirement").notNull(),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 22. PMB TEAM (Tim PMB)
// ============================================================
export const pmbTeam = pgTable("pmb_team", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    image: varchar("image", { length: 500 }),
    order: integer("display_order").notNull().default(0),
});

// ============================================================
// 23. ADMIN USERS (Pengguna Panel Admin)
// ============================================================
export const adminUsers = pgTable("admin_users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 191 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(), // Hashed
    role: varchar("role", { length: 50 }).notNull().default("staff"), // superadmin, staff
    permissions: text("permissions"), // JSON string array of allowed menu slugs
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
});
