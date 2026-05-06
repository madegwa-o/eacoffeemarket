"use client";

import { useState } from "react";

export function MeetingModal({ exhibitorId }: { exhibitorId: string }) {
  const [message, setMessage] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  async function submit() {
    await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exhibitor_id: exhibitorId, message, proposed_time: proposedTime }) });
  }
  return <div className="rounded-xl border p-4"><textarea className="w-full border p-2" value={message} onChange={(e) => setMessage(e.target.value)} /><input className="mt-2 w-full border p-2" type="datetime-local" value={proposedTime} onChange={(e) => setProposedTime(e.target.value)} /><button className="mt-2 rounded bg-blue-600 px-3 py-2 text-white" onClick={submit}>Send Request</button></div>;
}
