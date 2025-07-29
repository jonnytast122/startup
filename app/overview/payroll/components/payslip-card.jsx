import { useState } from "react";
import { CirclePlus, Receipt, X, SendHorizontal } from "lucide-react";

const payslips = [
  {
    id: 1,
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    date: "March 1, 2025",
    time: "9:00 AM",
    bankName: "ABA",
    salary: "$3,000",
  },
  {
    id: 2,
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Jane Smith",
    date: "March 2, 2025",
    time: "10:30 AM",
    bankName: "ABA",
    salary: "$2,500",
  },
  {
    id: 3,
    profilePic: "https://randomuser.me/api/portraits/men/50.jpg",
    name: "Alex Johnson",
    date: "March 3, 2025",
    time: "8:15 AM",
    bankName: "ABA",
    salary: "$2,800",
  },
  {
    id: 4,
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Emily Davis",
    date: "March 4, 2025",
    time: "12:00 PM",
    bankName: "ABA",
    salary: "$3,200",
  },
  {
    id: 5,
    profilePic: "https://randomuser.me/api/portraits/men/34.jpg",
    name: "Michael Brown",
    date: "March 5, 2025",
    time: "3:45 PM",
    bankName: "ABA",
    salary: "$3,500",
  },
];

export default function PayslipCard() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendInvoice = () => {
    setShowDialog(true);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1 className="font-custom text-lg mr-4">Payslip</h1>
          <div className="flex items-center gap-2 bg-orange-100 text-orange-400 px-2 py-1 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-300" />
            <span className="font-custom text-sm">PENDING</span>
          </div>
        </div>

        <button
          onClick={toggleSelectMode}
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1 rounded-2xl border border-gray-300 hover:bg-blue-50"
        >
          <CirclePlus size={16} className="text-blue-600" />
          {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      {/* Instructional Text */}
      {selectMode && (
        <p className="text-base text-blue-600 px-4 pb-2">
          Please select invoices to send.
        </p>
      )}

      {/* List */}
      <div className="p-4 space-y-4">
        {payslips.map((payslip) => (
          <div
            key={payslip.id}
            className={`grid grid-cols-5 gap-4 items-center py-3 rounded-lg cursor-pointer p-1 ${
              selectedIds.includes(payslip.id)
                ? "bg-blue-200 border border-blue-400" // selected = light blue background with a blue border
                : "hover:bg-blue-100" // hover = even lighter blue background
            }`}
            onClick={() => selectMode && handleSelect(payslip.id)}
          >
            <div className="flex items-center gap-3">
              <img
                src={payslip.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-medium">{payslip.name}</p>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-base text-black">{payslip.date}</span>
              <span className="text-sm text-gray-500">{payslip.time}</span>
            </div>

            <div className="text-md text-gray-700">{payslip.bankName}</div>

            <div className="text-md font-medium">{payslip.salary}</div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-2 hover:bg-blue-100 hover:border-blue-300 transition whitespace-nowrap">
                <Receipt size={16} />
                Send Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Send Invoice Button */}
      {selectMode && selectedIds.length > 0 && (
        <div className="px-4 pb-4">
          <button
            onClick={handleSendInvoice}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-2xl text-base hover:bg-green-700 transition"
          >
            <SendHorizontal size={18} />
            Send Invoice ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowDialog(false)}
            >
              <X size={18} />
            </button>
            <img
              src="/images/account_create.png"
              alt="Success"
              className="w-32 mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">
              Send invoice successful
            </h2>
            <p className="text-sm text-gray-600">
              Your invoices have been sent!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
