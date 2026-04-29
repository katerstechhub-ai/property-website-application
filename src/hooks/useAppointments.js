"use client";
import { useState, useEffect, useCallback } from "react";
import { getAppointments, createAppointment, confirmAppointment, completeAppointmentAgent, completeAppointmentUser, deleteAppointment } from "@/src/lib/api";

export function useAppointments(filters = {}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const bookAppointment = async (appointmentData) => {
    try {
      const newAppointment = await createAppointment(appointmentData);
      setAppointments(prev => [newAppointment, ...prev]);
      return { success: true, appointment: newAppointment };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const acceptAppointment = async (id) => {
    try {
      await confirmAppointment(id);
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const completeAppointment = async (id, role) => {
    try {
      if (role === "agent") {
        await completeAppointmentAgent(id);
      } else {
        await completeAppointmentUser(id);
      }
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const pendingAppointments = appointments.filter(a => a.status?.toLowerCase() === "pending");
  const acceptedAppointments = appointments.filter(a => a.status?.toLowerCase() === "accepted");
  const completedAppointments = appointments.filter(a => a.status?.toLowerCase() === "completed");

  return {
    appointments,
    pendingAppointments,
    acceptedAppointments,
    completedAppointments,
    loading,
    error,
    bookAppointment,
    acceptAppointment,
    completeAppointment,
    cancelAppointment,
    refresh: fetchAppointments,
  };
}