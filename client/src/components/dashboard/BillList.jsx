import {useState } from "react";
import { useSelector } from "react-redux";

const BillList = () => {
  const list = [
    { id: 1, type: "Electricity" },
    { id: 2, type: "Water" },
    { id: 3, type: "Gas" },
    { id: 4, type: "Internet" },
    { id: 5, type: "Rent" },
    { id: 6, type: "Other" },
  ];

  const { currentUser } = useSelector((state) => state.user);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBillType, setSelectedBillType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBillByType = async (type) => {
    if (!currentUser) {
      setErrorMessage("Please sign in to view your bills.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(
        `/api/bill/getBillByTypes/${type}?userId=${currentUser._id}`,
        {
          method: "GET",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setFilteredBills(data.bills || []);
      } else {
        setFilteredBills([]);
        setErrorMessage("No bills found for this type.");
      }
    } catch (error) {
      console.error("Error fetching bills by type:", error);
      setErrorMessage("Error fetching bills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (type) => {
    setSelectedBillType(type);
    fetchBillByType(type);
  };


  /*
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);



  const paymentHandler = async (bill) => {
    try {
      const options = {
        billId: bill._id,
        amount: bill.amount,
      };
      const response = await fetch(`/api/payment/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });
      const data = await response.json();

      const paymentObject = new window.Razorpay({
        key: "rzp_test_MDSLJ2BaZKvTuz",
        order_id: data.id,
        ...data,
        handler: function (response) {
          const options2 = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            billId: bill._id,
            userId: currentUser._id,
          };
          fetch(`/api/payment/verifyPayment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(options2),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                alert("Payment Successful");
              } else {
                alert("Payment Failed");
              }
            });
        },
      });

      paymentObject.open();
    } catch (error) {
      console.log("Error creating order or initiating payment:", error);
    }
  };


  */
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-5 px-4 sm:px-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
        Bill Types
      </h1>
      <ul className="flex flex-wrap justify-center space-x-4 mb-10">
        {list.map((item) => (
          <li key={item.id}>
            <button
              className={`border-2 rounded-lg px-4 py-2 font-semibold font-mono transition duration-300 ${
                selectedBillType === item.type
                  ? "bg-red-800 text-white border-red-800"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleButtonClick(item.type)}
              disabled={loading}
            >
              {item.type}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-mono font-semibold mb-5 text-gray-700">
          Fetched Bills - {selectedBillType || "None"}
        </h2>
        {currentUser === null ? (
          <p className="font-bold text-4xl text-gray-400 text-center">
            Please sign in to view your bill list...
          </p>
        ) : loading ? (
          <p className="text-gray-400 font-semibold text-2xl">
            Loading bills...
          </p>
        ) : errorMessage ? (
          <p className="text-red-500 font-semibold text-2xl">{errorMessage}</p>
        ) : filteredBills.length > 0 ? (
          <ul className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBills.map((bill) => (
              <li
                key={bill._id}
                className="border px-5 py-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition duration-300"
              >
                <div>
                  <div className="mb-4">
                    <img
                      className="h-40 w-full object-cover rounded-lg"
                      src={bill.billImage}
                      alt={bill.billType}
                    />
                  </div>
                  <p className="mb-2">
                    <strong>Description:</strong> {bill.description}
                  </p>
                  <p className="mb-2">
                    <strong>Amount:</strong> ₹{bill.amount}
                  </p>
                  <p className="mb-2">
                    <strong>Due Date:</strong>{" "}
                    {new Date(bill.dueDate).toLocaleDateString()}
                    {/* {console.log(bill)} */}
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <strong>Status:</strong>
                    {bill.paymentStatus ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <span className="text-red-800 font-semibold">Unpaid</span>
                        {/* <button
                          className="px-4 py-2 bg-green-500 border rounded-lg text-white hover:bg-green-600 transition duration-300"
                          onClick={() => paymentHandler(bill)}
                        >
                          Pay Now
                        </button> */}
                      
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 font-semibold text-2xl text-center">
            No bills found. Select a type from the options above.
          </p>
        )}
      </div>
    </div>
  );
};

export default BillList;
