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

        if (!res.ok) {
            return {
                errors: {
                    general:
                        data?.message ||
                        data?.msg ||
                        "Agent creation failed",
                },
            };
        }

        // =========================
        // ✅ FIXED LOCALSTORAGE LOGIC
        // =========================
        const newAgent = data?.data || data?.user || data;

        const existingAgents = JSON.parse(
            localStorage.getItem("agent_user") || "[]"
        );

        const isArray = Array.isArray(existingAgents);

        const agentsArray = isArray ? existingAgents : [];

        const exists = agentsArray.some((a) => a.id === newAgent.id);

        if (!exists) {
            agentsArray.push(newAgent);
        }

        localStorage.setItem("agent_user", JSON.stringify(agentsArray));

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
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Agent
                </h1>

                <input name="full_name" placeholder="Full Name" className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" />
                <input name="company" placeholder="Company" className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" />
                <input name="email" placeholder="Email" className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" />
                <input name="phone" placeholder="Phone" className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" />
                <input name="password" type="password" placeholder="Password" className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4" />

                {state?.errors?.general && (
                    <p className="text-red-500 text-sm">{state.errors.general}</p>
                )}

                <button className="bg-blue-600 text-white w-full py-3 mt-4">
                    Create Agent
                </button>

                {state?.success && (
                    <p className="text-green-600 text-center mt-2">
                        Agent created successfully
                    </p>
                )}
            </form>
        </div>
    );
}