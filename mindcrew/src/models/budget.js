import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalBudget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  remaining: { type: Number, default: function() { return this.totalBudget; } },
  month: { type: String, required: true } // e.g. "2025-09"
});

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
