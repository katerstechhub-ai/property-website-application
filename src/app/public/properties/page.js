"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, MapPinIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const mockProperties = [
        { _id: "1", name: "Luxury Beachfront Villa", price: "350,000,000", city: "Lagos", state: "Lagos", address: "Lekki Phase 1", type: "SALES", bedroom: 5, bathroom: 6, area: "450 sqm", images: ["https://i.pinimg.com/736x/a2/7a/e1/a27ae171ead1f2b1a488dfeaea496c5b.jpg"], is_verified: true },
        { _id: "2", name: "Modern Executive Apartment", price: "2,500,000", city: "Abuja", state: "FCT", address: "Maitama", type: "RENT", bedroom: 3, bathroom: 3, area: "180 sqm", images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600"], is_verified: true },
        { _id: "3", name: "Cozy Family Home", price: "85,000,000", city: "Port Harcourt", state: "Rivers", address: "GRA Phase 2", type: "SALES", bedroom: 4, bathroom: 4, area: "320 sqm", images: ["https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600"], is_verified: true },
        { _id: "4", name: "Studio Apartment", price: "800,000", city: "Lagos", state: "Lagos", address: "Ikeja", type: "RENT", bedroom: 1, bathroom: 1, area: "65 sqm", images: ["https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=600"], is_verified: false },
        { _id: "5", name: "Commercial Plaza", price: "500,000,000", city: "Abuja", state: "FCT", address: "Central Business District", type: "LEASE", bedroom: 0, bathroom: 8, area: "1200 sqm", images: ["https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600"], is_verified: true },
        { _id: "6", name: "Penthouse Suite", price: "5,000,000", city: "Lagos", state: "Lagos", address: "Victoria Island", type: "RENT", bedroom: 4, bathroom: 4, area: "280 sqm", images: ["https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600"], is_verified: true }
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProperties(mockProperties);
            setLoading(false);
        }, 500);
    }, []);

    const filters = ["ALL", "RENT", "SALES", "LEASE"];
    const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt"];

    const filteredProperties = properties.filter(property => {
        const matchesFilter = activeFilter === "ALL" || property.type === activeFilter;
        const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) || property.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === "" || selectedCity === "All Cities" || property.city === selectedCity;
        return matchesFilter && matchesSearch && matchesCity;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header with Big Background Image */}
            <div className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">All Properties</h1>
                        <p className="text-lg text-gray-200">Discover your perfect property from our extensive collection</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Search by name, city, or address..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                        </select>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {filters.map((filter) => (<button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2 font-medium transition ${activeFilter === filter ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>{filter}</button>))}
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Found {filteredProperties.length} properties</p>
                    <select className="border px-3 py-1 text-sm"><option>Sort by: Latest</option><option>Price: Low to High</option><option>Price: High to Low</option></select>
                </div>

                {/* Properties Grid */}
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-20 bg-white"><BuildingOfficeIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">No properties found</p><button onClick={() => { setSearchQuery(""); setSelectedCity(""); setActiveFilter("ALL"); }} className="text-blue-600 mt-2 hover:underline">Clear filters</button></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => (
                            <Link href={`/public/properties/${property._id}`} key={property._id}>
                                <div className="bg-white shadow-md overflow-hidden">
                                    <div className="h-52 overflow-hidden bg-gray-200"><img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" /></div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-900">{property.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}</p>
                                        <p className="text-blue-600 font-bold text-xl mt-2">₦{parseInt(property.price).toLocaleString()}</p>
                                        <div className="flex gap-4 text-sm text-gray-500 mt-3 pt-3 border-t"><span>{property.bedroom} beds</span><span>{property.bathroom} baths</span><span>{property.area}</span></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}