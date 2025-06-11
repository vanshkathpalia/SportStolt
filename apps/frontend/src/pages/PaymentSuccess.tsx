import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("userId");

    if (userId) {
      const token = localStorage.getItem("token");
      axios
        .post(
          `${BACKEND_URL}/api/v1/earn/confirm-payment`,
          { userId: Number(userId) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setStatus("success");
          setTimeout(() => {
            window.location.href = "/profile";
          }, 3000);
        })
        .catch((err) => {
          console.error("Payment confirmation failed:", err);
          setStatus("error");
          setTimeout(() => {
            window.location.href = "/profile";
          }, 5000);
        });
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <div className="text-center mt-10 text-lg">
      {status === "loading" && <p>Confirming your payment... Please wait.</p>}
      {status === "success" && (
        <p className="text-green-600 font-semibold">
          ✅ Payment confirmed! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">
          ❌ Payment confirmation failed. Redirecting shortly...
        </p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
