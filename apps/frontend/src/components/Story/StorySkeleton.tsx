export const StorySkeleton = () => {
  return (
    <div role="status" className="animate-pulse">
      <div className="bg-background gap-4 rounded-lg shadow-sm p-2 mb-1">
        {/* toggle shadow*/}
        <div className="fles space-x-2 mb-4">
          <button className="px-3 py-1 text-sm rounded-full transition bg-blue-500 text-white">
                  Locations
          </button>
          <button className="px-3 py-1 text-sm rounded-full transitionbg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Sports
          </button>
        </div>
        
        <div className="flex gap-4 scroll-pr-24 overflow-x-auto pb-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Circle to represent the story icon */}
              <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>

              {/* Label or title placeholder */}
              <div className="h-2 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading stories...</span>
    </div>
  );
};



// <div>
//             <div className="bg-white rounded-lg shadow-sm p-4 mb-4 ">
//                 <div className="flex flex-row-reverse gap-1 overflow-x-auto pb-2 scrollbar-hide cursor-pointer" >
//                 {Array.from({ length: 6 }).map((_, index) => (
//                     <div key={index} className="flex flex-col items-center">
//                     {/* Circle to represent the story icon */}
//                     <div className="h-16 w-16 bg-gray-200 rounded-full mb-2"></div>
//                     {/* Label or title placeholder */}
//                     <div className="h-2 w-10 bg-gray-200 rounded-full"></div>
//                     </div>
//                 ))}
//                 </div>
//             </div>
// </div>