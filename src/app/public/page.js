"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    HomeIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    IdentificationIcon,
    ChevronRightIcon,
    StarIcon,
    CheckCircleIcon,
    SparklesIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function PublicHome() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    const backgroundImages = [
        "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "https://images.pexels.com/photos/209289/pexels-photo-209289.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const mockProperties = [
        {
            _id: "1",
            name: "Luxury Beachfront Villa",
            price: "350,000,000",
            city: "Lagos",
            state: "Lagos",
            address: "Lekki Phase 1",
            type: "SALES",
            category: "VILLA",
            bedroom: 5,
            bathroom: 6,
            area: "450 sqm",
            images: ["https://i.pinimg.com/736x/a2/7a/e1/a27ae171ead1f2b1a488dfeaea496c5b.jpg"],
            is_verified: true,
            featured: true
        },
        {
            _id: "2",
            name: "Modern Executive Apartment",
            price: "2,500,000",
            city: "Abuja",
            state: "FCT",
            address: "Maitama",
            type: "RENT",
            category: "APARTMENT",
            bedroom: 3,
            bathroom: 3,
            area: "180 sqm",
            images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false
        },
        {
            _id: "3",
            name: "Cozy Family Home",
            price: "85,000,000",
            city: "Port Harcourt",
            state: "Rivers",
            address: "GRA Phase 2",
            type: "SALES",
            category: "DUPLEX",
            bedroom: 4,
            bathroom: 4,
            area: "320 sqm",
            images: ["https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false
        },
        {
            _id: "4",
            name: "Studio Apartment",
            price: "800,000",
            city: "Lagos",
            state: "Lagos",
            address: "Ikeja",
            type: "RENT",
            category: "FLAT",
            bedroom: 1,
            bathroom: 1,
            area: "65 sqm",
            images: ["https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: false,
            featured: false
        },
        {
            _id: "5",
            name: "Commercial Plaza",
            price: "500,000,000",
            city: "Abuja",
            state: "FCT",
            address: "Central Business District",
            type: "LEASE",
            category: "COMMERCIAL",
            bedroom: 0,
            bathroom: 8,
            area: "1200 sqm",
            images: ["https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: true
        },
        {
            _id: "6",
            name: "Penthouse Suite",
            price: "5,000,000",
            city: "Lagos",
            state: "Lagos",
            address: "Victoria Island",
            type: "RENT",
            category: "APARTMENT",
            bedroom: 4,
            bathroom: 4,
            area: "280 sqm",
            images: ["https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false
        }
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProperties(mockProperties);
            setLoading(false);
        }, 800);
    }, []);

    const filters = ["ALL", "RENT", "SALES", "LEASE"];
    const cities = ["All Cities", "Lagos", "Abuja", "Port Harcourt", "Ibadan"];

    const filteredProperties = properties.filter(property => {
        const matchesFilter = activeFilter === "ALL" || property.type === activeFilter;
        const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === "" || selectedCity === "All Cities" || property.city === selectedCity;
        return matchesFilter && matchesSearch && matchesCity;
    });

    const steps = [
        {
            number: "01",
            title: "Search",
            desc: "Browse thousands of verified properties by location, price, or type.",
            image: "https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            number: "02",
            title: "Contact Agent",
            desc: "Connect directly with trusted agents — no middlemen, no hidden charges.",
            image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            number: "03",
            title: "Visit Property",
            desc: "Schedule a viewing at your convenience and inspect your favourite listings.",
            image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            number: "04",
            title: "Close the Deal",
            desc: "Finalise your purchase or rental with full documentation support.",
            image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=600"
        }
    ];

    const testimonials = [
        { name: "John Doe", role: "Homeowner", text: "Found my dream home in just 2 weeks! Amazing platform.", rating: 5 },
        { name: "Sarah Adeleke", role: "Investor", text: "Best real estate platform in Nigeria. Highly recommended!", rating: 5 },
        { name: "Michael Okafor", role: "First-time Buyer", text: "The process was smooth and hassle-free. Thank you!", rating: 4 }
    ];

    const projects = [
        { name: "PARAMOUNT TWIN TOWERS", location: "Oniru, Victoria Island", price: "₦720,000,000", status: "CURRENTLY SELLING", unit: "2 BEDROOM PREMIUM UNIT", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "CERULEAN TOWERS", location: "Water Corporation Rd, Victoria Island", price: "₦850,000,000", status: "COMING SOON", unit: "3 BEDROOM LUXURY UNIT", image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "THE ROCKHAMPTON", location: "Katampe, Abuja", price: "₦620,000,000", status: "CURRENTLY SELLING", unit: "4 BEDROOM DUPLEX", image: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "SKYVILLA", location: "Probyn Close, Ikoyi", price: "₦950,000,000", status: "COMING SOON", unit: "PENTHOUSE SUITE", image: "https://images.pexels.com/photos/209289/pexels-photo-209289.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "CLAREN VILLA", location: "Luggard Avenue, Ikoyi", price: "₦780,000,000", status: "CURRENTLY SELLING", unit: "5 BEDROOM VILLA", image: "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "GRENADINES RESORT", location: "Katampe, Abuja", price: "₦1,200,000,000", status: "COMING SOON", unit: "RESORT VILLAS", image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden text-white min-h-[650px] flex items-center">
                {backgroundImages.map((img, idx) => (
                    <div key={idx} className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${currentBgIndex === idx ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url('${img}')` }} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-sm">20,000+ properties available</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Not just a house.
                                <br />
                                <span className="text-blue-400">It's home.</span>
                            </h1>
                            <p className="text-lg text-gray-200 mb-8 max-w-lg">Skip the rental maze. We connect you directly to verified properties across Nigeria — no middlemen, no stress.</p>
                            <div className="bg-white rounded-2xl p-2 shadow-2xl">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-1 relative">
                                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" placeholder="Search by city, address, or property name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-5 py-4 text-gray-900 rounded-xl md:rounded-l-xl md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full md:w-44 pl-12 pr-5 py-4 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                            {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                                        </select>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                        <MagnifyingGlassIcon className="w-5 h-5" /> Search
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-300">
                                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-400" /> No hidden fees</div>
                                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-400" /> Verified listings</div>
                                <div className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-400" /> 24/7 support</div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center"><p className="text-3xl font-bold text-blue-400">500+</p><p className="text-sm text-gray-300">Active listings</p></div>
                                    <div className="text-center"><p className="text-3xl font-bold text-blue-400">50+</p><p className="text-sm text-gray-300">Trusted agents</p></div>
                                    <div className="text-center"><p className="text-3xl font-bold text-blue-400">1000+</p><p className="text-sm text-gray-300">Happy renters</p></div>
                                    <div className="text-center"><p className="text-3xl font-bold text-blue-400">20+</p><p className="text-sm text-gray-300">Cities covered</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {backgroundImages.map((_, idx) => (<button key={idx} onClick={() => setCurrentBgIndex(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBgIndex === idx ? "w-6 bg-white" : "bg-white/50"}`} />))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 group-hover:scale-110 transition"><BuildingOfficeIcon className="w-6 h-6 text-blue-600 group-hover:text-white" /></div>
                        <p className="text-2xl font-bold text-blue-600">500+</p><p className="text-gray-600 text-sm">Properties</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-600 group-hover:scale-110 transition"><UserGroupIcon className="w-6 h-6 text-green-600 group-hover:text-white" /></div>
                        <p className="text-2xl font-bold text-green-600">50+</p><p className="text-gray-600 text-sm">Agents</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-600 group-hover:scale-110 transition"><StarSolid className="w-6 h-6 text-yellow-500 group-hover:text-white" /></div>
                        <p className="text-2xl font-bold text-yellow-500">1000+</p><p className="text-gray-600 text-sm">Happy Clients</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600 group-hover:scale-110 transition"><MapPinIcon className="w-6 h-6 text-purple-600 group-hover:text-white" /></div>
                        <p className="text-2xl font-bold text-purple-600">20+</p><p className="text-gray-600 text-sm">Cities</p>
                    </div>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Trusted by Thousands</h2>
                        <p className="text-blue-200">Join Nigeria's fastest-growing property platform</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-blue-300" /> 100% Verified Listings</div>
                        <div className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-blue-300" /> Instant Booking</div>
                        <div className="flex items-center gap-2"><ArrowTrendingUpIcon className="w-5 h-5 text-blue-300" /> Best Prices Guaranteed</div>
                        <div className="flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-blue-300" /> Legal Documentation</div>
                    </div>
                </div>
            </div>

            {/* ─── HOW IT WORKS ─── */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-1 mb-4">
                            <SparklesIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-600 font-medium">Simple Process</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Your journey to finding the perfect property in 4 easy steps</p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="group">
                                {/* Image */}
                                <div className="relative overflow-hidden  mb-5 shadow-md">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-52 object-cover "
                                    />
                                    {/* Step number badge */}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                                        {step.number}
                                    </div>
                                    {/* Connector line (hidden on last) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 z-10" />
                                    )}
                                </div>
                                {/* Text */}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Projects Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] overflow-hidden shadow-xl">
                            <img src="https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Premium Project" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <p className="text-white text-sm">Premium Collection</p>
                                <h3 className="text-white text-2xl font-bold">Luxury Living Redefined</h3>
                            </div>
                        </div>
                        <div>
                            <div className="mb-6">
                                <p className="text-blue-600 text-sm font-semibold mb-2">FEATURED PROJECTS</p>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience Something Extra-Ordinary</h2>
                                <p className="text-gray-600">Paramount Twin Towers provide a unique blend of safe and secure community living that welcomes its residents to feel "at home".</p>
                            </div>
                            <div className="space-y-4">
                                {projects.slice(0, 2).map((project, idx) => (
                                    <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-24 h-24 bg-gray-200 flex-shrink-0 overflow-hidden"><img src={project.image} alt={project.name} className="w-full h-full object-cover" /></div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{project.name}</h3>
                                            <p className="text-sm text-gray-500">{project.location}</p>
                                            <p className="text-blue-600 font-bold mt-1">{project.price}</p>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-gray-400">{project.unit}</span>
                                                <span className="text-xs text-green-600">{project.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="text-blue-600 font-semibold mt-4 hover:text-blue-800 transition">VIEW ALL PROJECTS →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Projects Grid */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-blue-600 text-sm font-semibold mb-2">OUR PORTFOLIO</p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Projects</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Discover our signature developments across prime locations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, idx) => (
                            <div key={idx} className="bg-white shadow-md overflow-hidden">
                                <div className="h-64 overflow-hidden"><img src={project.image} alt={project.name} className="w-full h-full object-cover" /></div>
                                <div className="p-5">
                                    <h3 className="font-bold text-xl text-gray-900">{project.name}</h3>
                                    <p className="text-gray-500 mt-1">{project.location}</p>
                                    <p className="text-blue-600 font-bold text-lg mt-2">{project.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {filters.map((filter) => (<button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${activeFilter === filter ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"}`}>{filter}</button>))}
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">Found {filteredProperties.length} properties</p>
                            <select className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"><option>Sort by: Latest</option><option>Price: Low to High</option><option>Price: High to Low</option></select>
                        </div>
                        {filteredProperties.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl"><BuildingOfficeIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">No properties found</p><button onClick={() => { setSearchQuery(""); setSelectedCity(""); setActiveFilter("ALL"); }} className="text-blue-600 mt-2 hover:underline">Clear filters</button></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <Link href={`/public/properties/${property._id}`} key={property._id}>
                                        <div className="bg-white shadow-md overflow-hidden hover:shadow-lg transition">
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
                    </>
                )}
            </div>

            {/* Testimonials Section */}
            <div className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}><div className="absolute inset-0 bg-black/70"></div></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1 mb-4"><StarSolid className="w-4 h-4 text-yellow-400" /><span className="text-sm text-white font-medium">Client Stories</span></div>
                        <h2 className="text-3xl font-bold text-white mb-3">What Our Clients Say</h2>
                        <p className="text-gray-200">Real experiences from real people</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition">
                                <div className="flex text-yellow-400 mb-3">{[...Array(testimonial.rating)].map((_, i) => (<StarSolid key={i} className="w-5 h-5" />))}</div>
                                <p className="text-gray-200 mb-4 italic">"{testimonial.text}"</p>
                                <div><p className="font-semibold text-white">{testimonial.name}</p><p className="text-sm text-gray-300">{testimonial.role}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-700 text-white py-16">
                <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div><div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div></div>
                <div className="relative max-w-5xl mx-auto text-center px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your dream home?</h2>
                    <p className="text-blue-100 mb-8 text-lg">Join thousands of happy homeowners who found their perfect property with us</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/tenant/register"><button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg flex items-center gap-2">Get Started <ChevronRightIcon className="w-5 h-5" /></button></Link>
                        <Link href="/agent/login"><button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition">List Your Property</button></Link>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-white py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Stay Updated</h3>
                    <p className="text-gray-600 mb-6">Get the latest property listings and market news directly in your inbox</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">Subscribe</button>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </div>
    );
}