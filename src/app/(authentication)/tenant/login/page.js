"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Color Palette
const COLORS = {
  primary: '#6E473B',
  secondary: '#BE85A9',
  background: '#F5F0ED',
  cardBg: '#FFFFFF',
  textLight: '#A7807B',
  textDark: '#291COE',
  border: '#E1D4C2'
};

export default function TenantLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                const userData = { ...data.data, role: data.data.role || "tenant" };
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(userData));
                router.push("/tenant");
            } else {
                setError(data.msg || "Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: COLORS.background }}>
            <div className="max-w-md w-full">
                {/* Back to Home */}
                <div className="mb-6">
                    <Link href="/public" className="inline-flex items-center gap-2 text-sm transition hover:opacity-70" style={{ color: COLORS.primary }}>
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg mb-4" style={{ backgroundColor: COLORS.primary }}>
                        <HomeIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold" style={{ color: COLORS.textDark }}>Welcome Back</h1>
                    <p className="mt-1 text-sm" style={{ color: COLORS.textLight }}>Sign in to find your dream property</p>
                </div>

                <div className="rounded-2xl p-8 shadow-xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: `${COLORS.primary}10`, border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                        >
                            <HomeIcon className="w-5 h-5" />
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 text-center text-sm" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <span style={{ color: COLORS.textLight }}>Don't have an account? </span>
                        <Link href="/tenant/register" className="font-medium hover:underline" style={{ color: COLORS.primary }}>
                            Register here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}