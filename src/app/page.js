"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputPanel from "@/components/OutputPanel";
import DebugHistory from "@/components/DebugHistory";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  async function handleSubmit(formData) {
    setLoading(true);
    setResult(null);
    setError("");

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
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-3 gap-6">
      <h1 className="text-2xl font-bold">AI Debugger</h1>
      <div className="md:col-span-2 space-y-6">
      <InputForm onSubmit={handleSubmit} />
      {loading && (
        <div className="border rounded-lg p-4 animate-pulse">
          <p className="font-medium">Analyzing your bug...</p>
          <p className="text-sm text-gray-500">
            Finding root cause and generating fix...
          </p>
          {error && (
  <div className="border border-red-300 bg-red-50 p-3 rounded">
    {error}
  </div>
)}
        </div>
      )}

      <OutputPanel data={result} />
      </div>
      <div>
    <DebugHistory onSelect={setResult} />
  </div>
      </div>
    </main>
  );
}
