import Button from "../common/Button";
import { formatDate } from "@/src/utils/formatters";

export default function AgentTable({ agents, onVerify, onDelete, loading }) {
  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return <div className="text-center py-8 text-gray-500">No agents found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-sm">Name</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Company</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Email</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Status</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{agent.full_name}</td>
              <td className="px-6 py-4 text-gray-600">{agent.company || "—"}</td>
              <td className="px-6 py-4 text-gray-600">{agent.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  agent.is_verified 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {agent.is_verified ? "Verified" : "Pending"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {!agent.is_verified && (
                    <Button size="sm" onClick={() => onVerify(agent._id, true)}>
                      Verify
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => onDelete(agent._id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}