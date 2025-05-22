import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
    else setMessage("Invalid or missing token");
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Resetting...");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Reset Password
        </h2>

        {token ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 ${
                loading ? "opacity-50 cursor-wait" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : null}

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
