"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HomeIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    PlusCircleIcon,
    TrashIcon,
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    DocumentTextIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

export default function AdminCreateProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [agents, setAgents] = useState([]);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
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
        agent: ""
    });
    const [amenitiesInput, setAmenitiesInput] = useState("");

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://property.reworkstaging.name.ng/v1/agents", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setAgents(data.data || []);
        } catch (err) {
            console.error("Error fetching agents:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const addAmenity = () => {
        if (amenitiesInput.trim() && !formData.amenities.includes(amenitiesInput.trim().toUpperCase())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenitiesInput.trim().toUpperCase()]
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            setError("Maximum 5 images allowed");
            return;
        }
        setImages(prev => [...prev, ...files]);
        setError("");
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (propertyId, token) => {
        if (images.length === 0) return true;
        
        setUploading(true);
        const formDataImages = new FormData();
        images.forEach(image => {
            formDataImages.append("images", image);
        });

        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${propertyId}/resource`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataImages
            });
            return res.ok;
        } catch (err) {
            console.error("Error uploading images:", err);
            return false;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const priceValue = formData.price.replace(/,/g, "");

        const submitData = {
            ...formData,
            price: priceValue,
        };

        try {
            // Create property
            const res = await fetch("http://property.reworkstaging.name.ng/v1/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            const data = await res.json();

            if (res.ok || data.code === 200 || data.code === 201) {
                const propertyId = data.data?._id || data._id;
                
                // Upload images if any
                if (images.length > 0 && propertyId) {
                    await uploadImages(propertyId, token);
                }
                
                setSuccess(true);
                setTimeout(() => router.push("/admin/properties"), 2000);
            } else {
                setError(data.message || data.msg || "Failed to create property");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["FLAT", "APARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP", "VILLA", "COMMERCIAL"];
    const types = ["RENT", "SALES", "LEASE"];
    const paymentPlans = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
    const furnishingOptions = ["FURNISHED", "UNFURNISHED", "SEMI_FURNISHED"];
    const propertyUses = ["RESIDENTIAL", "COMMERCIAL"];

    const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white transition";
    const selectClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white appearance-none transition";

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/properties" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-4 group transition">
                        <ArrowLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition" />
                        Back to Properties
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <PlusCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
                            <p className="text-gray-500 mt-1">Add a new property listing to the platform</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold">Property created successfully!</p>
                            <p className="text-sm text-green-600">Redirecting to properties list...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start gap-3">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">⚠️</span>
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Form Header Gradient */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
                    
                    <div className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <HomeIcon className="w-5 h-5 text-emerald-500" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g., Luxury Beachfront Villa" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                                    <input type="text" name="price" required value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g., 350000000" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className={inputClass} placeholder="e.g., Lagos" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className={inputClass} placeholder="e.g., Lekki" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className={inputClass} placeholder="Full property address" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={selectClass}>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className={selectClass}>
                                        {types.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Plan</label>
                                    <select name="payment_plan" value={formData.payment_plan} onChange={handleChange} className={selectClass}>
                                        {paymentPlans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                                    <select name="furnishing" value={formData.furnishing} onChange={handleChange} className={selectClass}>
                                        {furnishingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rooms & Spaces</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                    <input type="number" name="bedroom" value={formData.bedroom} onChange={handleNumberChange} className={inputClass} min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                                    <input type="number" name="bathroom" value={formData.bathroom} onChange={handleNumberChange} className={inputClass} min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Toilets</label>
                                    <input type="number" name="toilet" value={formData.toilet} onChange={handleNumberChange} className={inputClass} min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parking Space</label>
                                    <input type="number" name="parking_space" value={formData.parking_space} onChange={handleNumberChange} className={inputClass} min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Area</label>
                                    <input type="text" name="total_area" value={formData.total_area} onChange={handleChange} className={inputClass} placeholder="e.g., 250 sqm" />
                                </div>
                            </div>
                        </div>

                        {/* Property Use */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Use</label>
                            <select name="property_use" value={formData.property_use} onChange={handleChange} className={`${selectClass} max-w-xs`}>
                                {propertyUses.map(use => <option key={use} value={use}>{use}</option>)}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" className={inputClass} placeholder="Describe the property in detail..." />
                        </div>

                        {/* Assign to Agent */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4" />
                                Assign to Agent (Optional)
                            </label>
                            <select name="agent" value={formData.agent} onChange={handleChange} className={`${selectClass} max-w-md`}>
                                <option value="">-- Select Agent (optional) --</option>
                                {agents.map(agent => (
                                    <option key={agent._id} value={agent._id}>{agent.full_name} {agent.company ? `(${agent.company})` : ""}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">Leave empty to assign property to yourself as admin</p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                Amenities
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={amenitiesInput} onChange={(e) => setAmenitiesInput(e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g., SWIMMING_POOL, GYM, PARKING" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())} />
                                <button type="button" onClick={addAmenity} className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition text-sm font-medium">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map((amenity, idx) => (
                                    <span key={idx} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-sm flex items-center gap-2">
                                        {amenity}
                                        <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-emerald-900 transition">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5 text-emerald-500" />
                                Property Images
                            </h2>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition hover:bg-emerald-50/30">
                                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">Drag & drop or click to upload</p>
                                <p className="text-xs text-gray-400 mb-4">Upload up to 5 images (JPG, PNG, WEBP)</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
                                    <PhotoIcon className="w-4 h-4" />
                                    Select Images
                                </label>
                            </div>
                            
                            {/* Image Preview */}
                            {images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">{images.length} image(s) selected</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs transition shadow-md"
                                                >
                                                    <XMarkIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-2">*Images will be uploaded after property creation</p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading || success || uploading}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {loading || uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        {uploading ? "Uploading Images..." : "Creating Property..."}
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        Create Property
                                    </>
                                )}
                            </button>
                            <Link href="/admin/properties" className="flex-1">
                                <button type="button" className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-semibold transition">
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