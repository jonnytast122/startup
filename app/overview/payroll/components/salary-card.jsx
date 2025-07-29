import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

Chart.register(ArcElement, Tooltip, Legend);

export default function SalaryCard() {
    // Salary data
    const marketingSalary = 2300;
    const adminSalary = 19200;
    const developerSalary = 5500;
    const hrSalary = 53000;

    // Colors for the departments
    const colors = {
        marketing: "#FF9800",  // Orange
        admin: "#4CAF50",      // Green
        developer: "#2196F3",  // Blue
        hr: "#9C27B0",         // Purple
    };

    // Doughnut chart data
    const data = {
        labels: ["Marketing", "Admin", "Developer", "HR"],
        datasets: [
            {
                data: [marketingSalary, adminSalary, developerSalary, hrSalary],
                backgroundColor: [colors.marketing, colors.admin, colors.developer, colors.hr],
                hoverBackgroundColor: ["#FFB74D", "#81C784", "#64B5F6", "#CE93D8"],
            },
        ],
    };

    const options = {
        circumference: 360,  // Full circle (360 degrees)
        rotation: 330,               // Start from top
        cutout: "75%",               // Set cutout for doughnut effect
        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
        },
    };

    return (
        <div className="bg-white">
            {/* Header */}
            <h2 className="text-lg font-custom leading-tight mb-8">
  Salary Breakdown by <span className="block">Department</span>
</h2>



            {/* Full Circle Doughnut Chart */}
            <div className="flex justify-center items-center">
                <div className="w-2/3">
                    <Doughnut data={data} options={options} />
                </div>
            </div>

            {/* Custom Grid for Legend */}
            <div className="mt-10 flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Create a grid of legend items */}
                    {data.labels.map((label, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: data.datasets[0].backgroundColor[index],
                                }}
                            ></span>
                            <span className="text-xs">{`${label}: $${data.datasets[0].data[index].toLocaleString()}`}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
