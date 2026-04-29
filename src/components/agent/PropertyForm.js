"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const CATEGORIES = ["FLAT", "APARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP"];
const TYPES = ["RENT", "LEASE", "SALES"];
const PAYMENT_PLANS = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];
const FURNISHING = ["FURNISHED", "UNFURNISHED"];
const PROPERTY_USES = ["RESIDENTIAL", "COMMERCIAL"];

export default function PropertyForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    country: "NIGERIA",
    state: initialData?.state || "",
    city: initialData?.city || "",
    address: initialData?.address || "",
    description: initialData?.description || "",
    category: initialData?.category || "FLAT",
    type: initialData?.type || "RENT",
    payment_plan: initialData?.payment_plan || "PER_ANNUM",
    furnishing: initialData?.furnishing || "UNFURNISHED",
    property_use: initialData?.property_use || "RESIDENTIAL",
    bedroom: initialData?.bedroom || 0,
    bathroom: initialData?.bathroom || 0,
    toilet: initialData?.toilet || 0,
    parking_space: initialData?.parking_space || 0,
    total_area: initialData?.total_area || "",
    amenities: initialData?.amenities || [],
    ...initialData,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Property Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Luxury Villa"
        />
        <Input
          label="Price (₦)"
          name="price"
          required
          value={formData.price}
          onChange={handleChange}
          placeholder="50000000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Plan</label>
          <select
            name="payment_plan"
            value={formData.payment_plan}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PAYMENT_PLANS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="State" name="state" required value={formData.state} onChange={handleChange} />
        <Input label="City" name="city" required value={formData.city} onChange={handleChange} />
      </div>

      <Input label="Address" name="address" required value={formData.address} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your property..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input label="Bedrooms" name="bedroom" type="number" value={formData.bedroom} onChange={handleNumberChange} />
        <Input label="Bathrooms" name="bathroom" type="number" value={formData.bathroom} onChange={handleNumberChange} />
        <Input label="Toilets" name="toilet" type="number" value={formData.toilet} onChange={handleNumberChange} />
        <Input label="Parking Space" name="parking_space" type="number" value={formData.parking_space} onChange={handleNumberChange} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amenities</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., SWIMMING_POOL, GYM"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
          />
          <Button type="button" variant="secondary" onClick={addAmenity}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.amenities.map((amenity, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {amenity}
              <button type="button" onClick={() => removeAmenity(amenity)} className="hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" loading={isLoading}>
          {initialData ? "Update Property" : "Create Property"}
        </Button>
      </div>
    </form>
  );
}