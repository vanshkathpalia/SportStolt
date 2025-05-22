import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Signup/Auth";
import { Quote } from "../components/Signup/Quote";

export const Signin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Auth } from "../components/Signup/Auth";
// import { Quote } from "../components/Signup/Quote";

// export const Signin = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handlePopState = () => {
//       // When user presses browser back on signin/signup, go to home page by replacing history entry
//       navigate("/", { replace: true });
//     };

//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, [navigate]);

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2">
//       <div>
//         <Auth type="signin" />
//       </div>
//       <div className="hidden lg:block">
//         <Quote />
//       </div>
//     </div>
//   );
// };

