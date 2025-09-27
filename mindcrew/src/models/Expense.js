import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent model overwrite in Next.js hot reload
export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
