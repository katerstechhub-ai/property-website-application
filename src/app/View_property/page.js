"use client";
import { useEffect, useState } from "react";


export default function ViewProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const data = JSON.parse(
        localStorage.getItem("my_properties") || "[]"
      );

      console.log("ALL PROPERTIES:", data);

      if (!data || data.length === 0) {
        setError("No properties found.");
      } else {
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          "http://property.reworkstaging.name.ng/v1/reviews"
        );

        const data = await res.json();

        console.log("REVIEWS FROM API:", data);

        setReviews(data?.data || data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    }

    fetchReviews();
  }, []);

  if (loading)
    return <div className="p-20 text-center font-bold">Loading...</div>;

  if (error)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        {error}
      </div>
    );

  async function deleteProperty(propertyId) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://property.reworkstaging.name.ng/v1/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("DELETE RESPONSE:", data);

      // if (!res.ok) {
      //   alert(data?.message || "Delete failed");
      //   return false;
      // }

      // remove from localStorage
      const existing = JSON.parse(localStorage.getItem("my_properties") || "[]");
      const updated = existing.filter((p) => p.id !== propertyId);

      localStorage.setItem("my_properties", JSON.stringify(updated));

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10 text-black">
        My Properties
      </h1>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {properties.map((property, index) => {
          const image =
            property?.images?.[0]?.url ||
            property?.images?.[0]?.secure_url ||
            property?.images?.[0] ||
            property?.image ||
            property?.image_url ||
            null;
          const price = property.price || "No price";

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="h-56 bg-gray-200">
                {image ? (
                  <img
                    src={image}
                    alt="property"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-xl font-bold mb-1 text-black">
                  {property.name || "No Name"}
                </h2>

                <p className="text-green-600 font-bold mb-2">
                  {price}
                </p>

                <p className="text-gray-500 text-sm mb-3">
                  🏘️ {property.address || "No address"}
                </p>
                <div className="mt-3">
                  <p className="text-sm font-bold text-gray-700">Reviews:</p>

                  {reviews.length > 0 ? (
                    reviews.slice(0, 2).map((r, i) => (
                      <p key={i} className="text-xs text-gray-500">
                        • {r.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No reviews yet</p>
                  )}
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>{property.state || "N/A"}</span>
                  <span>{property.category || "General"}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  {/* VIEW */}
                  <button
                    onClick={() => {
                      localStorage.setItem("selected_property", JSON.stringify(property));
                      window.location.href = "/Edit_property";
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Edit Property
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this property?")) return;

                      const success = await deleteProperty(property.id);

                      if (success) {
                        setProperties((prev) =>
                          prev.filter((p) => p.id !== property.id)
                        );
                      }
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "edit_property",
                        JSON.stringify(property)
                      );
                      window.location.href = "/property-review";
                    }}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                  >
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}