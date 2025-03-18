import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { FaGoogle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Failed to sign in. Please try again.";

      if (error.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized for sign-in. Please contact the administrator.";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
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