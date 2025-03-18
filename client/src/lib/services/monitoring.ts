
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export class MonitoringService {
  private static bytesToMB(bytes: number): number {
    return Math.round(bytes / (1024 * 1024));
  }

  static async updateSessionMetrics(sessionId: string, bandwidthUsed: number, latency: number) {
    try {
      const sessionRef = doc(db, 'proxySessions', sessionId);
      await updateDoc(sessionRef, {
        bandwidthUsed: this.bytesToMB(bandwidthUsed),
        averageLatency: Math.round(latency)
      });
    } catch (error) {
      console.error('Error updating session metrics:', error);
    }
  }
}
