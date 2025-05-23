// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import { Label } from "../ui/label"
// import { useEventForm } from "../../hooks/useEventForm"

// interface EventFormProps {
//   onSuccess: () => void
// }

// export function EventForm({ onSuccess }: EventFormProps) {
//   const {
//     title,
//     setTitle,
//     startDate,
//     setStartDate,
//     endDate,
//     setEndDate,
//     startTime,
//     setStartTime,
//     stadium,
//     setStadium,
//     city,
//     setCity,
//     country,
//     setCountry,
//     state,
//     setState,
//     sport,
//     setSport,
//     participants,
//     setParticipants,
//     organisedBy,
//     setOrganisedBy,
//     image,
//     setImage,
//     isLoading,
//     handleSubmit,
//   } = useEventForm(onSuccess)

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Title *</Label>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Start Date *</Label>
//         <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">End Date *</Label>
//         <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Start Time *</Label>
//         <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Stadium *</Label>
//         <Input value={stadium} onChange={(e) => setStadium(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">City *</Label>
//         <Input value={city} onChange={(e) => setCity(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">State *</Label>
//         <Input value={state} onChange={(e) => setState(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Country *</Label>
//         <Input value={country} onChange={(e) => setCountry(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Organised By *</Label>
//         <Input value={organisedBy} onChange={(e) => setOrganisedBy(e.target.value)} required />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Sport *</Label>
//         <select
//           value={sport}
//           onChange={(e) => setSport(e.target.value)}
//           className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-900 rounded-lg dark:text-gray-300"
//           required
//         >
//           <option value="">Select sport</option>
//           <option value="Football">Football</option>
//           <option value="Cricket">Cricket</option>
//           <option value="Basketball">Basketball</option>
//           <option value="Tennis">Tennis</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Participants (optional)</Label>
//         <Input
//           type="number"
//           value={participants ?? ""}
//           onChange={(e) => setParticipants(Number(e.target.value))}
//         />
//       </div>

//       <div>
//         <Label className="block text-sm font-medium dark:text-white text-black mb-1">Image URL *</Label>
//         <Input value={image} onChange={(e) => setImage(e.target.value)} required />
//       </div>

//       <Button
//         type="submit"
//         className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-white"
//         disabled={
//           !title || !startDate || !endDate || !startTime || !stadium || !city ||
//           !state || !country || !organisedBy || !sport || !image
//         }
//       >
//         {isLoading ? "Creating story..." : "Share Story"}
//       </Button>
//     </form>
//   )
// }
