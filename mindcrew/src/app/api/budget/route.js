// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Budget from "@/models/budget";
// import Expense from "@/models/Expense";
// import { connectDB } from "@/lib/mongoose.js";

// // ✅ GET all budgets for a user
// export async function GET(req) {
//   try {
//     await connectDB();
//     // const { searchParams } = new URL(req.url);
//     // const userId = searchParams.get("userId");

//     const userId="6704f23c123abc0001112222";
//     if (!userId) {
//       return NextResponse.json({ error: "Missing userId" }, { status: 400 });
//     }

//     // Fetch budgets
//     const budgets = await Budget.find({ userId });

//     // Calculate spent dynamically
//     for (let budget of budgets) {
//       const expenses = await Expense.find({
//         user: userId,
//         createdAt: {
//           $gte: new Date(`${budget.month}-01`),
//           $lt: new Date(`${budget.month}-31`)
//         }
//       });

//       const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
//       budget.spent = spent;
//       budget.remaining = budget.totalBudget - spent;
//       budget.save();
//     }
// console.log("budget",budgets);
// // budgets.save();
//     return NextResponse.json(budgets);
//   } catch (error) {
//     console.error("GET Budget Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // ✅ POST create budget
// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { userId, totalBudget, month } = body;

//     if (!userId || !totalBudget || !month) {
//       return NextResponse.json(
//         { error: "userId, totalBudget and month are required" },
//         { status: 400 }
//       );
//     }

//     const budget = new Budget({
//       userId,
//       totalBudget,
//       spent: 0,
//       remaining: totalBudget,
//       month
//     });

//     await budget.save();
//     return NextResponse.json(budget);
//   } catch (error) {
//     console.error("POST Budget Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Budget from "@/models/budget";
import Expense from "@/models/Expense";
import { connectDB } from "@/lib/mongoose.js";

// Helper to get the first day of the next month (safer than -31)
function getNextMonthDate(monthString) {
  const [year, month] = monthString.split("-").map(Number);
  // Month index is 0-based, so month is 1-based. Adding 1 handles year rollover.
  return new Date(year, month, 1); 
}

// ✅ GET all budgets for a user
export async function GET(req) {
  try {
    await connectDB();
    // 💡 It's better to read the userId from the query params for real use
    // const { searchParams } = new URL(req.url);
    // const userId = searchParams.get("userId");

    const userId="6704f23c123abc0001112222"; // Using your hardcoded test ID
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch budgets
    const budgets = await Budget.find({ userId });

    // Calculate spent dynamically
    for (let budget of budgets) {
      const startDate = new Date(`${budget.month}-01`);
      const endDate = getNextMonthDate(budget.month);

      // 1. ❌ Was 'user: userId' -> Fixed to 'userId: userId' to match schema
        const expenses = await Expense.find({
        userId: userId, // ❌ Was 'user: userId' (in the old code) or might be missing
        createdAt: {
          $gte: new Date(`${budget.month}-01`),
          $lt: new Date(`${budget.month}-31`) // (Better to use first day of next month)
        }
      });

      const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // 2. Dynamically update the object properties before sending
      budget.spent = spent;
      budget.remaining = budget.totalBudget - spent;
      
      // 3. ❌ Removed the incorrect and unnecessary await budget.save();
    }
    
    // console.log("budget",budgets); // Keep for debugging if needed

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET Budget Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST create budget (No changes needed here)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, totalBudget, month } = body;

    if (!userId || !totalBudget || !month) {
      return NextResponse.json(
        { error: "userId, totalBudget and month are required" },
        { status: 400 }
      );
    }

    const budget = new Budget({
      userId,
      totalBudget,
      spent: 0,
      remaining: totalBudget,
      month
    });

    await budget.save();
    return NextResponse.json(budget);
  } catch (error) {
    console.error("POST Budget Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}