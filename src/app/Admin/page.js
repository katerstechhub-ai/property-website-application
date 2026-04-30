"use client";

import { useActionState,} from "react";

async function registerMerchant(prevState, formData) {
    const full_name = formData.get("full_name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    let errors = {};
    if (!full_name) errors.full_name = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone is required";
    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) return { errors };

    try {
        const res = await fetch(
            "http://property.reworkstaging.name.ng/v1/merchants", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    phone,
                    password,
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return { errors: { general: data.msg || "Registration failed" } };
        }

        return {
            success: true,
            data, // The API should return the new merchant data + token here
        };
    } catch (err) {
        return { errors: { general: "Network error. Please try again." } };
    }
}

export default function CreateMerchant() {
    const [state, formAction] = useActionState(registerMerchant, {
        errors: {},
    });


    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-10">
            <form action={formAction} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-black">Create Merchant Account</h1>
                
                <div className="space-y-4">
                    <div>
                        <input name="full_name" placeholder="Full Name" className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        {state?.errors?.full_name && <p className="text-red-500 text-xs mt-1">{state.errors.full_name}</p>}
                    </div>

                    <div>
                        <input name="email" type="email" placeholder="Email Address" className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                        <input name="phone" placeholder="Phone Number" className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        {state?.errors?.phone && <p className="text-red-500 text-xs mt-1">{state.errors.phone}</p>}
                    </div>

                    <div>
                        <input type="password" name="password" placeholder="Password" className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                    </div>

                    {state?.errors?.general && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">
                            {state.errors.general}
                        </div>
                    )}

                    <button className="bg-blue-600 text-white py-3 px-6 w-full rounded font-semibold hover:bg-blue-700 transition duration-200">
                        Sign Up as Merchant
                    </button>

                    {state?.success && (
                        <div className="text-green-600 text-center mt-4 p-2 bg-green-50 rounded">
                            Merchant account created successfully!
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}