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
