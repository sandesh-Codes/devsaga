"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const { data: session, status } = useSession();
  const router = useRouter();
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
         if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

      if ( status === "authenticated") {
        fetch("/api/extension/token")
      .then(res => res.json())
      .then(data => {
        setToken(data.token);
        setLoading(false);
      });
    }
    }, [status]);

    async function generateToken() {
        setGenerating(true);
        const res = await fetch("/api/extension/token", {method: "POST"});
        const data = await res.json();
        setToken(data.token);
        setGenerating(false);
    }

    async function copyToken() {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

      if (status === "loading" || status === "unauthenticated") {
    return null;
  }

    return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>VS Code Extension Token</CardTitle>
          <CardDescription>
            Use this token to connect the DevSaga VS Code extension to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : token ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm break-all">
                {token}
              </code>
              <Button variant="outline" onClick={copyToken}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No token generated yet.</p>
          )}

          <Button onClick={generateToken} disabled={generating}>
            {generating ? "Generating..." : token ? "Regenerate Token" : "Generate Token"}
          </Button>

          {token && (
            <p className="text-xs text-muted-foreground">
              ⚠️ Regenerating will invalidate your old token. You'll need to update it in VS Code.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
    
}