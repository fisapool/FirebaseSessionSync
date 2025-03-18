import { useEffect, useState } from "react";
import { ProxyCard } from "./ProxyCard";
import { type ProxyServer } from "@shared/schema";
import { subscribeToProxyServers } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function ProxyList() {
  const [proxies, setProxies] = useState<ProxyServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeToProxyServers(auth.currentUser.uid, (updatedProxies) => {
      setProxies(updatedProxies);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[200px] animate-pulse bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proxies.map((proxy) => (
        <ProxyCard 
          key={proxy.id} 
          proxy={proxy}
          onStatusChange={() => {
            toast({
              title: "Status Updated",
              description: `${proxy.name} status has been updated.`
            });
          }}
        />
      ))}
    </div>
  );
}