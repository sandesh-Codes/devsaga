"use client";
import { useState } from "react";

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

  const inputClass = `
    w-full bg-[#141310] border border-[#2a2820]
    rounded-xl text-[#f0ece0] font-mono text-[13px]
    px-4 py-3 placeholder:text-[#5a5448]
    outline-none focus:border-[#c9a84c]/60
    focus:ring-2 focus:ring-[#c9a84c]/08
    transition-all resize-none
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-1.5">
        <label className="text-[10px] tracking-widest font-mono text-[#5a5448]">ERROR MESSAGE</label>
        <input
          name="error"
          placeholder="Paste your error here..."
          value={form.error}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] tracking-widest font-mono text-[#5a5448]">CODE</label>
        <textarea
          name="code"
          placeholder="Paste the relevant code..."
          value={form.code}
          onChange={handleChange}
          required
          rows={7}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] tracking-widest font-mono text-[#5a5448]">
          CONTEXT <span className="text-[#3a3530]">— optional</span>
        </label>
        <textarea
          name="context"
          placeholder="What were you trying to do?"
          value={form.context}
          onChange={handleChange}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] tracking-widest font-mono text-[#5a5448]">CATEGORY</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm({ ...form, category: cat })}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                form.category === cat
                  ? "bg-[#c9a84c]/12 border-[#c9a84c]/40 text-[#c9a84c]"
                  : "bg-transparent border-[#2a2820] text-[#5a5448] hover:border-[#3a3530] hover:text-[#f0ece0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, simpler: !form.simpler })}
          className={`relative w-10 h-5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
            form.simpler ? "bg-[#c9a84c]" : "bg-[#2a2820]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#f0ece0] shadow transition-transform ${
              form.simpler ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-[#8a8070]">
          Explain simpler
          {form.simpler && (
            <span className="ml-2 text-[10px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/25 px-2 py-0.5 rounded-full">
              ON
            </span>
          )}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border"
        style={{
          background: "rgba(201,168,76,0.08)",
          borderColor: "rgba(201,168,76,0.25)",
          color: "#c9a84c",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          "Debug →"
        )}
      </button>

    </form>
  );
}