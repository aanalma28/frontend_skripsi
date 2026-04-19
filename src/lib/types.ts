export type LogType = 'FLOW' | 'PENALTY';

export interface TrafficLog {
    id: number;
    type: LogType;    
    src_ip: string;
    timestamp: string;
    penalty_score: number;
    confidence: number;
    latent_coords: [number, number];
    method: string;
    status?: string;
    is_blocked?: boolean;
    action?: string;
}

export interface PenaltyData {
    src_ip: string;
    current_penalty: number;
    last_updated: string;
}

export interface BlockedIP {
    id: string;
    src_ip: string;
    blocked_at: string;
    released_at?: string;
    message?: string;
    curr_status: string;
    reason: string;     // Tambahan baru
    blocked_duration_minutes: number; // Tambahan baru
}

export interface SystemConfig {
    block_threshold: number,
    penalty_heavy_rate: number,
    penalty_suspect_rate: number,
    penalty_decay_rate: number,
    block_duration_minutes: number,
    mikrotik_block_enabled: boolean,    
    engine_status: string,
    interface_dst: string,
    ip_filter: string,
    mikrotik_api_host: string,
    mikrotik_api_username: string,
    mikrotik_api_password: string
}

export interface TrafficStats {
    total_analyzed: number;
    judol_detected: number;
    current_queue?: number;
}