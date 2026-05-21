# Sambat - Planning System

## 1. Ringkasan Produk

Sambat adalah sistem pengaduan masyarakat Kabupaten Madiun berbasis AI yang menerima laporan dari WhatsApp, Telegram, dan dashboard web. Sistem membantu mengklasifikasikan aduan, meneruskan laporan ke dinas terkait, memantau tindak lanjut, serta menampilkan progres secara realtime kepada publik.

## 2. Tujuan Utama

- Memudahkan masyarakat mengirim aduan melalui kanal yang familiar.
- Mempercepat klasifikasi dan distribusi aduan ke dinas terkait.
- Mengurangi proses manual pada penerimaan laporan awal.
- Menyediakan monitoring aduan terpusat untuk admin.
- Meningkatkan transparansi status dan tindak lanjut aduan.

## 3. Aktor Sistem

| Aktor | Kebutuhan Utama |
| --- | --- |
| Masyarakat | Mengirim aduan, melampirkan bukti, menerima status, melihat progres publik |
| Superadmin | Mengelola aduan, dinas, admin, kanal integrasi, monitoring sistem |
| Admin Dinas | Menangani aduan dinas, memperbarui status, membuat tindak lanjut |
| AI Worker | Mengklasifikasikan, meringkas, menentukan prioritas, membuat respon awal |

## 4. Kanal dan Dashboard

### Kanal Aduan

- WhatsApp melalui Baileys.
- Telegram Bot melalui Telegraf.
- Form atau dashboard web.

### Dashboard

- Public dashboard: feed aduan, status, filter, pencarian, statistik, peta, dan riwayat tindak lanjut publik.
- Superadmin dashboard: CRUD aduan, user admin, dinas, monitoring AI, worker, sesi WhatsApp, Telegram, analytics, dan audit log.
- Agency dashboard: daftar aduan dinas, update status, tanggapan, bukti tindak lanjut, SLA, statistik, dan notifikasi progres ke pelapor.

## 5. Alur Inti Aduan

1. Pelapor mengirim aduan dari WhatsApp, Telegram, atau web.
2. Gateway menerima pesan dan attachment gambar.
3. Aduan masuk queue untuk diproses asynchronous.
4. AI menghasilkan kategori, dinas tujuan, prioritas, ringkasan, dan respon awal.
5. Sistem menyimpan aduan dan log proses ke database.
6. Pelapor menerima konfirmasi awal.
7. Dashboard menerima update realtime.
8. Admin dinas memproses aduan dan membuat tindak lanjut.
9. Pelapor dan public dashboard menerima update sesuai aturan publikasi.

## 6. Fitur Inti

### Complaint Management

- CRUD aduan.
- Status dan tracking aduan.
- Multi attachment bukti laporan berupa gambar.
- Kategori, prioritas, sumber laporan, dan dinas tujuan.
- Riwayat aksi dan audit.

### AI Processing

- Klasifikasi kategori aduan.
- Rekomendasi dinas terkait.
- Penentuan tingkat urgensi.
- Ringkasan laporan.
- Respon otomatis awal.
- Validasi output AI sebelum disimpan atau dikirim.

### Follow Up

- Admin membuat laporan tindak lanjut.
- Upload multi attachment bukti penanganan berupa gambar.
- Catatan internal dan konten publik dipisahkan.
- Update status aduan.
- Notifikasi progres ke pelapor.

### Realtime and Notification

- Update feed dan status dashboard secara realtime.
- Notifikasi penerimaan, proses, tindak lanjut baru, dan penyelesaian aduan.
- Pengiriman notifikasi melalui kanal asal jika tersedia.

## 7. Scope MVP

### Wajib MVP

- Monorepo dasar untuk API, web, worker, shared types, dan database client.
- Login admin dengan JWT dan role dasar.
- Penerimaan aduan dari minimal satu kanal chat dan form web.
- Queue pemrosesan aduan.
- Integrasi Gemini untuk klasifikasi dan respon awal.
- Database aduan, dinas, user, log, tindak lanjut, dan notifikasi.
- Superadmin dan agency dashboard minimum.
- Public dashboard untuk daftar aduan dan status publik.
- Update status dan tindak lanjut beserta notifikasi dasar.
- Validasi attachment gambar maksimal 5 MB per file.

### Setelah MVP

