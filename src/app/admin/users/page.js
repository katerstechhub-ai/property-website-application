"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UsersIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/admin/login"); return; }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = getToken();
        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/users?limit=100", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        setDeleteLoading(userId);
        const token = getToken();
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200) {
                setUsers(prev => prev.filter(u => u._id !== userId));
            }
        } catch (err) {
            console.error("Error deleting user:", err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/admin" className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <UsersIcon className="w-6 h-6 text-red-600" /> Manage Users
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">View and manage all registered tenants</p>
                        </div>
                        <span className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl">
                            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6 relative max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm bg-white shadow-sm"
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                        <p className="text-gray-400">{search ? "No users match your search." : "No users registered yet."}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">User</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Contact</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Joined</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <UsersIcon className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                                                        <p className="text-xs text-gray-400 font-mono">{user._id?.slice(-10)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <EnvelopeIcon className="w-3 h-3 text-gray-400" /> {user.email}
                                                    </p>
                                                    {user.phone && (
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <PhoneIcon className="w-3 h-3 text-gray-400" /> {user.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <CalendarDaysIcon className="w-3 h-3" />
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    disabled={deleteLoading === user._id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                    {deleteLoading === user._id ? "Deleting..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}