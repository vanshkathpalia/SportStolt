import { useState } from 'react';
import { EventCard } from '../components/Event/EventCard';

import { Search, Plus } from 'lucide-react';
import { useEvents } from '../hooks';
// import { Appbar } from '../components/StickyBars/Appbar';
import { Sidebar } from '../components/StickyBars/Sidebar';



export const Events = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const {loading, events} = useEvents();
  
    // const filteredEvents = events.filter(event => //use evet usestate for event
    //   event.stadium.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   event.city.toLowerCase().includes(searchQuery.toLowerCase())
    // );

  if(loading) {
    return <div>
      loading...
      {/* {events.map(event => ( <EventCard
        events={event}
      />))} */}
    </div>
  }

  else {
    return (
    <div className="flex-row grid grid-cols-5">
      <div className = "pt-6 px-4" >
          <Sidebar />
      </div>
      <div className="col-span-2 sm:col-span-4 md:col-span-4 lg:col-span-3">
        <div className="space-y-8 p-14">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Upcoming Events</h1>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>
    
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
        <div className="grid grid-cols-1 gap-6">
        {events.map(event => (
          <EventCard
            event={event}
            onRegister={() => alert('Registration functionality coming soon!')}
          />
        ))}

        </div>
        </div>
      </div>
    </div>
    );
  }
}

// export const Events = () => {
//   return <div>
//     here is the events
//   </div>
// }

//md:grid-cols-2 lg:grid-cols-3