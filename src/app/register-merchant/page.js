"use client";
import { useState } from "react";

export default function RegisterMerchant() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: ""
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/merchants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setResult({ success: res.ok, data });
            
            if (res.ok) {
                // Try to login immediately after registration
                const loginRes = await fetch("http://property.reworkstaging.name.ng/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                const loginData = await loginRes.json();
                
                if (loginData.code === 200 && loginData.data) {
                    localStorage.setItem("token", loginData.data.token);
                    localStorage.setItem("user", JSON.stringify(loginData.data));
                    setTimeout(() => {
                        window.location.href = "/admin";
                    }, 2000);
                }
            }
        } catch (err) {
            setResult({ success: false, error: err.message });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-2">Register as Merchant</h1>
                <p className="text-gray-400 text-sm mb-6">Create a merchant account to manage agents and properties</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="merchant@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="08012345678"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Registering..." : "Register as Merchant"}
                    </button>
                </form>

                {result && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${result.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                        <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-6 text-center text-gray-500 text-xs">
                    <p>Note: Merchant accounts can create agents and manage properties</p>
                </div>
            </div>
        </div>
    );
}