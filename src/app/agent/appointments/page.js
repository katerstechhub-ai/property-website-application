"use client";
import { useState } from "react";
import Link from "next/link";

// Mock data for preview
const mockAppointments = [
  {
    _id: "apt1",
    property: {
      name: "Luxury Apartment",
      address: "123 Victoria Island, Lagos"
    },
    date: "2024-05-20",
    time: { from: "10:00 AM", to: "12:00 PM" },
    user_id: "user_abc123",
    status: "pending",
    msg: "I would love to see this property. Please confirm availability."
  },
  {
    _id: "apt2",
    property: {
      name: "Modern Duplex",
      address: "Maitama, Abuja"
    },
    date: "2024-05-22",
    time: { from: "2:00 PM", to: "4:00 PM" },
    user_id: "user_def456",
    status: "pending",
    msg: "Interested in viewing. Can we do morning slot?"
  },
  {
    _id: "apt3",
    property: {
      name: "Cozy Studio",
      address: "Ikeja, Lagos"
    },
    date: "2024-05-18",
    time: { from: "11:00 AM", to: "1:00 PM" },
    user_id: "user_ghi789",
    status: "accepted",
    msg: "Looking forward to the viewing."
  },
  {
    _id: "apt4",
    property: {
      name: "Beachfront Villa",
      address: "Lekki Phase 1, Lagos"
    },
    date: "2024-05-15",
    time: { from: "3:00 PM", to: "5:00 PM" },
    user_id: "user_jkl012",
    status: "completed",
    msg: "Great property!"
  }
];

export default function AgentAppointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [loading, setLoading] = useState(false);

  const confirmAppointment = async (appointmentId) => {
    // Mock confirm
    setAppointments(prev => prev.map(apt => 
      apt._id === appointmentId ? { ...apt, status: "accepted" } : apt
    ));
  };

  const rejectAppointment = async (appointmentId) => {
    if (!confirm("Reject this appointment request?")) return;
    setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
  };

  const completeAppointment = async (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt._id === appointmentId ? { ...apt, status: "completed" } : apt
    ));
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "⏳ Pending" },
      accepted: { bg: "bg-green-100", text: "text-green-800", label: "✓ Accepted" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "✗ Rejected" },
      completed: { bg: "bg-blue-100", text: "text-blue-800", label: "✓ Completed" }
    };
    const s = config[status?.toLowerCase()] || config.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status?.toLowerCase() === "pending");
  const upcomingAppointments = appointments.filter(a => a.status?.toLowerCase() === "accepted");
  const completedAppointments = appointments.filter(a => a.status?.toLowerCase() === "completed");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/agent" className="text-purple-600 hover:underline inline-flex items-center">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2">Appointment Requests</h1>
        <p className="text-gray-600">Manage viewing appointments from potential tenants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{pendingAppointments.length}</p>
          <p className="text-sm text-yellow-600">Pending Requests</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{upcomingAppointments.length}</p>
          <p className="text-sm text-green-600">Upcoming Appointments</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{completedAppointments.length}</p>
          <p className="text-sm text-blue-600">Completed</p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <span className="text-5xl block mb-4">📅</span>
          <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
          <p className="text-gray-500">When tenants book viewings, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Appointments */}
          {pendingAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-yellow-700">Pending Requests</h2>
              {pendingAppointments.map((apt) => (
                <div key={apt._id} className="bg-white border border-yellow-200 rounded-xl p-6 mb-4">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{apt.property?.name || "Property"}</h3>
                      <p className="text-gray-600 mb-3">{apt.property?.address}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div><span className="text-gray-500">Date:</span> <span className="font-medium">{apt.date}</span></div>
                        <div><span className="text-gray-500">Time:</span> <span>{apt.time?.from} - {apt.time?.to}</span></div>
                        <div><span className="text-gray-500">Tenant ID:</span> <span className="text-xs">{apt.user_id?.slice(-8)}</span></div>
                      </div>
                      {apt.msg && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600"><span className="font-medium">Tenant's Note:</span> {apt.msg}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => confirmAppointment(apt._id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => rejectAppointment(apt._id)}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-700">Upcoming Appointments</h2>
              {upcomingAppointments.map((apt) => (
                <div key={apt._id} className="bg-white border border-green-200 rounded-xl p-6 mb-4">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{apt.property?.name || "Property"}</h3>
                        {getStatusBadge(apt.status)}
                      </div>
                      <p className="text-gray-600 mb-3">{apt.property?.address}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div><span className="text-gray-500">Date:</span> <span className="font-medium">{apt.date}</span></div>
                        <div><span className="text-gray-500">Time:</span> <span>{apt.time?.from} - {apt.time?.to}</span></div>
                      </div>
                    </div>
                    <button
                      onClick={() => completeAppointment(apt._id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Appointments */}
          {completedAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Completed</h2>
              {completedAppointments.map((apt) => (
                <div key={apt._id} className="bg-gray-50 rounded-xl p-6 mb-4">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{apt.property?.name || "Property"}</h3>
                      <p className="text-gray-600 mb-2">{apt.property?.address}</p>
                      <p className="text-sm text-gray-500">Completed on: {apt.updatedAt ? new Date(apt.updatedAt).toLocaleDateString() : apt.date}</p>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}