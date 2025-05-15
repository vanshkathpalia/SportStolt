import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@vanshkathpalia/sportstolt-common";
import axios from "axios";
import { BACKEND_URL } from "../../config.ts";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs);
      const jwt = response.data.token;
      if (!jwt) {
        alert("Authentication failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", jwt);
      navigate("/post");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.error || e.response?.data?.message || "Unexpected error";
      alert(errorMessage);
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) sendRequest();
        }}
        className="flex justify-center"
      >
        <div>
          {/* Only animate this content, not the whole page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="px-10">
              <div className="text-3xl font-extrabold">
                {type === "signup" ? "Create an account" : "Sign in to your account"}
              </div>
              <div className="text-slate-500">
                {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                <Link
                  className="pl-2 underline"
                  to={type === "signin" ? "/signup" : "/signin"}
                >
                  {type === "signin" ? "Sign up" : "Sign in"}
                </Link>
              </div>
            </div>

            <div className="pt-8">
              {type === "signup" && (
                <LabelledInput
                  label="Name"
                  placeholder="Vansh..."
                  onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })}
                />
              )}
              <LabelledInput
                label="Email"
                placeholder="vanshkumar@gmail.com"
                onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
              />
              <LabelledInput
                label="Password"
                type="password"
                placeholder="asdasd"
                onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
              />
              <button
                type="submit"
                className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center justify-center transition-all duration-300 ${
                  loading ? "cursor-wait" : ""
                }`}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null }
                {loading ? "Processing..." : type === "signup" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
