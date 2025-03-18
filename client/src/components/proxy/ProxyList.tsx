import { useQuery } from "@tanstack/react-query";
import { ProxyCard } from "./ProxyCard";
import { type ProxyServer } from "@shared/schema";

export function ProxyList() {
  const { data: proxies, isLoading, refetch } = useQuery<ProxyServer[]>({
    queryKey: ["/api/proxies"],
  });

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
      {proxies?.map((proxy) => (
        <ProxyCard 
          key={proxy.id} 
          proxy={proxy} 
          onStatusChange={refetch}
        />
      ))}
    </div>
  );
}
