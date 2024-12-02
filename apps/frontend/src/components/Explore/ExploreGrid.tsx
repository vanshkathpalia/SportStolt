
import { Heart, MessageCircle } from 'lucide-react';
import { Sidebar } from '../StickyBars/Sidebar';
// import { Appbar } from '../StickyBars/Appbar';

interface ExploreGridProps {
  isLoading?: boolean;
}

export const ExploreGrid = ({ isLoading } : ExploreGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-8">
        <div className = "pt-6 px-4 col-span-1" >
          <Sidebar />
        </div>
        <div className="grid grid-cols-3 gap-2 p-10 sm:col-span-8 md:col-span-6">
          {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  

  const posts = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd',
    'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1',
    'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
  ].map(url => `${url}?w=600&h=600&fit=crop`);

  return ( <div className="grid grid-cols-8">
    <div className = "pt-6 px-4 col-span-1" >
      <Sidebar />
    </div>
    <div className="grid grid-cols-3 gap-2 max-w-7xl p-10 sm:col-span-8 md:col-span-6">
      {posts.map((post, index) => (
        <div key={index} className="relative group aspect-square">
          <img
            src={post}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover"
          />
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