"use client";
import { useState } from "react";
import { useRouter ,router} from 'next/navigation';
// import { Router } from "next/router"; 
import toast from "react-hot-toast";


export default function Login() {

    const router=useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(" Login successful!");

         router.push('/'); 
      } else {
         toast.error(data.error || " Login failed");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-600">
      <h2 className="text-2xl font-semibold mb-6 text-teal-300 text-center">🔑 Login</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 text-white"
          required
        />
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
          Login
        </button>
      </form>
      {message && <p className="text-center mt-3 text-white">{message}</p>}
    </div>
  );
}
