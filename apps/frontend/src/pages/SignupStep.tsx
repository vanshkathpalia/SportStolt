// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Quote } from "../components/Signup/Quote";
// import { SignupStepForm } from "../components/Signup/Step";

// export const SignupStep = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const role = searchParams.get("role") || "INDIVIDUAL"; // fallback

//   useEffect(() => {
//     // Prevent back navigation to auth pages by pushing new state and listening to popstate
//     window.history.pushState(null, "", window.location.href);
//     const handlePopState = () => {
//       navigate("/", { replace: true }); // redirect to homepage if back button pressed
//     };
//     window.addEventListener("popstate", handlePopState);

//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [navigate]);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2">
//       <div>
//         <SignupStepForm role={role} />
//       </div>
//       <div className="hidden lg:block">
//         <Quote />
//       </div>
//     </div>
//   );
// };
