import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config.ts";
import { Loader2, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { signupInput } from "@vanshkathpalia/sportstolt-common";
import { z } from "zod";
import { useAuth } from "../../context/useAuth.ts";
import { useTheme } from "../../context/useTheme.ts";

type SignupInput = z.infer<typeof signupInput>;

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [postInputs, setPostInputs] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs);
      const jwt = response.data.token;
      const user = response.data.user;

      if (!jwt) {
        alert("Forgot Password? Change your password");
        setLoading(false);
        return;
      }

      handleLoginSuccess(user, jwt);

      navigate("/post", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error && typeof error.response.data.error === "string") {
          alert(error.response.data.error);
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-800 flex flex-col justify-center transition-colors duration-300">
      
      {/* Toggle Theme Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="bg-white text-blue-600 p-2 rounded-full dark:bg-gray-700 dark:text-yellow-300"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) sendRequest();
        }}
        className="flex justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg"
        >
          <div className="text-3xl text-black dark:text-slate-300 font-extrabold mb-2">
            {type === "signup" ? "Create an account" : "Sign in to your account"}
          </div>
          <div className="text-slate-500 dark:text-slate-400 mb-6">
            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
            <Link
              className="pl-2 underline text-blue-600 dark:text-blue-400"
              to={type === "signin" ? "/signup" : "/signin"}
              replace
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </div>

          {type === "signup" && (
            <LabelledInput
              label="Name"
              placeholder="Vansh..."
              onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
            />
          )}
          <LabelledInput
            label="Email"
            placeholder="example@gmail.com"
            onChange={(e) => setPostInputs({ ...postInputs, email: e.target.value })}
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="********"
            onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
          />

          {type === "signin" && (
            <div className="text-sm text-right mt-2 text-blue-600 dark:text-blue-400 hover:underline">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          <button
            type="submit"
            className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-slate-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 flex items-center justify-center transition-all duration-300 ${
              loading ? "cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "Processing..." : type === "signup" ? "Sign up" : "Sign in"}
          </button>
        </motion.div>
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
      <label className="block mb-2 text-sm font-semibold pt-4 text-gray-800 dark:text-gray-200">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-gray-900 dark:placeholder-gray-400 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
        placeholder={placeholder}
        required
      />
    </div>
  );
}



// import { ChangeEvent, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BACKEND_URL } from "../../config.ts";
// import { Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { signupInput } from "@vanshkathpalia/sportstolt-common";
// import { z } from "zod";
// import { useAuth } from "../../context/useAuth.ts";

// type SignupInput = z.infer<typeof signupInput>;

// export const Auth = ({ type }: { type: "signup" | "signin" }) => {
//   const navigate = useNavigate();
//   // const { setUser } = useAuth();
//   const { handleLoginSuccess } = useAuth();

//   const [postInputs, setPostInputs] = useState<SignupInput>({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   async function sendRequest() {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs);
//       const jwt = response.data.token;
//       const user = response.data.user; // backend sends this

//       if (!jwt) {
//         alert("Forgot Password? Change your password");
//         setLoading(false);
//         return;
//       }

//       // Store token and user in localStorage
//       // localStorage.setItem("token", jwt);
//       // if (user) {
//       //   localStorage.setItem("user", JSON.stringify(user));
//       //   setUser(user);  // update context immediately
//       // }
//       // this all is done by ->

//       handleLoginSuccess(user, jwt);

//       navigate("/post", { replace: true });
//     } catch (error: unknown) {
//       // Check if axios error and backend sent error message
//       if (axios.isAxiosError(error)) {
//         if (error.response && error.response.data && typeof error.response.data.error === "string") {
//           alert(error.response.data.error);
//         } else {
//           alert("An unexpected error occurred. Please try again.");
//         }
//       } else {
//         alert("An unexpected error occurred. Please try again.");
//       }
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <div className="px-10 pt-4 bg-gray-50 dark:bg-gray-800 ">
//         {/* "Go Home" button replaces history so that home is start of stack */}
//         {/* <button onClick={() => navigate("/", { replace: true })} className="text-blue-600 hover:underline">
//           Go Home
//         </button> */}
//       </div>

//       <div className="h-screen bg-gray-50 dark:bg-gray-800 flex justify-center flex-col transition-colors duration-300">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (!loading) sendRequest();
//           }}
//           className="flex justify-center"
//         >
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, ease: "easeInOut" }}
//             >
//               <div className="px-10">
//                 <div className="text-3xl text-black dark:text-slate-400 font-extrabold">
//                   {type === "signup" ? "Create an account" : "Sign in to your account"}
//                 </div>
//                 <div className="text-slate-500">
//                   {type === "signin" ? "Don't have an account?" : "Already have an account?"}
//                   {/* Use navigate with replace to avoid infinite history */}
//                   <Link
//                     className="pl-2 underline"
//                     to={type === "signin" ? "/signup" : "/signin"}
//                     replace
//                   >
//                     {type === "signin" ? "Sign up" : "Sign in"}
//                   </Link>
//                 </div>
//               </div>

//               <div className="pt-8">
//                 {type === "signup" && (
//                   <LabelledInput
//                     label="Name"
//                     placeholder="Vansh..."
//                     onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
//                   />
//                 )}
//                 <LabelledInput
//                   label="Email"
//                   placeholder="example@gmail.com"
//                   onChange={(e) => setPostInputs({ ...postInputs, email: e.target.value })}
//                 />
//                 <LabelledInput
//                   label="Password"
//                   type="password"
//                   placeholder="asdasd"
//                   onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
//                 />

//                 {type === "signin" && (
//                   <div className="text-sm text-right mt-2 text-blue-600 dark:text-blue-400 hover:underline">
//                     <Link to="/forgot-password">Forgot Password?</Link>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2  dark:bg-slate-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center justify-center transition-all duration-300 ${
//                     loading ? "cursor-wait" : ""
//                   }`}
//                   disabled={loading}
//                 >
//                   {loading ? <Loader2 className=" animate-spin mr-2" /> : null}
//                   {loading ? "Processing..." : type === "signup" ? "Sign up" : "Sign in"}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// interface LabelledInputType {
//   label: string;
//   placeholder: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
// }

// function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
//   return (
//     <div>
//       <label className="block mb-2 text-sm font-semibold pt-4 text-gray-800 dark:text-gray-200">
//         {label}
//       </label>

//       <input
//         onChange={onChange}
//         type={type || "text"}
//         className="bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 text-gray-900 dark:placeholder-gray-400 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
//         placeholder={placeholder}
//         required
//       />
//     </div>
//   );
// }