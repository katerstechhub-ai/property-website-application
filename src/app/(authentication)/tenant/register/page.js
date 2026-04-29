// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function TenantRegister() {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [formData, setFormData] = useState({
//         first_name: "",
//         last_name: "",
//         email: "",
//         phone: "",
//         password: "",
//         confirm_password: ""
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         if (formData.password !== formData.confirm_password) {
//             setError("Passwords do not match");
//             setLoading(false);
//             return;
//         }

//         if (formData.password.length < 6) {
//             setError("Password must be at least 6 characters");
//             setLoading(false);
//             return;
//         }

//         try {
//             // CORRECT ENDPOINT: POST /users
//             const res = await fetch("http://property.reworkstaging.name.ng/v1/users", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     first_name: formData.first_name,
//                     last_name: formData.last_name,
//                     email: formData.email,
//                     phone: formData.phone,
//                     password: formData.password
//                 })
//             });

//             const data = await res.json();

//             if (res.ok || data._id) {
//                 // Registration successful, redirect to login
//                 router.push("/tenant/login");
//             } else {
//                 setError(data.message || data.msg || "Registration failed. Please try again.");
//             }
//         } catch (err) {
//             console.error("Registration error:", err);
//             setError("Cannot connect to server. Please try again.");
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
//             <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//                 <div className="text-center mb-8">
//                     <div className="text-5xl mb-3">📝</div>
//                     <h1 className="text-2xl font-bold text-gray-900">Tenant Registration</h1>
//                     <p className="text-gray-500 mt-1">Create your free account</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {error && (
//                         <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
//                             {error}
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                             <input
//                                 type="text"
//                                 name="first_name"
//                                 required
//                                 value={formData.first_name}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                 placeholder="John"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                             <input
//                                 type="text"
//                                 name="last_name"
//                                 required
//                                 value={formData.last_name}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                 placeholder="Doe"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                         <input
//                             type="email"
//                             name="email"
//                             required
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="you@example.com"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             required
//                             value={formData.phone}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="08012345678"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             required
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="Minimum 6 characters"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                         <input
//                             type="password"
//                             name="confirm_password"
//                             required
//                             value={formData.confirm_password}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="Confirm your password"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
//                     >
//                         {loading ? "Creating Account..." : "Register as Tenant"}
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center text-sm">
//                     <span className="text-gray-500">Already have an account? </span>
//                     <Link href="/tenant/login" className="text-blue-600 hover:underline">
//                         Sign in
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }




"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, UserIcon, PhoneIcon, HomeIcon } from "@heroicons/react/24/outline";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-10">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-4">
                        {/* <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" /> */}
                        <HomeIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-blue-300 mt-1 text-sm">Join thousands finding their dream home</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">First Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="first_name"
                                        required
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">Last Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Phone Number</label>
                            <div className="relative">
                                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="08012345678"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirm_password"
                                    required
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2"
                        >
                            <UserIcon className="w-5 h-5" />
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link href="/tenant/login" className="text-blue-400 hover:text-blue-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}