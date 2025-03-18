import { useEffect } from "react";
import { useLocation } from "wouter";
import { auth } from "@/lib/firebase";
import { ProxyList } from "@/components/proxy/ProxyList";
import { BandwidthChart } from "@/components/analytics/BandwidthChart";
import { LatencyMonitor } from "@/components/analytics/LatencyMonitor";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLocation("/auth");
      }
    });

    return () => unsubscribe();
  }, [setLocation]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Proxy Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BandwidthChart />
        <LatencyMonitor />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Proxies</h2>
        <ProxyList />
      </div>
    </div>
  );
}
