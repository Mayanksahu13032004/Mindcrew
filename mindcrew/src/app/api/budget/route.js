import { NextResponse } from "next/server";
import Budget from "@/models/budget";
import Expense from "@/models/Expense";
import { connectDB } from "@/lib/mongoose.js";

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
    if (month) query.month = month;

    const budgets = await Budget.find(query);

    for (let budget of budgets) {
      const expenses = await Expense.find({ userId, month: budget.month });
      const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
      budget.spent = spent;
      budget.remaining = budget.totalBudget - spent;
      await budget.save();
    }

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET Budget Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, totalBudget, month } = await req.json();

    if (!userId || !totalBudget || !month) {
      return NextResponse.json(
        { error: "userId, totalBudget, and month are required" },
        { status: 400 }
      );
    }

    // Check if a budget already exists for the same user and month
    let existingBudget = await Budget.findOne({ userId, month });

    if (existingBudget) {
      // Add the new amount to existing totalBudget and update remaining
      existingBudget.totalBudget += Number(totalBudget);
      existingBudget.remaining += Number(totalBudget);
      await existingBudget.save();

      return NextResponse.json({
        message: "Budget updated successfully",
        budget: existingBudget,
      });
    }

    // If no existing budget, create a new one
    const newBudget = new Budget({
      userId,
      totalBudget,
      spent: 0,
      remaining: totalBudget,
      month,
    });

    await newBudget.save();
    return NextResponse.json({
      message: "New budget created successfully",
      budget: newBudget,
    });
  } catch (error) {
    console.error("POST Budget Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

