export interface TrafficLog {
    id: number;
    ip: string;
    method: 'VPN' | 'DoH' | 'DoT' | 'None';
    status: 'Judol' | 'Normal';
    confidence: number;
    latent_coords: number[];
}

export interface TrafficStats {
    total_analyzed: number;
    judol_detected: number;
}