import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const WithdrawPage = () => {
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/earn/withdraw`,
        { amount: Number(amount), upi },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json",
          } 
        }
      );

      console.log(res.data);

      alert("✅ Withdrawal successful!");
      setAmount("");
      setUpi("");
    } catch (err: unknown) {
    if (err instanceof Error) {
        console.error(err);
        alert(`❌ Withdrawal failed: ${err.message}`);
    } else if (axios.isAxiosError(err)) {
        console.error(err);
        alert(`❌ Withdrawal failed: ${err.response?.data || 'Unknown error'}`);
    } else {
        console.error(err);
        alert(`❌ Withdrawal failed: Unknown error`);
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div> 
        <h2 className="text-3xl pt-10 text-center font-bold mb-4 dark:text-white">Withdraw Your Earnings</h2>
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white dark:bg-slate-800">
            <p className="mb-4 text-md text-gray-300">
                Minimum 5 valid stories after payment required. 1 point = ₹0.1.
            </p>

        <input
            className="w-full mb-5 p-2 border rounded"
            type="text"
            placeholder="Enter UPI ID (e.g., you@okaxis)"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
        />

        <input
            className="w-full mb-5 p-2 border rounded"
            type="number"
            placeholder="Amount to withdraw (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
        />

        <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            onClick={handleWithdraw}
            disabled={loading}
        >
            {loading ? "Processing..." : "Withdraw"}
        </button>
        </div>
    </div>
  );
};

export default WithdrawPage;
