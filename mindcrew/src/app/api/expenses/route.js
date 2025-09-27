import { NextResponse } from "next/server";
import Expense from "@/models/Expense";
import { connectDB } from "@/lib/mongoose.js";

// 📌 GET all expenses
export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return NextResponse.json(expenses, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📌 POST new expense
export async function POST(req) {
  try {
    await connectDB();
    const { title, category, amount, description } = await req.json();

    const expense = new Expense({ title, category, amount, description });
    await expense.save();

    return NextResponse.json({ message: "Expense added", expense }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
