"use client";

import { CirclePlus, Receipt, Pencil } from "lucide-react";
import InvoiceDialog from "./invoicedialog";
import { useState } from "react";
import PayslipCard from "./payslip-card";

const transactions = [
  {
    id: 1,
    profilePic: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Daniel Richards",
    salary: "$1,200",
    date: "March 3, 2025",
  },
  {
    id: 2,
    profilePic: "https://randomuser.me/api/portraits/women/18.jpg",
    name: "Sophia Lee",
    salary: "$2,150",
    date: "March 4, 2025",
  },
  {
    id: 3,
    profilePic: "https://randomuser.me/api/portraits/men/25.jpg",
    name: "Chris Brown",
    salary: "$950",
    date: "March 5, 2025",
  },
  {
    id: 4,
    profilePic: "https://randomuser.me/api/portraits/women/27.jpg",
    name: "Ella Johnson",
    salary: "$1,800",
    date: "March 6, 2025",
  },
  {
    id: 5,
    profilePic: "https://randomuser.me/api/portraits/men/30.jpg",
    name: "Kevin Tran",
    salary: "$2,400",
    date: "March 7, 2025",
  },
  {
    id: 6,
    profilePic: "https://randomuser.me/api/portraits/men/66.jpg",
    name: "Chris Brown",
    salary: "$950",
    date: "March 5, 2025",
  },
  {
    id: 7,
    profilePic: "https://randomuser.me/api/portraits/women/66.jpg",
    name: "Ella Johnson",
    salary: "$1,800",
    date: "March 6, 2025",
  },
  {
    id: 8,
    profilePic: "https://randomuser.me/api/portraits/men/90.jpg",
    name: "Kevin Tran",
    salary: "$2,400",
    date: "March 7, 2025",
  },
];

export default function TransactionCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-custom">Transaction</h1>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-100 text-light-blue px-4 py-1.5 rounded-lg hover:bg-blue-200 transition">
            <CirclePlus size={16} />
            New
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-white text-light-blue shadow-md px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <Pencil size={16} />
            Edit Invoice
          </button>
          <InvoiceDialog isOpen={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
        {/* Left side (3 boxes vertically stacked) */}
        <div className="col-span-1 shadow-xl h-full rounded-xl mt-3 bg-white md:col-span-2 lg:col-span-3 space-y-4">
          <PayslipCard />
        </div>

        {/* Right side (long vertically, w-2/5) */}
        <div className="col-span-1 font-custom bg-white shadow-xl mt-3 md:col-span-1 lg:col-span-2 h-full rounded-xl order-first md:order-none">
          <div className="flex items-center justify-between p-4">
            <h1 className="font-custom text-lg">Transaction History</h1>
            <button className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1 hover:bg-blue-50">
              See All
            </button>
          </div>

          {/* Separate Transaction List */}
          <div className="px-4 pb-4 space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between pb-3"
              >
                {/* Left: Profile and Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={txn.profilePic}
                    alt={txn.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-medium text-gray-800">{txn.name}</p>
                </div>

                {/* Right: Salary and Date */}
                <div className="text-right">
                  <p className="text-base font-semibold ">{txn.salary}</p>
                  <p className="text-xs text-gray-500">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
