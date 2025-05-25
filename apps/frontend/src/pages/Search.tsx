import { useState, useEffect } from 'react';
import { SearchGrid } from '../components/Search/SearchGrid';
import { MobileNav } from '../components/StickyBars/MobileNav';
import { Sidebar } from '../components/StickyBars/Sidebar';
import axios from 'axios';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { BACKEND_URL } from '../config';


export const Search = ({openCreateModal}: {openCreateModal: () => void}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)")


  useEffect(() => {
    const fetchImages = async () => {
      try {
        
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/api/v1/search/images`, { 
          method: "GET",
          headers: { Authorization: token } 
        });
        
        console.log('Fetched images:', response.data.images); // Debugging
        setPosts(response.data.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchImages();
  }, []);

  return (
      <div className="min-h-screen bg-background">
          {isMobile && <MobileNav openCreateModal={openCreateModal} />}

          <div className="flex">
            <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
              <Sidebar openCreateModal={openCreateModal} />
            </div>
          </div>

        <main className="flex-1 md:ml-16 xl:ml-56 pb-16 md:pb-8">

          {isLoading ? (
            <div className="max-w-screen-xl mx-auto px-4">
              <div className="max-w-md mx-auto p-8">
                <div className="relative">
                  <div className="block w-full p-4 ps-10 bg-gray-200 opacity-90 dark:opacity-50 rounded-lg h-14"></div> {/* Input field placeholder */}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-7xl p-3 m-2 sm:col-span-8 md:col-span-6">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-200 animate-pulse dark:opacity-10 opacity-90"
                  />
                ))}
              </div>
            </div>

            ) : (

              <SearchGrid posts={posts}/>

          )}

      
        </main>
      
    </div>
  );
};


// import { useState, useEffect } from 'react';
// import { SearchGrid } from '../components/Search/SearchGrid';
// import { MobileNav } from '../components/StickyBars/MobileNav';
// import { Sidebar } from '../components/StickyBars/Sidebar';
// import axios from 'axios';
// import { useMediaQuery } from '../hooks/useMediaQuery';

// export const Search = ({ openCreateModal }: { openCreateModal: () => void }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [posts, setPosts] = useState<string[]>([]);
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get('/api/v1/search/images');
//         setPosts(response.data.images);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//       <div className="flex">
//         <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//           <Sidebar openCreateModal={openCreateModal} />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 md:ml-16 xl:ml-56">
//           {/* Fixed Search Bar */}
//           <div className="fixed top-0 left-0 right-0 md:left-16 xl:left-56 z-50 bg-white dark:bg-slate-900 shadow-md">
//             <div className="max-w-screen-xl mx-auto px-4 py-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search images..."
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   disabled
//                 />
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
//               </div>
//             </div>
//           </div>

//           {/* Scrollable Content (offset by header height) */}
//           <div className="max-w-screen-xl mx-auto px-4 pt-[96px] pb-6">
//             {isLoading ? (
//               <>
//                 <div className="grid grid-cols-3 gap-4 max-w-7xl p-3 m-2 sm:col-span-8 md:col-span-6">
//                   {[...Array(9)].map((_, i) => (
//                     <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <SearchGrid posts={posts} />
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
