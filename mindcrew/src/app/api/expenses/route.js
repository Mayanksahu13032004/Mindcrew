import { NextResponse } from "next/server";
import Expense from "@/models/Expense";
import Budget from "@/models/budget";
import { connectDB } from "@/lib/mongoose";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const query = { userId };
    if (month) query.month = month; // ✅ fetch only selected month

    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET Expenses Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { title, category, amount, description, user: userId, month } =
      await req.json();

    if (!userId || !month) {
      return NextResponse.json(
        { error: "userId and month required" },
        { status: 400 }
      );
    }

    // ✅ create expense with correct month
    const expense = new Expense({
      title,
      category,
      amount: Number(amount),
      description,
      userId,
      month,
    });

    await expense.save();

    // ✅ Update correct month's budget
    const budget = await Budget.findOne({ userId, month });
    if (budget) {
      budget.spent += Number(amount);
      budget.remaining = budget.totalBudget - budget.spent;
      await budget.save();
    }

    return NextResponse.json({ message: "Expense added", expense });
  } catch (error) {
    console.error("POST Expense Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
