import React from 'react';
import { EventType } from '../../hooks/types'; // Make sure this path is correct

interface EventGridProps {
  isLoading?: boolean;
  events: EventType[];
}

export const EventGrid: React.FC<EventGridProps> = ({ isLoading, events }) => {
  if (isLoading) {
    return (
      // 
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[180px] w-full bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <p className="text-center text-gray-400 pt-20">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="border rounded-lg p-4 shadow hover:shadow-md transition duration-200 dark:bg-slate-300 bg-white"
        >
          <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
          <p className="text-sm text-gray-600  mb-1">📍 {event.city} — {event.stadium}</p>
          <p className="text-sm text-gray-600 mb-1">
            📅 <span>{event.timing}</span>  
          </p>
          {/* this is giving the same time always, don't know why */}
          {/* <p className="text-sm text-gray-600 mb-1">
            🕒 Starts: {new Date(event.startDate).toLocaleDateString('en-GB')} at{' '}
            {new Date(event.startDate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p> */}
          <p className="text-sm text-gray-600 mb-2">
            🔚 Ends: {new Date(event.endDate).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600  mb-2">👤 Organised By: {event.organisedBy}</p>
          {event.description && (
            <p className="text-sm text-gray-700">{event.description}</p>
          )}
          <p
            className={`mt-2 text-xs font-semibold ${
              event.status === 'completed'
                ? 'text-gray-500'
                : event.status === 'ongoing'
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </p>
        </div>
      ))}
    </div>
  );
};
