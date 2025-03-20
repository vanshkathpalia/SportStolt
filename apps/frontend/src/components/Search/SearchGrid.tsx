
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, MessageCircle } from 'lucide-react';
import { Sidebar } from '../StickyBars/Sidebar';

interface SearchGridProps {
  isLoading?: boolean;
  openCreateModal: () => void;
}

export const SearchGrid = ({ isLoading, openCreateModal }: SearchGridProps) => {
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
          <Sidebar openCreateModal={() => {}}/>
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
        <Sidebar openCreateModal={openCreateModal}/>
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

