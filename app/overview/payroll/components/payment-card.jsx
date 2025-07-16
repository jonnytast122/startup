import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function PaymentCard() {
  // Static values
  const grossPay = 300;
  const deduction = 50;
  const netSalary = 234;

  // Colors for separators & chart
  const colors = {
    grossPay: "#4CAF50", // Green
    deduction: "#F44336", // Red
    netSalary: "#2196F3", // Blue
  };

  // Doughnut chart data
  const data = {
    labels: ["Gross Pay", "Deduction", "Net Salary"],
    datasets: [
      {
        data: [grossPay, deduction, netSalary],
        backgroundColor: [colors.grossPay, colors.deduction, colors.netSalary],
        hoverBackgroundColor: ["#45A049", "#D32F2F", "#1976D2"],
      },
    ],
  };

  const options = {
    circumference: 180, // Half-doughnut
    rotation: 270,
    cutout: "60%",
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
      <h2 className="text-lg font-semibold mb-4">Payment</h2>

      {/* Payment Details */}
      <div className="flex items-center justify-around">
        <div className="flex items-center">
          <div className="w-1 h-12 rounded-md bg-green-600 mr-2"></div> {/* Green Separator */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Gross Pay</p>
            <p className="text-lg font-semibold">${grossPay}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1 h-12 rounded-md bg-red-600 mr-2"></div> {/* Red Separator */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Deduction</p>
            <p className="text-lg font-semibold">${deduction}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-1 h-12 rounded-md bg-blue-600 mr-2"></div> {/* Blue Separator */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Net Salary</p>
            <p className="text-lg font-semibold">${netSalary}</p>
          </div>
        </div>
      </div>

      {/* Half Doughnut Chart */}
      <div className="flex justify-center">
        <div>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
