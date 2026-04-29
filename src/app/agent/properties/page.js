"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        country: "NIGERIA",
        state: "ABUJA",
        city: "",
        lat: "",
        lng: "",
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
        disclaimer: "",
        amenities: [],
        agent: "demo-agent-123"
    });

    const [amenitiesInput, setAmenitiesInput] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Simulate API call
        setTimeout(() => {
            // Mock success
            setSuccess("Property created successfully! Redirecting...");
            setTimeout(() => {
                router.push("/agent/properties");
            }, 1500);
            setLoading(false);
        }, 1000);

        // Real API code (commented out for now)
        /*
        const token = localStorage.getItem("token");
        const priceValue = formData.price.replace(/,/g, "");
        const submitData = {
            ...formData,
            price: priceValue,
            lat: parseFloat(formData.lat) || 0,
            lng: parseFloat(formData.lng) || 0,
        };

        try {
            const res = await fetch("http://property.reworkstaging.name.ng/v1/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/agent/properties");
            } else {
                setError(data.message || "Failed to create property");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
        */
    };

    const categories = ["FLAT", "APARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP"];
    const propertyUses = ["RESIDENTIAL", "COMMERCIAL"];
    const paymentPlans = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
    const types = ["RENT", "LEASE", "SALES"];
    const furnishingOptions = ["FURNISHED", "UNFURNISHED"];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/agent/properties" className="text-purple-600 hover:underline inline-flex items-center">
                    ← Back to Properties
                </Link>
                <h1 className="text-3xl font-bold mt-2">Add New Property</h1>
                <p className="text-gray-600">Fill in the details below to list your property</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Demo Notice */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                    📝 <span className="font-semibold">Demo Mode:</span> Submit will show a success message. 
                    To enable real API, uncomment the API code in handleSubmit.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Property Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            placeholder="e.g., Luxury Villa in Lekki"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (₦) *</label>
                            <input
                                type="text"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g., 50000000"
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
                                placeholder="e.g., 250 sqm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type *</label>
                            <select
                                name="type"
                                required
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Plan *</label>
                            <select
                                name="payment_plan"
                                required
                                value={formData.payment_plan}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                {paymentPlans.map(plan => (
                                    <option key={plan} value={plan}>{plan}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Location</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <input
                                type="text"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address *</label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Latitude</label>
                            <input
                                type="text"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g., 34.27822"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Longitude</label>
                            <input
                                type="text"
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g., -118.3455"
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Property Details</h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Bedrooms</label>
                            <input
                                type="number"
                                name="bedroom"
                                value={formData.bedroom}
                                onChange={handleNumberChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bathrooms</label>
                            <input
                                type="number"
                                name="bathroom"
                                value={formData.bathroom}
                                onChange={handleNumberChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Toilets</label>
                            <input
                                type="number"
                                name="toilet"
                                value={formData.toilet}
                                onChange={handleNumberChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Parking Space</label>
                            <input
                                type="number"
                                name="parking_space"
                                value={formData.parking_space}
                                onChange={handleNumberChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Furnishing</label>
                            <select
                                name="furnishing"
                                value={formData.furnishing}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                {furnishingOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Property Use</label>
                        <select
                            name="property_use"
                            value={formData.property_use}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            {propertyUses.map(use => (
                                <option key={use} value={use}>{use}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Description</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description *</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Describe your property in detail..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Disclaimer (Optional)</label>
                        <textarea
                            name="disclaimer"
                            value={formData.disclaimer}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Any legal disclaimers?"
                        />
                    </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Amenities</h2>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={amenitiesInput}
                            onChange={(e) => setAmenitiesInput(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="e.g., SWIMMING_POOL, GYM, PARKING"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                        />
                        <button
                            type="button"
                            onClick={addAmenity}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Add
                        </button>
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

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating Property..." : "Create Property"}
                    </button>
                    <Link href="/agent/properties" className="flex-1">
                        <button type="button" className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}