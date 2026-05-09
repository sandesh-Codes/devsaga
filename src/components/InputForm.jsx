"use client"
import { useState } from "react"

export default function InputForm({ onSubmit }) {
    const [form, setForm] = useState({
        error: "",
        code: "",
        context: "",
        category: "Bug",
        simpler: false
    })

    function handleChange(e) {
    setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <input 
            name="error"
            placeholder="Error message"
            value={form.error}
            onChange={handleChange}
            className="w-full p-2 border"
            required />

            <textarea 
            name="code"
            placeholder="Paste your code"
            value={form.code}
            onChange={handleChange}
            className="w-full p-2 border h-32"
            required
            />

            <textarea 
            name="context"
            placeholder="What were you trying to do?"
            value={form.context}
            onChange={handleChange}
            className="w-full p-2 border h-20"
            />

          <select 
          name="category"
          value={form.value}
          onChange={handleChange}
          className="w-full p-2 border">

            <option>Bug</option>
            <option>Unexpected Behaviour</option>
            <option>Performance</option>
            <option>API Issue</option>
          </select>

        <button className="bg-black text-white px-4 py-2">Debug</button>
        <label className="flex gap-2 items-center">
            <input 
            type="checkbox"
            checked={form.simpler}
            onChange={(e) =>
                setForm({...form, simpler:e.target.checked}) } />Explain Simpler
        </label>
        </form>
    )

}