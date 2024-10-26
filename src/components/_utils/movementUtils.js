export function processMovements(movements) {
  return movements.map((mov) => ({
    date: new Date(mov.created_at).toLocaleDateString(),
    amount: mov.amount,
    timestamp: new Date(mov.created_at),
    content: mov.content,
    type: mov.type,
  }));
}

export function calculateTotalBalance(movements) {
  return movements.reduce((acc, mov) => acc + mov.amount, 0);
}

export function filterMovementsByDate(movements, startDate, endDate, isIncome) {
  return movements.filter((mov) => {
    const movDate = new Date(mov.timestamp).toLocaleDateString();
    return (
      (isIncome ? mov.amount >= 0 : mov.amount < 0) &&
      (!startDate || new Date(movDate) >= new Date(startDate)) &&
      (!endDate || new Date(movDate) <= new Date(endDate))
    );
  });
}

export function categorizeMovements(movements) {
  const categories = ["IT", "Food", "Transport", "Other"];

  return categories.map((type) => {
    const totalIncome = movements
      .filter((mov) => mov.type === type && mov.amount > 0)
      .reduce((sum, mov) => sum + mov.amount, 0);

    const totalSpending = movements
      .filter((mov) => mov.type === type && mov.amount < 0)
      .reduce((sum, mov) => sum + Math.abs(mov.amount), 0);

    return {
      name: type,
      incomeData: [{ name: "Income", value: totalIncome }],
      spendingData: [{ name: "Spending", value: totalSpending }],
    };
  });
}
