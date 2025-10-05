"use client";
import { useEffect, useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("2025-09");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({
    totalBudget: 0,
    spent: 0,
    remaining: 0,
    month: "",
  });
  const [loadingBudget, setLoadingBudget] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    description: "",
    month: selectedMonth,
  });

  // --- Auth Handlers ---
  const handleAuthSuccess = (user) => {
    if (user && user._id) {
      setCurrentUserId(user._id);
      setUserName(user.name);
      setIsLoggedIn(true);
      setActiveForm(null);

      fetchExpenses(user._id, selectedMonth);
      fetchBudget(user._id, selectedMonth);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUserId(null);
    setUserName(null);
    setIsLoggedIn(false);
    setBudget({ totalBudget: 0, spent: 0, remaining: 0, month: "" });
    setExpenses([]);
  };

  // --- Fetch Functions ---
  const fetchExpenses = async (userId = currentUserId, month = selectedMonth) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/expenses?userId=${userId}&month=${month}`);
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchBudget = async (userId = currentUserId, month = selectedMonth) => {
    if (!userId) return;
    try {
      setLoadingBudget(true);
      const res = await fetch(`/api/budget?userId=${userId}&month=${month}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setBudget(data[0]);
      } else {
        setBudget({ totalBudget: 0, spent: 0, remaining: 0, month });
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setLoadingBudget(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchBudget(currentUserId, selectedMonth);
      fetchExpenses(currentUserId, selectedMonth);
    }
  }, [selectedMonth, currentUserId]);

  // --- Utility: Allow adding expenses only for current or next 3 months ---
  const isMonthWithinAllowedRange = (monthStr) => {
    const selected = new Date(monthStr + "-01");
    const now = new Date();

    // Range: current month → next 3 months
    const min = new Date(now.getFullYear(), now.getMonth(), 1);
    const max = new Date(now.getFullYear(), now.getMonth() + 3, 1);

    return selected >= min && selected <= max;
  };

  // --- Expense Handlers ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userIdToUse = currentUserId;

    if (!userIdToUse) {
      alert("Please log in to add expenses.");
      return;
    }

    if (form.month !== selectedMonth) {
      alert("❌ The expense month must match the selected budget month.");
      return;
    }

    // Prevent adding for past months
    if (!isMonthWithinAllowedRange(selectedMonth)) {
      alert("❌ You can only add expenses for the current or next 3 months.");
      return;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          user: userIdToUse,
          month: selectedMonth,
        }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      setForm({
        title: "",
        category: "",
        amount: "",
        description: "",
        month: selectedMonth,
      });

      await fetchExpenses(userIdToUse, selectedMonth);
      await fetchBudget(userIdToUse, selectedMonth);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(`Could not add expense: ${error.message}`);
    }
  };

  // --- On Page Load ---
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    let initialUserId = null;

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        initialUserId = userData.id;
        setCurrentUserId(initialUserId);
        setUserName(userData.name);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    if (initialUserId) {
      fetchExpenses(initialUserId, selectedMonth);
      fetchBudget(initialUserId, selectedMonth);
    }
  }, []);

  // --- Prediction ---
  const prediction = (() => {
    const totalBudget = Number(budget.totalBudget);
    if (!expenses || expenses.length === 0 || totalBudget === 0) return null;

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    const spentSoFar = expenses.reduce(
      (acc, exp) => acc + Number(exp.amount),
      0
    );

    const avgDailySpend = spentSoFar / currentDay;
    const predictedTotalSpend = avgDailySpend * daysInMonth;
    const willOverspend = predictedTotalSpend > totalBudget;

    return {
      spentSoFar,
      avgDailySpend: avgDailySpend.toFixed(2),
      predictedTotalSpend: predictedTotalSpend.toFixed(2),
      willOverspend,
    };
  })();

  const canAddExpense = isMonthWithinAllowedRange(selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 p-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-teal-300 drop-shadow-lg">
          💰 Smart Budget Tracker
        </h1>

        {!isLoggedIn ? (
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveForm("login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Login
            </button>
            <button
              onClick={() => setActiveForm("signup")}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Signup
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <p className="text-lg font-medium text-teal-300">
              Hi, {userName ? userName.split(" ")[0] : "User"}!
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Modal Login/Signup */}
      {activeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-xl relative">
            <button
              onClick={() => setActiveForm(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-3xl font-bold"
            >
              &times;
            </button>
            {activeForm === "login" && (
              <Login onLoginSuccess={handleAuthSuccess} />
            )}
            {activeForm === "signup" && (
              <Signup onSignupSuccess={handleAuthSuccess} />
            )}
          </div>
        </div>
      )}

      {/* Budget Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-xl rounded-xl p-6 mb-10 border border-teal-400">
        <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
          📊 Monthly Budget
        </h2>

        {/* Month Picker */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setForm((f) => ({ ...f, month: e.target.value }));
          }}
          className="rounded-lg p-2 bg-white/80 text-black text-sm"
        />

        <div className="space-y-2 text-lg">
          <p>
            <span className="font-semibold">Month:</span>{" "}
            <span className="text-green-300">{budget.month}</span>
          </p>
          <p>
            <span className="font-semibold">Total Budget:</span>{" "}
            <span className="text-green-300">
              ₹{Number(budget.totalBudget).toFixed(2)}
            </span>
          </p>
          <p>
            <span className="font-semibold">Spent:</span>{" "}
            <span className="text-red-400">
              ₹{Number(budget.spent).toFixed(2)}
            </span>
          </p>
          <p>
            <span className="font-semibold">Remaining:</span>{" "}
            <span className="text-green-400">
              {loadingBudget
                ? "Loading..."
                : `₹${Number(budget.remaining).toFixed(2)}`}
            </span>
          </p>
        </div>
      </div>

      {/* Prediction Card */}
      {prediction && (
        <div
          className={`bg-gradient-to-r p-6 mb-10 rounded-xl shadow-lg border ${
            prediction.willOverspend
              ? "from-red-600 to-red-400 border-red-400"
              : "from-green-600 to-green-400 border-green-400"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
            📈 Budget Prediction
          </h2>
          <p className="text-white">
            Predicted total spending:{" "}
            <span className="font-bold">₹{prediction.predictedTotalSpend}</span>
          </p>
          {prediction.willOverspend ? (
            <p className="text-red-200 font-semibold mt-1">
              ⚠️ Warning! You might overspend this month.
            </p>
          ) : (
            <p className="text-green-200 font-semibold mt-1">
              ✅ You are on track to stay within budget.
            </p>
          )}
        </div>
      )}

      {/* Add Expense Form */}
      <div className="bg-slate-800 shadow-lg rounded-xl p-6 mb-10 border border-slate-600">
        <h2 className="text-xl font-semibold mb-2 text-teal-300">
          ➕ Add Expense
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          You can only add expenses for the current or next 3 months. Previous months are view-only.
        </p>

        {isLoggedIn ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
              required
              disabled={!canAddExpense}
            />
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category (Food, Travel, etc)"
              className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
              required
              disabled={!canAddExpense}
            />

            <input
              type="month"
              name="month"
              value={form.month || selectedMonth}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              required
              disabled={!canAddExpense}
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
              required
              disabled={!canAddExpense}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
              disabled={!canAddExpense}
            />
            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-semibold transition ${
                canAddExpense
                  ? "bg-gradient-to-r from-blue-700 to-teal-500 hover:opacity-90 text-white"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!canAddExpense}
            >
              {canAddExpense ? "Add Expense" : "Expense Locked (View Only)"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-400">
            Please log in to add expenses.
          </p>
        )}
      </div>

      {/* Expenses List */}
      <div className="bg-slate-800 shadow-lg rounded-xl p-6 border border-slate-600">
        <h2 className="text-xl font-semibold mb-6 text-teal-300">
          📋 Expenses
        </h2>
        {expenses.length > 0 ? (
          <ul className="divide-y divide-slate-700">
            {expenses.map((exp) => (
              <li
                key={exp._id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-white">
                    {exp.title}{" "}
                    <span className="text-sm text-gray-400">
                      ({exp.category})
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm">{exp.description}</p>
                </div>
                <p className="text-red-400 font-semibold">
                  - ₹{Number(exp.amount).toFixed(2)}
                </p>
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
