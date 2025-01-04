import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Register the Filler plugin
);

const Analytics = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    async function fetchUserData() {
        try {
            const response = await fetch(`/api/bill/getBill/${currentUser._id}`, {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            return result.data; // Return the data array
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserData();
                console.log("data", data);

                // Extract labels and amounts from the data
                const labels = data.map(item => new Date(item.dueDate).toLocaleDateString());
                const internetAmount = data.filter(item => item.billType === 'Internet').map(item => item.amount);
                const electricityAmount = data.filter(item => item.billType === 'Electricity').map(item => item.amount);
                const waterAmount = data.filter(item => item.billType === 'Water').map(item => item.amount);
                const gasAmount = data.filter(item => item.billType === 'Gas').map(item => item.amount);
                const otherAmount = data.filter(item => item.billType === 'Other').map(item => item.amount);
                const rentAmount = data.filter(item => item.billType === 'Rent').map(item => item.amount);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Internet',
                            data: internetAmount,
                            borderColor: 'green',
                            backgroundColor: '#8FD14F',
                            borderWidth: 2,
                            fill: true,
                        },
                        {
                            label: 'Electricity',
                            data: electricityAmount,
                            borderColor: 'red',
                            backgroundColor: '#EF5A6F',
                            borderWidth: 2,
                            fill: true,
                        },
                        {
                            label: 'Water',
                            data: waterAmount,
                            borderColor: 'Blue',
                            backgroundColor: '#478CCF',
                            borderWidth: 2,
                            fill: true,
                        },
                        {
                            label: 'Gas',
                            data: gasAmount,
                            borderColor: 'orange',
                            backgroundColor: '#F96E2A',
                            borderWidth: 2,
                            fill: true,
                        },
                        {
                            label: 'Other',
                            data: otherAmount,
                            borderColor: '#088395',
                            backgroundColor: '#37B7C3',
                            borderWidth: 2,
                            fill: true,
                        },
                        {
                            label: 'Rent',
                            data: rentAmount,
                            borderColor: 'pink',
                            backgroundColor: '#FF76CE',
                            borderWidth: 2,
                            fill: true,
                        }
                    ]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
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
                text: 'Monthly Bills Analytics',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount (INR)',
                },
            },
        },
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {chartData && <Line options={options} data={chartData} />||<p className='pt-20 text-center font-bold text-4xl text-gray-400'>Please log in to access the analytics dashboard.... </p>}
        </div>
    );
};

export default Analytics;
