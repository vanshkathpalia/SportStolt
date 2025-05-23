import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config.ts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SignupStepFormProps {
  role: "INDIVIDUAL" | "ORGANIZATION" | string;
}

export const SignupStepForm = ({ role }: SignupStepFormProps) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    fullName: "",
    organizationName: "",
    address: "",
    phone: "",
    // add more fields you want
  });
  const [loading, setLoading] = useState(false);

  async function submitStep() {
    setLoading(true);
    try {
      // Example API call for updating user details after signup
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup/step`,
        { ...inputs, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming success redirects user to /post page
      if (response.status === 200) 
        navigate("/post", { replace: true });
      else 
       console.error("Incorrect data given", response.data);
    } catch (error) {
      alert("Failed to save details. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-800 flex justify-center flex-col transition-colors duration-300 px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h1 className="text-3xl font-extrabold text-black dark:text-slate-400 mb-4">
          Complete your {role === "INDIVIDUAL" ? "profile" : "organization"} details
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) submitStep();
          }}
          className="space-y-6"
        >
          {role === "INDIVIDUAL" ? (
            <>
              <LabelledInput
                label="Full Name"
                placeholder="John Doe"
                value={inputs.fullName}
                onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
              />
              <LabelledInput
                label="Phone Number"
                placeholder="+1234567890"
                type="tel"
                value={inputs.phone}
                onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
              />
            </>
          ) : (
            <>
              <LabelledInput
                label="Organization Name"
                placeholder="Acme Corp"
                value={inputs.organizationName}
                onChange={(e) => setInputs({ ...inputs, organizationName: e.target.value })}
              />
              <LabelledInput
                label="Address"
                placeholder="123 Main St, City, Country"
                value={inputs.address}
                onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-600 cursor-wait" : "bg-gray-800 hover:bg-gray-900"
            } transition-colors duration-300`}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

interface LabelledInputProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value: string;
}

function LabelledInput({ label, placeholder, onChange, type, value }: LabelledInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </label>
      <input
        type={type || "text"}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-gray-900 dark:placeholder-gray-400 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
        required
      />
    </div>
  );
}
