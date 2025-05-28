import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Intro } from "../components/Home/Intro";
import { FeatureCard } from "../components/Home/FeatureCard";
import { Footer } from "../components/Home/Footer";
import { Features } from "../mockData/FeatureData";

export const Home = () => {
  const { user, refreshUser, visitedBefore } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true); // Track welcome screen visibility

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      if (window.opener) {
        window.close();
      } else {
        alert("Back button disabled. Close the tab manually.");
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
    } else {
      refreshUser()
        .catch(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [refreshUser]);

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem("token");

      // Delay navigation to allow welcome screen to show for 1s
      const timer = setTimeout(() => {
        if (token && user) {
          navigate("/post", { replace: true });
        } else if (visitedBefore) {
          navigate("/signin", { replace: true });
        }
        setShowWelcome(false); // Hide welcome screen after redirect or no token
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, navigate, visitedBefore]);

  // Show animated welcome screen during auth check and 1-second delay
  if (showWelcome && localStorage.getItem("token")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="text-center animate-fadeIn opacity-0 animate-delay-100">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {/* Welcome{user?.username ? ` back, ${user.username}` : " back"}!
            // rendering this was taking time  */}
            Welcome back!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Redirecting you to SportStolt</p>
        </div>
      </div>
    );
  }

  // Render homepage for new/guest users
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
      <Intro />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Sportstolt!
          </h1>
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover all the features that make our platform the perfect place for sports enthusiasts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import { Intro } from "../components/Home/Intro";
// import { FeatureCard } from "../components/Home/FeatureCard";
// import { Footer } from "../components/Home/Footer";
// import { Features } from "../mockData/FeatureData";


// export const Home = () => {
//   const { user, refreshUser, visitedBefore } = useAuth();
//   const navigate = useNavigate();

//   // Track if we are still loading/validating user
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       // No token: done loading, show homepage (new user or logged out)
//       setLoading(false);
//     } else {
//       // Token exists: try to refresh user
//       refreshUser()
//         .catch(() => {
//           // If refresh fails, user is invalid → done loading, show sign-in redirect
//           setLoading(false);
//         })
//         .finally(() => {
//           // Either success or fail, loading is done
//           setLoading(false);
//         });
//     }
//   }, [refreshUser]);

//   useEffect(() => {
//     if (!loading) {
//       const token = localStorage.getItem("token");

//       if (token && user) {
//         // Valid logged-in user → go to /post
//         navigate("/post", { replace: true });
//       } else if (visitedBefore) {
//         // Token exists but user invalid → go to signin
//         navigate("/signin", { replace: true });
//       }
//       // } else {
//       //   // If no token, check visitedBefore flag
//       //   if (!visitedBefore) {
//       //     // User never visited before, show intro page logic
//       //     // After showing onboarding, set visitedBefore to true
//       //     setVisitedBefore(true);
//       //     // You can render Intro here or redirect as needed
//       //   }
//       // }
//       // Else: no token and not loading → render homepage below
//     }
//   }, [loading, user, navigate, visitedBefore]);

//   // While loading, render nothing or a spinner (avoid flashing)
//   if (loading) return null;

//   // Now either:
//   // 1) no token = first-time visitor -> show homepage (new visitor or logged out)
//   // 2) redirects done in useEffect
//   // Case 1: logged in user will already be redirected above
//   // Case 2: logged-out user (with old token) gets redirected to signin

  
//   return (
//     <div className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
//       <Intro />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//         <div className="text-center mb-16">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Welcome to Sportstolt!
//           </h1>
//           <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
//             Everything You Need in One Platform
//           </h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//             Discover all the features that make our platform the perfect place for sports enthusiasts
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {Features.map((feature, index) => (
//             <FeatureCard
//               key={index}
//               title={feature.title}
//               description={feature.description}
//               icon={feature.icon}
//               color={feature.color}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Home;


// // import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/useAuth";
// // import { Intro } from "../components/Home/Intro";
// // import { FeatureCard } from "../components/Home/FeatureCard";
// // import { Footer } from "../components/Home/Footer";
// // import { Features } from "../mockData/FeatureData";

// // export const Home = () => {
// //   const { user, refreshUser } = useAuth();
// //   const navigate = useNavigate();

// //   // Restrict back button behavior
// //   useEffect(() => {
// //     window.history.pushState(null, "", window.location.href);

// //     const onPopState = () => {
// //       if (window.opener) {
// //         window.close();
// //       } else {
// //         alert("Delete the tab manually. Back button is disabled.");
// //         window.history.pushState(null, "", window.location.href);
// //       }
// //     };

// //     window.addEventListener("popstate", onPopState);

// //     return () => {
// //       window.removeEventListener("popstate", onPopState);
// //     };
// //   }, []);

// //   // Refresh and validate user
// //   useEffect(() => {
// //     refreshUser();
// //   }, [refreshUser]);

// //   // Redirect to sign-in if user is not authenticated
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       navigate("/signin", { replace: true });
// //     } else if (!user) {
// //       // user hasn't loaded yet, but token exists
// //       refreshUser(); // refreshUser will set user if token is valid
// //     } else {
// //       navigate("/post", { replace: true });
// //     }
// //   }, [user, navigate, refreshUser]);

// //   if (!user) return null; // Optionally show <Loading /> here

// //   return (
// //     <div className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
// //       <Intro />
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
// //         <div className="text-center mb-16">
// //           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
// //             Welcome back, {user.username}!
// //           </h1>
// //           <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
// //             Everything You Need in One Platform
// //           </h2>
// //           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
// //             Discover all the features that make our platform the perfect place for sports enthusiasts
// //           </p>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {Features.map((feature, index) => (
// //             <FeatureCard
// //               key={index}
// //               title={feature.title}
// //               description={feature.description}
// //               icon={feature.icon}
// //               color={feature.color}
// //             />
// //           ))}
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Home;
