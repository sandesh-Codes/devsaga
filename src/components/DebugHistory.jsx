"use client";

import { useState, useEffect } from "react";

export default function DebugHistory({ onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json().catch(() => []);
        setHistory(data);
      } catch (error) {
        console.error("History fetch error: ", error);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="border p-4">
      <h3 className="font-bold mb-2">History</h3>

      {history.length === 0 ? (
        <p>No debug history yet</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer border-b py-2"
            onClick={() => onSelect(item.response)}
          >
            {item.error.slice(0, 50)}...
          </div>
        ))
      )}
    </div>
  );
}
