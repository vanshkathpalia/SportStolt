// // hooks/useEventForm.ts
// import { useState } from "react"
// import axios from "axios"
// import { BACKEND_URL } from "../config"

// export function useEventForm(onSuccess: () => void) {
//   const [title, setTitle] = useState("")
//   const [startDate, setstartDate] = useState("")
//   const [endDate, setendDate] = useState("")
//   const [startTime, setstartTime] = useState("")
//   const [stadium, setStadium] = useState("")
//   const [city, setCity] = useState("")
//   const [state, setState] = useState("")
//   const [country, setCountry] = useState("")
//   const [sport, setSport] = useState("")
//   const [participants, setParticipants] = useState<number | undefined>()
//   const [organisedBy, setOrganisedBy] = useState("")
//   const [image, setImage] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       await axios.post(
//         `${BACKEND_URL}/api/v1/events`,
//         {
//           title,
//           startDate,
//           endDate,
//           startTime,
//           stadium,
//           city,
//           state,
//           country,
//           sport,
//           participants,
//           organisedBy,
//           image,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       )

//       // Reset form
//       setTitle("")
//       setstartDate("")
//       setendDate("")
//       setstartTime("")
//       setStadium("")
//       setCity("")
//       setState("")
//       setCountry("")
//       setSport("")
//       setParticipants(undefined)
//       setOrganisedBy("")
//       setImage("")

//       onSuccess()
//     } catch (error) {
//       console.error("Error creating event:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return {
//     title,
//     setTitle,
//     startDate,
//     setstartDate,
//     endDate,
//     setendDate,
//     startTime,
//     setstartTime,
//     stadium,
//     setStadium,
//     city,
//     setCity,
//     state,
//     setState,
//     country,
//     setCountry,
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
//   }
// }
