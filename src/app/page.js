"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputPanel from "@/components/OutputPanel";
import DebugHistory from "@/components/DebugHistory";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Debugger</h1>

      <InputForm onSubmit={handleSubmit} />
      <DebugHistory onSelect={setResult} />
      {loading && (
        <div className="border rounded-lg p-4 animate-pulse">
          <p className="font-medium">Analyzing your bug...</p>
          <p className="text-sm text-gray-500">
            Finding root cause and generating fix...
          </p>
        </div>
      )}

      <OutputPanel data={result} />
    </main>
  );
}
