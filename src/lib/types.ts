export interface TrafficLog {
    ip: string;
    method: 'VPN' | 'DoH' | 'DoT' | 'None';
    status: 'Judol' | 'Normal';
    confidence: number;    
}

export interface TrafficStats {
    total_analyzed: number;
    judol_detected: number;
}