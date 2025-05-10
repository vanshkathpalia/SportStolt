import { useState, useEffect } from 'react';
import { SearchGrid } from '../components/Search/SearchGrid';
import { MobileNav } from '../components/StickyBars/MobileNav';
import { Sidebar } from '../components/StickyBars/Sidebar';
import axios from 'axios';
import { useMediaQuery } from '../hooks/useMediaQuery';


export const Search = ({openCreateModal}: {openCreateModal: () => void}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)")


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/v1/search/images');
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

        <main className="flex-1 md:ml-16 xl:ml-56">

          {isLoading ? (
            <div className="max-w-screen-xl mx-auto px-4">
              <div className="max-w-md mx-auto p-8">
                  <div className="relative">
                    <div className="block w-full p-4 ps-10 bg-gray-300 rounded-lg h-14"></div> {/* Input field placeholder */}
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-7xl p-3 m-2 sm:col-span-8 md:col-span-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
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