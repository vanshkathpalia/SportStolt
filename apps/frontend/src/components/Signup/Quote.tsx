export const Quote = () => {
    return <div className="bg-slate-200 h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div className="max-w-lg" >
                <div className="text-3xl font-bold"> "Day one or one day" </div>
                <div className="max-w-md font-semibold text-xl mt-4"> me </div>
                <div className="max-w-sm font-light text-sm mt-1 text-slate-500"> CEO | SportStolt </div>
            </div>
                    
        </div>
    </div>
}

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
