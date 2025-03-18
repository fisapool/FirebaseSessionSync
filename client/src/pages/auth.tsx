import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signInWithGoogle, auth } from "@/lib/firebase";
import { FaGoogle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { getRedirectResult } from "firebase/auth";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).then((result) => {
      if (result) {
        setLocation("/dashboard");
      }
    }).catch((error) => {
      console.error("Redirect result error:", error);
      let errorMessage = "Failed to sign in. Please try again.";

      if (error.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized for sign-in. Please add this domain to Firebase Console's authorized domains list.";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    });
  }, [setLocation, toast]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // The redirect will happen automatically, and the result will be handled in useEffect
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to initiate sign-in. Please try again.",
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