import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { FaGoogle } from "react-icons/fa";

export default function Auth() {
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to PE</CardTitle>
          <CardDescription>
            Manage your residential proxies securely and efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin} 
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <FaGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
