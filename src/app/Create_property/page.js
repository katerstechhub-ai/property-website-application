"use client";
import { useActionState } from "react";

/* =========================
   UPLOAD IMAGES
========================= */
async function uploadImages(propertyId, token, files) {
    const formData = new FormData();

    files.slice(0, 5).forEach((file) => {
        formData.append("images", file);
    });

    const res = await fetch(
        `http://property.reworkstaging.name.ng/v1/properties/${propertyId}/resource`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    const data = await res.json();
    console.log("📸 UPLOAD RESPONSE:", data);

    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.data)) {
        return data.data.map((img) => img.url || img.secure_url || img);
    }

    return [];
}

/* =========================
   CREATE PROPERTY
========================= */
async function registerproperty(prevState, formData) {
    const name = formData.get("name");
    const price = formData.get("price");
    const country = formData.get("country");
    const state = formData.get("state");
    const city = formData.get("city");
    const address = formData.get("address");
    const description = formData.get("description");
    const status = formData.get("status");

    let errors = {};
    if (!name) errors.name = "name is required";
    if (!price) errors.price = "price is required";
    if (!country) errors.country = "country is required";
    if (!state) errors.state = "state is required";
    if (!city) errors.city = "city is required";
    if (!address) errors.address = "address is required";
    if (!description) errors.description = "description is required";
    if (!status) errors.status = "status is required";

    if (Object.keys(errors).length > 0) return { errors };

    try {
        const token = localStorage.getItem("token");
        const merchant_data = localStorage.getItem("agent_user");

        if (!token || !merchant_data) {
            return { errors: { general: "Login expired" } };
        }

        const merchant = JSON.parse(merchant_data);

        const fileInput = document.querySelector('input[name="images"]');
        const files = fileInput?.files ? Array.from(fileInput.files) : [];

        /* =========================
           CREATE PROPERTY
        ========================= */
        const res = await fetch(
            "http://property.reworkstaging.name.ng/v1/properties",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    price,
                    country,
                    state,
                    city,
                    address,
                    description,
                    status,
                    agent: merchant.id,

                    type: "RENT",
                    property_use: "RESIDENTIAL",
                    category: "FLAT",
                    payment_plan: "PER_ANNUM",
                    furnishing: "FURNISHED",

                    lat: 34.27822,
                    lng: -118.3455,
                    total_area: "220 sqm",

                    bedroom: 2,
                    bathroom: 4,
                    toilet: 3,
                    parking_space: 1,

                    disclaimer: "Just a simple text for the user",
                    amenities: ["BEDROOM", "TOILET", "GYM"],
                }),
            }
        );

        const data = await res.json();
        console.log("RAW RESPONSE:", data);

        if (!res.ok) {
            return {
                errors: {
                    general: data?.msg || data?.message || "Failed to create property",
                },
            };
        }

        /* =========================
           🔥 FIX OBJECT ID (IMPORTANT)
        ========================= */
        const propertyId =
            data?.data?.id ||
            data?.data?._id ||
            data?.id ||
            data?._id;

        if (!propertyId) {
            return {
                errors: {
                    general: "Property ID not returned from API",
                },
            };
        }

        console.log("✅ REAL PROPERTY ID:", propertyId);

        /* =========================
           UPLOAD IMAGES
        ========================= */
        let uploadedImages = [];
        if (files.length > 0) {
            uploadedImages = await uploadImages(propertyId, token, files);
        }

        /* =========================
           SAVE LOCALLY
        ========================= */
        const existing = JSON.parse(
            localStorage.getItem("my_properties") || "[]"
        );

        const newProperty = {
            id: propertyId,
            name,
            price,
            city,
            address,
            status,
            images: uploadedImages, // ✅ REAL IMAGE URLs
            createdAt: new Date().toISOString(),
        };

        existing.push(newProperty);

        localStorage.setItem("my_properties", JSON.stringify(existing));

        console.log("✅ SAVED PROPERTY:", newProperty);

        return { success: true, errors: {} };
    } catch (err) {
        console.error("ERROR:", err);
        return { errors: { general: "Network error" } };
    }
}

/* =========================
   UI
========================= */
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
                    Create Property
                </h1>
                <div>
                    <input
                        name="name"
                        placeholder="Name"
                        className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                    />
                    {state?.errors?.name && (
                        <p className="text-red-500 text-xs">
                            {state.errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <input name="price" placeholder="Price" className="w-full p-3 border border-gray-300 rounded bg-white text-black" />
                    {state?.errors?.price && (
                        <p className="text-red-500 text-xs">
                            {state.errors.price}
                        </p>
                    )}
                </div>
                <div>
                    <input name="country" placeholder="Country" className="w-full p-3 border border-gray-300 rounded bg-white text-black" />
                    {state?.errors?.country && (
                        <p className="text-red-500 text-xs">
                            {state.errors.country}
                        </p>
                    )}
                </div>
                <div>
                    <input name="state" placeholder="State" className="w-full p-3 border border-gray-300 rounded bg-white text-black" />
                    {state?.errors?.state && (
                        <p className="text-red-500 text-xs">
                            {state.errors.state}
                        </p>
                    )}
                </div>

                <div>
                    <input name="city" placeholder="City" className="w-full p-3 border border-gray-300 rounded bg-white text-black" />
                    {state?.errors?.city && (
                        <p className="text-red-500 text-xs">
                            {state.errors.city}
                        </p>
                    )}
                </div>
                <div>
                    <input name="address" placeholder="Address" className="w-full p-3 border border-gray-300 rounded bg-white text-black" />
                    {state?.errors?.address && (
                        <p className="text-red-500 text-xs">
                            {state.errors.address}
                        </p>
                    )}
                </div>
                <div>
                    <select
                        name="status"
                        className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                        defaultValue="AVAILABLE"
                    >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="SOLD">SOLD</option>
                    </select>

                    {state?.errors?.status && (
                        <p className="text-red-500 text-xs">
                            {state.errors.status}
                        </p>
                    )}
                </div>

                <textarea
                    name="description"
                    placeholder="Description"
                    className="input h-24 w-full text-black border- border-gray-300"
                />

                <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="w-full border p-2 rounded"
                />

                {state?.errors?.general && (
                    <p className="text-red-500 text-sm text-center">
                        {state.errors.general}
                    </p>
                )}

                <button className="bg-blue-600 text-white w-full py-3 rounded-lg">
                    Create Property
                </button>

                {state?.success && (
                    <p className="text-green-600 text-center">
                        Property created 🎉
                    </p>
                )}
            </form>
        </div>
    );

}