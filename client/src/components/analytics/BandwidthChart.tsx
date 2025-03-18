import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface BandwidthData {
  timestamp: string;
  bandwidth: number;
}

export function BandwidthChart() {
  const { data, isLoading } = useQuery<BandwidthData[]>({
    queryKey: ["/api/analytics/bandwidth"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bandwidth Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] animate-pulse bg-muted" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandwidth Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="bandwidth"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProxyData } from '@/lib/hooks/useProxyData';
import { auth } from '@/lib/firebase';

export function BandwidthChart() {
  const [chartData, setChartData] = useState<any>(null);
  const { sessions } = useProxyData(auth.currentUser?.uid || '');

  useEffect(() => {
    if (!sessions.length) return;

    const data = sessions.map(session => ({
      x: new Date(session.startTime).toLocaleTimeString(),
      y: session.bandwidthUsed || 0
    }));

    setChartData({
      labels: data.map(d => d.x),
      datasets: [{
        label: 'Bandwidth Usage (MB)',
        data: data.map(d => d.y),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    });
  }, [sessions]);

  if (!chartData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandwidth Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={chartData} options={{ maintainAspectRatio: false }} height={300} />
      </CardContent>
    </Card>
  );
}
