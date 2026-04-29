"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    HomeIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";

export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const loginDropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            setIsLoggedIn(true);
            try {
                const userData = JSON.parse(user);
                setUserRole(userData.role);
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
                setIsLoginDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.href = "/public";
    };

    const navLinks = [
        { href: "/public", label: "Home" },
        { href: "/public/properties", label: "Properties" },
    ];

    const getDashboardLink = () => {
        if (!isLoggedIn) return null;
        if (userRole === "admin" || userRole === "merchant") return { href: "/admin", label: "Admin Dashboard" };
        if (userRole === "agent") return { href: "/agent", label: "Agent Dashboard" };
        return { href: "/tenant", label: "My Dashboard" };
    };

    const dashboardLink = getDashboardLink();

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link href="/public" className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                                <HomeIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-900">Property<span className="text-blue-600">Hub</span></span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                                        pathname === link.href
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {dashboardLink && (
                                <Link
                                    href={dashboardLink.href}
                                    className="px-4 py-2 rounded-lg font-medium text-sm text-green-600 hover:bg-green-50 transition flex items-center gap-1"
                                >
                                    <ChartBarIcon className="w-4 h-4" />
                                    {dashboardLink.label}
                                </Link>
                            )}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {!isLoggedIn ? (
                                <>
                                    {/* Login Dropdown */}
                                    <div className="relative" ref={loginDropdownRef}>
                                        <button
                                            onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Login <ChevronDownIcon className="w-4 h-4" />
                                        </button>

                                        {isLoginDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                                <Link href="/tenant/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition cursor-pointer">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <HomeIcon className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">Tenant Login</p>
                                                            <p className="text-xs text-gray-500">Find and book properties</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link href="/agent/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition cursor-pointer border-t border-gray-50">
                                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <BriefcaseIcon className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">Agent Login</p>
                                                            <p className="text-xs text-gray-500">Manage your listings</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link href="/admin/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition cursor-pointer border-t border-gray-50">
                                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <ShieldCheckIcon className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">Admin Login</p>
                                                            <p className="text-xs text-gray-500">Platform management</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Register — Tenant only */}
                                    <Link href="/tenant/register">
                                        <button className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition">
                                            <UserIcon className="w-4 h-4" />
                                            Register
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        >
                            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-100 mt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg font-medium text-sm transition ${
                                        pathname === link.href ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {dashboardLink && (
                                <Link
                                    href={dashboardLink.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-green-600 bg-green-50"
                                >
                                    <ChartBarIcon className="w-4 h-4" /> {dashboardLink.label}
                                </Link>
                            )}

                            {!isLoggedIn ? (
                                <>
                                    <div className="border-t border-gray-100 pt-2 mt-2">
                                        <p className="px-3 py-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">Login As</p>
                                        <Link href="/tenant/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 text-sm">
                                                <HomeIcon className="w-4 h-4 text-blue-600" /> Tenant Login
                                            </div>
                                        </Link>
                                        <Link href="/agent/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 text-sm">
                                                <BriefcaseIcon className="w-4 h-4 text-purple-600" /> Agent Login
                                            </div>
                                        </Link>
                                        <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 text-sm">
                                                <ShieldCheckIcon className="w-4 h-4 text-red-600" /> Admin Login
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Register — Tenant ONLY on mobile too */}
                                    <div className="border-t border-gray-100 pt-2 mt-2">
                                        <p className="px-3 py-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">New Here?</p>
                                        <Link href="/tenant/register" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 text-sm">
                                                <UserIcon className="w-4 h-4 text-blue-600" /> Register as Tenant
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-red-600 bg-red-50 hover:bg-red-100 transition mt-2"
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow">{children}</main>

            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <HomeIcon className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">PropertyHub</h3>
                            </div>
                            <p className="text-gray-400 text-sm">Find your dream property with ease</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/public" className="hover:text-white transition">Home</Link></li>
                                <li><Link href="/public/properties" className="hover:text-white transition">Properties</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Account</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                {!isLoggedIn ? (
                                    <>
                                        <li><Link href="/tenant/login" className="hover:text-white transition">Tenant Login</Link></li>
                                        <li><Link href="/agent/login" className="hover:text-white transition">Agent Login</Link></li>
                                        <li><Link href="/admin/login" className="hover:text-white transition">Admin Login</Link></li>
                                        <li><Link href="/tenant/register" className="hover:text-white transition">Register as Tenant</Link></li>
                                    </>
                                ) : (
                                    <>
                                        {dashboardLink && (
                                            <li><Link href={dashboardLink.href} className="hover:text-white transition">Dashboard</Link></li>
                                        )}
                                        <li>
                                            <button onClick={handleLogout} className="hover:text-white transition">Logout</button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
                        <p>&copy; 2024 PropertyHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}