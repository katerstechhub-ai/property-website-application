"use client";

import { useEffect, useState } from "react";

export default function AgentsPage() {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const data = JSON.parse(
            localStorage.getItem("agent_user") || "[]"
        );

        setAgents(data);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">All Agents</h1>

            <div className="grid grid-cols-2 gap-4">
                {agents.length > 0 ? (
                    agents.map((a) => (
                        <div
                            key={a.id}
                            className="border p-4 rounded bg-white text-black"
                        >
                            <p className="font-bold text-blue-900 text-2xl">
                                {a.full_name}
                            </p>
                            <p className="text-red-500">Email:{a.email}</p>
                            <p className="text-green-500">Company:{a.company}</p>
                            <p className=" text-black">
                                {a.phone}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No agents found</p>
                )}
            </div>
        </div>
    );
}