"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BuildingOfficeIcon,
    PlusCircleIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";

export default function AdminProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://property.reworkstaging.name.ng/v1/properties", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setProperties(data.data || []);
        } catch (err) {
            console.error("Error fetching properties:", err);
        } finally {
            setLoading(false);
        }
    };

    const verifyProperty = async (propertyId, isVerified) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${propertyId}/set-verified`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ is_verified: isVerified })
            });
            if (res.ok) {
                fetchProperties();
            }
        } catch (err) {
            console.error("Error verifying property:", err);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${propertyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchProperties();
            }
        } catch (err) {
            console.error("Error deleting property:", err);
        }
    };

    const filteredProperties = properties.filter(prop => {
        const matchesSearch = prop.name?.toLowerCase().includes(search.toLowerCase()) ||
                              prop.city?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" ? true :
                              filter === "verified" ? prop.is_verified :
                              filter === "pending" ? !prop.is_verified : true;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium mb-4 group">
                    <span className="mr-1 group-hover:-translate-x-0.5 transition">←</span> Back to Dashboard
                </Link>
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
                        <p className="text-gray-500 mt-1">View, verify and manage all property listings</p>
                    </div>
                    <Link href="/admin/properties/create">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                            <PlusCircleIcon className="w-5 h-5" />
                            Create Property
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm" />
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === "all" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
                    <button onClick={() => setFilter("verified")} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === "verified" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Verified</button>
                    <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Pending</button>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Property</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Location</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Price</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProperties.map((prop) => (
                                <tr key={prop._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium">{prop.name}</p>
                                            <p className="text-xs text-gray-500">{prop.type} • {prop.category}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-600 text-sm">{prop.city}</p>
                                        <p className="text-xs text-gray-500">{prop.state}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">₦{parseInt(prop.price).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${prop.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {prop.is_verified ? "Verified" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/properties/${prop._id}`}>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><EyeIcon className="w-4 h-4" /></button>
                                            </Link>
                                            {!prop.is_verified && (
                                                <button onClick={() => verifyProperty(prop._id, true)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"><CheckCircleIcon className="w-4 h-4" /></button>
                                            )}
                                            <button onClick={() => deleteProperty(prop._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProperties.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No properties found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}