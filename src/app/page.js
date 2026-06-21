"use client";

import { useSession } from "next-auth/react";
import LandingPage from "@/components/LandingPage";

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ background: "var(--ds-bg)" }}>
      <div
        className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(201,168,76,0.2)", borderTopColor: "var(--ds-amber)" }}
      />
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingScreen />;

  return <LandingPage session={session} />;
}