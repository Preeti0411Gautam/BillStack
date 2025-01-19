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
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [billTypeSums, setBillTypeSums] = useState({});
  const [totalBillsSum, setTotalBillsSum] = useState(0);

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
        `/api/bill/getBillByUserId/${currentUser._id}`,
        { method: "GET" }
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
      try {
        const data = await fetchUserData();
        // Filter bills where paymentStatus is true
        const validBills = data.filter((bill) => bill.paymentStatus === true);

        const currentMonth = new Date().getMonth();
        const currentMonthBillExpenses = validBills.filter(
          (item) => new Date(item.dueDate).getMonth() === currentMonth
        );

        const billTypeSums = currentMonthBillExpenses.reduce((acc, item) => {
          const { billType, amount } = item;
          acc[billType] = (acc[billType] || 0) + amount;
          return acc;
        }, {});

        setBillTypeSums(billTypeSums);

        const totalSum = currentMonthBillExpenses.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        setTotalBillsSum(totalSum);

        const labels = months;
        const internetAmount = validBills
          .filter((item) => item.billType === "Internet")
          .map((item) => item.amount);
        const electricityAmount = validBills
          .filter((item) => item.billType === "Electricity")
          .map((item) => item.amount);
        const waterAmount = validBills
          .filter((item) => item.billType === "Water")
          .map((item) => item.amount);
        const gasAmount = validBills
          .filter((item) => item.billType === "Gas")
          .map((item) => item.amount);
        const otherAmount = validBills
          .filter((item) => item.billType === "Other")
          .map((item) => item.amount);
        const rentAmount = validBills
          .filter((item) => item.billType === "Rent")
          .map((item) => item.amount);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Internet",
              data: internetAmount,
              borderColor: "#8FD14F",
              backgroundColor: "rgba(143, 209, 79, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3, // Smooth curves
            },
            {
              label: "Electricity",
              data: electricityAmount,
              borderColor: "#EF5A6F",
              backgroundColor: "rgba(239, 90, 111, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3,
            },
            {
              label: "Water",
              data: waterAmount,
              borderColor: "#478CCF",
              backgroundColor: "rgba(71, 140, 207, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3,
            },
            {
              label: "Gas",
              data: gasAmount,
              borderColor: "#F96E2A",
              backgroundColor: "rgba(249, 110, 42, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3,
            },
            {
              label: "Other",
              data: otherAmount,
              borderColor: "#37B7C3",
              backgroundColor: "rgba(55, 183, 195, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3,
            },
            {
              label: "Rent",
              data: rentAmount,
              borderColor: "#FF76CE",
              backgroundColor: "rgba(255, 118, 206, 0.4)",
              borderWidth: 3,
              fill: true,
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Monthly Bills Analytics",
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
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Lighter grid lines
        },
      },
    },
  };

  const totalExpenses = (chartData?.datasets || []).reduce(
    (acc, dataset) =>
      acc + dataset.data.reduce((sum, value) => sum + (value || 0), 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-8 w-full max-w-screen-xl mx-auto">
      {currentUser === null ? (
        <div className="text-center  text-3xl font-semibold text-gray-400">
          Please sign in to see Analytics...
        </div>
      ) : (
        <>
          <div className="w-full lg:max-w-4xl p-6">
            {chartData ? (
              <div
                style={{ position: "relative", width: "100%", height: "400px" }}
              >
                <Line options={options} data={chartData} />
              </div>
            ) : (
              <p className="text-center text-lg text-gray-500">
                No data available for analytics.
              </p>
            )}
          </div>
          <div className="w-full lg:max-w-4xl bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Total Expenses
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Total Expenses till Today:{" "}
              <span className="text-red-500 font-semibold">
                {totalExpenses}
              </span>
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Aggregate Bill Expenses
            </h3>
            <ul className="space-y-2">
              {Object.entries(billTypeSums).map(([key, value]) => (
                <li key={key} className="flex justify-between text-gray-700">
                  <span>{key}</span>
                  <span className="text-orange-500">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
