"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    const [open, setOpen] = useState(true);

    const menu = [
        { name: "Create Property", href: "/Create_property" },
        { name: "View Properties", href: "/View_property" },
        { name: "Edit Property", href: "/Edit_property" },
        { name: "Property Reviews", href: "/property-reviews" },
        { name: "Manage Agents", href: "/dashboard/agents" },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-teal-50">

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`backdrop-blur-2xl bg-white/20 border-r border-white/30 shadow-xl
                transition-all duration-300
                ${open ? "w-72" : "w-20"}`}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/20">
                    <h1 className="font-bold text-gray-800 text-lg">
                        {open ? "🏡 JK-Housing" : "JK"}
                    </h1>

                    <button
                        onClick={() => setOpen(!open)}
                        className="text-gray-700 hover:scale-110 transition"
                    >
                        ☰
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-3 space-y-2">
                    {menu.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="
                                block px-3 py-2 rounded-xl
                                text-gray-700
                                hover:bg-indigo-500 hover:text-white
                                transition-all duration-200
                                hover:scale-[1.02]
                            "
                        >
                            {open ? item.name : item.name.slice(0, 2)}
                        </Link>
                    ))}
                </nav>
            </aside>


            {/* ================= MAIN ================= */}
            <main className="flex-1 p-6 space-y-6">

                {/* HERO CARD */}
                <div className="
                    bg-white/60 backdrop-blur-xl
                    border border-white/40
                    rounded-2xl shadow-lg
                    p-6
                    hover:shadow-2xl transition
                ">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome to JK-Housing
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your properties, agents, reviews & bookings in one place.
                    </p>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="
                        bg-white/70 backdrop-blur-xl
                        rounded-2xl p-5 shadow
                        hover:scale-[1.03] hover:shadow-xl
                        transition-all
                    ">
                        <h2 className="text-gray-600">Properties</h2>
                        <p className="text-2xl font-bold">120+</p>
                    </div>

                    <div className="
                        bg-white/70 backdrop-blur-xl
                        rounded-2xl p-5 shadow
                        hover:scale-[1.03] hover:shadow-xl
                        transition-all
                    ">
                        <h2 className="text-gray-600">Agents</h2>
                        <p className="text-2xl font-bold">18</p>
                    </div>

                    <div className="
                        bg-white/70 backdrop-blur-xl
                        rounded-2xl p-5 shadow
                        hover:scale-[1.03] hover:shadow-xl
                        transition-all
                    ">
                        <h2 className="text-gray-600">Bookings</h2>
                        <p className="text-2xl font-bold">340+</p>
                    </div>
                </div>

                {/* 🎬 HERO YOUTUBE VIDEO SECTION */}
                <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">

                    {/* YOUTUBE EMBED */}
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/iMP3Zn2X9sg?autoplay=1&mute=1&loop=1&playlist=iMP3Zn2X9sg&controls=0&showinfo=0&rel=0"
                        title="JK Housing Video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>

                    {/* DARK OVERLAY */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* TEXT CONTENT */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

                        <h1 className="text-white text-2xl md:text-4xl font-bold">
                            JK-Housing Dashboard
                        </h1>

                        <p className="text-gray-200 mt-2 text-sm md:text-lg max-w-xl">
                            Manage properties, agents, reviews and bookings in one place
                        </p>

                        <button className="mt-4 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition">
                            Explore System
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}