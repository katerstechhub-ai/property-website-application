"use client";
import { useEffect, useState } from "react";

export default function AgentProfile() {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("agent_user") || "{}");
    const cleanAgent = raw.data || raw;

    setAgent(cleanAgent);
  }, []);

  if (!agent) {
    return <p>Loading agent...</p>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold">{agent.full_name}</h2>

      <p className="text-gray-600">{agent.email}</p>

      <p className="text-gray-500">
        {agent.primary_phone || agent.phones?.[0]}
      </p>

      <p className="text-sm text-gray-400">
        Company: {agent.company}
      </p>

      <p className="text-xs text-gray-400">
        ID: {agent.id}
      </p>
    </div>
  );
}