export const StorySkeleton = () => {
    return (
      <div role="status" className="animate-pulse">
        
        {/* <div className="p-4 flex gap-4 overflow-x-auto w-screen max-w-screen-md pb-2">
          //Repeating circles for story skeleton
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              //Circle to represent the story icon
              <div className="h-16 w-16 bg-gray-200 rounded-full mb-2"></div>
              //Label or title placeholder
              <div className="h-2 w-10 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div> */}
        
        
        <div className="bg-white gap-4 rounded-lg shadow-sm p-2 mb-4">
                <div className="p-2 flex gap-4 overflow-x-auto w-screen max-w-3xl pb-2 " >
                {Array.from({ length: 11 }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                    {/* Circle to represent the story icon */}
                    <div className="h-14 w-14 bg-gray-200 rounded-full mb-2"></div>
                    
                    {/* Label or title placeholder */}
                    <div className="h-2 w-10 bg-gray-200 rounded-full"></div>
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