- Peta persebaran dan analytics lanjutan.
- SLA monitoring lengkap.
- Monitoring kanal dan worker yang lebih detail.
- Multi-instance scaling dan optimasi queue.
- Otomasi laporan periodik dinas.

## 8. Arsitektur Teknis

### Stack

| Area | Teknologi |
| --- | --- |
| Monorepo | Turborepo, PNPM Workspace, TypeScript |
| Frontend | Next.js, Tailwind CSS, TanStack Query, Socket.IO Client |
| Backend | NestJS, Prisma ORM, Socket.IO |
| Messaging | Baileys, Telegraf |
| Async Processing | Redis, BullMQ |
| Database | Supabase PostgreSQL |
| AI | Google Gemini API |

### Komponen

```text
WhatsApp / Telegram / Web
          |
    NestJS Gateway
          |
   Redis + BullMQ
          |
      AI Worker
          |
Supabase PostgreSQL
          |
 Next.js Dashboards
          |
 Socket.IO Updates
```

### Modul Utama

- Auth and RBAC.
- Complaint.
- Agency.
- AI processing.
- WhatsApp gateway.
- Telegram bot.
- Worker and queue.
- Realtime.
- Notification.
- Follow up report.
- Audit and analytics.

## 9. Data Inti

| Entitas | Field Penting |
| --- | --- |
| User | id, name, email, role, agency_id |
| Agency | id, name, description |
| Complaint | id, source, sender, message, category, priority, status, agency_id, ai_summary, created_at |
| ComplaintLog | id, complaint_id, action, created_by, created_at |
| FollowUpReport | id, complaint_id, agency_id, created_by, title, description, image_attachments, is_public, created_at |
| Notification | id, complaint_id, channel, recipient, message, status, created_at |

## 10. Queue dan Event

### Queue Awal

| Queue | Fungsi |
| --- | --- |
| complaint-incoming | Normalisasi aduan masuk |
| ai-classification | Pemrosesan AI |
| auto-reply | Konfirmasi awal pelapor |
| notification | Pengiriman update progres |
| analytics | Agregasi statistik |

### Event Realtime Awal

- `complaint.created`
- `complaint.updated`
- `follow_up.created`
- `notification.updated`

## 11. Keamanan dan Kualitas

- JWT authentication dan RBAC.
- Rate limiting pada API dan kanal masuk.
- Sanitasi input dan validasi attachment image-only maksimal 5 MB per file.
- Validasi prompt dan output AI.
- Audit log untuk perubahan penting.
- Webhook signature validation bila kanal mendukung.
- Retry, dead-letter handling, dan idempotency untuk job penting.
- Pemisahan catatan internal dari data yang tampil publik.

## 12. Deployment Awal

| Komponen | Target Awal |
| --- | --- |
| Frontend | Vercel |
| API | VPS Node.js + NGINX |
| Worker | PM2 pada runtime Node.js |
| Redis | Redis Cloud |
| Database | Supabase PostgreSQL |

Target awal cocok untuk MVP dan early production, dengan API stateless dan worker yang dapat diperbanyak saat beban meningkat.

## 13. Urutan Implementasi

1. Setup monorepo, config bersama, database schema, dan environment.
2. Bangun auth, RBAC, agency, dan complaint core.
3. Bangun queue serta worker pemrosesan aduan.
4. Integrasikan Gemini untuk klasifikasi dan respon awal.
5. Integrasikan kanal aduan chat dan form web.
6. Bangun superadmin dan agency dashboard.
7. Tambahkan follow up report, notifikasi, dan realtime update.
8. Bangun public dashboard dan aturan publikasi data.
9. Tambahkan audit, security hardening, monitoring, dan deployment.

## 14. Keputusan yang Perlu Dipastikan

- Kanal chat pertama untuk MVP: WhatsApp, Telegram, atau keduanya.
- Status lifecycle aduan yang resmi.
- Daftar kategori aduan dan mapping dinas awal.
- Aturan data pribadi yang boleh tampil pada dashboard publik.
- Retensi media attachment.
- SLA tiap prioritas dan aturan eskalasi.

## 15. Aturan Attachment

- Semua attachment hanya berupa gambar.
- Satu aduan atau laporan tindak lanjut dapat memiliki lebih dari satu gambar.
- Ukuran maksimal setiap gambar adalah 5 MB.
- Validasi tipe file dan ukuran dilakukan sebelum attachment disimpan atau diproses.
