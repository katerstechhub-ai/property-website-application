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
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside
                className={`bg-linear-to-r/oklch from-indigo-500 to-teal-400 text-white transition-all duration-300 ${
                    open ? "w-72" : "w-20"
                }`}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-700">
                    <h1 className="font-bold text-lg">
                        {open ? "JK-Housing" : "JK"}
                    </h1>

                    <button
                        onClick={() => setOpen(!open)}
                        className="text-white text-sm"
                    >
                        ☰
                    </button>
                </div>

                <nav className="p-3 space-y-2">
                    {menu.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
                        >
                            {open ? item.name : item.name.slice(0, 2)}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}