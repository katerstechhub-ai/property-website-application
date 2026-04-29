"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.code === 200 && data.data) {
                const role = data.data.role?.toLowerCase();
                if (role !== "admin" && role !== "merchant") {
                    setError("Access denied. This portal is for administrators only.");
                    setLoading(false);
                    return;
                }
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify({ ...data.data }));
                router.push("/admin");
            } else {
                setError(data.msg || "Invalid email or password.");
            }
        } catch (err) {
            setError("Cannot connect to server. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 px-4 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-700/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-700/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-900/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl shadow-2xl shadow-red-900/50 mb-4 ring-4 ring-red-500/20">
                        <ShieldCheckIcon className="w-11 h-11 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-red-300/80 mt-2 text-sm">Restricted access — authorized personnel only</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/8 border border-white/15 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 outline-none transition"
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-white/8 border border-white/15 text-white placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 outline-none transition"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-900/40 mt-2"
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            {loading ? "Authenticating..." : "Sign in as Admin"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 pt-5 border-t border-white/10">
                        <p className="text-center text-xs text-gray-500">
                            Not an admin?{" "}
                            <Link href="/tenant/login" className="text-red-400 hover:text-red-300 transition">
                                Tenant login
                            </Link>
                            {" · "}
                            <Link href="/agent/login" className="text-red-400 hover:text-red-300 transition">
                                Agent login
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/public" className="text-gray-500 hover:text-gray-300 text-sm transition">
                        ← Back to site
                    </Link>
                </div>
            </div>
        </div>
    );
}