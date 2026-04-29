"use client";
import { useState, useEffect, useCallback } from "react";
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from "@/src/lib/api";

export function useProperties(initialFilters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const addProperty = async (propertyData) => {
    try {
      const newProperty = await createProperty(propertyData);
      setProperties(prev => [newProperty, ...prev]);
      return { success: true, property: newProperty };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const editProperty = async (id, propertyData) => {
    try {
      const updated = await updateProperty(id, propertyData);
      setProperties(prev => prev.map(p => p._id === id ? updated : p));
      return { success: true, property: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeProperty = async (id) => {
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    properties,
    loading,
    error,
    filters,
    setFilters,
    fetchProperties,
    addProperty,
    editProperty,
    removeProperty,
  };
}

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  return { property, loading, error };
}