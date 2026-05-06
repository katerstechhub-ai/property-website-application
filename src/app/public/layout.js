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

// Color Palette
const COLORS = {
  primary: '#6E473B',
  secondary: '#BE85A9',
  background: '#F5F0ED',
  cardBg: '#FFFFFF',
  textLight: '#A7807B',
  textDark: '#291COE',
  border: '#E1D4C2'
};

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
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background }}>
            {/* Navigation */}
            <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: COLORS.cardBg, borderBottom: `1px solid ${COLORS.border}` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link href="/public" className="flex items-center space-x-2 group">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition group-hover:scale-105" style={{ backgroundColor: COLORS.primary }}>
                                <HomeIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl" style={{ color: COLORS.primary }}>
                                Jas<span style={{ color: COLORS.primary }}>K</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                                        pathname === link.href
                                            ? "text-white"
                                            : "hover:bg-opacity-10"
                                    }`}
                                    style={pathname === link.href ? { backgroundColor: COLORS.primary, color: '#fff' } : { color: COLORS.primary }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {dashboardLink && (
                                <Link
                                    href={dashboardLink.href}
                                    className="px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-1"
                                    style={{ color: COLORS.primary, backgroundColor: `${COLORS.primary}10` }}
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
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                                            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                                        >
                                            Login <ChevronDownIcon className="w-4 h-4" />
                                        </button>

                                        {isLoginDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-50 overflow-hidden" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                                <Link href="/tenant/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 transition cursor-pointer hover:bg-opacity-5" style={{ backgroundColor: COLORS.cardBg }}>
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
                                                            <HomeIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm" style={{ color: COLORS.primary }}>Tenant Login</p>
                                                            <p className="text-xs" style={{ color: COLORS.primary }}>Find and book properties</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link href="/agent/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 transition cursor-pointer hover:bg-opacity-5" style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg }}>
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
                                                            <BriefcaseIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm" style={{ color: COLORS.primary }}>Agent Login</p>
                                                            <p className="text-xs" style={{ color: COLORS.primary }}>Manage your listings</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link href="/admin/login" onClick={() => setIsLoginDropdownOpen(false)}>
                                                    <div className="flex items-center gap-3 px-4 py-3 transition cursor-pointer hover:bg-opacity-5" style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg }}>
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
                                                            <ShieldCheckIcon className="w-4 h-4" style={{ color: COLORS.primary }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm" style={{ color: COLORS.primary }}>Admin Login</p>
                                                            <p className="text-xs" style={{ color: COLORS.primary }}>Platform management</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Register — Tenant only */}
                                    <Link href="/tenant/register">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition" style={{ border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}>
                                            <UserIcon className="w-4 h-4" />
                                            Register
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition text-white"
                                    style={{ backgroundColor: COLORS.primary }}
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg transition"
                            style={{ color: COLORS.primary }}
                        >
                            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden pb-4 pt-2 space-y-1 mt-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg font-medium text-sm transition ${
                                        pathname === link.href ? "text-white" : ""
                                    }`}
                                    style={pathname === link.href ? { backgroundColor: COLORS.primary, color: '#fff' } : { color: COLORS.primary }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {dashboardLink && (
                                <Link
                                    href={dashboardLink.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm"
                                    style={{ color: COLORS.primary, backgroundColor: `${COLORS.primary}10` }}
                                >
                                    <ChartBarIcon className="w-4 h-4" /> {dashboardLink.label}
                                </Link>
                            )}

                            {!isLoggedIn ? (
                                <>
                                    <div className="pt-2 mt-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                                        <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.primary }}>Login As</p>
                                        <Link href="/tenant/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: COLORS.primary }}>
                                                <HomeIcon className="w-4 h-4" style={{ color: COLORS.primary }} /> Tenant Login
                                            </div>
                                        </Link>
                                        <Link href="/agent/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: COLORS.primary }}>
                                                <BriefcaseIcon className="w-4 h-4" style={{ color: COLORS.primary }} /> Agent Login
                                            </div>
                                        </Link>
                                        <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: COLORS.primary }}>
                                                <ShieldCheckIcon className="w-4 h-4" style={{ color: COLORS.primary }} /> Admin Login
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="pt-2 mt-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                                        <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.primary }}>New Here?</p>
                                        <Link href="/tenant/register" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: COLORS.primary }}>
                                                <UserIcon className="w-4 h-4" style={{ color: COLORS.primary }} /> Register as Tenant
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm mt-2"
                                    style={{ color: COLORS.primary, backgroundColor: `${COLORS.primary}10` }}
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="mt-16" style={{ backgroundColor: COLORS.textDark }}>
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
                                    <HomeIcon className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-bold text-lg" style={{ color: COLORS.primary }}>JasK</h3>
                            </div>
                            <p className="text-black text-sm">Find your dream property with ease</p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/public" className="text-black">Home</Link></li>
                                <li><Link href="/public/properties" className="text-black ">Properties</Link></li>
                            </ul>
                        </div>

                        {/* Account */}
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Account</h4>
                            <ul className="space-y-2 text-sm">
                                {!isLoggedIn ? (
                                    <>
                                        <li><Link href="/tenant/login" className="text-black">Tenant Login</Link></li>
                                        <li><Link href="/agent/login" className="black ">Agent Login</Link></li>
                                        <li><Link href="/admin/login" className="black">Admin Login</Link></li>
                                        <li><Link href="/tenant/register" className="black ">Register as Tenant</Link></li>
                                    </>
                                ) : (
                                    <>
                                        {dashboardLink && (
                                            <li><Link href={dashboardLink.href} className="text-black">Dashboard</Link></li>
                                        )}
                                        <li>
                                            <button onClick={handleLogout} className="text-black ">Logout</button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="text-black hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-black hover:text-white transition">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 mt-8 text-center text-sm" style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
                        <p className="text-black">&copy; 2026 JasK. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}