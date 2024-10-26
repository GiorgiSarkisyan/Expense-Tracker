/* eslint-disable react/prop-types */
// Charts.js
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function Charts({ incomeData, outcomeData }) {
  const maxIncomeAmount = Math.max(...incomeData.map((mov) => mov.amount)) || 0;
  const incomeYMax = maxIncomeAmount + 300;

  const maxOutcomeAmount =
    Math.max(...outcomeData.map((mov) => mov.amount)) || 0;
  const outcomeYMax = maxOutcomeAmount + 300;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white max-w-[600px]">
        <div />
        <AreaChart
          width={520}
          height={350}
          data={incomeData}
          margin={{ top: 20, right: 30, left: 5, bottom: 10 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <CartesianGrid strokeDasharray="10" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, incomeYMax]} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#12c54e"
            strokeWidth={3}
            fill="#00ff55"
            name="Income"
          />
        </AreaChart>
      </div>

      <div className="bg-white max-w-[600px]">
        <AreaChart
          width={520}
          height={350}
          data={outcomeData}
          margin={{ top: 20, right: 30, left: 5, bottom: 10 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <CartesianGrid strokeDasharray="4" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, outcomeYMax]} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#ff4c4c"
            strokeWidth={3}
            fill="#ffcccc"
            name="Outcome"
          />
        </AreaChart>
      </div>
    </div>
  );
}
