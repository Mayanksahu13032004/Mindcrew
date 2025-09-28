function predictOverspend(expenses, totalBudget) {
  const today = new Date();
  const currentDay = today.getDate(); // e.g., 15th
  const daysInMonth = 30; // simple assumption
  const predictionDay = 20; // day to predict for

  // 1️⃣ Total spent so far
  const spentSoFar = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  // 2️⃣ Average daily spending
  const avgDailySpend = spentSoFar / currentDay;

  // 3️⃣ Predicted spending by the 20th
  const predictedBy20th = avgDailySpend * predictionDay;

  // 4️⃣ Compare with total budget
  const willOverspend = predictedBy20th > totalBudget;

  return {
    spentSoFar,
    avgDailySpend: avgDailySpend.toFixed(2),
    predictedBy20th: predictedBy20th.toFixed(2),
    willOverspend,
  };          
} 
