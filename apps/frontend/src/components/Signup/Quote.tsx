export const Quote = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 flex justify-center items-center transition-colors duration-300">
      <div className="max-w-xl px-6 text-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          "Day one or one day"
        </div>
        <div className="font-semibold text-xl mt-4 text-gray-700 dark:text-gray-300">
          – me
        </div>
        <div className="font-light text-sm mt-1 text-gray-500 dark:text-gray-400">
          CEO | SportStolt
        </div>
      </div>
    </div>
  );
};


// import { useEffect, useState } from "react";
// import axios from "axios";

// export const Quote = () => {
//   const [quote, setQuote] = useState("");
//   const [author, setAuthor] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchQuote = async () => {
//     try {
//       const response = await axios.get("https://api.quotable.io/random");
//       setQuote(response.data.content);
//       setAuthor(response.data.author);
//     } catch (error) {
//       console.error("Error fetching quote:", error);
//       setQuote("Keep pushing your limits.");
//       setAuthor("SportStolt");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuote();
//   }, []);

//   return (
//     <div className="bg-slate-200 h-screen flex justify-center flex-col">
//       <div className="flex justify-center">
//         <div className="max-w-lg">
//           {loading ? (
//             <div className="text-3xl font-bold animate-pulse">Loading...</div>
//           ) : (
//             <>
//               <div className="text-3xl font-bold">"{quote}"</div>
//               <div className="max-w-md font-semibold text-xl mt-4">- {author}</div>
//               <div className="max-w-sm font-light text-sm mt-1 text-slate-500">SportStolt</div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
