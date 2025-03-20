"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { MapPin, Clock, Users, Image, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface CreateStoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const SPORT_CATEGORIES = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Running",
  "Swimming",
  "Cycling",
  "Golf",
  "Rugby",
  "Volleyball",
  "Boxing",
  "Gymnastics",
  "Other",
]

//write handle submit function

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [sportType, setSportType] = useState("")
  const [participants, setParticipants] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically send the data to your backend
      const formData = {
        title,
        description,
        location,
        startTime,
        endTime,
        sportType,
        participants: parseInt(participants),
        file: selectedFile,
      }

      console.log('Creating story:', formData)
      // Add your API call here
      // await createStory(formData)

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setStartTime("")
      setEndTime("")
      setSportType("")
      setParticipants("")
      setSelectedFile(null)
      setPreviewUrl(null)

      onClose()
    } catch (error) {
      console.error('Error creating story:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Story Image Upload */}
          <div className="space-y-2">
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
          </div>

          {/* Title */}
          <div className="space-y-2">
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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Sport Type */}
          <div className="space-y-2">
            <Label htmlFor="sportType">Sport Type</Label>
            <Select value={sportType} onValueChange={setSportType} required>
              <SelectTrigger id="sportType" className="w-full">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORT_CATEGORIES.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants">Expected Participants</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="participants"
                type="number"
                placeholder="Enter number of participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="pl-9"
                min="1"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !title || !description || !location || !startTime || !endTime || !sportType || !selectedFile}
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
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router-dom";
// // import { Sidebar } from "../components/StickyBars/Sidebar";
// import { Camera, MapPin, X, Upload, Trophy, Link as LinkIcon, FileText } from 'lucide-react';
// // import { Appbar } from "../components/StickyBars/Appbar";
// import { Sidebar } from "../components/StickyBars/Sidebar";



// export const AddStory = ({openCreateModal}: {openCreateModal: () => void}) => {
//     const [formData, setFormData] = useState({
//         location: "",
//         image: "",
//         locationImage: "",
//         description: "",
//         eventLink: "",
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
//                     Authorization: localStorage.getItem("token")
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
//                                 name="eventLink"
//                                 value={formData.eventLink}
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