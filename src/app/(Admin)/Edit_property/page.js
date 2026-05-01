"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BASE_URL = "http://ecommerce.reworkstaging.name.ng/v1";

export default function EditProperty() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", address: "" });

  useEffect(() => {
    async function fetchOne() {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setForm(data.data);
    }

    fetchOne();
  }, [id]);

  async function handleUpdate(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    alert("Updated!");
  }

  return (
    <div className=" min-h-dvh bg-white">
      <form onSubmit={handleUpdate} className="p-6 w-[40%] mx-auto shadow-lg">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black mb-5"
          placeholder="Name"
        />

        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black mb-5"
          placeholder="Address"
        />

       <div className="text-center">
         <button className="bg-blue-500 text-white px-7 py-2 rounded-xl">Update</button>
       </div>
      </form>
    </div>

  );
}