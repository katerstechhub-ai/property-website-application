"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    LockClosedIcon,
    PlusCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function CreateAgent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        company: "",
        email: "",
        phone: "",      // ✅ Phone field added
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

        const adminToken = localStorage.getItem("token");

        if (!adminToken) {
            setError("You are not logged in. Please login again.");
            setLoading(false);
            router.push("/admin/login");
            return;
        }

        try {
            // Try /merchants/agents endpoint first
            const res = await fetch("http://property.reworkstaging.name.ng/v1/merchants/agents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok && (data.code === 200 || data.code === 201)) {
                setSuccess(true);
                setTimeout(() => router.push("/admin/agents"), 2000);
            } else {
                setError(data.message || data.msg || "Failed to create agent");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-sm bg-white shadow-sm transition";

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href="/admin/agents" className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium mb-4 group">
                    <span className="mr-1 group-hover:-translate-x-0.5 transition">←</span> Back to Agents
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <PlusCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Agent</h1>
                </div>
                <p className="text-gray-500 ml-13">Add a new agent to the platform. They will be able to list and manage properties.</p>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                    <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 text-green-600" />
                    <div>
                        <p className="font-semibold">Agent created successfully!</p>
                        <p className="text-sm text-green-600">Redirecting to agents list...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-500" />
                <form onSubmit={handleSubmit} className="p-7 space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className={inputClass} placeholder="e.g. John Doe" />
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company / Agency</label>
                        <div className="relative">
                            <BuildingOfficeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="e.g. Lagos Real Estate Ltd" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="agent@example.com" />
                        </div>
                    </div>

                    {/* Phone Number - NEW */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="e.g. 08012345678" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="Minimum 8 characters" minLength={8} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                        <p className="font-semibold mb-1">ℹ️ Important</p>
                        <p>Agents can only be created by administrators. Please securely share the credentials with the agent after creation.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={loading || success} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-red-100">
                            <PlusCircleIcon className="w-5 h-5" />
                            {loading ? "Creating Agent..." : "Create Agent"}
                        </button>
                        <Link href="/admin/agents" className="flex-1">
                            <button type="button" className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}