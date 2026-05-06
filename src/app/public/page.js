"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    HomeIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChevronRightIcon,
    StarIcon,
    CheckCircleIcon,
    SparklesIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// Color Palette (YOUR ORIGINAL COLORS - UNCHANGED)
const COLORS = {
    primary: '#6E473B',
    secondary: '#BE85A9',
    background: '#F5F0ED',
    cardBg: '#FFFFFF',
    textLight: '#A7807B',
    textDark: '#291COE',
    border: '#E1D4C2',
    accent: '#6E473B'
};

// New text styles inspired by retro/vintage typography
const retroText = {
    heroHeading: "font-black uppercase tracking-tighter",
    heroSub: "font-black uppercase tracking-wide",
    sectionTitle: "font-black uppercase tracking-wide",
    badge: "font-bold uppercase tracking-wider text-xs",
    button: "font-black uppercase tracking-wide text-sm"
};

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
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Hero Section */}
            <div className="relative overflow-hidden min-h-[650px] flex items-center">
                {backgroundImages.map((img, idx) => (
                    <div key={idx} className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${currentBgIndex === idx ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url('${img}')` }} />
                ))}
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)` }}></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: `${COLORS.cardBg}20`, backdropFilter: 'blur(4px)' }}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.secondary }}></span>
                                <span className={`${retroText.badge} text-sm text-white`}>20,000+ properties available</span>
                            </div>
                            <h1 className={`${retroText.heroHeading} text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 text-white`}>
                                NOT JUST A HOUSE.
                                <br />
                                <span className={retroText.heroSub} style={{ color: COLORS.secondary }}>IT'S HOME.</span>
                            </h1>
                            <p className="text-lg mb-8 max-w-lg text-white/90">Skip the rental maze. We connect you directly to verified properties across Nigeria — no middlemen, no stress.</p>
                            <div className="rounded-2xl p-2 shadow-2xl" style={{ backgroundColor: COLORS.cardBg }}>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-1 relative">
                                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                        <input type="text" placeholder="Search by city, address, or property name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-5 py-4 rounded-xl md:rounded-l-xl md:rounded-r-none focus:outline-none focus:ring-2" style={{ color: COLORS.textDark, backgroundColor: COLORS.cardBg }} />
                                    </div>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: COLORS.textLight }} />
                                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full md:w-44 pl-12 pr-5 py-4 rounded-xl focus:outline-none focus:ring-2 appearance-none" style={{ color: COLORS.textDark, backgroundColor: `${COLORS.primary}08` }}>
                                            {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                                        </select>
                                    </div>
                                    <button className={`${retroText.button} px-8 py-4 rounded-xl transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`} style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                                        <MagnifyingGlassIcon className="w-5 h-5" /> SEARCH
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-6 text-sm">
                                <div className="flex items-center gap-1 text-white/80"><CheckCircleIcon className="w-4 h-4" style={{ color: COLORS.secondary }} /> No hidden fees</div>
                                <div className="flex items-center gap-1 text-white/80"><CheckCircleIcon className="w-4 h-4" style={{ color: COLORS.secondary }} /> Verified listings</div>
                                <div className="flex items-center gap-1 text-white/80"><CheckCircleIcon className="w-4 h-4" style={{ color: COLORS.secondary }} /> 24/7 support</div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="rounded-2xl p-6" style={{ backgroundColor: `${COLORS.cardBg}20`, backdropFilter: 'blur(4px)', border: `1px solid ${COLORS.cardBg}30` }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center"><p className="text-3xl font-black" style={{ color: COLORS.secondary }}>500+</p><p className="text-sm text-white">Active listings</p></div>
                                    <div className="text-center"><p className="text-3xl font-black" style={{ color: COLORS.secondary }}>50+</p><p className="text-sm text-white">Trusted agents</p></div>
                                    <div className="text-center"><p className="text-3xl font-black" style={{ color: COLORS.secondary }}>1000+</p><p className="text-sm text-white">Happy renters</p></div>
                                    <div className="text-center"><p className="text-3xl font-black" style={{ color: COLORS.secondary }}>20+</p><p className="text-sm text-white">Cities covered</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {backgroundImages.map((_, idx) => (<button key={idx} onClick={() => setCurrentBgIndex(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentBgIndex === idx ? "w-6" : ""}`} style={{ backgroundColor: currentBgIndex === idx ? COLORS.cardBg : `${COLORS.cardBg}50` }} />))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group" style={{ backgroundColor: COLORS.cardBg }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition" style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                            <BuildingOfficeIcon className="w-6 h-6" />
                        </div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>500+</p>
                        <p className="text-sm" style={{ color: COLORS.primary }}>Properties</p>
                    </div>
                    <div className="rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group" style={{ backgroundColor: COLORS.cardBg }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition" style={{ backgroundColor: COLORS.secondary, color: '#fff' }}>
                            <UserGroupIcon className="w-6 h-6" />
                        </div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.secondary }}>50+</p>
                        <p className="text-sm" style={{ color: COLORS.secondary }}>Agents</p>
                    </div>
                    <div className="rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group" style={{ backgroundColor: COLORS.cardBg }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition" style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                            <StarSolid className="w-6 h-6" />
                        </div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>1000+</p>
                        <p className="text-sm" style={{ color: COLORS.primary }}>Happy Clients</p>
                    </div>
                    <div className="rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition group" style={{ backgroundColor: COLORS.cardBg }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition" style={{ backgroundColor: COLORS.secondary, color: '#fff' }}>
                            <MapPinIcon className="w-6 h-6" />
                        </div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.secondary }}>20+</p>
                        <p className="text-sm" style={{ color: COLORS.secondary }}>Cities</p>
                    </div>
                </div>
            </div>

            {/* Trust Badges Section */}
            <div className="py-12 mt-12" style={{ backgroundColor: COLORS.background }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className={`${retroText.sectionTitle} text-2xl mb-2`} style={{ color: COLORS.primary }}>TRUSTED BY THOUSANDS</h2>
                        <p style={{ color: COLORS.primary }}>Join Nigeria's fastest-growing property platform</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <ShieldCheckIcon className="w-5 h-5" style={{ color: COLORS.secondary }} /> 100% Verified Listings
                        </div>
                        <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <CheckCircleIcon className="w-5 h-5" style={{ color: COLORS.secondary }} /> Instant Booking
                        </div>
                        <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <ArrowTrendingUpIcon className="w-5 h-5" style={{ color: COLORS.secondary }} /> Best Prices Guaranteed
                        </div>
                        <div className="flex items-center gap-2" style={{ color: COLORS.primary }}>
                            <ShieldCheckIcon className="w-5 h-5" style={{ color: COLORS.secondary }} /> Legal Documentation
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="py-20" style={{ backgroundColor: COLORS.cardBg }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
                            <SparklesIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                            <span className={`${retroText.badge} text-sm font-medium`} style={{ color: COLORS.primary }}>SIMPLE PROCESS</span>
                        </div>
                        <h2 className={`${retroText.sectionTitle} text-3xl mb-3`} style={{ color: COLORS.textDark }}>HOW IT WORKS</h2>
                        <p className="max-w-xl mx-auto" style={{ color: COLORS.textLight }}>Your journey to finding the perfect property in 4 easy steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="group">
                                <div className="relative overflow-hidden mb-5 shadow-md rounded-2xl">
                                    <img src={step.image} alt={step.title} className="w-full h-52 object-cover" />
                                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg" style={{ backgroundColor: COLORS.primary, color: '#fff' }}>{step.number}</div>
                                </div>
                                <h3 className={`${retroText.sectionTitle} text-lg mb-1`} style={{ color: COLORS.textDark }}>{step.title.toUpperCase()}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: COLORS.textLight }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Projects Section */}
            <div className="py-20" style={{ backgroundColor: COLORS.background }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] overflow-hidden shadow-xl rounded-2xl">
                            <img src="https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Premium Project" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: `linear-gradient(to top, ${COLORS.textDark}dd, transparent)` }}>
                                <p className={`${retroText.badge} text-sm`} style={{ color: COLORS.secondary }}>PREMIUM COLLECTION</p>
                                <h3 className="text-2xl font-black text-white">LUXURY LIVING REDEFINED</h3>
                            </div>
                        </div>
                        <div>
                            <div className="mb-6">
                                <p className={`${retroText.badge} text-sm font-semibold mb-2`} style={{ color: COLORS.primary }}>FEATURED PROJECTS</p>
                                <h2 className={`${retroText.sectionTitle} text-3xl mb-4`} style={{ color: COLORS.textDark }}>EXPERIENCE SOMETHING EXTRA-ORDINARY</h2>
                                <p className="text-gray-600">Paramount Twin Towers provide a unique blend of safe and secure community living that welcomes its residents to feel "at home".</p>
                            </div>
                            <div className="space-y-4">
                                {projects.slice(0, 2).map((project, idx) => (
                                    <div key={idx} className="flex gap-4 pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}><img src={project.image} alt={project.name} className="w-full h-full object-cover" /></div>
                                        <div>
                                            <h3 className="font-bold" style={{ color: COLORS.textDark }}>{project.name}</h3>
                                            <p className="text-sm" style={{ color: COLORS.textLight }}>{project.location}</p>
                                            <p className="font-bold mt-1" style={{ color: COLORS.primary }}>{project.price}</p>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs" style={{ color: COLORS.textLight }}>{project.unit}</span>
                                                <span className="text-xs" style={{ color: COLORS.secondary }}>{project.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/public/properties">
                                    <button className={`${retroText.button} font-semibold mt-4 transition hover:opacity-70`} style={{ color: COLORS.primary }}>VIEW ALL PROJECTS →</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Projects Grid */}
            <div className="py-20" style={{ backgroundColor: COLORS.cardBg }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className={`${retroText.badge} text-sm font-semibold mb-2`} style={{ color: COLORS.primary }}>OUR PORTFOLIO</p>
                        <h2 className={`${retroText.sectionTitle} text-3xl mb-3`} style={{ color: COLORS.textDark }}>OUR PROJECTS</h2>
                        <p className="max-w-2xl mx-auto" style={{ color: COLORS.textLight }}>Discover our signature developments across prime locations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, idx) => (
                            <div key={idx} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                <div className="h-64 overflow-hidden"><img src={project.image} alt={project.name} className="w-full h-full object-cover" /></div>
                                <div className="p-5">
                                    <h3 className="font-bold text-xl" style={{ color: COLORS.textDark }}>{project.name}</h3>
                                    <p className="mt-1" style={{ color: COLORS.textLight }}>{project.location}</p>
                                    <p className="font-bold text-lg mt-2" style={{ color: COLORS.primary }}>{project.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {filters.map((filter) => (
                        <button key={filter} onClick={() => setActiveFilter(filter)} 
                            className={`${retroText.button} px-6 py-2 rounded-full font-medium transition-all duration-300 ${activeFilter === filter ? "text-white shadow-md" : ""}`} 
                            style={activeFilter === filter ? { backgroundColor: COLORS.primary, color: '#fff' } : { backgroundColor: COLORS.cardBg, color: COLORS.textLight, border: `1px solid ${COLORS.border}` }}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm" style={{ color: COLORS.textLight }}>Found {filteredProperties.length} properties</p>
                            <select className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}>
                                <option>Sort by: Latest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                        {filteredProperties.length === 0 ? (
                            <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                <BuildingOfficeIcon className="w-20 h-20 mx-auto mb-4" style={{ color: COLORS.textLight }} />
                                <p className="text-lg" style={{ color: COLORS.textDark }}>No properties found</p>
                                <button onClick={() => { setSearchQuery(""); setSelectedCity(""); setActiveFilter("ALL"); }} className="mt-2 hover:underline" style={{ color: COLORS.primary }}>Clear filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <Link href={`/public/properties/${property._id}`} key={property._id}>
                                        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                            <div className="h-52 overflow-hidden" style={{ backgroundColor: `${COLORS.primary}10` }}>
                                                <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-lg" style={{ color: COLORS.textDark }}>{property.name}</h3>
                                                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: COLORS.textLight }}>
                                                    <MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}
                                                </p>
                                                <p className="font-bold text-xl mt-2" style={{ color: COLORS.primary }}>₦{parseInt(property.price).toLocaleString()}</p>
                                                <div className="flex gap-4 text-sm mt-3 pt-3" style={{ color: COLORS.textLight, borderTop: `1px solid ${COLORS.border}` }}>
                                                    <span>{property.bedroom} beds</span>
                                                    <span>{property.bathroom} baths</span>
                                                    <span>{property.area}</span>
                                                </div>
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
                <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
                    <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,0.75)` }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-4" style={{ backgroundColor: `${COLORS.cardBg}20`, backdropFilter: 'blur(4px)' }}>
                            <StarSolid className="w-4 h-4" style={{ color: COLORS.secondary }} />
                            <span className={`${retroText.badge} text-sm text-white font-medium`}>CLIENT STORIES</span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3">WHAT OUR CLIENTS SAY</h2>
                        <p className="text-white/80">Real experiences from real people</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="rounded-2xl p-6 transition" style={{ backgroundColor: `${COLORS.cardBg}20`, backdropFilter: 'blur(4px)' }}>
                                <div className="flex mb-3" style={{ color: COLORS.secondary }}>
                                    {[...Array(testimonial.rating)].map((_, i) => (<StarSolid key={i} className="w-5 h-5" />))}
                                </div>
                                <p className="text-white/90 mb-4 italic">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-semibold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-white/70">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden py-16" style={{ background: `linear-gradient(135deg, ${COLORS.textDark} 0%, ${COLORS.primary} 100%)` }}>
                <div className="relative max-w-5xl mx-auto text-center px-4">
                    <h2 className={`${retroText.sectionTitle} text-3xl md:text-4xl mb-4 text-white`}style={{  color: COLORS.primary }}>READY TO FIND YOUR DREAM HOME?</h2>
                    <p className="mb-8 text-lg text-white/90"style={{  color: COLORS.primary }}>Join thousands of happy homeowners who found their perfect property with us</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/tenant/register">
                            <button className={`${retroText.button} px-8 py-3 rounded-xl font-semibold transition shadow-lg flex items-center gap-2`} style={{ backgroundColor: COLORS.cardBg, color: COLORS.primary }}>
                                GET STARTED <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/agent/login">
                            <button className={`${retroText.button} border-2 px-8 py-3 rounded-xl font-semibold transition`} style={{ borderColor: COLORS.cardBg, color: COLORS.cardBg }}>
                                LIST YOUR PROPERTY
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="py-16" style={{ backgroundColor: COLORS.cardBg }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.textDark }}>Stay Updated</h3>
                    <p className="mb-6" style={{ color: COLORS.textLight }}>Get the latest property listings and market news directly in your inbox</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }} />
                        <button className={`${retroText.button} px-6 py-3 rounded-xl font-semibold transition`} style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                            SUBSCRIBE
                        </button>
                    </div>
                    <p className="text-xs mt-4" style={{ color: COLORS.textLight }}>We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </div>
    );
}