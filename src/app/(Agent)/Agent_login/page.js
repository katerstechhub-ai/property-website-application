"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

async function registerAgent(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    let errors = {};
    if (!email) errors.email = "Email is required";
    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) return { errors };

    try {
        const res = await fetch(
            "http://property.reworkstaging.name.ng/v1/auth/login", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        const data = await res.json();

        // 🔍 DEBUG: SEE WHAT API RETURNS
        console.log("LOGIN RESPONSE:", data);

        if (!res.ok) {
            return { errors: { general: data.msg || "Login failed" } };
        }

        // ✅ SAFE TOKEN EXTRACTION
        const token = data.token || data?.data?.token;
        const user = data.user || data?.data?.user || data;

        if (!token) {
            return { errors: { general: "Token not found in response" } };
        }

        // // --- SAVING DATA ---
        // if (typeof window !== "undefined") {
        //     localStorage.setItem("m_user", JSON.stringify(user));
        //     localStorage.setItem("token", token);
        // }

        return {
            success: true,
            user,
        };
    } catch (err) {
        return { errors: { general: "Network error. Please try again." } };
    }
}

export default function CreateMerchant() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(registerAgent, {
        errors: {},
    });

    // ✅ Redirect after login
    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                router.push("/dashboard"); // ✅ now active
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [state?.success, router]);

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
            <form action={formAction} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
             
                
                <div className="space-y-4">
                    <div>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                    </div>

                    {state?.errors?.general && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                            {state.errors.general}
                        </div>
                    )}

                    <button 
                        disabled={isPending}
                        className="bg-blue-600 text-white py-3 px-6 w-full rounded font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
                    >
                        {isPending ? "Logging in..." : "Sign In"}
                    </button>

                    {state?.success && (
                        <div className="text-green-600 text-center mt-4 p-2 bg-green-50 rounded">
                            Welcome back! Redirecting to dashboard...
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}