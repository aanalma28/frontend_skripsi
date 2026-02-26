import { io, Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { TrafficLog, TrafficStats } from "./types";

// Koneksi ke Flask (Backend AI)
export const socket: Socket = io("http://localhost:5000", {
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    autoConnect: false
});

// file store, menyimpan data sementara dengan jumlah tertentu, hilang jika halaman direfresh
export const trafficLogs = writable<TrafficLog[]>([]);
export const trafficStats = writable<TrafficStats>({
    total_analyzed: 0,
    judol_detected: 0
})
export const isAiConnected = writable<boolean>(false);