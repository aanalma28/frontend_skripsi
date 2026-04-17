import { io, Socket } from "socket.io-client";
import { writable } from "svelte/store";
import type { TrafficLog, TrafficStats, PenaltyData, BlockedIP, SystemConfig } from "./types";


export const socket: Socket = io("http://localhost:5000", {
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    autoConnect: false
});

// STORES LAMA
export const trafficLogs = writable<TrafficLog[]>([]);
export const trafficStats = writable<TrafficStats>({
    total_analyzed: 0,
    judol_detected: 0,
    current_queue: 0
});
export const isAiConnected = writable<boolean>(false);
// STORES BARU (Untuk Fitur Penalty & Block)
export const penaltyStore = writable<PenaltyData[]>([]);
export const blockedStore = writable<BlockedIP[]>([]);
// Store untuk System Config (Singleton Cache)
export const systemConfig = writable<SystemConfig>({
    block_threshold: 0,
    penalty_heavy_rate: 0,
    penalty_suspect_rate: 0,
    penalty_decay_rate: 0,
    block_duration_minutes: 0,
    mikrotik_block_enabled: false,
    engine_status: 'off', // Nilai aman agar UI tidak crash
    port_sniffer_device: '',
    ip_filter: '',
    mikrotik_api_host: '',
    mikrotik_api_username: '',
    mikrotik_api_password: ''
});