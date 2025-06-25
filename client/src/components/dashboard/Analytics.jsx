import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useSelector } from "react-redux";
const baseURL = import.meta.env.VITE_BACKEND_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  async function fetchUserData() {
    try {
      const response = await fetch(
        `${baseURL}/api/bill/getBillByUserId/${currentUser._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserData();

        // Extract available years from bills
        const years = Array.from(
          new Set(data.map((bill) => new Date(bill.dueDate).getFullYear()))
        ).sort((a, b) => b - a);
        setAvailableYears(years);

        // Filter bills by selected year
        const validBills = data.filter(
          (bill) =>
            new Date(bill.dueDate).getFullYear() === Number(selectedYear)
        );

        const monthlyData = months.map((month) => ({
          month,
          Internet: 0,
          Electricity: 0,
          Water: 0,
          Gas: 0,
          Other: 0,
          Rent: 0,
        }));

        validBills.forEach((bill) => {
          const monthIndex = new Date(bill.dueDate).getMonth();

          if (monthIndex >= 0 && monthIndex < 12) {
            monthlyData[monthIndex][bill.billType] += bill.amount;
          }
        });

        setMonthlyTotals(monthlyData);

        const total = monthlyData.reduce((sum, monthData) => {
          return (
            sum +
            Object.values(monthData).reduce((monthSum, value) => {
              return monthSum + (typeof value === "number" ? value : 0);
            }, 0)
          );
        }, 0);
        setTotalExpenses(total);

        const billTypes = [
          "Internet",
          "Electricity",
          "Water",
          "Gas",
          "Other",
          "Rent",
        ];
        const colorMap = {
          Internet: "#8FD14F",
          Electricity: "#EF5A6F",
          Water: "#478CCF",
          Gas: "#F96E2A",
          Other: "#37B7C3",
          Rent: "#FF76CE",
        };

        const datasets = billTypes.map((type) => ({
          label: type,
          data: monthlyData.map((month) => month[type]),
          borderColor: colorMap[type],
          backgroundColor: `${colorMap[type]}40`,
          borderWidth: 3,
          fill: true,
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.3,
        }));

        setChartData({
          labels: months,
          datasets: datasets,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchData();
  }, [currentUser, selectedYear]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Monthly Bills Analytics (${selectedYear})`,
        font: { size: 24 },
        color: "#1F2937",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        bodyFont: { size: 14 },
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Month", color: "#4B5563" },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Amount (INR)", color: "#4B5563" },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-8 w-full max-w-screen-xl mx-auto">
      
          {/* Year Filter Dropdown */}
          <div className="w-full flex justify-end mb-4">
            <label className="text-gray-800 text-xl font-medium mr-2">
              Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-800 px-3 py-1 rounded-md text-md text-gray-800 font-semibold"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Chart */}
          <div className="w-full lg:max-w-4xl p-6">
            {chartData ? (
              <div
                style={{ position: "relative", width: "100%", height: "400px" }}
              >
                <Line options={options} data={chartData} />
              </div>
            ) : (
              <p className="text-center text-lg text-gray-600">
                No data available for analytics.
              </p>
            )}
          </div>

          {/* Table */}
          <div className="w-full lg:max-w-4xl bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Monthly Breakdown
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Total Expenses Across All Months:{" "}
              <span className="text-red-500 font-semibold">
                ₹{totalExpenses.toFixed(2)}
              </span>
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Month",
                      "Internet",
                      "Electricity",
                      "Water",
                      "Gas",
                      "Other",
                      "Rent",
                      "Total",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyTotals.map((monthData, index) => {
                    const monthTotal = Object.entries(monthData)
                      .filter(([key]) => key !== "month")
                      .reduce((sum, [_, value]) => sum + value, 0);

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {monthData.month}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Internet.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Electricity.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Water.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Gas.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Other.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{monthData.Rent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-sm text-gray-900">
                          ₹{monthTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
</div>
  );
}

export default Analytics;
