import { Heart, MessageCircle } from 'lucide-react';

interface SearchGridProps {
  posts: string[];
}

export const SearchGrid = ({ posts }: SearchGridProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Search Bar */}
      <div className="sticky top-14 md:top-0 z-20 bg-background md:p-4 border-b-inherit border-gray-300">
        <div className="max-w-screen-xl mx-auto px-4 py-4 bg-background">
          <form className="max-w-md mx-auto">
            <label htmlFor="default-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..." required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 max-w-7xl p-4 m-2 sm:col-span-8 md:col-span-6">
          {posts.map((post, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={post} alt={`Post ${index + 1}`} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
    </div>
  );
};
