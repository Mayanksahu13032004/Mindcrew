"use client";
import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Signup successful!");
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      setMessage("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-600">
      <h2 className="text-2xl font-semibold mb-6 text-teal-300 text-center">📝 Signup</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 text-white"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 text-white"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </form>

      {message && <p className="text-center mt-3 text-white">{message}</p>}
    </div>
  );
}
