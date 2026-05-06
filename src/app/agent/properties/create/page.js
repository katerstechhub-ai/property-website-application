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
    SparklesIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bg = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`${bg} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}>
                {type === "success" && <CheckCircleIcon className="w-5 h-5 shrink-0" />}
                {type === "error" && <XMarkIcon className="w-5 h-5 shrink-0" />}
                <span className="text-sm font-medium flex-1">{message}</span>
                <button onClick={onClose} className="hover:opacity-80"><XMarkIcon className="w-4 h-4" /></button>
            </div>
        </div>
    );
}

const compressImage = (file) => new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
        let { width, height } = img;
        const MAX = 1200;
        if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
            else { width = Math.round(width * MAX / height); height = MAX; }
        }
        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob(blob => {
            if (blob.size / 1024 > 500) {
                canvas.toBlob(b2 => resolve(new File([b2], file.name, { type: "image/jpeg" })), "image/jpeg", 0.6);
            } else {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
            }
        }, "image/jpeg", 0.8);
    };
    img.src = url;
});

export default function AgentCreateProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [toast, setToast] = useState(null);
    const [agentId, setAgentId] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [amenitiesInput, setAmenitiesInput] = useState("");

    const [formData, setFormData] = useState({
        name: "", price: "", country: "NIGERIA", state: "", city: "",
        address: "", description: "", category: "FLAT", type: "RENT",
        payment_plan: "PER_ANNUM", furnishing: "UNFURNISHED",
        property_use: "RESIDENTIAL", bedroom: 0, bathroom: 0,
        toilet: 0, parking_space: 0, total_area: "", amenities: [],
    });

    const showToast = (message, type) => setToast({ message, type });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/agent/login"); return; }
        const user = JSON.parse(userData);

        // Agent role check
        if (user.role?.toLowerCase() !== "agent") {
            router.push("/agent/login");
            return;
        }

        // The agent ID is what gets sent as the 'agent' field on the property
        const id = user.id || user._id;
        if (!id) {
            showToast("Agent ID not found. Please login again.", "error");
            router.push("/agent/login");
            return;
        }
        setAgentId(id);
    }, []);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => imagePreviews.forEach(p => { if (p.startsWith("blob:")) URL.revokeObjectURL(p); });
    }, [imagePreviews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const addAmenity = () => {
        const trimmed = amenitiesInput.trim().toUpperCase();
        if (trimmed && !formData.amenities.includes(trimmed)) {
            setFormData(prev => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
            setAmenitiesInput("");
        }
    };

    const removeAmenity = (a) =>
        setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }));

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const total = imageFiles.length + files.length;
        if (total > 5) { showToast(`Max 5 images. You already have ${imageFiles.length}.`, "error"); return; }
        const previews = files.map(f => URL.createObjectURL(f));
        setImageFiles(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...previews]);
        showToast(`${files.length} image(s) added`, "success");
    };

    const removeFile = (idx) => {
        if (imagePreviews[idx]?.startsWith("blob:")) URL.revokeObjectURL(imagePreviews[idx]);
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const uploadImages = async (propertyId, token) => {
        setUploading(true);
        setUploadStatus("Compressing images...");
        try {
            const compressed = await Promise.all(imageFiles.map(f => compressImage(f)));
            const fd = new FormData();
            compressed.forEach(f => fd.append("images", f));
            setUploadStatus("Uploading images...");
            const res = await fetch(`${BASE}/properties/${propertyId}/resource`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (res.ok || data.code === 200 || data.type === "SUCCESS") {
                showToast("Images uploaded!", "success");
            } else {
                showToast(`Images failed: ${data.message || "unknown error"}`, "error");
            }
        } catch (err) {
            showToast("Image upload failed. Property was still created.", "error");
        } finally {
            setUploading(false);
            setUploadStatus("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agentId) { showToast("Agent ID missing. Please login again.", "error"); return; }
        if (imageFiles.length === 0) { showToast("Please add at least one image.", "error"); return; }
        if (imageFiles.length > 5) { showToast("Maximum 5 images allowed.", "error"); return; }

        setLoading(true);
        const token = localStorage.getItem("token");

        // Per API docs: agent field must be the agent's ID
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
            agent: agentId,  // ← Required: agent's own ID when creating as agent
        };

        console.log("Creating property with agent:", agentId);
        console.log("Submit data:", submitData);

        try {
            const res = await fetch(`${BASE}/properties`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();
            console.log("Create property response:", data);

            if (res.ok || data.code === 200 || data.code === 201 || data.type === "SUCCESS") {
                const propertyId =
                    data.data?._id || data.data?.id ||
                    data._id || data.id;

                if (propertyId && imageFiles.length > 0) {
                    await uploadImages(propertyId, token);
                } else if (!propertyId) {
                    showToast("Property created but couldn't upload images — ID not returned.", "error");
                }

                setSuccess(true);
                showToast("Property created successfully!", "success");
                setTimeout(() => router.push("/agent"), 2500);
            } else {
                showToast(data.message || data.msg || "Failed to create property.", "error");
                console.error("Create failed:", data);
            }
        } catch (err) {
            console.error("Submit error:", err);
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["FLAT", "APPARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP", "VILLA", "COMMERCIAL"];
    const types = ["RENT", "SALES", "LEASE"];
    const paymentPlans = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
    const furnishingOptions = ["FURNISHED", "UNFURNISHED", "SEMI_FURNISHED"];
    const propertyUses = ["RESIDENTIAL", "COMMERCIAL"];

    const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-white transition";
    const sel = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-white appearance-none transition";

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <Link href="/agent" className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium mb-4 group transition">
                        <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <PlusCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">List New Property</h1>
                            <p className="text-gray-500 mt-1">Add a property to your listings</p>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 shrink-0" />
                        <div>
                            <p className="font-semibold">Property created successfully!</p>
                            <p className="text-sm">Redirecting to dashboard...</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />
                    <div className="p-6 space-y-8">

                        {/* Basic Info */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <HomeIcon className="w-5 h-5 text-purple-500" /> Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inp} placeholder="e.g., Modern 3-Bedroom Flat" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                                    <input type="text" name="price" required value={formData.price} onChange={handleChange} className={inp} placeholder="e.g., 2500000" />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-purple-500" /> Location
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className={inp} placeholder="e.g., Lagos" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className={inp} placeholder="e.g., Ikeja" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className={inp} placeholder="e.g., 12 Allen Avenue, Ikeja" />
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5 h-5 text-purple-500" /> Property Details
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={sel}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className={sel}>
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Plan</label>
                                    <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} className={sel}>
                                        {paymentPlans.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                                    <select name="furnishing" value={formData.furnishing} onChange={handleChange} className={sel}>
                                        {furnishingOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Rooms & Spaces</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { label: "Bedrooms",     name: "bedroom" },
                                    { label: "Bathrooms",    name: "bathroom" },
                                    { label: "Toilets",      name: "toilet" },
                                    { label: "Parking",      name: "parking_space" },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                                        <input type="number" name={f.name} value={formData[f.name]} onChange={handleNumberChange} className={inp} min="0" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Area</label>
                                    <input type="text" name="total_area" value={formData.total_area} onChange={handleChange} className={inp} placeholder="250 sqm" />
                                </div>
                            </div>
                        </div>

                        {/* Property Use */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Use</label>
                            <select name="property_use" value={formData.property_use} onChange={handleChange} className={`${sel} max-w-xs`}>
                                {propertyUses.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" className={inp} placeholder="Describe the property — features, condition, surroundings..." />
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-purple-500" /> Amenities
                            </h2>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text" value={amenitiesInput}
                                    onChange={e => setAmenitiesInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    placeholder="e.g., SWIMMING_POOL, GYM, SECURITY"
                                />
                                <button type="button" onClick={addAmenity} className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition text-sm font-medium">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map((a, i) => (
                                    <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2">
                                        {a}
                                        <button type="button" onClick={() => removeAmenity(a)} className="hover:text-purple-900 font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5 text-purple-500" /> Property Images <span className="text-red-500">*</span>
                            </h2>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition hover:bg-purple-50/30">
                                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 mb-1">Click to upload property photos</p>
                                <p className="text-xs text-gray-400 mb-4">Up to 5 images · JPG, PNG, WEBP</p>
                                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="img-upload" />
                                <label htmlFor="img-upload" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer shadow-sm transition">
                                    <ArrowUpTrayIcon className="w-4 h-4" /> Select Images
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">{imagePreviews.length} / 5 image(s) selected</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative group">
                                                <img src={src} alt="" className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-purple-400 transition" />
                                                <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100">
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
                                disabled={loading || success || uploading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                            >
                                {uploading ? (
                                    <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />{uploadStatus || "Uploading..."}</>
                                ) : loading ? (
                                    <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />Creating Property...</>
                                ) : (
                                    <><PlusCircleIcon className="w-5 h-5" />List Property</>
                                )}
                            </button>
                            <Link href="/agent" className="flex-1">
                                <button type="button" className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">Cancel</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}