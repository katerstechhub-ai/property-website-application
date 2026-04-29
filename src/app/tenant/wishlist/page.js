"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/public/login");
            return;
        }
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const token = getToken();
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?._id || userData?.id;

        try {
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            const wishlistRes = await fetch(`http://property.reworkstaging.name.ng/v1/users/${userId}/wishlist`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const wishlistData = await wishlistRes.json();

            const wishlistProperties = [];
            if (wishlistData.data && wishlistData.data.length > 0) {
                for (const item of wishlistData.data) {
                    const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${item.property_id}`, {
                        headers: { "Authorization": `Bearer ${publicToken}` }
                    });
                    const propData = await propRes.json();
                    if (propData.data) wishlistProperties.push(propData.data);
                }
            }
            setWishlist(wishlistProperties);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        const token = getToken();
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?._id || userData?.id;

        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/users/${userId}/wishlist/${propertyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setWishlist(wishlist.filter(p => p._id !== propertyId));
            }
        } catch (err) {
            console.error("Error removing from wishlist:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/tenant" className="text-blue-600 hover:underline inline-flex items-center">
                    ← Back to Dashboard
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600 mb-8">Properties you've saved for later</p>

            {wishlist.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <span className="text-6xl block mb-4">❤️</span>
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Start adding properties you love</p>
                    <Link href="/public" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((property) => (
                        <div key={property._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition">
                            <div className="h-52 bg-gray-100 relative">
                                {property.images?.[0] ? (
                                    <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-200">🏠</div>
                                )}
                                <button
                                    onClick={() => removeFromWishlist(property._id)}
                                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                                >
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">{property.city}, {property.state}</p>
                                <p className="text-blue-600 font-bold text-xl mb-3">₦{property.price?.toLocaleString()}</p>
                                <div className="flex gap-2 mb-3">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.type}</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.category}</span>
                                </div>
                                <Link href={`/public/properties/${property._id}`}>
                                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}