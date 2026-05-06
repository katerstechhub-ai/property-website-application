"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    PlusCircleIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    PhotoIcon,
    XMarkIcon,
    MapPinIcon,
    CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";
const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
const getId = (obj) => obj?._id || obj?.id || null;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500";

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div
                className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`}
            >
                {type === "success" && <CheckCircleIcon className="w-5 h-5" />}
                {type === "error" && <XMarkIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-auto hover:opacity-80">
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Image helpers ────────────────────────────────────────────────────────────
function extractImageUrl(prop) {
    if (!prop) return null;
    const looksLikeUrl = (v) =>
        typeof v === "string" &&
        v.length > 4 &&
        (v.startsWith("http") ||
            v.startsWith("/") ||
            /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));

    const fromItem = (item) => {
        if (!item) return null;
        if (looksLikeUrl(item)) return item;
        if (typeof item === "object") {
            for (const k of [
                "url",
                "uri",
                "path",
                "src",
                "image",
                "link",
                "file",
                "resource",
            ]) {
                if (looksLikeUrl(item[k])) return item[k];
            }
        }
        return null;
    };

    const fromArray = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        for (const item of arr) {
            const u = fromItem(item);
            if (u) return u;
        }
        return null;
    };

    return (
        fromArray(prop.resources) ||
        fromArray(prop.images) ||
        fromArray(prop.media) ||
        fromArray(prop.photos) ||
        fromArray(prop.files) ||
        fromItem(prop.image) ||
        fromItem(prop.thumbnail) ||
        fromItem(prop.photo) ||
        fromItem(prop.cover) ||
        null
    );
}

function extractAllImages(prop) {
    if (!prop) return [];
    const looksLikeUrl = (v) =>
        typeof v === "string" &&
        v.length > 4 &&
        (v.startsWith("http") ||
            v.startsWith("/") ||
            /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));

    const fromItem = (item) => {
        if (looksLikeUrl(item)) return item;
        if (typeof item === "object" && item) {
            for (const k of [
                "url",
                "uri",
                "path",
                "src",
                "image",
                "link",
                "file",
                "resource",
            ]) {
                if (looksLikeUrl(item[k])) return item[k];
            }
        }
        return null;
    };

    const urls = [];
    for (const field of ["resources", "images", "media", "photos", "files"]) {
        if (Array.isArray(prop[field])) {
            for (const item of prop[field]) {
                const u = fromItem(item);
                if (u && !urls.includes(u)) urls.push(u);
            }
        }
    }
    return urls;
}

// ─── Image Upload Modal ───────────────────────────────────────────────────────
function ImageUploadModal({ prop, onClose, onSuccess, showToast }) {
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
            });
        };
    }, [imagePreviews]);

    const compressImage = (file, maxSizeKB = 500) =>
        new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                let { width, height } = img;
                const MAX_DIM = 1200;
                if (width > MAX_DIM || height > MAX_DIM) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIM) / width);
                        width = MAX_DIM;
                    } else {
                        width = Math.round((width * MAX_DIM) / height);
                        height = MAX_DIM;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                URL.revokeObjectURL(url);

                canvas.toBlob(
                    (blob) => {
                        if (blob.size / 1024 > maxSizeKB) {
                            canvas.toBlob(
                                (blob2) =>
                                    resolve(
                                        new File([blob2], file.name, {
                                            type: "image/jpeg",
                                        })
                                    ),
                                "image/jpeg",
                                0.6
                            );
                        } else {
                            resolve(
                                new File([blob], file.name, {
                                    type: "image/jpeg",
                                })
                            );
                        }
                    },
                    "image/jpeg",
                    0.8
                );
            };
            img.src = url;
        });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 5 - imageFiles.length;
        const toAdd = files.slice(0, remaining);

        if (files.length > remaining) {
            showToast(
                `Only ${remaining} slot(s) remaining. Added first ${remaining}.`,
                "error"
            );
        }

        const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setImageFiles((prev) => [...prev, ...toAdd]);
        e.target.value = "";
    };

    const removeFile = (index) => {
        if (imagePreviews[index]?.startsWith("blob:"))
            URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) {
            showToast("Please select at least one image", "error");
            return;
        }

        const token = localStorage.getItem("token");
        const propertyId = getId(prop);

        if (!token) {
            showToast("No token found. Please login again.", "error");
            return;
        }
        if (!propertyId) {
            showToast("Invalid property ID", "error");
            return;
        }

        setUploading(true);
        try {
            const fd = new FormData();
            const compressed = await Promise.all(
                imageFiles.map((f) => compressImage(f))
            );
            compressed.forEach((f) => fd.append("images", f));

            const res = await fetch(
                `/api/proxy/properties/${propertyId}/resource`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                }
            );
            const data = await res.json();

            if (res.ok || data.code === 200 || data.status === "success") {
                showToast("Images uploaded successfully!", "success");
                setTimeout(() => {
                    onClose();
                    onSuccess?.();
                }, 1500);
            } else {
                showToast(data.message || "Upload failed", "error");
            }
        } catch (err) {
            console.error("Upload error:", err);
            showToast("Upload failed: " + err.message, "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">
                        Add Images
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                        {prop?.name} · up to 5 images
                    </p>

                    {imageFiles.length < 5 && (
                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
                            />
                        </div>
                    )}

                    {imagePreviews.length > 0 && (
                        <div className="mt-2 mb-4 grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={preview}
                                        className="w-full h-20 object-cover rounded-lg"
                                        alt=""
                                    />
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={uploadImages}
                            disabled={uploading || imageFiles.length === 0}
                            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:bg-red-700 transition"
                        >
                            {uploading
                                ? "Compressing & Uploading..."
                                : "Upload Images"}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Property Detail Modal ────────────────────────────────────────────────────
function PropertyModal({ prop, onClose }) {
    const [activeImg, setActiveImg] = useState(0);
    const images = extractAllImages(prop);
    const mainImg = images[activeImg] || extractImageUrl(prop);

    const formatPrice = (price) => {
        if (!price) return "—";
        const num = parseInt(String(price).replace(/,/g, ""));
        return isNaN(num) ? String(price) : "₦" + num.toLocaleString();
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow transition"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="relative w-full h-56 bg-gray-100 rounded-t-3xl overflow-hidden">
                    {mainImg ? (
                        <img
                            src={mainImg}
                            alt={prop.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <PhotoIcon className="w-14 h-14 text-gray-300" />
                        </div>
                    )}
                    <span
                        className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-semibold shadow ${
                            prop.is_verified
                                ? "bg-green-500 text-white"
                                : "bg-yellow-400 text-gray-900"
                        }`}
                    >
                        {prop.is_verified ? "Verified" : "Pending"}
                    </span>
                </div>

                {images.length > 1 && (
                    <div className="flex gap-2 px-6 pt-3 overflow-x-auto">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImg(i)}
                                className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                                    i === activeImg
                                        ? "border-red-500"
                                        : "border-gray-200"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                <div className="px-6 pt-4 pb-8 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {prop.name || "Unnamed Property"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                                {[
                                    prop.address,
                                    prop.city,
                                    prop.state,
                                    prop.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-bold text-red-600">
                                {formatPrice(prop.price)}
                            </p>
                            {prop.payment_plan && (
                                <p className="text-xs text-gray-400">
                                    {prop.payment_plan.replace(/_/g, " ")}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            prop.type,
                            prop.category,
                            prop.property_use,
                            prop.furnishing,
                        ]
                            .filter(Boolean)
                            .map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                    </div>

                    {[
                        prop.bedroom,
                        prop.bathroom,
                        prop.toilet,
                        prop.parking_space,
                    ].some((v) => v != null) && (
                        <div className="grid grid-cols-4 gap-3 bg-gray-50 rounded-2xl p-4">
                            {[
                                ["Bed", prop.bedroom],
                                ["Bath", prop.bathroom],
                                ["Toilet", prop.toilet],
                                ["Parking", prop.parking_space],
                            ].map(([label, value]) =>
                                value != null ? (
                                    <div key={label} className="text-center">
                                        <p className="text-xl font-bold text-gray-900">
                                            {value}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {label}
                                        </p>
                                    </div>
                                ) : null
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-4">
                        {[
                            ["Total Area", prop.total_area],
                            ["Type", prop.type],
                            [
                                "Payment Plan",
                                prop.payment_plan?.replace(/_/g, " "),
                            ],
                            ["Property Use", prop.property_use],
                            ["Furnishing", prop.furnishing],
                        ]
                            .filter(([, v]) => v)
                            .map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                                        {label}
                                    </p>
                                    <p className="text-gray-800 text-sm font-medium mt-0.5">
                                        {value}
                                    </p>
                                </div>
                            ))}
                    </div>

                    {prop.description && (
                        <div className="border-t pt-4">
                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                                Description
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {prop.description}
                            </p>
                        </div>
                    )}

                    {Array.isArray(prop.amenities) &&
                        prop.amenities.length > 0 && (
                            <div className="border-t pt-4">
                                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                    Amenities
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {prop.amenities.map((a) => (
                                        <span
                                            key={a}
                                            className="text-xs px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-medium"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminProperties() {
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState("");
    const [verifying, setVerifying] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [selectedProp, setSelectedProp] = useState(null);
    const [uploadingForProp, setUploadingForProp] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => setToast({ message, type });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/admin/login");
            return;
        }
        try {
            const user = JSON.parse(userData);
            if (user.role !== "MERCHANT") {
                router.push("/admin/login");
                return;
            }
        } catch {
            router.push("/admin/login");
            return;
        }
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        setError("");
        try {
            const token = getToken();
            const userData = JSON.parse(
                localStorage.getItem("user") || "{}"
            );
            const myId = getId(userData);
            let allProperties = [];

            const endpoints = [
                `${BASE}/properties`,
                `${BASE}/properties?merchant=${myId}`,
                `${BASE}/properties?verified=true`,
                `${BASE}/properties?verified=false`,
            ];

            // Collect agent-scoped endpoints
            try {
                const agentsRes = await fetch(`${BASE}/merchants/agents`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const agentsData = await agentsRes.json();
                const agents = Array.isArray(agentsData.data)
                    ? agentsData.data
                    : [];
                for (const agent of agents) {
                    const agentId = getId(agent);
                    if (!agentId) continue;
                    endpoints.push(`${BASE}/properties?agent=${agentId}`);
                    endpoints.push(
                        `${BASE}/properties?agent=${agentId}&verified=true`
                    );
                    endpoints.push(
                        `${BASE}/properties?agent=${agentId}&verified=false`
                    );
                }
            } catch {
                // non-fatal
            }

            await Promise.all(
                endpoints.map(async (url) => {
                    try {
                        const res = await fetch(url, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const data = await res.json();
                        const list =
                            data.data ||
                            data.properties ||
                            data.results ||
                            [];
                        if (Array.isArray(list) && list.length > 0)
                            allProperties.push(...list);
                    } catch {
                        // skip failed endpoints silently
                    }
                })
            );

            // De-duplicate by ID
            const seen = new Set();
            const unique = allProperties.filter((p) => {
                const id = getId(p);
                if (!id || seen.has(id)) return false;
                seen.add(id);
                return true;
            });

            // ── FIX: Reconcile deleted_properties against server response ──
            // Only keep IDs in the deleted list that the server did NOT return.
            // This prevents newly created properties from being hidden because
            // their ID was previously in the deleted list, and auto-cleans
            // IDs where the server-side delete actually failed.
            const deletedIds = JSON.parse(
                localStorage.getItem("deleted_properties") || "[]"
            );
            const serverIds = new Set(
                unique.map((p) => getId(p)).filter(Boolean)
            );
            const reconciledDeletedIds = deletedIds.filter(
                (id) => !serverIds.has(id)
            );
            localStorage.setItem(
                "deleted_properties",
                JSON.stringify(reconciledDeletedIds)
            );

            // Filter out IDs that are confirmed deleted (not returned by server)
            const finalProperties = unique.filter(
                (p) => !reconciledDeletedIds.includes(getId(p))
            );

            setProperties(finalProperties);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to load properties. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    const viewProperty = async (propId) => {
        // Show cached version immediately, then refresh from server
        const cached = properties.find((p) => getId(p) === propId);
        setSelectedProp(cached || null);
        try {
            const res = await fetch(`${BASE}/properties/${propId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            const fresh =
                data.data ||
                data.property ||
                (data._id || data.id ? data : null);
            if (fresh) setSelectedProp(fresh);
        } catch {
            // keep cached version
        }
    };

    const verifyProperty = async (propertyId) => {
        setVerifying(propertyId);
        try {
            const res = await fetch(
                `${BASE}/properties/${propertyId}/set-verified`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ is_verified: true }),
                }
            );
            const data = await res.json();

            if (res.ok || data.code === 200 || data.status === "success") {
                setProperties((prev) =>
                    prev.map((p) =>
                        getId(p) === propertyId
                            ? { ...p, is_verified: true }
                            : p
                    )
                );
                showToast("Property verified successfully!", "success");
            } else {
                showToast(
                    data.message || data.msg || "Failed to verify property.",
                    "error"
                );
            }
        } catch {
            showToast("Network error while verifying.", "error");
        } finally {
            setVerifying(null);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!confirm("Delete this property? This cannot be undone.")) return;
        setDeleting(propertyId);

        try {
            const res = await fetch(`${BASE}/properties/${propertyId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if (res.ok && data.code === 200) {
                // Track deleted ID in localStorage
                const deletedIds = JSON.parse(
                    localStorage.getItem("deleted_properties") || "[]"
                );
                if (!deletedIds.includes(propertyId)) {
                    localStorage.setItem(
                        "deleted_properties",
                        JSON.stringify([...deletedIds, propertyId])
                    );
                }
                // Remove optimistically from UI
                setProperties((prev) =>
                    prev.filter((p) => getId(p) !== propertyId)
                );
                showToast("Property deleted successfully!", "success");
            } else {
                showToast(data.message || data.msg || "Delete failed", "error");
            }
        } catch (err) {
            console.error("Delete error:", err);
            showToast(`Network error: ${err.message}`, "error");
        } finally {
            setDeleting(null);
        }
    };

    const formatPrice = (price) => {
        if (!price) return "—";
        const num = parseInt(String(price).replace(/,/g, ""));
        return isNaN(num) ? String(price) : num.toLocaleString();
    };

    const filteredProperties = properties.filter((prop) => {
        const matchesSearch =
            prop.name?.toLowerCase().includes(search.toLowerCase()) ||
            prop.city?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "verified"
                ? prop.is_verified
                : filter === "pending"
                ? !prop.is_verified
                : true;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {selectedProp && (
                <PropertyModal
                    prop={selectedProp}
                    onClose={() => setSelectedProp(null)}
                />
            )}
            {uploadingForProp && (
                <ImageUploadModal
                    prop={uploadingForProp}
                    onClose={() => setUploadingForProp(null)}
                    onSuccess={fetchProperties}
                    showToast={showToast}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium mb-4 group"
                    >
                        <span className="mr-1 group-hover:-translate-x-0.5 transition">
                            ←
                        </span>{" "}
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Manage Properties
                            </h1>
                            <p className="text-gray-500 mt-1">
                                View, verify and manage all property listings
                                {properties.length > 0 && (
                                    <span className="ml-2 text-red-600 font-medium">
                                        ({properties.length} total)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchProperties}
                                className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowPathIcon className="w-4 h-4" /> Refresh
                            </button>
                            <Link href="/admin/properties/create">
                                <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                                    <PlusCircleIcon className="w-5 h-5" />{" "}
                                    Create Property
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "verified", "pending"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
                                    filter === f
                                        ? f === "verified"
                                            ? "bg-green-600 text-white"
                                            : f === "pending"
                                            ? "bg-yellow-600 text-white"
                                            : "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Image
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Property
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Location
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Price
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-12 text-gray-500"
                                        >
                                            {properties.length === 0
                                                ? "No properties yet. Create your first property above."
                                                : "No properties match your search or filter."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProperties.map((prop) => {
                                        const propId = getId(prop);
                                        const imageUrl = extractImageUrl(prop);
                                        const isVerifying =
                                            verifying === propId;
                                        const isDeleting = deleting === propId;

                                        return (
                                            <tr
                                                key={propId}
                                                className={`border-b hover:bg-gray-50 transition ${
                                                    isDeleting
                                                        ? "opacity-40 pointer-events-none"
                                                        : ""
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={
                                                                    prop.name ||
                                                                    "property"
                                                                }
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.display =
                                                                        "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">
                                                        {prop.name || "—"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {[
                                                            prop.type,
                                                            prop.category,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" • ") || "—"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-700 text-sm">
                                                        {prop.city || "—"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {prop.state}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    ₦{formatPrice(prop.price)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                            prop.is_verified
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {prop.is_verified
                                                            ? "Verified"
                                                            : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() =>
                                                                viewProperty(
                                                                    propId
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="View details"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                setUploadingForProp(
                                                                    prop
                                                                )
                                                            }
                                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                            title="Add images"
                                                        >
                                                            <CloudArrowUpIcon className="w-4 h-4" />
                                                        </button>

                                                        {!prop.is_verified && (
                                                            <button
                                                                onClick={() =>
                                                                    verifyProperty(
                                                                        propId
                                                                    )
                                                                }
                                                                disabled={
                                                                    isVerifying
                                                                }
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                                                title="Verify"
                                                            >
                                                                {isVerifying ? (
                                                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <CheckCircleIcon className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                deleteProperty(
                                                                    propId
                                                                )
                                                            }
                                                            disabled={isDeleting}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {isDeleting ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <TrashIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}