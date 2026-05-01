"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserGroupIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    LockClosedIcon,
    UserIcon
} from "@heroicons/react/24/outline";

export default function AdminCreateAgent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        company: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Not logged in. Please login again.");
            setLoading(false);
            return;
        }

        const body = {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        };

        // Only include company if filled in
        if (formData.company.trim()) {
            body.company = formData.company.trim();
        }

        console.log("Creating agent with body:", body);

        try {
            // Correct endpoint: POST /merchants/agents
            const res = await fetch("http://property.reworkstaging.name.ng/v1/merchants/agents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            console.log("Create agent response:", data);

            if (res.ok || data.code === 200 || data.code === 201) {
                setSuccess(true);
                setTimeout(() => router.push("/admin/agents"), 2000);
            } else {
                setError(data.message || data.msg || "Failed to create agent. Check console for details.");
                console.error("Agent creation failed:", data);
            }
        } catch (err) {
            console.error("Submit error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-sm bg-white transition";

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/agents" className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium mb-4 group transition">
                        <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition" />
                        Back to Agents
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create New Agent</h1>
                            <p className="text-gray-500 mt-1">Add an agent to your merchant account</p>
                        </div>
                    </div>
                </div>

                {/* Success */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Agent created successfully!</p>
                            <p className="text-sm text-green-600">Redirecting to agents list...</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5">⚠️</span>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />

                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g., John Smith"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                                Company (Optional)
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g., Prime Realty Ltd"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="agent@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="e.g., 08012345678"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                <LockClosedIcon className="w-4 h-4 text-gray-400" />
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Minimum 8 characters"
                            />
                            <p className="text-xs text-gray-400 mt-1">The agent will use this to log in</p>
                        </div>

                        <div className="flex gap-4 pt-2 border-t">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Creating Agent...
                                    </>
                                ) : (
                                    <>
                                        <UserGroupIcon className="w-5 h-5" />
                                        Create Agent
                                    </>
                                )}
                            </button>
                            <Link href="/admin/agents" className="flex-1">
                                <button type="button" className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}