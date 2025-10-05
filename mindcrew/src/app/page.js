// "use client";
// import { useEffect, useState } from "react";
// import Signup from "./components/Signup";
// import Login from "./components/Login";

// export default function Dashboard() {

//      const [activeForm, setActiveForm] = useState(null); 
//   const [expenses, setExpenses] = useState([]);
//   const [budget, setBudget] = useState({
//     totalBudget: 0,
//     spent: 0,
//     remaining: 0,
//   });
//   const [loadingBudget, setLoadingBudget] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     category: "",
//     amount: "",
//     description: "",
//     user: "6704f23c123abc0001112222", // test user id
//   });

//   // Fetch expenses
//   const fetchExpenses = async () => {
//     try {
//       const res = await fetch("/api/expenses");
//       const data = await res.json();
//       setExpenses(data);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     }
//   };

//   // Fetch budget
//   const fetchBudget = async () => {
//     try {
//       setLoadingBudget(true);
//       const res = await fetch("/api/budget?user=6704f23c123abc0001112222");
//       const data = await res.json();
// console.log(data);

//       if (Array.isArray(data) && data.length > 0) {
//         setBudget(data[0]);
//       } else {
//         setBudget({ totalBudget: 0, spent: 0, remaining: 0 });
//       }
//     } catch (error) {
//       console.error("Error fetching budget:", error);
//     } finally {
//       setLoadingBudget(false);
//     }
//   };

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Add expense
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/expenses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) throw new Error("Failed to add expense");

//       // Reset form
//       setForm({
//         title: "",
//         category: "",
//         amount: "",
//         description: "",
//         user: form.user,
//       });

//       // Fetch updated expenses and budget
//       await fetchExpenses();
//       await fetchBudget();
//     } catch (error) {
//       console.error("Error adding expense:", error);
//     }
//   };

//   // Fetch expenses & budget on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchExpenses();
//       await fetchBudget();
//     };
//     fetchData();
//   }, []);


// // Basic overspend prediction
// const prediction = (() => {
//   if (!expenses || expenses.length === 0) return null;

//   const today = new Date();
//   const currentDay = today.getDate();
//   const predictionDay = 20; // day to predict overspending

//   const spentSoFar = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
//   const avgDailySpend = spentSoFar / currentDay;
//   const predictedBy20th = avgDailySpend * predictionDay;
//   const willOverspend = predictedBy20th > budget.totalBudget;

//   return {
//     spentSoFar,
//     avgDailySpend: avgDailySpend.toFixed(2),
//     predictedBy20th: predictedBy20th.toFixed(2),
//     willOverspend,
//   };
// })();



//   return (
  


//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 p-8 text-white">
//        <div className="flex items-center justify-between mb-8">
//         <h1 className="text-4xl font-extrabold text-teal-300 drop-shadow-lg">
//           💰 Smart Budget Tracker
//         </h1>
//         <div className="flex space-x-4">
//           <button
//             onClick={() => setActiveForm("login")}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => setActiveForm("signup")}
//             className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
//           >
//             Signup
//           </button>
//         </div>
//       </div>

//       {/* Form below */}
//       <div>
//         {activeForm === "login" && <Login />}
//         {activeForm === "signup" && <Signup />}
//       </div>


      

//       {/* Monthly Budget Card */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-xl rounded-xl p-6 mb-10 border border-teal-400">
//         <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
//           📊 Monthly Budget
//         </h2>
//         <div className="space-y-2 text-lg">
//           <p>
//             <span className="font-semibold">Total Budget:</span>{" "}
//             <span className="text-green-300">₹{budget.totalBudget}</span>
//           </p>
//           <p>
//             <span className="font-semibold">Spent:</span>{" "}
//             <span className="text-red-400">₹{budget.spent}</span>
//           </p>
//           <p>
//             <span className="font-semibold">Remaining:</span>{" "}
//             <span className="text-green-400">
//               {loadingBudget ? "Loading..." : `₹${budget.remaining}`}
//             </span>
//           </p>
//         </div>
//       </div>


// {/* Prediction Card */}
// {prediction && (
//   <div className={`bg-gradient-to-r p-6 mb-10 rounded-xl shadow-lg border ${
//     prediction.willOverspend ? "from-red-600 to-red-400 border-red-400" 
//                               : "from-green-600 to-green-400 border-green-400"
//   }`}>
//     <h2 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
//       📈 Budget Prediction
//     </h2>
//     <p className="text-white">
//       Predicted spending by 20th: <span className="font-bold">₹{prediction.predictedBy20th}</span>
//     </p>
//     {prediction.willOverspend ? (
//       <p className="text-red-200 font-semibold mt-1">⚠️ Warning! You might overspend this month.</p>
//     ) : (
//       <p className="text-green-200 font-semibold mt-1">✅ You are on track to stay within budget.</p>
//     )}
//   </div>
// )}




//       {/* Add Expense Form */}
//       <div className="bg-slate-800 shadow-lg rounded-xl p-6 mb-10 border border-slate-600">
//         <h2 className="text-xl font-semibold mb-6 text-teal-300">➕ Add Expense</h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Title"
//             className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
//             required
//           />
//           <input
//             type="text"
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category (Food, Travel, etc)"
//             className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
//             required
//           />
//           <input
//             type="number"
//             name="amount"
//             value={form.amount}
//             onChange={handleChange}
//             placeholder="Amount"
//             className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
//             required
//           />
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Description"
//             className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none text-white"
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
//           >
//             Add Expense
//           </button>
//         </form>
//       </div>

//       {/* Expenses List */}
//       <div className="bg-slate-800 shadow-lg rounded-xl p-6 border border-slate-600">
//         <h2 className="text-xl font-semibold mb-6 text-teal-300">📋 Expenses</h2>
//         {expenses.length > 0 ? (
//           <ul className="divide-y divide-slate-700">
//             {expenses.map((exp) => (
//               <li key={exp._id} className="py-4 flex justify-between items-center">
//                 <div>
//                   <p className="font-medium text-white">
//                     {exp.title}{" "}
//                     <span className="text-sm text-gray-400">({exp.category})</span>
//                   </p>
//                   <p className="text-gray-400 text-sm">{exp.description}</p>
//                 </div>
//                 <p className="text-red-400 font-semibold">- ₹{exp.amount}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-400">No expenses yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import Dashboard from "./dashborad/page";
export default function Home() {
  return (
    <div>
      {/* <h1>Welcome to Next.js!</h1> */}
      <Dashboard/>
    </div>
  );
}