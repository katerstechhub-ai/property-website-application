// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function TenantLogin() {
//     const router = useRouter();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [debugInfo, setDebugInfo] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setDebugInfo(null);

//         try {
//             const response = await fetch("http://property.reworkstaging.name.ng/v1/auth/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await response.json();
//             setDebugInfo({ status: response.status, data });

//             if (response.ok && data.token) {
//                 localStorage.setItem("token", data.token);
//                 localStorage.setItem("user", JSON.stringify(data.user || { email }));

//                 const userRole = data.user?.role?.toLowerCase() || "";

//                 if (userRole === "admin" || userRole === "merchant") {
//                     router.push("/admin");
//                 } else if (userRole === "agent") {
//                     router.push("/agent");
//                 } else {
//                     router.push("/tenant");
//                 }
//             } else {
//                 setError(data.message || data.msg || `Error ${response.status}: Login failed`);
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError("Cannot connect to server. Please check your connection.");
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//             <div className="text-center mb-8">
//                 <div className="text-5xl mb-3">🏠</div>
//                 <h1 className="text-2xl font-bold text-gray-900">Tenant Login</h1>
//                 <p className="text-gray-500 mt-1">Sign in to find your dream property</p>
//             </div>

//             {/* Debug Info */}
//             {debugInfo && (
//                 <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs overflow-auto">
//                     <p className="font-semibold">API Response:</p>
//                     <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 {error && (
//                     <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
//                         {error}
//                     </div>
//                 )}

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                     <input
//                         type="email"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         placeholder="your@email.com"
//                         autoComplete="email"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                     <input
//                         type="password"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                         placeholder="Enter your password"
//                         autoComplete="current-password"
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
//                 >
//                     {loading ? "Signing in..." : "Sign in as Tenant"}
//                 </button>
//             </form>

//             <div className="mt-6 text-center text-sm">
//                 <span className="text-gray-500">Don't have an account? </span>
//                 <Link href="/tenant/register" className="text-blue-600 hover:underline">
//                     Register as Tenant
//                 </Link>
//             </div>

//             <div className="mt-4 text-center text-xs text-gray-400">
//                 <Link href="/public" className="hover:text-gray-600">← Browse as Guest</Link>
//             </div>
//         </div>
//     );
// }




"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function TenantLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit triggered", { email, password });
        setLoading(true);
        setError("");
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log("API response:", data);  // add this line
            console.log("HTTP status:", res.status);  // add this too



            if (data.code === 200 && data.data) {
                const userData = { ...data.data, role: data.data.role || "tenant" }; // change role default per file
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(userData));
                router.push("/tenant"); // change per file
            } else {
                setError(data.msg || "Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-4">
                        {/* <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" /> */}
                        <HomeIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-blue-300 mt-1 text-sm">Sign in to find your dream property</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                        >
                            <HomeIcon className="w-5 h-5" />
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm">
                        <span className="text-gray-400">Don't have an account? </span>
                        <Link href="/tenant/register" className="text-blue-400 hover:text-blue-300 font-medium">
                            Register here
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/public" className="text-gray-400 hover:text-white text-sm transition">
                        ← Browse as Guest
                    </Link>
                </div>
            </div>
        </div>
    );
}