"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    description: "",
    user: "6704f23c123abc0001112222", // test user id
  });

  // ✅ Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // ✅ Fetch budget
  const fetchBudget = async () => {
    try {
      const res = await fetch("/api/budget");
      const data = await res.json();
      setBudget(data);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      setForm({ title: "", category: "", amount: "", description: "", user: form.user });
      fetchExpenses();
      fetchBudget();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 p-8 text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-teal-300 drop-shadow-lg">
        💰 Smart Budget Tracker
      </h1>

      {/* Budget Section */}
      <div className="bg-gradient-to-r from-blue-800 to-teal-600 shadow-xl rounded-xl p-6 mb-10 border border-teal-400">
        <h2 className="text-2xl font-semibold mb-4 text-teal-200">📊 Monthly Budget</h2>
        {budget ? (
          <div className="space-y-2 text-lg">
            <p>
              <span className="font-semibold text-white">Total Budget:</span>{" "}
              <span className="text-teal-300">₹{budget.totalBudget}</span>
            </p>
            <p>
              <span className="font-semibold text-white">Spent:</span>{" "}
              <span className="text-red-400">₹{budget.spent}</span>
            </p>
            <p>
              <span className="font-semibold text-white">Remaining:</span>{" "}
              <span className="text-green-400">₹{budget.remaining}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-300">Loading budget...</p>
        )}
      </div>

      {/* Add Expense Form */}
      <div className="bg-slate-800 shadow-lg rounded-xl p-6 mb-10 border border-slate-600">
        <h2 className="text-xl font-semibold mb-6 text-teal-300">➕ Add Expense</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category (Food, Travel, etc)"
            className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
            required
          />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-slate-800 shadow-lg rounded-xl p-6 border border-slate-600">
        <h2 className="text-xl font-semibold mb-6 text-teal-300">📋 Expenses</h2>
        {expenses.length > 0 ? (
          <ul className="divide-y divide-slate-700">
            {expenses.map((exp) => (
              <li key={exp._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">
                    {exp.title}{" "}
                    <span className="text-sm text-gray-400">({exp.category})</span>
                  </p>
                  <p className="text-gray-400 text-sm">{exp.description}</p>
                </div>
                <p className="text-red-400 font-semibold">- ₹{exp.amount}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No expenses yet.</p>
        )}
      </div>
    </div>
  );
}
