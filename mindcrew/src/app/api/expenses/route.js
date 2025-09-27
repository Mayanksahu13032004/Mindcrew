import { NextResponse } from "next/server";
import Expense from "@/models/Expense";
import Budget from "@/models/budget";   // ✅ Import Budget model
import { connectDB } from "@/lib/mongoose.js";

// 📌 GET all expenses (Using the simplified version for this file)
export async function GET() {
  // You might want to filter this by userId, but keeping it simple for now.
  try {
    await connectDB();
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return NextResponse.json(expenses, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📌 POST new expense (This is where the subtraction happens)
// Inside api/expenses/route.js -> POST function

export async function POST(req) {
  try {
    await connectDB();
    // 1. Correctly extract 'userId' from the 'user' field sent by the frontend
    const body = await req.json();
    const { title, category, amount, description, user: userId } = body; 

    if (!title || !category || !amount || !userId) {
        return NextResponse.json({ error: "Missing required expense fields" }, { status: 400 });
    }

    // 2. 🚨 FIX: Ensure you are passing the userId into the correct schema field name: 'userId'
    const expense = new Expense({ 
      title, 
      category,          
      amount, 
      description, 
      userId: userId // THIS MUST BE 'userId' to match the Expense Schema
    });
    await expense.save();

    // 3. Find current month budget using the same correct 'userId'
    const month = new Date().toISOString().slice(0, 7); // e.g., "2025-09"
    let currentBudget = await Budget.findOne({ userId, month });

    if (currentBudget) {
      const numericAmount = Number(amount);
      
      // 4. Update and Save the Budget
      currentBudget.spent += numericAmount;
      currentBudget.remaining = currentBudget.totalBudget - currentBudget.spent;
      
      await currentBudget.save(); // ⭐ This line saves the updated spent/remaining to the DB
    } else {
        console.warn(`Budget not found for user ${userId} in month ${month}. Expense posted but budget not updated.`);
    }

    return NextResponse.json({ message: "Expense added", expense }, { status: 201 });
  } catch (err) {
    console.error("Error adding expense:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}