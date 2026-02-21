export type LogType = 'FLOW' | 'VOTING'

export interface TrafficLog {
    id: number;
    type: LogType;
    timestamp: string;
    ip: string;
    
    // Properti untuk Type FLOW (Real-Time)
    status?: string;
    method?: string;
    confidence?: number;
    latent_coords?: [number, number];

    // Properti untuk Type VOTING (Result per 3 menit)
    final_label?: string;
    final_method?: string;
    avg_confidence?: number;
    violation_rate?: string;
    centroid?: [number, number];
    is_blocked?: boolean;
    action?: string;

}

export interface TrafficStats {
    total_analyzed: number;
    judol_detected: number;
}