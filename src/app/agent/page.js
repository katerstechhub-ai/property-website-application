"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BuildingOfficeIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    BriefcaseIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon,
    HomeIcon,
    XMarkIcon,
    PhotoIcon,
    SparklesIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";

// Helper function to extract image URL (same as admin)
function extractImageUrl(prop) {
    if (!prop) return null;

    const looksLikeUrl = (v) =>
        typeof v === "string" && v.length > 4 &&
        (v.startsWith("http") || v.startsWith("/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));

    const fromItem = (item) => {
        if (!item) return null;
        if (looksLikeUrl(item)) return item;
        if (typeof item === "object") {
            for (const k of ["url", "uri", "path", "src", "image", "link", "file", "resource"]) {
                if (looksLikeUrl(item[k])) return item[k];
            }
        }
        return null;
    };

    const fromArray = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        for (const item of arr) {
            const u = fromItem(item);
            if (u) return u;
        }
        return null;
    };

    return (
        fromArray(prop.resources) ||
        fromArray(prop.images) ||
        fromArray(prop.media) ||
        fromArray(prop.photos) ||
        fromArray(prop.files) ||
        fromItem(prop.image) ||
        fromItem(prop.thumbnail) ||
        fromItem(prop.photo) ||
        fromItem(prop.cover) ||
        null
    );
}

function extractAllImages(prop) {
    if (!prop) return [];
    const looksLikeUrl = (v) =>
        typeof v === "string" && v.length > 4 &&
        (v.startsWith("http") || v.startsWith("/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));
    const fromItem = (item) => {
        if (looksLikeUrl(item)) return item;
        if (typeof item === "object" && item) {
            for (const k of ["url", "uri", "path", "src", "image", "link", "file", "resource"]) {
                if (looksLikeUrl(item[k])) return item[k];
            }
        }
        return null;
    };
    const urls = [];
    for (const field of ["resources", "images", "media", "photos", "files"]) {
        if (Array.isArray(prop[field])) {
            for (const item of prop[field]) {
                const u = fromItem(item);
                if (u && !urls.includes(u)) urls.push(u);
            }
        }
    }
    return urls;
}

// Toast Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}>
                {type === "success" && <CheckCircleIcon className="w-5 h-5" />}
                {type === "error" && <XCircleIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-auto hover:opacity-80">
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// View Property Modal
function ViewPropertyModal({ property, onClose }) {
    const [activeImage, setActiveImage] = useState(0);
    const images = extractAllImages(property);
    const mainImage = images[activeImage] || extractImageUrl(property);

    const formatPrice = (price) => {
        if (!price) return "—";
        const num = parseInt(String(price).replace(/,/g, ""));
        return isNaN(num) ? String(price) : "₦" + num.toLocaleString();
    };

    if (!property) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow transition"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Image Gallery */}
                <div className="relative w-full h-64 bg-gray-100 rounded-t-2xl overflow-hidden">
                    {mainImage ? (
                        <img src={mainImage} alt={property.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <PhotoIcon className="w-14 h-14 text-gray-300" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                            {property.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${property.is_verified ? "bg-green-500 text-white" : "bg-amber-400 text-white"}`}>
                            {property.is_verified ? "✓ Verified" : "⏳ Pending"}
                        </span>
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 px-6 pt-3 pb-2 overflow-x-auto">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                    i === activeImage ? "border-purple-600" : "border-gray-200"
                                }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-6 space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{property.name}</h2>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            {property.address}, {property.city}, {property.state}
                        </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-b py-3">
                        <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-2xl font-bold text-purple-600">{formatPrice(property.price)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Plan</p>
                            <p className="font-semibold">{property.payment_plan?.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Area</p>
                            <p className="font-semibold">{property.total_area || "—"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center">
                            <p className="text-xl font-bold">{property.bedroom || 0}</p>
                            <p className="text-xs text-gray-500">Bedrooms</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold">{property.bathroom || 0}</p>
                            <p className="text-xs text-gray-500">Bathrooms</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold">{property.toilet || 0}</p>
                            <p className="text-xs text-gray-500">Toilets</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold">{property.parking_space || 0}</p>
                            <p className="text-xs text-gray-500">Parking</p>
                        </div>
                    </div>

                    {property.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
                        </div>
                    )}

                    {property.amenities?.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((amenity, i) => (
                                    <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Edit Property Modal
function EditPropertyModal({ property, onClose, onUpdate, showToast }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        country: "NIGERIA",
        state: "",
        city: "",
        address: "",
        description: "",
        category: "FLAT",
        total_area: "",
        property_use: "RESIDENTIAL",
        payment_plan: "PER_ANNUM",
        type: "RENT",
        bedroom: 0,
        bathroom: 0,
        toilet: 0,
        parking_space: 0,
        furnishing: "UNFURNISHED",
        amenities: [],
    });
    const [amenitiesInput, setAmenitiesInput] = useState("");
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name || "",
                price: property.price || "",
                country: property.country || "NIGERIA",
                state: property.state || "",
                city: property.city || "",
                address: property.address || "",
                description: property.description || "",
                category: property.category || "FLAT",
                total_area: property.total_area || "",
                property_use: property.property_use || "RESIDENTIAL",
                payment_plan: property.payment_plan || "PER_ANNUM",
                type: property.type || "RENT",
                bedroom: property.bedroom || 0,
                bathroom: property.bathroom || 0,
                toilet: property.toilet || 0,
                parking_space: property.parking_space || 0,
                furnishing: property.furnishing || "UNFURNISHED",
                amenities: property.amenities || [],
            });
        }
    }, [property]);

    useEffect(() => {
        return () => {
            newImagePreviews.forEach(preview => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [newImagePreviews]);

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
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, trimmed]
            }));
            setAmenitiesInput("");
        }
    };

    const removeAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }));
    };

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
                                (blob2) => resolve(new File([blob2], file.name, { type: "image/jpeg" })),
                                "image/jpeg",
                                0.6
                            );
                        } else {
                            resolve(new File([blob], file.name, { type: "image/jpeg" }));
                        }
                    },
                    "image/jpeg",
                    0.8
                );
            };

            img.src = url;
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            showToast("Maximum 5 new images allowed", "error");
            return;
        }
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
        setNewImageFiles(prev => [...prev, ...files]);
        showToast(`${files.length} new image(s) selected`, "success");
    };

    const removeNewImage = (index) => {
        if (newImagePreviews[index] && newImagePreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(newImagePreviews[index]);
        }
        setNewImageFiles(prev => prev.filter((_, idx) => idx !== index));
        setNewImagePreviews(prev => prev.filter((_, idx) => idx !== index));
    };

    const uploadNewImages = async (propertyId, token) => {
        if (newImageFiles.length === 0) return true;
        
        setUploadingImages(true);
        
        try {
            const fd = new FormData();
            const compressedFiles = await Promise.all(newImageFiles.map(file => compressImage(file)));
            compressedFiles.forEach((file) => {
                fd.append("images", file);
            });
            
            const res = await fetch(`${BASE}/properties/${propertyId}/resource`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            
            const data = await res.json();
            
            if (res.ok || data.code === 200) {
                showToast("New images uploaded successfully!", "success");
                return true;
            } else {
                showToast("Failed to upload new images", "error");
                return false;
            }
        } catch (err) {
            console.error("Upload error:", err);
            showToast("Failed to upload new images", "error");
            return false;
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        const propertyId = property?._id || property?.id;

        const submitData = {
            ...formData,
            price: String(formData.price).replace(/,/g, ""),
        };

        try {
            const res = await fetch(`${BASE}/properties/${propertyId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            const data = await res.json();

            if (res.ok || data.code === 200) {
                if (newImageFiles.length > 0) {
                    await uploadNewImages(propertyId, token);
                }
                showToast("Property updated successfully!", "success");
                if (onUpdate) await onUpdate();
                setTimeout(onClose, 1500);
            } else {
                showToast(data.message || "Failed to update property", "error");
            }
        } catch (err) {
            console.error("Update error:", err);
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["FLAT", "APARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP"];
    const propertyUses = ["RESIDENTIAL", "COMMERCIAL"];
    const paymentPlans = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
    const types = ["RENT", "LEASE", "SALES"];
    const furnishingOptions = ["FURNISHED", "UNFURNISHED", "SEMI_FURNISHED"];

    if (!property) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit Property</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Basic Information */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Property Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₦) *</label>
                            <input
                                type="text"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Area</label>
                            <input
                                type="text"
                                name="total_area"
                                value={formData.total_area}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Plan</label>
                            <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                {paymentPlans.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address *</label>
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-5 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Beds</label>
                            <input type="number" name="bedroom" value={formData.bedroom} onChange={handleNumberChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Baths</label>
                            <input type="number" name="bathroom" value={formData.bathroom} onChange={handleNumberChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Toilets</label>
                            <input type="number" name="toilet" value={formData.toilet} onChange={handleNumberChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Parking</label>
                            <input type="number" name="parking_space" value={formData.parking_space} onChange={handleNumberChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Furnishing</label>
                            <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                {furnishingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Property Use</label>
                        <select name="property_use" value={formData.property_use} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                            {propertyUses.map(use => <option key={use} value={use}>{use}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description *</label>
                        <textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Amenities</label>
                        <div className="flex gap-2 mb-2">
                            <input type="text" value={amenitiesInput} onChange={(e) => setAmenitiesInput(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g., SWIMMING_POOL" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())} />
                            <button type="button" onClick={addAmenity} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.amenities.map((amenity, idx) => (
                                <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {amenity}
                                    <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-red-600">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Add New Images */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Add New Images</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition">
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="edit-image-upload" />
                            <label htmlFor="edit-image-upload" className="cursor-pointer inline-flex items-center gap-2 text-purple-600">
                                <ArrowUpTrayIcon className="w-5 h-5" />
                                Click to upload new images
                            </label>
                        </div>
                        {newImagePreviews.length > 0 && (
                            <div className="mt-3 grid grid-cols-4 gap-2">
                                {newImagePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={preview} className="w-full h-20 object-cover rounded-lg" alt="" />
                                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button type="submit" disabled={loading || uploadingImages} className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
                            {uploadingImages ? "Uploading Images..." : loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AgentDashboard() {
    const router = useRouter();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getToken = () => localStorage.getItem("token");
    const showToast = (message, type) => setToast({ message, type });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/agent/login");
            return;
        }
        const parsed = JSON.parse(userData);
        const role = parsed.role?.toLowerCase();
        if (role !== "agent") {
            router.push("/agent/login");
            return;
        }
        setAgent(parsed);
        fetchData(parsed);
    }, []);

    const fetchData = async (agentData) => {
        const token = getToken();
        const agentId = agentData?.id || agentData?._id;

        if (!token) {
            showToast("Authentication failed. Please login again.", "error");
            router.push("/agent/login");
            return;
        }

        try {
            setLoading(true);
            
            // Fetch properties with proper authentication
            const propsRes = await fetch(`${BASE}/properties?agent=${agentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (!propsRes.ok) {
                throw new Error(`HTTP ${propsRes.status}`);
            }
            
            const propsData = await propsRes.json();
            const propertiesList = propsData.data || propsData.properties || [];
            
            // Enrich properties with full data if needed
            const enrichedProperties = [];
            for (const prop of propertiesList) {
                try {
                    const singlePropRes = await fetch(`${BASE}/properties/${prop._id || prop.id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const singlePropData = await singlePropRes.json();
                    enrichedProperties.push(singlePropData.data || singlePropData);
                } catch {
                    enrichedProperties.push(prop);
                }
            }
            
            setProperties(enrichedProperties);

            // Fetch appointments for agent's properties
            const aptRes = await fetch(`${BASE}/appointments?agent=${agentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const aptData = await aptRes.json();
            
            const enrichedAppointments = [];
            if (aptData.data && aptData.data.length > 0) {
                for (const apt of aptData.data) {
                    try {
                        const propRes = await fetch(`${BASE}/properties/${apt.property_id}`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const propData = await propRes.json();
                        enrichedAppointments.push({ ...apt, property: propData.data || propData });
                    } catch {
                        enrichedAppointments.push(apt);
                    }
                }
            }
            setAppointments(enrichedAppointments);
            
        } catch (err) {
            console.error("Error fetching agent data:", err);
            showToast("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (aptId, action) => {
        const token = getToken();
        setActionLoading(aptId + action);
        try {
            const endpoint = action === "accept"
                ? `${BASE}/appointments/${aptId}/set-agent-appointment-acceptance`
                : `${BASE}/appointments/${aptId}`;
            const method = action === "accept" ? "PUT" : "DELETE";
            const res = await fetch(endpoint, {
                method,
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200 || res.ok) {
                if (action === "accept") {
                    setAppointments(prev => prev.map(a =>
                        a._id === aptId ? { ...a, status: "accepted" } : a
                    ));
                    showToast("Appointment accepted!", "success");
                } else {
                    setAppointments(prev => prev.filter(a => a._id !== aptId));
                    showToast("Appointment declined", "success");
                }
            } else {
                showToast(data.message || "Action failed", "error");
            }
        } catch (err) {
            console.error("Action error:", err);
            showToast("Something went wrong", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!confirm("Delete this property? This cannot be undone.")) return;
        
        const token = getToken();
        if (!token) {
            showToast("Please login again", "error");
            return;
        }
        
        try {
            const res = await fetch(`${BASE}/properties/${propertyId}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            const data = await res.json();
            
            if (res.ok || data.code === 200) {
                setProperties(prev => prev.filter(p => (p._id || p.id) !== propertyId));
                showToast("Property deleted successfully", "success");
                
                // Also update local storage deleted list
                const deletedIds = JSON.parse(localStorage.getItem("deleted_properties") || "[]");
                if (!deletedIds.includes(propertyId)) {
                    deletedIds.push(propertyId);
                    localStorage.setItem("deleted_properties", JSON.stringify(deletedIds));
                }
            } else {
                showToast(data.message || "Failed to delete property", "error");
            }
        } catch (err) {
            console.error("Error deleting property:", err);
            showToast("Network error. Please try again.", "error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("deleted_properties");
        router.push("/public");
    };

    const openViewModal = (property) => {
        setSelectedProperty(property);
        setIsViewModalOpen(true);
    };

    const openEditModal = (property) => {
        setSelectedProperty(property);
        setIsEditModalOpen(true);
    };

    const closeModals = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedProperty(null);
    };

    const refreshProperties = async () => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsed = JSON.parse(userData);
            await fetchData(parsed);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending:   { bg: "bg-amber-100",  text: "text-amber-700",  icon: ClockIcon,        label: "Pending" },
            accepted:  { bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircleIcon,  label: "Accepted" },
            rejected:  { bg: "bg-red-100",    text: "text-red-700",    icon: XCircleIcon,      label: "Rejected" },
            completed: { bg: "bg-blue-100",   text: "text-blue-700",   icon: CheckCircleIcon,  label: "Completed" },
        };
        const s = config[status?.toLowerCase()] || config.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const tabs = [
        { id: "overview",      label: "Overview",      icon: ChartBarIcon },
        { id: "properties",    label: "My Properties", icon: BuildingOfficeIcon, count: properties.length },
        { id: "appointments",  label: "Appointments",  icon: CalendarDaysIcon,   count: appointments.filter(a => a.status?.toLowerCase() === "pending").length },
        { id: "profile",       label: "Profile",       icon: UserCircleIcon },
    ];

    const pendingCount = appointments.filter(a => a.status?.toLowerCase() === "pending").length;
    const verifiedCount = properties.filter(p => p.is_verified).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Modals */}
            {isViewModalOpen && selectedProperty && (
                <ViewPropertyModal property={selectedProperty} onClose={closeModals} />
            )}
            {isEditModalOpen && selectedProperty && (
                <EditPropertyModal 
                    property={selectedProperty} 
                    onClose={closeModals} 
                    onUpdate={refreshProperties}
                    showToast={showToast}
                />
            )}
            
            {/* Hero Banner */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-violet-800/75 to-purple-900/85" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                                <BriefcaseIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm">Welcome back,</p>
                                <h1 className="text-2xl font-bold text-white">
                                    {agent?.full_name || `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim() || "Agent"}
                                </h1>
                                {agent?.company && (
                                    <p className="text-purple-200 text-sm flex items-center gap-1 mt-0.5">
                                        <BuildingOfficeIcon className="w-3.5 h-3.5" />
                                        {agent.company}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md">
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Add Property
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { icon: BuildingOfficeIcon, value: properties.length,  label: "Total Listings",    color: "text-purple-300" },
                            { icon: CheckCircleIcon,    value: verifiedCount,       label: "Verified",          color: "text-green-300"  },
                            { icon: CalendarDaysIcon,   value: appointments.length, label: "Appointments",      color: "text-blue-300"   },
                            { icon: ClockIcon,          value: pendingCount,        label: "Pending Reviews",   color: "text-amber-300"  },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20 hover:bg-white/15 transition">
                                    <Icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
                                    <p className="text-2xl font-bold text-white">{s.value}</p>
                                    <p className="text-purple-200 text-xs">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                                        activeTab === tab.id
                                            ? "border-purple-600 text-purple-600 bg-purple-50"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Overview Tab ── */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Properties */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                    Recent Listings
                                </h2>
                                <button onClick={() => setActiveTab("properties")} className="text-purple-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <BuildingOfficeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No listings yet</p>
                                    <Link href="/agent/properties/create" className="text-purple-600 text-sm hover:underline">
                                        Add your first property →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {properties.slice(0, 4).map((prop) => {
                                        const imageUrl = extractImageUrl(prop);
                                        return (
                                            <div key={prop._id || prop.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer" onClick={() => openViewModal(prop)}>
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} className="w-full h-full object-cover" alt={prop.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <HomeIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{prop.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" /> {prop.city}, {prop.state}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-purple-700 font-bold text-sm">₦{prop.price?.toLocaleString()}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prop.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                                        {prop.is_verified ? "Verified" : "Pending"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Pending Appointments */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                                    Pending Appointments
                                </h2>
                                <button onClick={() => setActiveTab("appointments")} className="text-purple-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {pendingCount === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No pending appointments</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.filter(a => a.status?.toLowerCase() === "pending").slice(0, 4).map((apt) => (
                                        <div key={apt._id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                            <p className="font-semibold text-sm">{apt.property?.name || "Property"}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {apt.date} · {apt.time?.from} – {apt.time?.to}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "accept")}
                                                    disabled={actionLoading === apt._id + "accept"}
                                                    className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "reject")}
                                                    disabled={actionLoading === apt._id + "reject"}
                                                    className="flex-1 text-xs border border-red-400 text-red-600 hover:bg-red-50 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Properties Tab ── */}
                {activeTab === "properties" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">My Properties ({properties.length})</h2>
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Add New Property
                                </button>
                            </Link>
                        </div>

                        {properties.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                                <p className="text-gray-500 mb-4">Start listing properties for potential tenants</p>
                                <Link href="/agent/properties/create">
                                    <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 inline-block text-sm font-semibold transition">
                                        Add Your First Property
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {properties.map((prop) => {
                                    const imageUrl = extractImageUrl(prop);
                                    const propertyId = prop._id || prop.id;
                                    return (
                                        <div key={propertyId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                                            <div className="h-44 bg-gray-100 relative overflow-hidden cursor-pointer" onClick={() => openViewModal(prop)}>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={prop.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <HomeIcon className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                                        {prop.type}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${prop.is_verified ? "bg-green-500 text-white" : "bg-amber-400 text-white"}`}>
                                                        {prop.is_verified ? "✓ Verified" : "⏳ Pending"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-base mb-1 line-clamp-1">{prop.name}</h3>
                                                <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" /> {prop.city}, {prop.state}
                                                </p>
                                                <p className="text-purple-700 font-bold text-lg mb-3">₦{prop.price?.toLocaleString()}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openViewModal(prop)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-xl text-xs font-medium transition"
                                                    >
                                                        <EyeIcon className="w-3.5 h-3.5" /> View
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(prop)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 border border-purple-400 text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-xs font-medium transition"
                                                    >
                                                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProperty(propertyId)}
                                                        className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-xs transition"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Appointments Tab ── */}
                {activeTab === "appointments" && (
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                                <p className="text-gray-500">Appointment requests will appear here once tenants book viewings</p>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{apt.property?.name || "Property"}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" /> {apt.property?.address || apt.property?.city}
                                                    </p>
                                                </div>
                                                {getStatusBadge(apt.status)}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                                                    <p className="font-semibold text-sm">{apt.date}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Time</p>
                                                    <p className="font-semibold text-sm">{apt.time?.from} – {apt.time?.to}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Tenant ID</p>
                                                    <p className="font-mono text-xs text-gray-600">{apt.user_id?.slice(-10)}</p>
                                                </div>
                                            </div>

                                            {apt.msg && (
                                                <div className="bg-purple-50 border border-purple-100 px-4 py-3 rounded-xl">
                                                    <p className="text-sm text-purple-700">
                                                        <span className="font-semibold">Message: </span>{apt.msg}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {apt.status?.toLowerCase() === "pending" && (
                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "accept")}
                                                    disabled={actionLoading === apt._id + "accept"}
                                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "reject")}
                                                    disabled={actionLoading === apt._id + "reject"}
                                                    className="w-full flex items-center justify-center gap-2 border-2 border-red-400 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                                >
                                                    <XCircleIcon className="w-4 h-4" />
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── Profile Tab ── */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                                        <BriefcaseIcon className="w-9 h-9 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {agent?.full_name || `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim()}
                                        </h2>
                                        <p className="text-purple-200 text-sm">Real Estate Agent</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { icon: EnvelopeIcon,        label: "Email",   value: agent?.email },
                                    { icon: PhoneIcon,           label: "Phone",   value: agent?.phone || "Not provided" },
                                    { icon: BuildingOfficeIcon,  label: "Company", value: agent?.company || "Not provided" },
                                    { icon: CalendarDaysIcon,    label: "Member Since", value: agent?.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "—" },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">{item.label}</p>
                                                <p className="font-medium">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}