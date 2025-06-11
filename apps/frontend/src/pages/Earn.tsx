import axios from "axios";
import { BACKEND_URL } from "../config";
// @ts-expect-error: cashfree-js library is not typed, but it's a required dependency
import { load } from "@cashfreepayments/cashfree-js";
import { useState } from "react";
import { Link } from "react-router-dom";


export const EarnPage = () => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to continue.");
      return;
    }

    try {
      setLoading(true);
      const userRes = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User data:", userRes.data);

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/earn/create-order`,
        { amount: 5 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sessionId = res.data.paymentSessionId;
      console.log("Session ID from backend:", res.data);

      if (!sessionId) {
        alert("Payment session not received.");
        return;
      }

      const cashfree = await load({
          mode: "production", // use "sandbox" for testing
        // mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Payment Error:", err);
        alert("Error: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-900 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-6 text-center">Join the Proof of Work Program</h1>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 space-y-5 border border-slate-200 dark:border-slate-700">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Why a ₹5 Fee?</h2>
          <p className="text-xl">
            This small fee helps us ensure that only genuine contributors are part of our community. It filters out spam
            and keeps the platform fair for everyone working hard to provide meaningful sports-related content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">What is Proof of Work?</h2>
          <p className="text-xl">
            Proof of Work (PoW) is our trust model. By paying ₹5, you're signing up for a reward-based system where
            you can earn points and recognition by uploading valid and verified local sports stories, events, or
            activities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">What Do You Get?</h2>
          <ul className="list-disc pl-5 space-y-1 text-xl">
            <li>Access to story posting and earning platform</li>
            <li>Eligibility for monthly rewards & leaderboard ranking</li>
            <li>Verified badge after consistent PoW</li>
            <li>Support from the community and moderators</li>
          </ul>
        </section>

        <section className="text-center mt-6">
          <button
            onClick={handlePay}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay ₹5 to Join"}
          </button>

          <div className="mt-6">
            <p className="text-lg mb-2">Already paid and earned points?</p>
            <Link
              to="/withdraw"
              className="text-blue-500 underline hover:text-blue-800 transition"
            >
              Withdraw your earnings here →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EarnPage;
