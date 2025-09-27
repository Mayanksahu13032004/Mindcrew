import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Budget from "@/models/budget";
import Expense from "@/models/Expense";
import mongoose from "mongoose";

// 🔹 Create Budget
export async function POST(req) {
  await connectDB();
  const { userId, category, limit } = await req.json();

  if (!userId || !category || !limit) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const budget = new Budget({
      user: new mongoose.Types.ObjectId(userId), // ✅ convert string → ObjectId
      category,
      limit,
    });

    await budget.save();
    return NextResponse.json({ message: "Budget created", budget });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔹 Get Budgets (with spent amount calculated from expenses)
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // get budgets for this user
    const budgets = await Budget.find({
      user: new mongoose.Types.ObjectId(userId),
    });

    // get expenses for this user
    const expenses = await Expense.find({
      user: new mongoose.Types.ObjectId(userId),
    });

    // calculate spent per category
    const spentMap = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    // map budgets with spent field
    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      spent: spentMap[b.category] || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
