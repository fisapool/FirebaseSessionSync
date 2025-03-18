import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Current: {data?.current}ms</span>
            <span>Average: {data?.average}ms</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}