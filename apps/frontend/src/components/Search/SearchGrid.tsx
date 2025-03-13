
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MessageCircle } from 'lucide-react';
import { Sidebar } from '../StickyBars/Sidebar';

interface SearchGridProps {
  isLoading?: boolean;
}

export const SearchGrid = ({ isLoading }: SearchGridProps) => {
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(isLoading ?? true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/v1/search/images');
        console.log('Fetched images:', response.data.images); // Debugging
        setPosts(response.data.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-8">
        <div className="pt-6 px-4 col-span-1">
          <Sidebar />
        </div>
        <div className="grid grid-cols-3 gap-2 p-10 sm:col-span-8 md:col-span-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8">
      <div className="pt-6 px-4 col-span-1">
        <Sidebar />
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-7xl p-10 sm:col-span-8 md:col-span-6">
        {posts.map((post, index) => (
          <div key={index} className="relative group aspect-square">
            <img src={post} alt={`Post ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="w-6 h-6" />
                  <span className="font-semibold">2.5k</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-semibold">124</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Heart, MessageCircle } from 'lucide-react';
// import { Sidebar } from '../StickyBars/Sidebar';
// import { BACKEND_URL } from '../../config';
// import { MobileNav } from '../StickyBars/MobileNav';
// import useIsMobile  from '../../hooks/useIsMobile';

// interface SearchGridProps {
//   isLoading?: boolean;
// }

// export const SearchGrid = ({ isLoading }: SearchGridProps) => {
//   const [posts, setPosts] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(isLoading ?? true);
//   const isMobile = useIsMobile();

//   useEffect(() => {
    
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/v1/search/images`);
//         console.log('Full API Response:', response.data); // Log full response
  
//         if (response.data && response.data.images) {
//           console.log('Fetched images:', response.data.images); // Confirm images exist
//           setPosts(response.data.images);
//         } else {
//           console.error('Invalid API response:', response.data);
//           setPosts([]); // Set an empty array to avoid breaking the UI
//         }
//       } catch (error) {
//         console.error('Error fetching images:', error);
//         setPosts([]);
//       } finally {
//         setLoading(false);
//       }
    
//     // try {
//     //     const response = await fetch('http://localhost:8787/api/v1/search/images', {
//     //           method: 'GET',
//     //           headers: { 'Content-Type': 'application/json' },
//     //     });
//     //     const data = await response.json();
//     //     if (data && data.images) {
//     //             console.log('Fetched images:', data.images); // Confirm images exist
//     //             setPosts(data.images);
//     //             setLoading(false);
//     //           } else {
//     //             console.error('Invalid API response:', data);
//     //             setPosts([]); // Set an empty array to avoid breaking the UI
//     //           }
//     //   } catch (error) {
//     //       console.error('Error updating story view status:', error);
//     //       setPosts([]);
//     //   }

//     };
//     fetchImages();
//   }, []);


//   if (loading) {
//     return (
//       <div className="grid grid-cols-8">
//         <div className="pt-6 px-4 col-span-1">
//           <Sidebar />
//         </div>
//         <div className="grid grid-cols-3 gap-2 p-10 sm:col-span-8 md:col-span-6">
//           {[...Array(9)].map((_, i) => (
//             <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!posts.length) {
//     return (
//       <div className="flex">
//         <div className = "hidden sm:block w-16 lg:w-64 fixed h-screen" >
//             {!isMobile && <Sidebar />}
//         </div>

//         <div className="min-h-screen bg-background">
//           {isMobile && <MobileNav />}
//         </div>
//         <div className="col-span-7 flex items-center justify-center p-10">
//           <p className="text-gray-500">No images found.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-8">
//       <div className = "hidden sm:block w-16 lg:w-64 fixed h-screen" >
//             {!isMobile && <Sidebar />}
//         </div>

//         <div className="min-h-screen bg-background">
//           {isMobile && <MobileNav />}
//         </div>
//       <div className="grid grid-cols-3 gap-2 max-w-7xl p-10 md:col-span-8 sm:col-span-6">
//         {posts.map((post, index) => (
//           <div key={index} className="relative group aspect-square">
//             <img src={post} alt={`Post ${index + 1}`} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
//               <div className="flex gap-6 text-white">
//                 <div className="flex items-center gap-1">
//                   <Heart className="w-6 h-6" />
//                   <span className="font-semibold">2.5k</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <MessageCircle className="w-6 h-6" />
//                   <span className="font-semibold">124</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };