"use client";
import { useState } from "react";

export default function CreateAdmin() {
    const [formData, setFormData] = useState({
        full_name: "Benjamin Kater",
        email: "benjamin@admin.com",
        phone: "08012345678",
        password: "12345678"
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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
                // Auto login after registration
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-2">Create Admin Account</h1>
                <p className="text-gray-400 text-sm mb-6">Register a new merchant/admin account</p>

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
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {loading ? "Creating..." : "Create Admin Account"}
                    </button>
                </form>

                {result && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${result.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                        <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}