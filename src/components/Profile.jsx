/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import Spinner from "./Spinner";
import Charts from "./Charts";
import PieCharts from "./PieCharts";
import { MovContext } from "../context/MovContext";
import {
  calculateTotalBalance,
  categorizeMovements,
  filterMovementsByDate,
  processMovements,
} from "./_utils/movementUtils";
import Movement from "./Movement";
import { Logout } from "../data/actions";

export default function Profile({ data, movements }) {
  const { setModal } = useContext(MovContext);
  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const [startDate, setStartDate] = useState(
    twoMonthsAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  if (data === null || movements === null) return <Spinner />;

  const { user } = data;
  const processedMovements = processMovements(movements);
  const totalBalance = calculateTotalBalance(processedMovements);
  const filteredIncomeMovements = filterMovementsByDate(
    processedMovements,
    startDate,
    endDate,
    true
  );
  const filteredOutcomeMovements = filterMovementsByDate(
    processedMovements,
    startDate,
    endDate,
    false
  );
  const dataByCategory = categorizeMovements(processedMovements);

  async function handleLogout() {
    const { error } = await Logout();

    if (error) throw new Error(error);
  }

  return (
    <div className="select-none responsive">
      <div>
        <div className="drop-shadow-2xl flex justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex">
              <img
                src={user.user_metadata.avatar_url}
                className="object-fill rounded-full w-[250px] h-[250px]"
              />
              <div className="p-5 flex flex-col gap-5">
                <span className="font-poppins text-5xl font-light text-gray-700">
                  {user.user_metadata.name}
                </span>
                <span className="rounded-3xl bg-cyan-600 font-poppins text-2xl p-2 text-white">
                  Total Balance: {totalBalance.toLocaleString()}$
                </span>
                <button
                  className="w-40 h-12 duration-300 transition-all bg-slate-500 text-white font-poppins text-2xl rounded-xl hover:bg-white hover:text-black"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="flex justify-around">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-1"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-1"
              />
            </div>

            <Charts
              incomeData={filteredIncomeMovements}
              outcomeData={filteredOutcomeMovements}
            />
          </div>
          <div className="flex items-center flex-col gap-3">
            <h2 className="font-poppins text-4xl">Movements</h2>
            <ul className="w-full overflow-auto max-h-[900px] bg-gray-300">
              {processedMovements.map((mov, index) => {
                return <Movement mov={mov} key={index} />;
              })}
            </ul>
            <button
              className="duration-300 transition-all w-full h-20 font-poppins text-2xl bg-slate-600 text-white hover:bg-white hover:text-slate-600"
              onClick={() => setModal(true)}
            >
              Add New Movement
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-center font-poppins text-3xl mt-10">
        Income vs. Spending by Category
      </h2>
      <div className="flex flex-wrap gap-4 mt-5 justify-center">
        {dataByCategory.map((category, index) => (
          <PieCharts
            key={index}
            categoryName={category.name}
            incomeData={category.incomeData}
            spendingData={category.spendingData}
          />
        ))}
      </div>
    </div>
  );
}
