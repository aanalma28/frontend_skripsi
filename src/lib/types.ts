export type LogType = 'FLOW' | 'PENALTY';

export interface TrafficLog {
    id: number;
    type: LogType;    
    ip: string;
    timestamp: string;
    penalty_score: number;
    confidence: number;
    latent_coords: [number, number];
    
    // Properti untuk Type FLOW (Real-Time)
    status?: string;
    method?: string; 

    // Properti untuk Type PENALTY    
    is_blocked?: boolean;
    action?: string;

}

export interface TrafficStats {
    total_analyzed: number;
    judol_detected: number;
    current_queue?: number;
}