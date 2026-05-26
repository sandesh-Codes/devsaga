"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
 
const CATEGORIES = ["Bug", "Unexpected Behaviour", "Performance", "API Issue"];
 
export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    error: "",
    code: "",
    context: "",
    category: "Bug",
    simpler: false,
  });
 
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
 
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }
 
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
 
      {/* Error message */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#6b6b8a] font-medium">Error Message</label>
        <input
          name="error"
          placeholder="Paste your error here..."
          value={form.error}
          onChange={handleChange}
          required
          className="w-full bg-[#0d0d1a] border border-[#2a2a40] rounded-xl text-[#e8e8f0] font-mono text-[13px] px-4 py-3 placeholder:text-[#4a4a65] outline-none focus:border-[#7c6af7] focus:ring-2 focus:ring-[#7c6af7]/10 transition-all"
        />
      </div>
 
      {/* Code */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#6b6b8a] font-medium">Code</label>
        <Textarea
          name="code"
          placeholder="Paste the relevant code..."
          value={form.code}
          onChange={handleChange}
          required
          className="w-full min-h-[140px] bg-[#0d0d1a] border border-[#2a2a40] rounded-xl text-[#e8e8f0] font-mono text-[13px] px-4 py-3 placeholder:text-[#4a4a65] outline-none focus:border-[#7c6af7] focus:ring-2 focus:ring-[#7c6af7]/10 transition-all resize-none"
        />
      </div>
 
      {/* Context */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#6b6b8a] font-medium">
          Context <span className="text-[#4a4a65]">(optional)</span>
        </label>
        <Textarea
          name="context"
          placeholder="What were you trying to do?"
          value={form.context}
          onChange={handleChange}
          className="w-full min-h-[72px] bg-[#0d0d1a] border border-[#2a2a40] rounded-xl text-[#e8e8f0] font-mono text-[13px] px-4 py-3 placeholder:text-[#4a4a65] outline-none focus:border-[#7c6af7] focus:ring-2 focus:ring-[#7c6af7]/10 transition-all resize-none"
        />
      </div>
 
      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#6b6b8a] font-medium">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm({ ...form, category: cat })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                form.category === cat
                  ? "bg-[#7c6af7]/20 border-[#7c6af7]/50 text-[#a78bfa]"
                  : "bg-transparent border-[#2a2a40] text-[#6b6b8a] hover:border-[#4a4a65] hover:text-[#e8e8f0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
 
      {/* Explain simpler toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, simpler: !form.simpler })}
          className={`relative w-10 h-5 rounded-full transition-all cursor-pointer shrink-0 ${
            form.simpler ? "bg-[#7c6af7]" : "bg-[#2a2a40]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              form.simpler ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-[#6b6b8a]">
          Explain simpler
          {form.simpler && (
            <Badge className="ml-2 text-[10px] bg-[#7c6af7]/15 text-[#a78bfa] border-[#7c6af7]/30 hover:bg-[#7c6af7]/15">
              ON
            </Badge>
          )}
        </span>
      </div>
 
      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7c6af7]/20 to-[#60a5fa]/20 border border-[#7c6af7]/30 text-[#a78bfa] hover:from-[#7c6af7]/30 hover:to-[#60a5fa]/30 hover:shadow-[0_0_24px_rgba(124,106,247,0.2)] hover:-translate-y-px transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[#a78bfa]/30 border-t-[#a78bfa] rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Debug!"
        )}
      </button>
 
    </form>
  );
}
 