// import { useState, useEffect } from "react"
// import axios from "axios"
// import { BACKEND_URL } from "../config"
// import { useNavigate } from "react-router-dom"

// export function useStoryForm(onSuccess: () => void) {
//   const [description, setDescription] = useState("")
//   const [location, setLocation] = useState("")
//   const [activityStarted, setActivityStarted] = useState("")
//   const [activityEnded, setActivityEnded] = useState("")
//   const [sport, setSport] = useState("")
//   const [stadium, setStadium] = useState("")
//   const [image, setImage] = useState("")
//   const [participants, setParticipants] = useState<number | undefined>(undefined)
//   const [locationImage, setLocationImage] = useState("")
//   const [isStartTimeInPast, setIsStartTimeInPast] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const navigate = useNavigate()

//   useEffect(() => {
//     if (!activityStarted) return

//     const [hours, minutes] = activityStarted.split(":").map(Number)

//     const selectedDateTime = new Date()
//     selectedDateTime.setHours(hours, minutes, 0, 0)
//     setIsStartTimeInPast(selectedDateTime.getTime() < Date.now())
//   }, [activityStarted])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const formData = {
//         location,
//         image,
//         locationImage,
//         description,
//         participants,
//         sport,
//         activityStarted,
//         activityEnded,
//         stadium,
//         viewed: false,
//       }

//       console.log("Form Data being sent:", formData)

//       await axios.post(`${BACKEND_URL}/api/v1/story`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       navigate("/post")
//       onSuccess()

//       // Reset form fields
//       setImage("")
//       setDescription("")
//       setLocation("")
//       setActivityStarted("")
//       setActivityEnded("")
//       setSport("")
//       setParticipants(undefined)
//       setStadium("")
//       setLocationImage("")
//     } catch (error) {
//       console.error("Error submitting story:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return {
//     description,
//     setDescription,
//     location,
//     setLocation,
//     activityStarted,
//     setActivityStarted,
//     activityEnded,
//     setActivityEnded,
//     sport,
//     setSport,
//     stadium,
//     setStadium,
//     image,
//     setImage,
//     participants,
//     setParticipants,
//     locationImage,
//     setLocationImage,
//     isStartTimeInPast,
//     isLoading,
//     handleSubmit,
//   }
// }
