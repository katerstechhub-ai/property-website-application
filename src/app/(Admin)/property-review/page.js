"use client";
import { useActionState } from "react";

async function registerproperty(prevState, formData) {
    const text = formData.get("text");

    let errors = {};
    if (!text) errors.text = "text is required";

    if (Object.keys(errors).length > 0) return { errors };

    try {
        if (typeof window === "undefined")
            return { errors: { general: "Client error" } };

        const token = localStorage.getItem("token");

        // ✅ FIX: properly parse property + user
        const property = JSON.parse(
            localStorage.getItem("my_properties") || "{}"
        );

        const user = JSON.parse(
            localStorage.getItem("agent_user") || "{}"
        );

        if (!token || !property?.id || !user?.id) {
            return { errors: { general: "Missing login or property" } };
        }

        const payload = {
            property_id: property.id,   // ✅ FIXED
            user_id: user.id,           // ✅ FIXED
            text,                       // ✅ FIXED
        };

        console.log("📦 FINAL PAYLOAD:", payload);

        const res = await fetch(
            "http://property.reworkstaging.name.ng/v1/reviews",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();
        console.log("RAW RESPONSE:", data);

        if (!res.ok) {
            return {
                errors: {
                    general:
                        data?.msg ||
                        data?.message ||
                        "Failed to create review",
                },
            };
        }

        return { success: true, errors: {} };

    } catch (err) {
        console.error("ERROR:", err);
        return { errors: { general: "Network error" } };
    }
}



export default function Create_property() {
    const [state, formAction] = useActionState(registerproperty, {
        errors: {},
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
            <form
                action={formAction}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4"
            >
                <h1 className="text-2xl font-bold text-center text-black">
                    Create reviews
                </h1>
                <div>
                    <input
                        name="text"
                        placeholder="text"
                        className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                    />
                    {state?.errors?.text && (
                        <p className="text-red-500 text-xs">
                            {state.errors.text}
                        </p>
                    )}
                </div>

                {state?.errors?.general && (
                    <p className="text-red-500 text-sm text-center">
                        {state.errors.general}
                    </p>
                )}

                <button className="bg-blue-600 text-white w-full py-3 rounded-lg">
                    Create reviews
                </button>

                {state?.success && (
                    <p className="text-green-600 text-center">
                        reviews created 🎉
                    </p>
                )}
            </form>
        </div>
    );
}

