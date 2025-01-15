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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result.data; // Return the data array
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        const currentMonth = new Date().getMonth();
        const currentMonthBillExpenses = data.filter(
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
        const internetAmount = data
          .filter((item) => item.billType === "Internet")
          .map((item) => item.amount);
        const electricityAmount = data
          .filter((item) => item.billType === "Electricity")
          .map((item) => item.amount);
        const waterAmount = data
          .filter((item) => item.billType === "Water")
          .map((item) => item.amount);
        const gasAmount = data
          .filter((item) => item.billType === "Gas")
          .map((item) => item.amount);
        const otherAmount = data
          .filter((item) => item.billType === "Other")
          .map((item) => item.amount);
        const rentAmount = data
          .filter((item) => item.billType === "Rent")
          .map((item) => item.amount);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Internet",
              data: internetAmount,
              borderColor: "green",
              backgroundColor: "#8FD14F",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Electricity",
              data: electricityAmount,
              borderColor: "red",
              backgroundColor: "#EF5A6F",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Water",
              data: waterAmount,
              borderColor: "blue",
              backgroundColor: "#478CCF",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Gas",
              data: gasAmount,
              borderColor: "orange",
              backgroundColor: "#F96E2A",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Other",
              data: otherAmount,
              borderColor: "#088395",
              backgroundColor: "#37B7C3",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Rent",
              data: rentAmount,
              borderColor: "pink",
              backgroundColor: "#FF76CE",
              borderWidth: 2,
              fill: true,
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
    plugins: {
      title: {
        display: true,
        text: "Monthly Bills Analytics",
        font: { size: 24 },
        color: "#1F2937",
      },
      tooltip: { mode: "index", intersect: false },
      legend: { display: true, position: "top" },
    },
    scales: {
      x: { title: { display: true, text: "Month", color: "#4B5563" } },
      y: { title: { display: true, text: "Amount (INR)", color: "#4B5563" } },
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
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="w-full max-w-4xl p-6">
        {chartData ? (
          <Line options={options} data={chartData} />
        ) : (
          <p className="text-center text-lg text-gray-500">
            No data available for analytics.
          </p>
        )}
      </div>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Total Expenses
        </h2>
        <p className="text-lg text-gray-600">
          Total Expenses till Today:{" "}
          <span className="text-red-500 font-semibold">{totalExpenses}</span>
        </p>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Aggregate Bill Expenses
          </h3>
          <ul className="space-y-2">
            {Object.entries(billTypeSums).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="text-gray-700">{key}</span>
                <span className="text-orange-500">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
