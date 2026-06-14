# SENTINEL AI-IPS — Frontend Dashboard

Frontend dashboard untuk sistem **AI-IPS (Intrusion Prevention System)** yang mendeteksi trafik judi online menggunakan model **VAE + DNN**.

## Tech Stack

| Teknologi | Versi |
|---|---|
| SvelteKit | 2.x (Svelte 5) |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |
| Node.js | 22.x |
| Socket.IO Client | 4.x |

## Arsitektur

Frontend ini **hanya menampilkan hasil** dari backend. Semua logika deteksi, komunikasi Mikrotik, dan proses AI dilakukan di backend (terpisah).

```
[Mikrotik] ←→ [Backend :5000] ←→ [Frontend :5173]
                (Flask + AI)       (SvelteKit Dashboard)
```

Komunikasi frontend → backend:
- **REST API** (`fetch`) untuk initial data, config update, IP release
- **WebSocket** (`socket.io`) untuk real-time traffic logs, penalty updates, block notifications

---

## Development (Lokal)

```sh
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Akses di `http://localhost:5173`. Pastikan backend sudah berjalan di port `5000`.

---

## Docker Deployment (Production)

Tidak perlu `npm install` atau `npm run build` secara manual. Docker sudah menghandle semuanya secara otomatis.

### Prasyarat

1. **Docker & Docker Compose** sudah terinstall di perangkat
   ```sh
   # Cek apakah Docker sudah terinstall
   docker --version
   docker compose version
   ```

2. **Backend container** sudah berjalan (`sentinel_backend` di port 5000)
   ```sh
   # Pastikan backend sudah aktif
   sudo docker ps | grep sentinel_backend
   ```

### Langkah 1 — Clone Repository (Jika Belum)

```sh
git clone https://github.com/aanalma28/frontend_skripsi.git
cd frontend_skripsi
```

> Jika sudah punya repo-nya, pastikan sudah di branch terbaru:
> ```sh
> git pull origin main
> ```

### Langkah 2 — Build & Jalankan Container

```sh
# Satu command ini sudah: install deps → build production → jalankan server
sudo docker compose up -d --build
```

Proses pertama kali akan memakan waktu beberapa menit (download base image + build SvelteKit). Build selanjutnya akan lebih cepat berkat Docker layer cache.

### Langkah 3 — Verifikasi

```sh
# Cek container berjalan
sudo docker compose ps

# Output yang diharapkan:
# NAME                STATUS          PORTS
# sentinel_frontend   Up xx seconds   (host network)

# Cek logs untuk memastikan tidak ada error
sudo docker compose logs -f frontend
```

Buka browser dan akses: **http://localhost:5173**

### Menghentikan Container

```sh
# Stop container (data tetap aman)
sudo docker compose down
```

### Menjalankan Ulang (Tanpa Rebuild)

```sh
# Jika tidak ada perubahan kode, cukup:
sudo docker compose up -d
```

### Rebuild Setelah Update Kode

```sh
# Jika ada perubahan kode (git pull, edit file, dll):
sudo docker compose up -d --build
```

### Konfigurasi Environment

| Variable | Default | Keterangan |
|---|---|---|
| `FRONTEND_PORT` | `5173` | Port frontend dashboard |

Contoh mengganti port:

```sh
FRONTEND_PORT=8080 sudo docker compose up -d --build
```

### Troubleshooting

| Masalah | Solusi |
|---|---|
| Container exit / restart terus | `sudo docker compose logs frontend` untuk lihat error |
| Frontend tampil tapi data kosong | Pastikan backend (`sentinel_backend`) sudah berjalan di port 5000 |
| Port 5173 sudah dipakai | Ganti port: `FRONTEND_PORT=3000 sudo docker compose up -d --build` |
| Perlu rebuild dari nol | `sudo docker compose build --no-cache` lalu `sudo docker compose up -d` |

### Catatan Penting

> **Tidak perlu build manual** — Proses `npm run build` sudah dilakukan otomatis di dalam Docker saat `docker compose up --build`. Kamu tidak perlu install Node.js atau npm di perangkat target.

> **Network Mode: Host** — Container frontend menggunakan `network_mode: host` agar browser bisa mengakses backend di `localhost:5000`. Ini karena semua komunikasi ke backend terjadi di sisi client (browser), bukan di server SvelteKit.

---

## Struktur Projek

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/     # Sidebar, Monitoring, Charts
│   │   ├── socket.ts       # Socket.IO connection & stores
│   │   ├── theme.ts        # Dark/Light mode toggle
│   │   └── types.ts        # TypeScript interfaces
│   └── routes/
│       ├── +page.svelte          # Landing page
│       ├── login/                # Login page
│       ├── blocked/              # Blocked access page
│       └── dashboard/
│           ├── +page.svelte      # Dashboard utama
│           ├── monitor/          # Full traffic monitor
│           ├── intelligence/     # AI intelligence view
│           ├── penalties/        # Penalty scores
│           ├── blocked_ips/      # Blocked IP management
│           └── settings/         # System configuration
├── Dockerfile
├── docker-compose.yml
└── svelte.config.js              # adapter-node untuk Docker
```
