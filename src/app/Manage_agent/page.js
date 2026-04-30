"use client";

import { useEffect, useState } from "react";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const agent = JSON.parse(localStorage.getItem("agent"));
    if (agent) setAgents([agent]);
  }, []);

  return (
    <div className="p-6">
      <h1>Agents</h1>

      {agents.map((a) => (
        <div key={a.id} className="border p-3">
          {a.full_name} - {a.email}
          <p>{a.company}</p>
        </div>
      ))}
    </div>
  );
}