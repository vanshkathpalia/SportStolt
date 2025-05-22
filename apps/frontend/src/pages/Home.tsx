import { useEffect } from "react";
import { Intro } from "../components/Home/Intro";
import { FeatureCard } from "../components/Home/FeatureCard";
import { Footer } from "../components/Home/Footer";
import { Features } from "../mockData/FeatureData";

export const Home = () => {

  // useEffect(() => {
  //   window.history.replaceState(null, "", window.location.href);

  //   const onPopState = () => {
  //     window.close(); // Works only if opened by JS
  //   };

  //   window.addEventListener("popstate", onPopState);

  //   return () => {
  //     window.removeEventListener("popstate", onPopState);
  //   };
  // }, []);

  // useEffect(() => {
  //   window.history.pushState(null, "", window.location.href);

  //   const onPopState = () => {
  //     // Instead of pushing again and again
  //     alert("Back navigation is disabled. Use in-app navigation.");
  //     window.history.pushState(null, "", window.location.href);
  //   };

  //   window.addEventListener("popstate", onPopState);

  //   return () => {
  //     window.removeEventListener("popstate", onPopState);
  //   };
  // }, []);


  useEffect(() => {
  window.history.pushState(null, "", window.location.href);

  const onPopState = () => {
    if (window.opener) {
      // Opened via window.open(), safe to attempt closing
      window.close();
    } else {
      // Fallback: block back button
      alert("Delete the tab manually. Back button is disabled.");
      window.history.pushState(null, "", window.location.href);
    }
  };

  window.addEventListener("popstate", onPopState);

  return () => {
    window.removeEventListener("popstate", onPopState);
  };
}, []);


  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
      <Intro />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
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




// import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// import { Intro } from "../components/Home/Intro";
// import { FeatureCard } from "../components/Home/FeatureCard";
// import { Footer } from "../components/Home/Footer";
// import { Features } from "../mockData/FeatureData";

// export const Home = () => {
//   // const navigate = useNavigate();

//   useEffect(() => {
//   // Prevent back navigation from home
//     window.history.pushState(null, "", window.location.href);
    
//     const onBackButtonEvent = (e: PopStateEvent) => {
//       e.preventDefault();
//       window.location.href = "about:blank"; // Exit the app
//     };

//     window.addEventListener("popstate", onBackButtonEvent);

//     return () => {
//       window.removeEventListener("popstate", onBackButtonEvent);
//     };
//   }, []);



//   return (
//     <div className="min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
//       <Intro />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
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
