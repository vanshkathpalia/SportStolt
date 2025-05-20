"use client"

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useEvents } from "../hooks";
import { Sidebar } from "../components/StickyBars/Sidebar";
import { EventCard } from "../components/Event/EventCard";
import { MobileNav } from "../components/StickyBars/MobileNav";
import { useMediaQuery } from "../hooks/useMediaQuery";

export const EventsPage = ({ openCreateModal }: { openCreateModal: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, events } = useEvents();
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredEvents = events.filter(event =>
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-16 xl:ml-56">
          <div className="max-w-screen-lg mx-auto px-4 py-6">
          
            <div className="flex justify-between items-center mb-4">
  
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h1>

              {/* Create Button */}
              <button
                onClick={openCreateModal}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus size={16} />
                Create Event
              </button>
            </div>

            {/* Loading Skeletons */}
            {/* Search Bar */}
            <div className="relative w-full mb-8">
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
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

// import { useState } from 'react';
// import { EventCard } from '../components/Event/EventCard';
// import { Search, Plus } from 'lucide-react';
// import { useEvents } from '../hooks';
// import { Sidebar } from '../components/StickyBars/Sidebar';

// export const EventsPage = ({openCreateModal}: {openCreateModal: () => void}) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const { loading, events } = useEvents();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="grid grid-cols-1 md:grid-cols-5">
//           <div className="pt-6 px-4 col-span-1">
//             <Sidebar openCreateModal={openCreateModal}/>
//           </div>
//           <div className="col-span-1 md:col-span-4 p-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (

//     // <div className="min-h-screen bg-background">
//     //   {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//     //   <div className="flex">
//     //     <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//     //       <Sidebar openCreateModal={openCreateModal} />
//     //     </div>
//     <div className="min-h-screen bg-gray-50">
//       <div className="grid grid-cols-1 md:grid-cols-6">
//         <div className="pt-6 px-4 col-span-1">
//           <Sidebar openCreateModal={openCreateModal}/>
//         </div>
        
//         <div className="col-span-1 md:col-span-4">
//           <div className="space-y-6 p-4 sm:p-6 lg:p-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
//               <button 
//                 onClick={() => {window.location.href = '/addevent'}}
//                 className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Plus className="w-5 h-5" />
//                 <span>Create Event</span>
//               </button>
//             </div>
    
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search events by name or location..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white"
//               />
//             </div>
  
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {events.map((event, index) => (
//                 <EventCard
//                   key={index}
//                   event={event}
//                   onRegister={() => alert('Registration functionality coming soon!')}
//                 />
//               ))}
//             </div>

//             {events.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">No events found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// // "use client"

// import { useState, useEffect } from "react"
// import { useMediaQuery } from "../hooks/useMediaQuery"
// import { Input } from "../components/ui/input"
// import { Search, Calendar, MapPin, Plus } from "lucide-react"
// import { Button } from "../components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
// // import { CreateEventModal } from "../components/modals/CreateEventModal"

// // Mock data
// import { COMPETITIONS } from "../mockData/Competitions"
// import { MobileNav } from "../components/StickyBars/MobileNav"
// import { Sidebar } from "../components/StickyBars/Sidebar"

// // Sport categories for filtering
// const SPORT_CATEGORIES = [
//   "All",
//   "Basketball",
//   "Soccer",
//   "Tennis",
//   "Running",
//   "Swimming",
//   "Cycling",
//   "Golf",
//   "Rugby",
//   "Volleyball",
// ]

// interface CompetitionsPageProps {
//   openCreateModal: () => void
// }

// export const EventsPage = ({ openCreateModal }: CompetitionsPageProps) => {
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedSport, setSelectedSport] = useState("All")
//   const [selectedDate, setSelectedDate] = useState("all")
//   // const [createEventModalOpen, setCreateEventModalOpen] = useState(false)
//   const isMobile = useMediaQuery("(max-width: 768px)")

//   // Filter events based on search query, sport, and date
//   const filteredEvents = COMPETITIONS.filter((event) => {
//     const matchesSearch =
//       searchQuery === "" ||
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.location.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesSport = selectedSport === "All" || event.sportType === selectedSport

//     // Simple date filtering logic
//     let matchesDate = true
//     const eventDate = new Date(event.date)
//     const today = new Date()

//     if (selectedDate === "today") {
//       matchesDate = eventDate.toDateString() === today.toDateString()
//     } else if (selectedDate === "week") {
//       const nextWeek = new Date(today)
//       nextWeek.setDate(today.getDate() + 7)
//       matchesDate = eventDate >= today && eventDate <= nextWeek
//     } else if (selectedDate === "month") {
//       const nextMonth = new Date(today)
//       nextMonth.setMonth(today.getMonth() + 1)
//       matchesDate = eventDate >= today && eventDate <= nextMonth
//     }

//     return matchesSearch && matchesSport && matchesDate
//   })

//   useEffect(() => {
//     // Simulate loading data
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Header - Only visible on mobile */}
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//       <div className="flex">
//         {/* Sidebar - Hidden on mobile */}
//         <div className="hidden md:block w-16 lg:w-64 fixed h-screen">
//           <Sidebar openCreateModal={openCreateModal} />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 md:ml-16 lg:ml-64 pb-16 md:pb-8">
//           <div className="max-w-screen-xl mx-auto p-4">
//             {/* Page Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold">Competitions & Events</h1>
//               <Button
//                 // onClick={() => setCreateEventModalOpen(true)}
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Event
//               </Button>
//             </div>

//             {/* Search and Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div className="md:col-span-2 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   type="text"
//                   placeholder="Search events"
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>

//               <Select value={selectedSport} onValueChange={setSelectedSport}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Sport" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {SPORT_CATEGORIES.map((sport) => (
//                     <SelectItem key={sport} value={sport}>
//                       {sport}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedDate} onValueChange={setSelectedDate}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Date" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Dates</SelectItem>
//                   <SelectItem value="today">Today</SelectItem>
//                   <SelectItem value="week">This Week</SelectItem>
//                   <SelectItem value="month">This Month</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Events List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {loading ? (
//                 // Loading skeletons
//                 Array(6)
//                   .fill(0)
//                   .map((_, index) => (
//                     <Card key={index} className="overflow-hidden">
//                       <div className="h-40 bg-muted animate-pulse" />
//                       <CardHeader className="pb-2">
//                         <div className="h-6 bg-muted rounded animate-pulse w-3/4 mb-2" />
//                         <div className="h-4 bg-muted rounded animate-pulse w-full" />
//                       </CardHeader>
//                       <CardContent className="space-y-2">
//                         <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
//                         <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
//                       </CardContent>
//                     </Card>
//                   ))
//               ) : filteredEvents.length > 0 ? (
//                 // Actual events
//                 filteredEvents.map((event) => (
//                   <Card key={event.id} className="overflow-hidden">
//                     <div className="h-40 relative">
//                       <img
//                         src={event.image || "/placeholder.svg"}
//                         alt={event.title}
//                         className="w-full h-full object-cover"
//                       />
//                       <Badge className="absolute top-2 right-2 bg-green-500">{event.sportType}</Badge>
//                     </div>
//                     <CardHeader className="pb-2">
//                       <div className="flex justify-between items-start">
//                         <CardTitle className="text-lg">{event.title}</CardTitle>
//                       </div>
//                       <CardDescription>{event.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-2 pb-2">
//                       <div className="flex items-center text-sm">
//                         <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
//                         <span>
//                           {event.date} • {event.time}
//                         </span>
//                       </div>
//                       <div className="flex items-center text-sm">
//                         <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
//                         <span>{event.location}</span>
//                       </div>
//                     </CardContent>
//                     <CardFooter className="flex justify-between pt-0">
//                       <div className="flex items-center">
//                         <Avatar className="h-6 w-6 mr-2">
//                           <AvatarImage src={event.organizer.avatar} />
//                           <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <span className="text-xs text-muted-foreground">{event.organizer.name}</span>
//                       </div>
//                       <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
//                         Join
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))
//               ) : (
//                 // No results
//                 <div className="col-span-full flex flex-col items-center justify-center py-12">
//                   <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-medium">No events found</h3>
//                   <p className="text-muted-foreground">Try different search criteria or create a new event</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Create Event Modal */}
//       {/* <CreateEventModal isOpen={createEventModalOpen} onClose={() => setCreateEventModalOpen(false)} /> */}
//     </div>
//   )
// }


