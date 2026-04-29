"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    StarIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    ArrowLeftIcon,
    EyeIcon,
    BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export default function AdminReviews() {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/admin/login"); return; }
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const token = getToken();
        try {
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            const res = await fetch("http://property.reworkstaging.name.ng/v1/reviews", {
                headers: { "Authorization": `Bearer ${publicToken}` }
            });
            const data = await res.json();

            const reviewsWithDetails = [];
            if (data.data && data.data.length > 0) {
                for (const review of data.data) {
                    try {
                        const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${review.property_id}`, {
                            headers: { "Authorization": `Bearer ${publicToken}` }
                        });
                        const propData = await propRes.json();
                        reviewsWithDetails.push({ ...review, property: propData.data });
                    } catch {
                        reviewsWithDetails.push(review);
                    }
                }
            }
            setReviews(reviewsWithDetails);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        setDeleteLoading(reviewId);
        const token = getToken();
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200) {
                setReviews(prev => prev.filter(r => r._id !== reviewId));
            }
        } catch (err) {
            console.error("Error deleting review:", err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.text?.toLowerCase().includes(search.toLowerCase()) ||
        review.property?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/admin" className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <StarIcon className="w-6 h-6 text-red-600" /> Manage Reviews
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Monitor and moderate user reviews on properties</p>
                        </div>
                        <span className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl">
                            {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="mb-6 relative max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by content or property..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm bg-white shadow-sm"
                    />
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Found</h3>
                        <p className="text-gray-400">{search ? "No reviews match your search." : "No reviews yet."}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div key={review._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                                <div className="flex flex-wrap justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <BuildingOfficeIcon className="w-4 h-4 text-yellow-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">
                                                {review.property?.name || "Unknown Property"}
                                            </h3>
                                            <Link href={`/public/properties/${review.property_id}`} target="_blank">
                                                <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                                    <EyeIcon className="w-3 h-3" /> View
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="flex gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-xl text-sm">{review.text}</p>
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                            <span>User: {review.user_id?.slice(-8)}</span>
                                            <span>ID: {review._id?.slice(-8)}</span>
                                            {review.createdAt && (
                                                <span>Posted: {new Date(review.createdAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteReview(review._id)}
                                        disabled={deleteLoading === review._id}
                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition disabled:opacity-50 h-fit"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        {deleteLoading === review._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}