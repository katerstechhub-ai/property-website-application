"use client";
import { useState, useEffect, useCallback } from "react";
import { getUserWishlist, addToWishlist, removeFromWishlist } from "@/src/lib/api";
import { getProperties } from "@/src/lib/api";

export function useWishlist(userId) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const wishlistData = await getUserWishlist(userId);
      setWishlist(wishlistData);
      
      // Fetch full property details
      const properties = [];
      for (const item of wishlistData) {
        try {
          const allProps = await getProperties();
          const found = allProps.find(p => p._id === item.property_id);
          if (found) properties.push(found);
        } catch (err) {
          console.error("Error fetching property:", err);
        }
      }
      setWishlistProperties(properties);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlistHandler = async (propertyId) => {
    if (!userId) return { success: false, error: "User not logged in" };
    
    try {
      await addToWishlist(userId, propertyId);
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFromWishlistHandler = async (propertyId) => {
    if (!userId) return { success: false, error: "User not logged in" };
    
    try {
      await removeFromWishlist(userId, propertyId);
      setWishlistProperties(prev => prev.filter(p => p._id !== propertyId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some(item => item.property_id === propertyId);
  };

  return {
    wishlist,
    wishlistProperties,
    loading,
    error,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    isInWishlist,
    refresh: fetchWishlist,
  };
}