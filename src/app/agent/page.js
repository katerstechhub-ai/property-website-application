"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BuildingOfficeIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    BriefcaseIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon,
    HomeIcon,
    XMarkIcon,
    PhotoIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";
const getToken = () => localStorage.getItem("token");
const getId = (obj) => obj?._id || obj?.id || null;

// ── Image helpers ─────────────────────────────────────────────────
function extractImageUrl(prop) {
    if (!prop) return null;
    const ok = (v) =>
        typeof v === "string" &&
        v.length > 4 &&
        (v.startsWith("http") ||
            v.startsWith("/") ||
            /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));
    const fromItem = (item) => {
        if (!item) return null;
        if (ok(item)) return item;
        if (typeof item === "object") {
            for (const k of [
                "url", "uri", "path", "src", "image",
                "link", "file", "resource", "secure_url",
            ])
                if (ok(item[k])) return item[k];
        }
        return null;
    };
    const fromArr = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return null;
        for (const item of arr) {
            const u = fromItem(item);
            if (u) return u;
        }
        return null;
    };
    return (
        fromArr(prop.resources) ||
        fromArr(prop.images) ||
        fromArr(prop.media) ||
        fromArr(prop.photos) ||
        fromArr(prop.files) ||
        fromItem(prop.image) ||
        fromItem(prop.thumbnail) ||
        fromItem(prop.photo) ||
        null
    );
}

