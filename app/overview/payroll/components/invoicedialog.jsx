import { Pencil } from "lucide-react";

export default function InvoiceDialog({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between">
                        <div className="flex gap-4">
                            <img
                                src="/images/invoice_logo.png"
                                alt="Logo"
                                className="w-32 h-30 object-contain"
                            />
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">Name</h2>
                                <p className="text-sm text-gray-600">Title</p>
                                <p className="text-sm text-gray-600">Company name</p>
                                <p className="text-sm text-gray-600">Salary Currency</p>
                                <p className="text-sm text-blue-600 underline">Billing address</p>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <button onClick={onClose} className="text-blue-600">
                                <Pencil size={20} />
                            </button>
                            <div className="text-sm bg-gray-100 p-2 rounded-md">#20240001</div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-xl font-bold text-gray-800">$1000.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="border rounded-md p-6">
                        <div className="grid grid-cols-3 gap-4 bg-white">
                            {/* Left info */}
                            <div className="col-span-1 space-y-2 bg-gray-10 p-4 rounded-md">
                                <h4 className="text-sm text-gray-500">Pay Period</h4>
                                <p className="text-sm font-medium text-gray-800">03/05/2020</p>
                                <h4 className="text-sm text-gray-500">Pay Date</h4>
                                <p className="text-sm font-medium text-gray-800">03/05/2020</p>
                                <h4 className="text-sm text-gray-500">Salary Currency</h4>
                                <p className="text-sm font-medium text-gray-800">Dollar</p>
                                <h4 className="text-sm text-gray-500">Working rate</h4>
                                <p className="text-sm font-medium text-gray-800">204 hours</p>
                                <h4 className="text-sm text-gray-500">Monthly rate</h4>
                                <p className="text-sm font-medium text-gray-800">$350</p>
                                <h4 className="text-sm text-gray-500">Hourly rate</h4>
                                <p className="text-sm font-medium text-gray-800">$1.45</p>
                            </div>

                            {/* Right info */}
                            <div className="col-span-2 text-sm text-gray-700">
                                <h4 className="font-semibold mb-2">Billing information</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-500">Daily work hours</span>
                                    <span className="text-right">160 hours</span>
                                    <span className="text-gray-500">Sick Leave</span>
                                    <span className="text-right">4 hours</span>
                                    <span className="text-gray-500">Time Off (Paid)</span>
                                    <span className="text-right">8 hours</span>
                                    <span className="text-gray-500">Unpaid Leave</span>
                                    <span className="text-right">0 hours</span>

                                    <span className="col-span-2 font-semibold mt-4">Earnings</span>
                                    <span className="text-gray-500">Basic Salary</span>
                                    <span className="text-right">$237.80</span>
                                    <span className="text-gray-500">Overtimes</span>
                                    <span className="text-right">$5</span>

                                    <span className="col-span-2 font-semibold mt-4">Deductions</span>
                                    <span className="text-gray-500">Income Tax (10%)</span>
                                    <span className="text-right">$22.88</span>
                                    <span className="text-gray-500">Total NSSF</span>
                                    <span className="text-right">$22.88</span>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-1">Note</h4>
                                    <p className="text-black font-medium">
                                        This is a custom message that might be relevant to employee.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="flex flex-col items-end text-sm text-gray-700 space-y-1 mt-6">
                            <div className="flex gap-8">
                                <span>Total Deduction</span>
                                <span className="font-semibold">$50.00</span>
                            </div>
                            <div className="flex gap-8">
                                <span>Total Earning</span>
                                <span className="font-semibold">$1000.00</span>
                            </div>
                            <div className="flex gap-8 text-base font-bold mt-2 border-t p-1">
                                <span>Net Salary</span>
                                <span>$950.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                        <div>
                            <p>Term & Conditions</p>
                            <h1 className="font-bold text-black">
                                Please check within 2 days of receiving this invoice.
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
