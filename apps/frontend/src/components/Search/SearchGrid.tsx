

import { Heart, MessageCircle } from 'lucide-react';

interface SearchGridProps {
  posts: string[];
}


export const SearchGrid = ({ posts }: SearchGridProps) => {

  return (
    <div className="min-h-screen bg-background">
        

        {/* Main Content */}
        
          <div className="max-w-screen-xl mx-auto px-4">

          <form className ="max-w-md mx-auto p-8">   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
                  <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
              </div>
          </form>
          
          <div className="grid grid-cols-3 gap-4 max-w-7xl p-3 m-2 sm:col-span-8 md:col-span-6">
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

          

            {/* Loading Skeletons */}
            {/* Search Bar */}
            {/* <div className="relative w-full mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events... by name or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center text-gray-500 text-lg mt-8">
                No events currently.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onRegister={() => alert('Registration functionality coming soon!')} 
                  />
                ))}
              </div>
            )} */}

          </div>
      </div>
  // return (
  //   <div className="grid grid-cols-8">
  //         {isMobile && <MobileNav openCreateModal={openCreateModal} />}
  //         <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
  //           <Sidebar openCreateModal={openCreateModal} />
  //         </div>
      
  //   </div>
  );
};



