/* eslint-disable react/prop-types */
// src/components/CategoryPieChart.js

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PieCharts({ incomeData, spendingData, categoryName }) {
  // Check if there are any movements by summing income and spending values
  const totalIncome = incomeData.reduce((sum, entry) => sum + entry.value, 0);
  const totalSpending = spendingData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );
  const hasMovements = totalIncome > 0 || totalSpending > 0;

  return (
    <div className="flex-1">
      <h3 className="text-center font-poppins text-2xl mb-3">{categoryName}</h3>
      {hasMovements ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={incomeData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#33b644"
            />
            <Pie
              data={spendingData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#ff4040"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center font-poppins text-lg text-gray-500 mt-5">
          No movements in this category.
        </div>
      )}
    </div>
  );
}
