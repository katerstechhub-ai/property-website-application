"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HomeIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    PlusCircleIcon,
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
    CheckCircleIcon,
    UserGroupIcon,
    SparklesIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";
const getAgentId = (a) => a?._id || a?.id || null;

// Toast Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500";

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div
                className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}
            >
                {type === "success" && <CheckCircleIcon className="w-5 h-5" />}
                {type === "error" && <XMarkIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-auto hover:opacity-80">
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Helper: compress image before upload
const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            let { width, height } = img;
            const MAX_DIM = 1200;
            if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height) {
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM;
                } else {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);

            canvas.toBlob(
                (blob) => {
                    if (blob.size / 1024 > maxSizeKB) {
                        canvas.toBlob(
                            (blob2) =>
                                resolve(
                                    new File([blob2], file.name, {
                                        type: "image/jpeg",
                                    })
                                ),
                            "image/jpeg",
                            0.6
                        );
                    } else {
                        resolve(
                            new File([blob], file.name, { type: "image/jpeg" })
                        );
                    }
                },
                "image/jpeg",
                0.8
            );
        };

        img.src = url;
    });
};

export default function AdminCreateProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [agents, setAgents] = useState([]);
    const [toast, setToast] = useState(null);

    // Image state
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        country: "NIGERIA",
        state: "",
        city: "",
        address: "",
        description: "",
        category: "FLAT",
        type: "RENT",
        payment_plan: "PER_ANNUM",
        furnishing: "UNFURNISHED",
        property_use: "RESIDENTIAL",
        bedroom: 0,
        bathroom: 0,
        toilet: 0,
        parking_space: 0,
        total_area: "",
        amenities: [],
        agent: "",
    });
    const [amenitiesInput, setAmenitiesInput] = useState("");

    const showToast = (message, type) => setToast({ message, type });

    useEffect(() => {
        fetchAgents();
    }, []);

    // Revoke blob URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
            });
        };
    }, [imagePreviews]);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE}/merchants/agents`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const list = Array.isArray(data.data)
                ? data.data
                : Array.isArray(data)
                ? data
                : [];
            setAgents(
                list.map((a) => ({
                    _id: getAgentId(a),
                    full_name: a.full_name || a.name || "Unknown",
                    company: a.company || "",
                }))
            );
        } catch {
            // fail silently — agents list is optional
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const addAmenity = () => {
        const trimmed = amenitiesInput.trim().toUpperCase();
        if (trimmed && !formData.amenities.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, trimmed],
            }));
            setAmenitiesInput("");
        }
    };

    const removeAmenity = (a) =>
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((x) => x !== a),
        }));

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const remaining = 5 - imageFiles.length;

        if (files.length > remaining) {
            showToast(
                `You can only add ${remaining} more image(s). Max 5 total.`,
                "error"
            );
            return;
        }

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setImageFiles((prev) => [...prev, ...files]);
        showToast(`${files.length} image(s) added`, "success");

        // Reset input so the same file can be re-selected if removed
        e.target.value = "";
    };

    const removeFile = (index) => {
        if (
            imagePreviews[index] &&
            imagePreviews[index].startsWith("blob:")
        ) {
            URL.revokeObjectURL(imagePreviews[index]);
        }
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (propertyId, token) => {
        setUploading(true);
        setUploadStatus("Compressing & uploading images...");

        try {
            const fd = new FormData();
            const compressed = await Promise.all(
                imageFiles.map((f) => compressImage(f))
            );
            compressed.forEach((file) => fd.append("images", file));

            const res = await fetch(
                `${BASE}/properties/${propertyId}/resource`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                }
            );
            const data = await res.json();

            if (res.ok || data.code === 200 || data.status === "success") {
                showToast("Images uploaded successfully!", "success");
            } else {
                showToast(
                    `Image upload failed: ${data.message || "unknown error"}`,
                    "error"
                );
            }
        } catch (err) {
            console.error("Upload error:", err);
            showToast(
                "Property created but images failed to upload.",
                "error"
            );
        } finally {
            setUploading(false);
            setUploadStatus("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            showToast("Please add at least one image.", "error");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        const submitData = {
            name: formData.name,
            price: String(formData.price).replace(/,/g, ""),
            country: formData.country,
            state: formData.state.toUpperCase(),
            city: formData.city,
            address: formData.address,
            description: formData.description,
            category: formData.category,
            type: formData.type,
            payment_plan: formData.payment_plan,
            furnishing: formData.furnishing,
            property_use: formData.property_use,
            bedroom: formData.bedroom,
            bathroom: formData.bathroom,
            toilet: formData.toilet,
            parking_space: formData.parking_space,
            total_area: formData.total_area,
            amenities: formData.amenities,
        };

        if (formData.agent?.trim()) submitData.agent = formData.agent.trim();

        try {
            const res = await fetch(`${BASE}/properties`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (
                res.ok ||
                data.code === 200 ||
                data.code === 201 ||
                data.status === "success"
            ) {
                const propertyId =
                    data.data?._id ||
                    data.data?.id ||
                    data._id ||
                    data.id ||
                    data.data?.data?._id ||
                    data.data?.data?.id;

                if (propertyId) {
                    await uploadImages(propertyId, token);
                } else {
                    showToast(
                        "Property created but image upload skipped — ID not found.",
                        "error"
                    );
                }

                setSuccess(true);
                showToast(
                    "Property created successfully! Redirecting...",
                    "success"
                );
                setTimeout(() => router.push("/admin/properties"), 2500);
            } else {
                showToast(
                    data.message || data.msg || "Failed to create property.",
                    "error"
                );
            }
        } catch (err) {
            console.error("Create property error:", err);
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "FLAT",
        "APPARTMENT",
        "LAND",
        "DUPLEX",
        "WAREHOUSE",
        "SHOP",
        "VILLA",
        "COMMERCIAL",
    ];
    const types = ["RENT", "SALES", "LEASE"];
    const paymentPlans = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
    const furnishingOptions = ["FURNISHED", "UNFURNISHED", "SEMI_FURNISHED"];
    const propertyUses = ["RESIDENTIAL", "COMMERCIAL"];

    const inputClass =
        "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white transition";
    const selectClass =
        "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white appearance-none transition";

    const isBusy = loading || uploading || success;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/properties"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-4 group transition"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition" />
                        Back to Properties
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <PlusCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create New Property
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Add a new property listing to the platform
                            </p>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 shrink-0" />
                        <div>
                            <p className="font-semibold">
                                Property created successfully!
                            </p>
                            <p className="text-sm text-green-600">
                                Redirecting...
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
                    <div className="p-6 space-y-8">

                        {/* Basic Info */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <HomeIcon className="w-5 h-5 text-emerald-500" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g., Luxury Beachfront Villa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₦) *
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g., 350000000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-emerald-500" />
                                Location
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g., Lagos"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g., Lekki"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Full property address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5 h-5 text-emerald-500" />
                                Property Details
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        {types.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Plan
                                    </label>
                                    <select
                                        name="payment_plan"
                                        value={formData.payment_plan}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        {paymentPlans.map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Furnishing
                                    </label>
                                    <select
                                        name="furnishing"
                                        value={formData.furnishing}
                                        onChange={handleChange}
                                        className={selectClass}
                                    >
                                        {furnishingOptions.map((o) => (
                                            <option key={o} value={o}>
                                                {o}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rooms & Spaces */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Rooms & Spaces
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { label: "Bedrooms", name: "bedroom" },
                                    { label: "Bathrooms", name: "bathroom" },
                                    { label: "Toilets", name: "toilet" },
                                    { label: "Parking", name: "parking_space" },
                                ].map((f) => (
                                    <div key={f.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {f.label}
                                        </label>
                                        <input
                                            type="number"
                                            name={f.name}
                                            value={formData[f.name]}
                                            onChange={handleNumberChange}
                                            className={inputClass}
                                            min="0"
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Area
                                    </label>
                                    <input
                                        type="text"
                                        name="total_area"
                                        value={formData.total_area}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="e.g., 250 sqm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Use */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Use
                            </label>
                            <select
                                name="property_use"
                                value={formData.property_use}
                                onChange={handleChange}
                                className={`${selectClass} max-w-xs`}
                            >
                                {propertyUses.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={inputClass}
                                placeholder="Describe the property in detail..."
                            />
                        </div>

                        {/* Assign Agent */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5 text-emerald-500" />
                                Assign to Agent
                            </h2>
                            {agents.length === 0 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>
                                        No agents found.{" "}
                                        <Link
                                            href="/admin/agents/create"
                                            className="font-semibold underline hover:text-amber-900"
                                        >
                                            Create an agent first.
                                        </Link>
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <select
                                        name="agent"
                                        value={formData.agent}
                                        onChange={handleChange}
                                        className={`${selectClass} max-w-md`}
                                    >
                                        <option value="">
                                            -- Select an agent (optional) --
                                        </option>
                                        {agents.map((agent) => (
                                            <option
                                                key={agent._id}
                                                value={agent._id}
                                            >
                                                {agent.full_name}
                                                {agent.company
                                                    ? ` (${agent.company})`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {agents.length} agent
                                        {agents.length !== 1 ? "s" : ""}{" "}
                                        available
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-emerald-500" />
                                Amenities
                            </h2>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={amenitiesInput}
                                    onChange={(e) =>
                                        setAmenitiesInput(e.target.value)
                                    }
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                    placeholder="e.g., SWIMMING_POOL, GYM, PARKING"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addAmenity();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addAmenity}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map((amenity, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2"
                                    >
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAmenity(amenity)
                                            }
                                            className="hover:text-emerald-900 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5 text-emerald-500" />
                                Property Images{" "}
                                <span className="text-sm font-normal text-gray-400">
                                    (up to 5)
                                </span>
                            </h2>

                            {imageFiles.length < 5 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition hover:bg-emerald-50/30">
                                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-2">
                                        Click to upload property images
                                    </p>
                                    <p className="text-xs text-gray-400 mb-4">
                                        {5 - imageFiles.length} slot(s)
                                        remaining · JPG, PNG, WEBP
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer shadow-sm"
                                    >
                                        <ArrowUpTrayIcon className="w-4 h-4" />
                                        Select Images
                                    </label>
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        {imagePreviews.length} image(s) selected
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {imagePreviews.map((preview, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:border-emerald-400 transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(idx)
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <XMarkIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={isBusy}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        {uploadStatus || "Uploading..."}
                                    </>
                                ) : loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        Creating Property...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        Create Property
                                    </>
                                )}
                            </button>
                            <Link href="/admin/properties" className="flex-1">
                                <button
                                    type="button"
                                    disabled={isBusy}
                                    className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}