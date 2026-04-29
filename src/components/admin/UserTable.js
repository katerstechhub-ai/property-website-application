import Button from "../common/Button";
import { formatDate } from "@/src/utils/formatters";

export default function UserTable({ users, onDelete, loading }) {
  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-8 text-gray-500">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-sm">Name</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Email</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Phone</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Joined</th>
            <th className="text-left px-6 py-3 font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500">ID: {user._id?.slice(-8)}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-gray-600">{user.phone || "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}