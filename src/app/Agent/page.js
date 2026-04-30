"use client";

import { useActionState } from "react";

async function registerAgent(prevState, formData) {
    const full_name = formData.get("full_name");
    const company = formData.get("company");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    let errors = {};
    if (!full_name) errors.full_name = "Full name is required";
    if (!company) errors.company = "Company is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone is required";
    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) return { errors };

    try {
        // ✅ GET TOKEN
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        if (!token) {
            return {
                errors: { general: "Session expired. Please login again." },
            };
        }

        const res = await fetch(
            "http://property.reworkstaging.name.ng/v1/agents",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    full_name,
                    company,
                    email,
                    phone,
                    password,
                }),
            }
        );

        const data = await res.json();

        // ❌ HANDLE ERRORS (INCLUDING EXPIRED TOKEN)
        if (!res.ok) {
            const message =
                data?.message || data?.msg || "Agent creation failed";

            // 🔥 TOKEN EXPIRED HANDLING
            if (message.toLowerCase().includes("expired")) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("merchant_user");
                }

                // redirect after short delay
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);

                return {
                    errors: {
                        general: "Session expired. Redirecting to login...",
                    },
                };
            }

            return { errors: { general: message } };
        }

        // ✅ SAVE AGENT
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "agent_user",
                JSON.stringify(data.user || data)
            );
        }
       
        return {
            success: true,
            data,
        };
    } catch (err) {
        return { errors: { general: "Network error. Please try again." } };
    }
}

export default function CreateAgent() {
    const [state, formAction] = useActionState(registerAgent, {
        errors: {},
    });

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
            <form
                action={formAction}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Create Agent
                </h1>

                <div className="space-y-4">
                    <div>
                        <input
                            name="full_name"
                            placeholder="Full Name"
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        />
                        {state?.errors?.full_name && (
                            <p className="text-red-500 text-xs">
                                {state.errors.full_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            name="company"
                            placeholder="Company"
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        />
                        {state?.errors?.company && (
                            <p className="text-red-500 text-xs">
                                {state.errors.company}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        />
                        {state?.errors?.email && (
                            <p className="text-red-500 text-xs">
                                {state.errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            name="phone"
                            placeholder="Phone"
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        />
                        {state?.errors?.phone && (
                            <p className="text-red-500 text-xs">
                                {state.errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        />
                        {state?.errors?.password && (
                            <p className="text-red-500 text-xs">
                                {state.errors.password}
                            </p>
                        )}
                    </div>

                    {state?.errors?.general && (
                        <div className="text-red-500 text-sm text-center">
                            {state.errors.general}
                        </div>
                    )}

                    <button className="bg-blue-600 text-white py-3 w-full rounded">
                        Create Agent
                    </button>

                    {state?.success && (
                        <div className="text-green-600 text-center mt-2">
                            Agent created successfully!
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}