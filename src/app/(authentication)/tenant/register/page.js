"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, UserIcon, PhoneIcon, HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

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

export default function TenantRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (data.code === 200 || data._id) {
                router.push("/tenant/login");
            } else {
                setError(data.msg || data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Cannot connect to server. Please try again.");
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
                    <h1 className="text-3xl font-bold" style={{ color: COLORS.textDark }}>Create Account</h1>
                    <p className="mt-1 text-sm" style={{ color: COLORS.textLight }}>Join thousands finding their dream home</p>
                </div>

                <div className="rounded-2xl p-8 shadow-xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: `${COLORS.primary}10`, border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>First Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COLORS.textLight }} />
                                    <input
                                        type="text"
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 text-sm"
                                        style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Last Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COLORS.textLight }} />
                                    <input
                                        type="text"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 text-sm"
                                        style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Phone Number</label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="08012345678"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textDark }}>Confirm Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                <input
                                    type="password"
                                    name="confirm_password"
                                    required
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2"
                            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                        >
                            <UserIcon className="w-5 h-5" />
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 text-center text-sm" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <span style={{ color: COLORS.textLight }}>Already have an account? </span>
                        <Link href="/tenant/login" className="font-medium hover:underline" style={{ color: COLORS.primary }}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}