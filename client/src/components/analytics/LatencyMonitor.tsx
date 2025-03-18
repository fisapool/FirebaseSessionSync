import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LatencyData {
  current: number;
  average: number;
  max: number;
}

export function LatencyMonitor() {
  const { data, isLoading } = useQuery<LatencyData>({
    queryKey: ["/api/analytics/latency"],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latency Monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 animate-pulse bg-muted" />
      </Card>
    );
  }

  const percentage = data ? (data.current / data.max) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current</span>
            <span>{data?.current}ms</span>
          </div>
          <Progress value={percentage} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-2xl font-bold">{data?.average}ms</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max</p>
            <p className="text-2xl font-bold">{data?.max}ms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProxyData } from '@/lib/hooks/useProxyData';
import { auth } from '@/lib/firebase';

export function LatencyMonitor() {
  const { sessions } = useProxyData(auth.currentUser?.uid || '');
  const [averageLatency, setAverageLatency] = useState<number>(0);

  useEffect(() => {
    if (!sessions.length) return;
    
    const latencies = sessions
      .map(s => s.averageLatency)
      .filter((l): l is number => l !== null && l !== undefined);
    
    if (latencies.length) {
      setAverageLatency(
        Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      );
    }
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Latency</CardTitle>
      </CardHeader>
      <CardContent className="text-4xl font-bold">
        {averageLatency}ms
      </CardContent>
    </Card>
  );
}
