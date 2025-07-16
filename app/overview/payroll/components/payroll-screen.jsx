"use client";

import PayrollTable from "./payroll-table";
import TransactionCard from "./transaction-card";

const PayrollScreen = () => {
  return (
    <div className="p-4">
      <PayrollTable />
      <TransactionCard />
    </div>
  );
};

export default PayrollScreen;
