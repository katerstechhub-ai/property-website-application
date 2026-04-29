// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function AgentRegister() {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [formData, setFormData] = useState({
//         full_name: "",
//         company: "",
//         email: "",
//         phone: "",
//         password: "",
//         confirm_password: ""
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
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
//             const res = await fetch("http://property.reworkstaging.name.ng/v1/agents", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     full_name: formData.full_name,
//                     company: formData.company,
//                     email: formData.email,
//                     phone: formData.phone,
//                     password: formData.password
//                 })
//             });

//             const data = await res.json();

//             if (res.ok || data._id) {
//                 router.push("/agent/login");
//             } else {
//                 setError(data.message || "Registration failed. Please try again.");
//             }
//         } catch (err) {
//             setError("Something went wrong. Please check your connection.");
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100 px-4 py-8">
//             <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//                 <div className="text-center mb-8">
//                     <div className="text-5xl mb-3">📝</div>
//                     <h1 className="text-2xl font-bold text-gray-900">Agent Registration</h1>
//                     <p className="text-gray-500 mt-1">Join as a property agent</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {error && (
//                         <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
//                             {error}
//                         </div>
//                     )}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                         <input
//                             type="text"
//                             name="full_name"
//                             required
//                             value={formData.full_name}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="John Doe"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
//                         <input
//                             type="text"
//                             name="company"
//                             value={formData.company}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="Real Estate Agency"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
//                         <input
//                             type="email"
//                             name="email"
//                             required
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="agent@example.com"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             required
//                             value={formData.phone}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="08012345678"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
//                         <input
//                             type="password"
//                             name="password"
//                             required
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="Minimum 6 characters"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
//                         <input
//                             type="password"
//                             name="confirm_password"
//                             required
//                             value={formData.confirm_password}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
//                             placeholder="Confirm your password"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
//                     >
//                         {loading ? "Creating Account..." : "Register as Agent"}
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center text-sm">
//                     <span className="text-gray-500">Already have an account? </span>
//                     <Link href="/agent/login" className="text-purple-600 hover:underline">
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
import { LockClosedIcon, EnvelopeIcon, UserIcon, PhoneIcon, BuildingOfficeIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

export default function AgentRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        company: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            const res = await fetch("http://property.reworkstaging.name.ng/v1/agents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    company: formData.company,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (data.code === 200 || data._id) {
                router.push("/agent/login");
            } else {
                setError(data.msg || data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4 py-10">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-2xl shadow-lg mb-4">
                        {/* <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" /> */}
                        <BriefcaseIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Agent Registration</h1>
                    <p className="text-purple-300 mt-1 text-sm">Join as a property agent</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Company Name <span className="text-gray-400 text-xs">(Optional)</span></label>
                            <div className="relative">
                                <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Real Estate Agency"
                                />
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
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="agent@example.com"
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
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
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
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
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
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2"
                        >
                            <BriefcaseIcon className="w-5 h-5" />
                            {loading ? "Creating Account..." : "Register as Agent"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/10 text-center text-sm">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link href="/agent/login" className="text-purple-400 hover:text-purple-300 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}