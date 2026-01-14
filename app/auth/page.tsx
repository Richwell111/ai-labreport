"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    // Simulate sign up
    setTimeout(() => {
      setUserEmail(email);
      setLoading(false);
      alert(
        "Account created! (This is a demo - no actual account was created)"
      );
      router.push("/");
    }, 500);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
  };

  const handleGmailSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gmail sign in failed");
      setLoading(false);
    }
  };


  const handleSSOSignIn = () => {
    if (!email.trim()) {
      alert("Please enter your work email");
      return;
    }
    setLoading(true);
    // Simulate SSO sign in
    setTimeout(() => {
      setUserEmail(email.trim());
      setLoading(false);
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Vivo Health</CardTitle>
          <CardDescription>
            Access your lab reports, health notes, and AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {userEmail ? (
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Signed in as <span className="font-medium">{userEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  This is a demo. In a production environment, you would access
                  your profile from the user menu.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex-1"
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                type="button"
                className="w-full"
                onClick={handleGmailSignIn}
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Gmail
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or use SSO
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSSOSignIn();
                    }
                  }}
                  disabled={loading}
                />
                <Button
                  onClick={handleSSOSignIn}
                  variant="outline"
                  className="w-full"
                  disabled={loading || !email.trim()}
                >
                  Sign in with SSO
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  For organizations using Google Workspace, Microsoft, or Okta
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) {
                      handleSignIn();
                    }
                  }}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) {
                      handleSignIn();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSignIn}
                  disabled={loading || !email || !password}
                >
                  Sign in
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleSignUp}
                  disabled={loading || !email || !password}
                >
                  Sign up
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                This is a demo. No actual authentication is performed.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
