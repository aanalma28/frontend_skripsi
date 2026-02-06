import { io, Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { TrafficLog, TrafficStats } from "./types";

// Koneksi ke Flask (Backend AI)
export const socket: Socket = io("http://localhost:5000");

// file store, menyimpan data sementara dengan jumlah tertentu, hilang jika halaman direfresh
export const trafficLogs = writable<TrafficLog[]>([]);
export const trafficStats = writable<TrafficStats>({
    total_analyzed: 0,
    judol_detected: 0
})
export const isAiConnected = writable<boolean>(false);

socket.on("connect", () => isAiConnected.set(true));
socket.on("disconnect", () => isAiConnected.set(false));

// Menerima hasil klasifikasi dari Beta-VAE + DNN
socket.on("new_traffic", (payload: {data: TrafficLog, stats: TrafficStats}) => {
    trafficLogs.update(logs => {
        const newLogs = [payload.data, ...logs];
        return newLogs.slice(0, 50);
    })
    trafficStats.set(payload.stats)
});