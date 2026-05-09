"use client"
import { useState } from "react"

export default function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy () {
        await navigator.clipboard.writeText(text)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1500)
    }

    return (
      <button
      onClick={handleCopy}
      className="text-sm px-2 py-1 border rounded">
        {copied ? "Copied!" : "Copy"}
      </button>
    )
}