function extractAllImages(prop) {
    if (!prop) return [];
    const ok = (v) =>
        typeof v === "string" &&
        v.length > 4 &&
        (v.startsWith("http") ||
            v.startsWith("/") ||
            /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));
    const fromItem = (item) => {
        if (ok(item)) return item;
        if (typeof item === "object" && item)
            for (const k of [
                "url", "uri", "path", "src", "image",
                "link", "file", "resource", "secure_url",
            ])
                if (ok(item[k])) return item[k];
        return null;
    };
    const urls = [];
    for (const field of ["resources", "images", "media", "photos", "files"])
        if (Array.isArray(prop[field]))
            for (const item of prop[field]) {
                const u = fromItem(item);
                if (u && !urls.includes(u)) urls.push(u);
            }
    return urls;
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);
    const bg =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500";
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`${bg} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]`}
            >
                {type === "success" ? (
                    <CheckCircleIcon className="w-5 h-5 shrink-0" />
                ) : (
                    <XCircleIcon className="w-5 h-5 shrink-0" />
                )}
                <span className="text-sm font-medium flex-1">{message}</span>
                <button onClick={onClose}>
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ── View Modal ────────────────────────────────────────────────────
function ViewPropertyModal({ property, onClose }) {
    const [activeImage, setActiveImage] = useState(0);
    const images = extractAllImages(property);
    const mainImage = images[activeImage] || extractImageUrl(property);
    const fmtPrice = (p) => {
        const n = parseInt(String(p || "").replace(/,/g, ""));
        return isNaN(n) ? p : "₦" + n.toLocaleString();
    };
    if (!property) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow transition"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="relative w-full h-64 bg-gray-100 rounded-t-2xl overflow-hidden">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={property.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <PhotoIcon className="w-14 h-14 text-gray-300" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                            {property.type}
                        </span>
                        <span
                            className={`text-xs px-2 py-1 rounded-lg font-medium ${
                                property.is_verified
                                    ? "bg-green-500 text-white"
                                    : "bg-amber-400 text-white"
                            }`}
                        >
                            {property.is_verified ? "✓ Verified" : "⏳ Pending"}
                        </span>
                    </div>
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 px-6 pt-3 overflow-x-auto">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                                    i === activeImage
                                        ? "border-purple-600"
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
                <div className="p-6 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">{property.name}</h2>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            {property.address}, {property.city}, {property.state}
                        </p>
                    </div>
                    <div className="flex justify-between items-center border-y py-3">
                        <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {fmtPrice(property.price)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="font-semibold text-sm">
                                {property.payment_plan?.replace(/_/g, " ")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="font-semibold text-sm">
                                {property.total_area || "—"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-center">
                        {[
                            ["Beds", property.bedroom],
                            ["Baths", property.bathroom],
                            ["Toilets", property.toilet],
                            ["Parking", property.parking_space],
                        ].map(([l, v]) => (
                            <div key={l}>
                                <p className="text-xl font-bold">{v ?? 0}</p>
                                <p className="text-xs text-gray-500">{l}</p>
                            </div>
                        ))}
                    </div>
                    {property.description && (
                        <div>
                            <h3 className="font-semibold mb-1">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {property.description}
                            </p>
                        </div>
                    )}
                    {property.amenities?.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((a, i) => (
                                    <span
                                        key={i}
                                        className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-medium"
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

// ── Edit Modal ────────────────────────────────────────────────────
function EditPropertyModal({ property, onClose, onUpdate, showToast }) {
    const [loading, setLoading] = useState(false);
    const [amenInput, setAmenInput] = useState("");
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [uploadingImgs, setUploadingImgs] = useState(false);
    const [form, setForm] = useState({
        name: "", price: "", country: "NIGERIA", state: "", city: "",
        address: "", description: "", category: "FLAT", total_area: "",
        property_use: "RESIDENTIAL", payment_plan: "PER_ANNUM", type: "RENT",
        bedroom: 0, bathroom: 0, toilet: 0, parking_space: 0,
        furnishing: "UNFURNISHED", amenities: [],
    });

    useEffect(() => {
        if (property)
            setForm({
                name: property.name || "",
                price: property.price || "",
                country: property.country || "NIGERIA",
                state: property.state || "",
                city: property.city || "",
                address: property.address || "",
                description: property.description || "",
                category: property.category || "FLAT",
                total_area: property.total_area || "",
                property_use: property.property_use || "RESIDENTIAL",
                payment_plan: property.payment_plan || "PER_ANNUM",
                type: property.type || "RENT",
                bedroom: property.bedroom || 0,
                bathroom: property.bathroom || 0,
                toilet: property.toilet || 0,
                parking_space: property.parking_space || 0,
                furnishing: property.furnishing || "UNFURNISHED",
                amenities: property.amenities || [],
            });
    }, [property]);

    useEffect(() => {
        return () =>
            newPreviews.forEach((p) => {
                if (p.startsWith("blob:")) URL.revokeObjectURL(p);
            });
    }, [newPreviews]);

    const hc = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const hn = (e) =>
        setForm((prev) => ({
            ...prev,
            [e.target.name]: parseInt(e.target.value) || 0,
        }));
    const addAmen = () => {
        const t = amenInput.trim().toUpperCase();
        if (t && !form.amenities.includes(t)) {
            setForm((prev) => ({ ...prev, amenities: [...prev.amenities, t] }));
            setAmenInput("");
        }
    };
    const removeAmen = (a) =>
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((x) => x !== a),
        }));

    const handleImgChange = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 5 - newFiles.length;
        const toAdd = files.slice(0, remaining);
        if (files.length > remaining)
            showToast(`Only ${remaining} slot(s) remaining.`, "error");
        setNewFiles((prev) => [...prev, ...toAdd]);
        setNewPreviews((prev) => [
            ...prev,
            ...toAdd.map((f) => URL.createObjectURL(f)),
        ]);
        e.target.value = "";
    };

    const removeNewImg = (i) => {
        if (newPreviews[i]?.startsWith("blob:"))
            URL.revokeObjectURL(newPreviews[i]);
        setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
        setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
    };

    const uploadNewImgs = async (propId, token) => {
        setUploadingImgs(true);
        try {
            const fd = new FormData();
            newFiles.forEach((f) => fd.append("images", f));
            const res = await fetch(`${BASE}/properties/${propId}/resource`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (res.ok || data.code === 200 || data.type === "SUCCESS")
                showToast("Images uploaded!", "success");
            else showToast("Failed to upload images", "error");
        } catch {
            showToast("Image upload failed", "error");
        } finally {
            setUploadingImgs(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = getToken();
        const propId = getId(property);
        try {
            const res = await fetch(`${BASE}/properties/${propId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    price: String(form.price).replace(/,/g, ""),
                }),
            });
            const data = await res.json();
            if (res.ok || data.code === 200 || data.type === "SUCCESS") {
                if (newFiles.length > 0) await uploadNewImgs(propId, token);
                showToast("Property updated!", "success");
                if (onUpdate) await onUpdate();
                setTimeout(onClose, 1500);
            } else {
                showToast(data.message || "Failed to update", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const inp =
        "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm";
    if (!property) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold">Edit Property</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Property Name *
                            </label>
                            <input
                                name="name"
                                required
                                value={form.name}
                                onChange={hc}
                                className={inp}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Price (₦) *
                            </label>
                            <input
                                name="price"
                                required
                                value={form.price}
                                onChange={hc}
                                className={inp}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">Category</label>
                            <select name="category" value={form.category} onChange={hc} className={inp}>
                                {["FLAT","APPARTMENT","LAND","DUPLEX","WAREHOUSE","SHOP"].map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Type</label>
                            <select name="type" value={form.type} onChange={hc} className={inp}>
                                {["RENT","SALES","LEASE"].map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Payment Plan</label>
                            <select name="payment_plan" value={form.payment_plan} onChange={hc} className={inp}>
                                {["PER_ANNUM","MONTHLY","PER_PLOT","PER_DAY"].map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">State *</label>
                            <input name="state" required value={form.state} onChange={hc} className={inp} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">City *</label>
                            <input name="city" required value={form.city} onChange={hc} className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Address *</label>
                        <input name="address" required value={form.address} onChange={hc} className={inp} />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            ["Beds", "bedroom"],
                            ["Baths", "bathroom"],
                            ["Toilets", "toilet"],
                            ["Parking", "parking_space"],
                        ].map(([l, n]) => (
                            <div key={n}>
                                <label className="block text-xs font-medium mb-1">{l}</label>
                                <input
                                    type="number"
                                    name={n}
                                    value={form[n]}
                                    onChange={hn}
                                    className={inp}
                                    min="0"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-medium mb-1">Furnishing</label>
                            <select name="furnishing" value={form.furnishing} onChange={hc} className={inp}>
                                {["FURNISHED","UNFURNISHED","SEMI_FURNISHED"].map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Total Area</label>
                        <input
                            name="total_area"
                            value={form.total_area}
                            onChange={hc}
                            className={inp}
                            placeholder="e.g., 120 sqm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Property Use</label>
                        <select name="property_use" value={form.property_use} onChange={hc} className={`${inp} max-w-xs`}>
                            {["RESIDENTIAL","COMMERCIAL"].map((u) => (
                                <option key={u}>{u}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Description *</label>
                        <textarea
                            name="description"
                            required
                            value={form.description}
                            onChange={hc}
                            rows="3"
                            className={inp}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Amenities</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={amenInput}
                                onChange={(e) => setAmenInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addAmen();
                                    }
                                }}
                                className={inp}
                                placeholder="e.g., GYM"
                            />
                            <button
                                type="button"
                                onClick={addAmen}
                                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.amenities.map((a, i) => (
                                <span
                                    key={i}
                                    className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
                                >
                                    {a}
                                    <button
                                        type="button"
                                        onClick={() => removeAmen(a)}
                                        className="hover:text-red-600 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">
                            Add New Images
                        </label>
                        {newFiles.length < 5 && (
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImgChange}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            />
                        )}
                        {newPreviews.length > 0 && (
                            <div className="mt-2 grid grid-cols-5 gap-2">
                                {newPreviews.map((src, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={src}
                                            className="w-full h-16 object-cover rounded-lg"
                                            alt=""
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImg(i)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 pt-2 border-t">
                        <button
                            type="submit"
                            disabled={loading || uploadingImgs}
                            className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                        >
                            {uploadingImgs
                                ? "Uploading Images..."
                                : loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading || uploadingImgs}
                            className="flex-1 border border-gray-300 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AgentDashboard() {
    const router = useRouter();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [actionLoading, setActionLoading] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const showToast = (msg, type) => setToast({ message: msg, type });

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw) { router.push("/agent/login"); return; }
        const parsed = JSON.parse(raw);
        if (parsed.role?.toLowerCase() !== "agent") {
            router.push("/agent/login");
            return;
        }
        setAgent(parsed);
        fetchData(parsed);
    }, []);

    const fetchData = async (agentData) => {
        const token = getToken();
        const agentId = getId(agentData);
        if (!token || !agentId) {
            showToast("Please login again.", "error");
            router.push("/agent/login");
            return;
        }

        setLoading(true);
        try {
            const propsRes = await fetch(
                `${BASE}/properties?agent=${agentId}&limit=100`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const propsData = await propsRes.json();
            const propList = propsData.data || [];

            const detailed = await Promise.all(
                propList.map(async (prop) => {
                    try {
                        const r = await fetch(
                            `${BASE}/properties/${getId(prop)}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const d = await r.json();
                        return d.data || d.property || prop;
                    } catch {
                        return prop;
                    }
                })
            );

            // ── FIX: Reconcile agent_deleted_properties against server data ──
            // Remove IDs from the deleted list that the server still returns —
            // this prevents newly created properties from being hidden because
            // a previous ID happened to match, and auto-cleans failed deletes.
            const deletedIds = JSON.parse(
                localStorage.getItem("agent_deleted_properties") || "[]"
            );
            const serverIds = new Set(
                detailed.map((p) => getId(p)).filter(Boolean)
            );
            const reconciledDeletedIds = deletedIds.filter(
                (id) => !serverIds.has(id)
            );
            localStorage.setItem(
                "agent_deleted_properties",
                JSON.stringify(reconciledDeletedIds)
            );

            const filtered = detailed.filter((p) => {
                const id = getId(p);
                return id && !reconciledDeletedIds.includes(id);
            });

            setProperties(filtered);

            // Fetch appointments
            const aptRes = await fetch(
                `${BASE}/appointments?agent=${agentId}&limit=100`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const aptData = await aptRes.json();
            const aptList = aptData.data || [];

            const enrichedApts = await Promise.all(
                aptList.map(async (apt) => {
                    if (!apt.property_id) return apt;
                    try {
                        const r = await fetch(
                            `${BASE}/properties/${apt.property_id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const d = await r.json();
                        return { ...apt, property: d.data || d };
                    } catch {
                        return apt;
                    }
                })
            );
            setAppointments(enrichedApts);
        } catch (err) {
            console.error("fetchData error:", err);
            showToast("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (aptId, action) => {
        const token = getToken();
        setActionLoading(aptId + action);
        try {
            let res;
            if (action === "accept") {
                res = await fetch(
                    `${BASE}/appointments/${aptId}/confirm-meeting`,
                    {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                res = await fetch(`${BASE}/appointments/${aptId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            const data = await res.json();
            if (res.ok || data.code === 200 || data.type === "SUCCESS") {
                if (action === "accept") {
                    setAppointments((prev) =>
                        prev.map((a) =>
                            a._id === aptId ? { ...a, status: "accepted" } : a
                        )
                    );
                    showToast("Appointment accepted!", "success");
                } else {
                    setAppointments((prev) =>
                        prev.filter((a) => a._id !== aptId)
                    );
                    showToast("Appointment declined.", "success");
                }
            } else {
                showToast(data.message || data.msg || "Action failed", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!confirm("Delete this property? This cannot be undone.")) return;
        setDeletingId(propertyId);
        const token = getToken();
        try {
            const response = await fetch(`${BASE}/properties/${propertyId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            let data = {};
            try { data = await response.json(); } catch { /* 204 no body */ }

            const success =
                response.ok ||
                data.code === 200 ||
                data.status === "success" ||
                data.type === "SUCCESS" ||
                data.message?.toLowerCase().includes("deleted") ||
                data.message?.toLowerCase().includes("success");

            if (success) {
                // 1. Remove from UI immediately
                setProperties((prev) =>
                    prev.filter((p) => getId(p) !== propertyId)
                );
                // 2. Track in localStorage
                const deletedIds = JSON.parse(
                    localStorage.getItem("agent_deleted_properties") || "[]"
                );
                if (!deletedIds.includes(propertyId)) {
                    localStorage.setItem(
                        "agent_deleted_properties",
                        JSON.stringify([...deletedIds, propertyId])
                    );
                }
                showToast("Property deleted successfully!", "success");
            } else {
                showToast(
                    data.message ||
                        data.msg ||
                        `Delete failed (${response.status})`,
                    "error"
                );
            }
        } catch (err) {
            console.error("Delete error:", err);
            showToast(`Network error: ${err.message}`, "error");
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/public");
    };

    const openView = (prop) => { setSelectedProperty(prop); setIsViewOpen(true); };
    const openEdit = (prop) => { setSelectedProperty(prop); setIsEditOpen(true); };
    const closeModals = () => { setIsViewOpen(false); setIsEditOpen(false); setSelectedProperty(null); };
    const refreshProps = async () => { if (agent) await fetchData(agent); };

    const getStatusBadge = (status) => {
        const cfg = {
            pending:   { bg: "bg-amber-100", text: "text-amber-700",  Icon: ClockIcon,       label: "Pending"   },
            accepted:  { bg: "bg-green-100", text: "text-green-700",  Icon: CheckCircleIcon, label: "Accepted"  },
            rejected:  { bg: "bg-red-100",   text: "text-red-700",    Icon: XCircleIcon,     label: "Rejected"  },
            completed: { bg: "bg-blue-100",  text: "text-blue-700",   Icon: CheckCircleIcon, label: "Completed" },
        };
        const s = cfg[status?.toLowerCase()] || cfg.pending;
        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
            >
                <s.Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const pendingCount = appointments.filter(
        (a) => a.status?.toLowerCase() === "pending"
    ).length;
    const verifiedCount = properties.filter((p) => p.is_verified).length;

    const tabs = [
        { id: "overview",     label: "Overview",      Icon: ChartBarIcon },
        { id: "properties",   label: "My Properties", Icon: BuildingOfficeIcon, count: properties.length },
        { id: "appointments", label: "Appointments",  Icon: CalendarDaysIcon,   count: pendingCount },
        { id: "profile",      label: "Profile",       Icon: UserCircleIcon },
    ];

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {isViewOpen && selectedProperty && (
                <ViewPropertyModal
                    property={selectedProperty}
                    onClose={closeModals}
                />
            )}
            {isEditOpen && selectedProperty && (
                <EditPropertyModal
                    property={selectedProperty}
                    onClose={closeModals}
                    onUpdate={refreshProps}
                    showToast={showToast}
                />
            )}

            {/* Hero */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-violet-800/75 to-purple-900/85" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
                                <BriefcaseIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm">
                                    Welcome back,
                                </p>
                                <h1 className="text-2xl font-bold text-white">
                                    {agent?.full_name ||
                                        `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim() ||
                                        "Agent"}
                                </h1>
                                {agent?.company && (
                                    <p className="text-purple-200 text-sm flex items-center gap-1">
                                        <BuildingOfficeIcon className="w-3.5 h-3.5" />
                                        {agent.company}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => fetchData(agent)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowPathIcon className="w-4 h-4" /> Refresh
                            </button>
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md">
                                    <PlusCircleIcon className="w-4 h-4" /> Add
                                    Property
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4" />{" "}
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { Icon: BuildingOfficeIcon, value: properties.length,    label: "Total Listings", color: "text-purple-300" },
                            { Icon: CheckCircleIcon,    value: verifiedCount,         label: "Verified",       color: "text-green-300"  },
                            { Icon: CalendarDaysIcon,   value: appointments.length,   label: "Appointments",   color: "text-blue-300"   },
                            { Icon: ClockIcon,          value: pendingCount,           label: "Pending",        color: "text-amber-300"  },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20"
                            >
                                <s.Icon
                                    className={`w-6 h-6 ${s.color} mx-auto mb-1`}
                                />
                                <p className="text-2xl font-bold text-white">
                                    {s.value}
                                </p>
                                <p className="text-purple-200 text-xs">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map(({ id, label, Icon, count }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                                    activeTab === id
                                        ? "border-purple-600 text-purple-600 bg-purple-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {count > 0 && (
                                    <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                    Recent Listings
                                </h2>
                                <button
                                    onClick={() => setActiveTab("properties")}
                                    className="text-purple-600 text-sm hover:underline"
                                >
                                    View all
                                </button>
                            </div>
                            {properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <BuildingOfficeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">
                                        No listings yet
                                    </p>
                                    <Link
                                        href="/agent/properties/create"
                                        className="text-purple-600 text-sm hover:underline"
                                    >
                                        Add your first property →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {properties.slice(0, 4).map((prop) => {
                                        const img = extractImageUrl(prop);
                                        return (
                                            <div
                                                key={getId(prop)}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => openView(prop)}
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                    {img ? (
                                                        <img
                                                            src={img}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <HomeIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">
                                                        {prop.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" />
                                                        {prop.city}, {prop.state}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                                                        prop.is_verified
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {prop.is_verified
                                                        ? "Verified"
                                                        : "Pending"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                                    Pending Appointments
                                </h2>
                                <button
                                    onClick={() => setActiveTab("appointments")}
                                    className="text-purple-600 text-sm hover:underline"
                                >
                                    View all
                                </button>
                            </div>
                            {pendingCount === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">
                                        No pending appointments
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments
                                        .filter(
                                            (a) =>
                                                a.status?.toLowerCase() ===
                                                "pending"
                                        )
                                        .slice(0, 4)
                                        .map((apt) => (
                                            <div
                                                key={apt._id}
                                                className="p-3 bg-amber-50 border border-amber-100 rounded-xl"
                                            >
                                                <p className="font-semibold text-sm">
                                                    {apt.property?.name ||
                                                        "Property"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {apt.date} ·{" "}
                                                    {apt.time?.from} –{" "}
                                                    {apt.time?.to}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAppointmentAction(
                                                                apt._id,
                                                                "accept"
                                                            )
                                                        }
                                                        disabled={!!actionLoading}
                                                        className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAppointmentAction(
                                                                apt._id,
                                                                "reject"
                                                            )
                                                        }
                                                        disabled={!!actionLoading}
                                                        className="flex-1 text-xs border border-red-400 text-red-600 hover:bg-red-50 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Properties Tab */}
                {activeTab === "properties" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                My Properties ({properties.length})
                            </h2>
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                                    <PlusCircleIcon className="w-4 h-4" /> Add
                                    Property
                                </button>
                            </Link>
                        </div>
                        {properties.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Properties Yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Start listing properties for potential
                                    tenants
                                </p>
                                <Link href="/agent/properties/create">
                                    <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 text-sm font-semibold">
                                        Add First Property
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {properties.map((prop) => {
                                    const propId = getId(prop);
                                    const img = extractImageUrl(prop);
                                    const isDeleting = deletingId === propId;
                                    return (
                                        <div
                                            key={propId}
                                            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group ${
                                                isDeleting
                                                    ? "opacity-40 pointer-events-none"
                                                    : ""
                                            }`}
                                        >
                                            <div
                                                className="h-44 bg-gray-100 relative overflow-hidden cursor-pointer"
                                                onClick={() => openView(prop)}
                                            >
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={prop.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <HomeIcon className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3 flex gap-1.5">
                                                    <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-lg">
                                                        {prop.type}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                                                            prop.is_verified
                                                                ? "bg-green-500 text-white"
                                                                : "bg-amber-400 text-white"
                                                        }`}
                                                    >
                                                        {prop.is_verified
                                                            ? "✓"
                                                            : "⏳"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-base mb-0.5 line-clamp-1">
                                                    {prop.name}
                                                </h3>
                                                <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {prop.city}, {prop.state}
                                                </p>
                                                <p className="text-purple-700 font-bold text-lg mb-3">
                                                    ₦
                                                    {parseInt(
                                                        String(
                                                            prop.price || ""
                                                        ).replace(/,/g, "")
                                                    ).toLocaleString()}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openView(prop)
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-xl text-xs font-medium transition"
                                                    >
                                                        <EyeIcon className="w-3.5 h-3.5" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openEdit(prop)
                                                        }
                                                        className="flex-1 flex items-center justify-center gap-1.5 border border-purple-400 text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-xs font-medium transition"
                                                    >
                                                        <PencilSquareIcon className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteProperty(
                                                                propId
                                                            )
                                                        }
                                                        disabled={isDeleting}
                                                        className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-xs transition disabled:opacity-50"
                                                        title="Delete property"
                                                    >
                                                        {isDeleting ? (
                                                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <TrashIcon className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === "appointments" && (
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Appointments Yet
                                </h3>
                                <p className="text-gray-500">
                                    Booking requests will appear here when
                                    tenants schedule viewings
                                </p>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div
                                    key={apt._id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">
                                                        {apt.property?.name ||
                                                            "Property"}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" />
                                                        {apt.property
                                                            ?.address ||
                                                            apt.property
                                                                ?.city ||
                                                            "—"}
                                                    </p>
                                                </div>
                                                {getStatusBadge(apt.status)}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">
                                                        Date
                                                    </p>
                                                    <p className="font-semibold text-sm">
                                                        {apt.date}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">
                                                        Time
                                                    </p>
                                                    <p className="font-semibold text-sm">
                                                        {apt.time?.from} –{" "}
                                                        {apt.time?.to}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">
                                                        Tenant
                                                    </p>
                                                    <p className="font-mono text-xs text-gray-600">
                                                        {apt.user_id?.slice(
                                                            -10
                                                        ) || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                            {apt.msg && (
                                                <div className="bg-purple-50 border border-purple-100 px-4 py-3 rounded-xl">
                                                    <p className="text-sm text-purple-700">
                                                        <span className="font-semibold">
                                                            Message:{" "}
                                                        </span>
                                                        {apt.msg}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {apt.status?.toLowerCase() ===
                                            "pending" && (
                                            <div className="flex flex-col gap-2 min-w-[130px]">
                                                <button
                                                    onClick={() =>
                                                        handleAppointmentAction(
                                                            apt._id,
                                                            "accept"
                                                        )
                                                    }
                                                    disabled={!!actionLoading}
                                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAppointmentAction(
                                                            apt._id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={!!actionLoading}
                                                    className="w-full flex items-center justify-center gap-2 border-2 border-red-400 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
                                                >
                                                    <XCircleIcon className="w-4 h-4" />
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                                        <BriefcaseIcon className="w-9 h-9 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {agent?.full_name ||
                                                `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim()}
                                        </h2>
                                        <p className="text-purple-200 text-sm">
                                            Real Estate Agent
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { Icon: EnvelopeIcon,       label: "Email",        value: agent?.email },
                                    { Icon: PhoneIcon,          label: "Phone",        value: agent?.phone || "Not provided" },
                                    { Icon: BuildingOfficeIcon, label: "Company",      value: agent?.company || "Not provided" },
                                    { Icon: CalendarDaysIcon,   label: "Member Since", value: agent?.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "—" },
                                ].map(({ Icon, label, value }, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl"
                                    >
                                        <Icon className="w-5 h-5 text-purple-600 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {label}
                                            </p>
                                            <p className="font-medium">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition mt-2"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}