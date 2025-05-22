import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Quote } from "../components/Signup/Quote";
import { Auth } from "../components/Signup/Auth";

export const Signup = () => {
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
        <Auth type="signup" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Quote } from "../components/Signup/Quote"
// import { Auth } from "../components/Signup/Auth"

// export const Signup = () => {
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         window.history.pushState(null, "", window.location.href);
//         const handlePopState = () => {
//             navigate("/", { replace: true });
//         };
//         window.addEventListener("popstate", handlePopState);
//         return () => {
//             window.removeEventListener("popstate", handlePopState);
//         };
//     }, [navigate]); //was no dependency array in the original code


//     return <div className="grid grid-cols-1 lg:grid-cols-2">
//         <div>
//             <Auth type="signup"/>
//         </div>
//         <div className="hidden lg:block">
//             <Quote />
//         </div>
//     </div>
// }