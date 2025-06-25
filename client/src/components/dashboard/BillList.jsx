import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const baseURL = import.meta.env.VITE_BACKEND_URL;

const BillList = () => {
  const list = [
    { id: 0, type: "All" },
    { id: 1, type: "Electricity" },
    { id: 2, type: "Water" },
    { id: 3, type: "Gas" },
    { id: 4, type: "Internet" },
    { id: 5, type: "Rent" },
    { id: 6, type: "Other" },
  ];

  const { currentUser } = useSelector((state) => state.user);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBillType, setSelectedBillType] = useState("All");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch(`${baseURL}/api/bill/getYears/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) setYearOptions(data.years);
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };
    fetchYears();
  }, [currentUser]);

  const fetchFilteredBills = async (type) => {


    setLoading(true);
    setErrorMessage(null);
    setSelectedBillType(type);
    setViewImage(null);
    setEditingBill(null);

    try {
      const query = new URLSearchParams({ userId: currentUser._id });
      if (type !== "All") query.append("billType", type);
      if (selectedMonth) query.append("month", selectedMonth);
      if (selectedYear) query.append("year", selectedYear);

      const res = await fetch(`${baseURL}/api/bill/filterByMonth?${query}`, {
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.bills)) {
        setFilteredBills(data.bills);
        if (data.bills.length === 0) {
          setErrorMessage("No bills found for the selected filter.");
        }
      } else {
        setFilteredBills([]);
        setErrorMessage(data.message || "Error fetching bills.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setFilteredBills([]);
      setErrorMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Bills by Type</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            className="border px-3 py-2 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button
            onClick={() => fetchFilteredBills(selectedBillType)}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Apply Filter
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {list.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedBillType(item.type);
                fetchFilteredBills(item.type);
              }}
              disabled={loading}
              className={`px-6 py-2 font-medium rounded-full border-2 ${
                selectedBillType === item.type
                  ? "bg-gray-700 text-white border-white"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item.type}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center">Fetching bills...</p>
        ) : errorMessage ? (
          <p className="text-center text-gray-500">{errorMessage}</p>
        ) : filteredBills.length === 0 ? (
          <p className="text-center">No bills found for this type.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBills.map((bill) => (
              <div key={bill._id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                {bill.billImage.toLowerCase().includes(".pdf") ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(bill.billImage)}&embedded=true`}
                    className="w-full h-40"
                  />
                ) : (
                  <img src={bill.billImage} className="w-full h-40 object-cover" />
                )}

                <div className="p-4">
                  <p className="font-semibold">{bill.billType}</p>
                  <p className="text-sm">₹{bill.amount}</p>
                  <p className="text-sm">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      bill.paymentStatus
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bill.paymentStatus ? "Paid" : "Unpaid"}
                  </span>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => setViewImage(bill.billImage)}
                      className="bg-blue-300 text-blue-800 font-semibold rounded px-3 py-1 text-sm"
                    >
                      View Bill
                    </button>
                    <button
                      onClick={() => {
                        setBillToDelete(bill._id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-300 text-red-700 font-semibold px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditingBill(bill)}
                      className="bg-green-200 text-green-800 font-semibold px-3 py-1 rounded text-sm"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative w-full max-w-3xl">
              <button
                onClick={() => setViewImage(null)}
                className="absolute top-2 right-2 text-white text-3xl"
              >
                &times;
              </button>
              {viewImage.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(viewImage)}&embedded=true`}
                  className="w-full h-[80vh]"
                />
              ) : (
                <img src={viewImage} className="w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl relative">
              <button
                onClick={() => setEditingBill(null)}
                className="absolute top-2 right-3 text-xl"
              >
                &times;
              </button>
              <h2 className="text-2xl mb-4">Edit Bill</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formData = new FormData(form);
                  const res = await fetch(
                    `${baseURL}/api/bill/updateBillFile/${editingBill._id}`,
                    {
                      method: "PATCH",
                      body: formData,
                    }
                  );
                  const data = await res.json();
                  if (data.success) {
                    fetchFilteredBills(selectedBillType);
                    setEditingBill(null);
                  } else {
                    alert("Update failed");
                  }
                }}
                encType="multipart/form-data"
              >
                <input
                  name="billType"
                  defaultValue={editingBill.billType}
                  className="w-full mb-2 border px-3 py-2"
                  required
                />
                <input
                  name="amount"
                  type="number"
                  defaultValue={editingBill.amount}
                  className="w-full mb-2 border px-3 py-2"
                  required
                />
                <input
                  name="dueDate"
                  type="date"
                  defaultValue={editingBill.dueDate.split("T")[0]}
                  className="w-full mb-2 border px-3 py-2"
                  required
                />
                <input
                  name="billGeneratedDate"
                  type="date"
                  defaultValue={editingBill.billGeneratedDate?.split("T")[0]}
                  className="w-full mb-2 border px-3 py-2"
                  required
                />
                {editingBill.billType === "Other" && (
                  <input
                    name="description"
                    defaultValue={editingBill.description}
                    className="w-full mb-2 border px-3 py-2"
                    required
                  />
                )}
                <select
                  name="paymentStatus"
                  defaultValue={editingBill.paymentStatus ? "true" : "false"}
                  className="w-full mb-2 border px-3 py-2"
                >
                  <option value="true">Paid</option>
                  <option value="false">Unpaid</option>
                </select>
                <input
                  name="billImage"
                  type="file"
                  accept="image/*,application/pdf"
                  className="w-full mb-2"
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-4 py-2 rounded w-full"
                >
                  Update Bill
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this bill? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await fetch(`${baseURL}/api/bill/deleteBill/${billToDelete}`, {
                      method: "DELETE",
                    });
                    setShowDeleteModal(false);
                    setBillToDelete(null);
                    fetchFilteredBills(selectedBillType);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillList;
