"use client"

import type React from "react"
import { useEffect } from "react";
import { useState,  } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Clock, Trophy, Camera, Users } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { BACKEND_URL } from "../../config"
import axios from "axios"
import { useNavigate } from "react-router-dom"
// import e from "express"

interface CreateStoryModalProps {
  isOpen: boolean
  onClose: () => void
}

// const SPORT_CATEGORIES = [
//   "Basketball",
//   "Soccer",
//   "Tennis",
//   "Running",
//   "Swimming",
//   "Cycling",
//   "Golf",
//   "Rugby",
//   "Volleyball",
//   "Boxing",
//   "Gymnastics",
//   "Other",
// ]

//write handle submit function

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
  // const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [activityStarted, setActivityStarted] = useState("")
  const [activityEnded, setActivityEnded] = useState("")
  const [sport, setSport] = useState("")
  const [stadium, setStadium] = useState("")
  const [image, setImage] = useState("")
  const [participants, setParticipants] = useState<number | undefined>(undefined);
  const [locationImage, setLocationImage] = useState("")  
  const [isStartTimeInPast, setIsStartTimeInPast] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null
  //   if (file) {
  //     setSelectedFile(file)
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setPreviewUrl(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const FormField = ({ label, value, onChange, type = "text", required = false }: {
  //   label: string
  //   value: string | number
  //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  //   type?: string
  //   required?: boolean
  // }) => (
  //   <div>
  //     <label className="block text-sm font-medium dark:text-white text-black mb-1">
  //       {label}
  //     </label>
  //     <input
  //       type={type}
  //       value={value}
  //       onChange={onChange}
  //       required={required}
  //       className=" w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //     />
  //   </div>
  // )


  useEffect(() => {
    if (!activityStarted) return;

    const [hours, minutes] = activityStarted.split(":").map(Number);

    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);
    setIsStartTimeInPast(selectedDateTime.getTime() < Date.now());

  }, [activityStarted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Log form data to ensure it's correct
      const formData = {
        location,
        image,
        locationImage,
        description,
        participants,
        sport,
        activityStarted,
        activityEnded,
        stadium,
        isViewed: false,
      };
  
      console.log("Form Data being sent:", formData);
  
      // Send data to the backend
      await axios.post(`${BACKEND_URL}/api/v1/story`, formData, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
      });
  
      // Navigate after successful post
      navigate("/post");
      
      // Reset form data
      setImage("");
      setDescription("");
      setLocation("");
      setActivityStarted("");
      setActivityEnded("");
      setSport("");
      setParticipants(undefined);
      setStadium("");
      setLocationImage("");
      onClose();
    } catch (error) {
      console.error("Error submitting story:", error);
      // Handle error (e.g., show a message to the user)
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-background">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Create New Story</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Story Image Upload */}
          {/* <div className="space-y-2">
            <Label>Story Image</Label>
            {previewUrl ? (
              <div className="relative w-full border-2 border-primary rounded-lg p-4">
                <img
                  src={previewUrl}
                  alt="Story preview"
                  className="max-h-64 mx-auto object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Image className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload story image
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("story-image-upload")?.click()}
                >
                  Select image
                </Button>
                <input
                  id="story-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div> */}

          <div>
                <label className="block text-sm font-medium dark:text-white text-black mb-2">
                    <Camera className="w-4 h-4 inline mr-1 " />
                    Story Image URL *
                </label>
                <input
                  type="text"
                  name="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
              />
          </div>
          
          {/* Location image Input, rendered through api, seen the name of locaiton 
          can be used for maps later... */}
          <div>
            {/* <FormField label="Location" value={locationImage} onChange={(e) => setLocationImage(e.target.value)} /> */}
          <label className="block text-sm font-medium dark:text-white text-black mb-2">
                <Camera className="w-4 h-4 inline mr-1" />
                Location Name
            </label>
              <input
              type="text"
              name="locationImage"
              value={locationImage}
                onChange={(e) => setLocationImage(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location URL"
              />
          </div>

          {/* Title */}
          {/* <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="title"
                placeholder="Enter story title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div> */}

          {/* Description */}
          <div className="space-y-2 dark:text-white text-black">
            {/* <FormField label="Description *" value={description} onChange={(e) => setDescription(e.target.value)} /> */}
            <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your story..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className=" w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            />
          </div>

          {/* Sport Type */}
          <div>
              <label className="block text-sm font-medium  mb-2 dark:text-white text-black">
                  <Trophy className="w-4 h-4 inline mr-1 " />
                  Sport *
              </label>
              <select
                  name="sport"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className=" w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                  <option value="">Select a sport</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Tennis">Tennis</option>
              </select>
          </div>

          {/* Location, for our backend api to pexel */}
          <div className="space-y-2 dark:text-white text-black">
            <Label htmlFor="location">Location *</Label>
              <Textarea
                id="location"
                placeholder="Add location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className=" w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            />
          </div>

          <div>
            <Label htmlFor="stadium" className="dark:text-white text-black">Stadium *</Label>
              <Textarea
                id="stadium"
                placeholder="Enter stadium name..."
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className=" w-full px-3 py-2 border dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4 dark:text-white text-black">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={activityStarted}
                  onChange={(e) => setActivityStarted(e.target.value)}
                  className="pl-9  dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300"
                  required
                />
              </div>
              {isStartTimeInPast && (
                <p className="text-xs text-red-500 mt-1">Start time is in the past</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={activityEnded}
                  onChange={(e) => setActivityEnded(e.target.value)}
                  className="pl-9  dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-2 dark:text-white text-black">
            <Label htmlFor="participants">Expected Participants</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="Participants"
                type="number"
                placeholder="Enter number of participants"
                value={participants}
            //  onChange={(e) => setParticipants(parseInt(e.target.value))} //this would have given NAN
                onChange={(e) => setParticipants(+e.target.value)} // this unsure value is a number
                className="pl-9 dark:border-gray-700 dark:bg-background rounded-lg dark:text-gray-300"
                min="1"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-white"
            disabled={ /*!isloading, was for when image was uploaded form device... */!image || !description || !location || !activityStarted || !activityEnded|| !sport }
          >
            {isLoading ? "Creating story..." : "Share Story"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


// import { useState, useRef } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";
// import { useNavigate } from "react-router-dom";
// import { Sidebar } from "../../components/StickyBars/Sidebar";

// import { Camera, MapPin, X, Upload, Trophy, Link as LinkIcon, FileText } from 'lucide-react';




// export const CreateStoryModal = ({openCreateModal}: {openCreateModal: () => void}) => {
//     const [formData, setFormData] = useState({
//         location: "",
//         image: "",
//         locationImage: "",
//         description: "",
//         participants: "",
//         sport: "",
//         activityStarted: "",
//         activityEnded: "",
//         stadium: "",
//     });
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const navigate = useNavigate();

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleDragOver = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const file = e.dataTransfer.files[0];
//         if (file && file.type.startsWith('image/')) {
//             handleImageSelect(file);
//         }
//     };

//     const handleImageSelect = (file: File) => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImagePreview(reader.result as string);
//             setFormData(prev => ({ ...prev, locationImage: reader.result as string }));
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             handleImageSelect(file);
//         }
//     };

//     const handleSubmit = async () => {
        
//         if (new Date(formData.activityEnded) <= new Date(formData.activityStarted)) {
//             alert("Activity Ended time must be after Activity Started time.");
//             return;
//         }

//         try {
//             setIsLoading(true);
//             await axios.post(`${BACKEND_URL}/api/v1/story`, {
//                 ...formData,
//                 isViewed: false
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 }
//             });
//             navigate(`/post`);
//         } catch (error) {
//             console.error('Error publishing story:', error);
//             // Handle error appropriately
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const isFormValid = formData.location && formData.image && formData.description && 
//                        formData.sport && formData.stadium && formData.activityStarted && formData.activityEnded;

//     return (
//         <div className="flex flex-row  bg-gray-50">
//             <div className="pt-6 px-4 md:pt-8 md:px-8">
//                 <Sidebar openCreateModal={openCreateModal} />
//             </div>

//             <div className="flex-1 p-4 md:p-8">
//                 <div className="max-w-3xl mx-auto">
//                     <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Story</h1>
                    
//                     <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-6">
//                         {/* Image Upload Section */}
//                         <div
//                             className={`relative h-72 md:h-96 rounded-lg border-2 border-dashed transition-colors ${
//                                 isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//                             } ${!imagePreview ? 'flex flex-col items-center justify-center' : ''}`}
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                         >
//                             {imagePreview ? (
//                                 <>
//                                     <img
//                                         src={imagePreview}
//                                         alt="Preview"
//                                         className="w-full h-full object-contain rounded-lg"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setImagePreview(null);
//                                             setFormData(prev => ({ ...prev, locationImage: "" }));
//                                         }}
//                                         className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
//                                     >
//                                         <X className="w-5 h-5" />
//                                     </button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
//                                     <p className="text-gray-600 mb-2 text-center">Drag and drop your image here</p>
//                                     <button
//                                         type="button"
//                                         onClick={() => fileInputRef.current?.click()}
//                                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                                     >
//                                         Select Image
//                                     </button>
//                                 </>
//                             )}
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                             />
//                         </div>

//                         {/* Manual Image URL Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Camera className="w-4 h-4 inline mr-1" />
//                                 Image URL
//                             </label>
//                             <input
//                                 type="text"
//                                 name="image"
//                                 value={formData.image}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter image URL"
//                             />
//                         </div>

//                         {/* Location image Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Camera className="w-4 h-4 inline mr-1" />
//                                 Location URL
//                             </label>
//                             <input
//                                 type="text"
//                                 name="locationImage"
//                                 value={formData.locationImage}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter location URL"
//                             />
//                         </div>

//                         {/* Location Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <MapPin className="w-4 h-4 inline mr-1" />
//                                 Location
//                             </label>
//                             <input
//                                 type="text"
//                                 name="location"
//                                 value={formData.location}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter location"
//                             />
//                         </div>

//                         {/* Activity Started Input */}
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             <Camera className="w-4 h-4 inline mr-1" />
//                             Activity Started At
//                         </label>
//                         <input
//                             type="datetime-local"
//                             name="activityStarted"
//                             value={formData.activityStarted}
//                             onChange={handleInputChange}
//                             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Activity Started"
//                         />

//                         {/* Activity Ended Input */}
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             <Camera className="w-4 h-4 inline mr-1" />
//                             Activity Ended At
//                         </label>
//                         <input
//                             type="datetime-local"
//                             name="activityEnded"
//                             value={formData.activityEnded}
//                             onChange={handleInputChange}
//                             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Activity Ended"
//                         />

//                         {/* Sport Selection */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Trophy className="w-4 h-4 inline mr-1" />
//                                 Sport
//                             </label>
//                             <select
//                                 name="sport"
//                                 value={formData.sport}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">Select a sport</option>
//                                 <option value="Cricket">Cricket</option>
//                                 <option value="Football">Football</option>
//                                 <option value="Basketball">Basketball</option>
//                                 <option value="Baseball">Baseball</option>
//                                 <option value="Tennis">Tennis</option>
//                             </select>
//                         </div>

//                         {/* Stadium Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <MapPin className="w-4 h-4 inline mr-1" />
//                                 Stadium
//                             </label>
//                             <input
//                                 type="text"
//                                 name="stadium"
//                                 value={formData.stadium}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter stadium name"
//                             />
//                         </div>

//                         {/* Description Textarea */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <FileText className="w-4 h-4 inline mr-1" />
//                                 Description
//                             </label>
//                             <textarea
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 rows={4}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Write your story description..."
//                             />
//                         </div>

//                         {/* Event Link Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <LinkIcon className="w-4 h-4 inline mr-1" />
//                                 Event Link (Optional)
//                             </label>
//                             <input
//                                 type="url"
//                                 name="participants"
//                                 value={formData.participants}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="https://example.com/event"
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <div className="flex justify-end pt-4">
//                             <button
//                                 onClick={handleSubmit}
//                                 disabled={isLoading || !isFormValid}
//                                 className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isLoading ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Publishing...
//                                     </span>
//                                 ) : (
//                                     'Publish Story'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };