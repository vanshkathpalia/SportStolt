import { Calendar, Users } from 'lucide-react';
import type { EventInterface } from '../../hooks';
import { useState } from 'react';
import { BACKEND_URL } from '../../config';

interface EventCardProps {
  event: EventInterface;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(event.isRegistered ?? false);

  const handleRegister = async (eventId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/v1/event/${eventId}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert(data.message);
      setIsRegistered(true); // ✅ Mark as registered
    } catch (err) {
      alert("Something went wrong while registering.");
      console.error(err);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
      <img src={event.imageUrl} alt={event.location} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{event.location}</h3>
          <span className="bg-blue-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {new Date(event.publishedDate).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-8 h-8" />
            <span>{event.timing}</span> {/* Contains start and end info */}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>Organized by: {event.author.name}</span>
          </div>
        </div>

        {isRegistered ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Register Done 
          </button>
        ) : (
          <button
            onClick={() => handleRegister(event.id)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register for Event
          </button>
        )}


        {/* <button
          onClick={onRegister}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register for Event
        </button> */}
      </div>
    </div>
  );
};

// import { Calendar, MapPin, Users } from 'lucide-react';
// import type { EventInterface } from '../../hooks';
// // import { format } from 'path';
// // import { format } from 'date-fns';

// interface EventCardProps {
//   event: EventInterface;
//   onRegister?: () => void;
// }

// export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
//       <img src={event.image} alt={event.city} className="w-full h-48 object-cover" />
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-semibold">{event.name}</h3> {/* Display event name */}
//           <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
//             {event.startDate && (
//               <>
//                 {new Date(event.startDate).toLocaleDateString()} {/* Format startDate */}
//               </>
//             )}
//           </span>
//         </div>

//         <div className="space-y-3 mb-6">
//           <div className="flex items-center gap-2 text-gray-600">
//             <Calendar className="w-5 h-5" />
//             <span>{new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</span> {/* Display start and end time */}
//           </div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <MapPin className="w-5 h-5" />
//             <span>{event.stadium}, {event.city}</span> {/* Display stadium and city */}
//           </div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <Users className="w-5 h-5" />
//             <span>Organized by: {event.organisedBy}</span> {/* Display organizer name */}
//           </div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <span>Country: {event.country}</span> {/* Display country */}
//           </div>
//           <div className="flex items-center gap-2 text-gray-600">
//             <span>State: {event.state}</span> {/* Display state */}
//           </div>
//         </div>

//         <button
//           onClick={onRegister}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Register for Event
//         </button>
//       </div>
//     </div>
//   );
// }

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