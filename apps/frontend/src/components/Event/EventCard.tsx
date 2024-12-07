
import { Calendar, MapPin, Users } from 'lucide-react';
import type { EventInterface } from '../../hooks';
// import { format } from 'path';
// import { format } from 'date-fns';

interface EventCardProps {
  event: EventInterface;
  onRegister?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">los angles </h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {/* {format(event.startTime, 'MMM d, yyyy')} */} 7-02-2024
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            {/* <span>{format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}</span> */}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>{event.stadium}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>{event.organisedBy} </span>
          </div>
        </div>
        
        <button
          onClick={onRegister}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register for Event
        </button>
      </div>
    </div>
  );
}

// {format(event.startTime, 'h:mm a')} - {format(event.eTime, 'h:mm a')}


{/* <div className=""> */}
{/* {event.city}
<button
  onClick={onRegister}
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
>
  Register for Event
</button> */}
{/* 
<div className="bg-white rounded-lg shadow-md overflow-hidden">
<div className='p-6'>
<div className="flex items-center justify-between mb-4">
  <h3 className="text-xl font-semibold">{event.city}</h3>
  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
    7-10-12
  </span>
</div>

<div className="space-y-3 mb-6">
  <div className="flex items-center gap-2 text-gray-600">
    <Calendar className="w-5 h-5" />
    <span>yes</span>
  </div>
  <div className="flex items-center gap-2 text-gray-600">
    <MapPin className="w-5 h-5" />
    <span>{event.stadium}, {event.city}</span>
  </div>
  <div className="flex items-center gap-2 text-gray-600">
    <Users className="w-5 h-5" />
    <span>{event.organisedBy}</span>
  </div>
</div>

<button
  onClick={onRegister}
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
>
  Register for Event
</button>
</div>
</div>
</div> */}