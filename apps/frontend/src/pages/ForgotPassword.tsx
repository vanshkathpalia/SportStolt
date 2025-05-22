import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";

export const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sending...");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Reset link sent to your email.");
        // Optional: Redirect after a short delay (e.g., back to sign in)
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`An error occurred: ${err.message}`);
      } else {
        setMessage("An unknown error occurred");
      }
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
          type="button"
        >
          &larr; Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
              required
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 ${
              loading ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
