import { useState } from 'react';
import { EventCard } from '../components/Event/EventCard';
import { Search, Plus } from 'lucide-react';
import { useEvents } from '../hooks';
import { Sidebar } from '../components/StickyBars/Sidebar';

export const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, events } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="pt-6 px-4 col-span-1">
            <Sidebar />
          </div>
          <div className="col-span-1 md:col-span-4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div className="pt-6 px-4 col-span-1">
          <Sidebar />
        </div>
        
        <div className="col-span-1 md:col-span-4">
          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
              <button 
                onClick={() => {window.location.href = '/addevent'}}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  event={event}
                  onRegister={() => alert('Registration functionality coming soon!')}
                />
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};