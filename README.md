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

## Docker Deployment

### Prasyarat
- Docker & Docker Compose terinstall
- Backend container sudah berjalan (`sentinel_backend` di port 5000)

### Build & Run

```sh
# Build dan jalankan container
docker compose up -d --build

# Cek status
docker compose ps

# Lihat logs
docker compose logs -f frontend
```

### Stop

```sh
docker compose down
```

### Konfigurasi Environment

| Variable | Default | Keterangan |
|---|---|---|
| `FRONTEND_PORT` | `5173` | Port frontend dashboard |

Contoh mengganti port:

```sh
FRONTEND_PORT=8080 docker compose up -d --build
```

### Catatan Penting

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
