import React, { useState, FormEvent } from 'react';
import { Calendar, Clock, MapPin, Building2, Users, Upload } from 'lucide-react';
import { Sidebar } from "../components/StickyBars/Sidebar";
import axios from 'axios';
import { BACKEND_URL } from "../config";
interface AddEventPageProps {
  openCreateModal: () => void
}

export const AddEvent = ({openCreateModal}: AddEventPageProps) => {
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    city: '',
    stadium: '',
    startDate: '',
    country: '',
    state: '',
    endDate: '',
    startTime: '',
    OrganisedBy: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }
    console.log("JWT Token:", token);


    // const formattedstartDate = new Date(`${formData.startDate}T${formData.startTime}:00Z`).toISOString();

    // const eventPayload = {
    //       ...formData,
    //       startDate: formattedstartDate,
    // };

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/event`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Use "Bearer" prefix if required by your API
        },
      });

      if (response.data) {
        alert('Event created successfully!');
        // Reset form
        setFormData({
          image: '',
          name: '',
          city: '',
          country: '',
          state: '',
          stadium: '',
          startDate: '',
          endDate: '',
          startTime: '',
          OrganisedBy: ''
        });
      } else {
        alert('Failed to create event');
        console.error(setFormData);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  // const [photos, setPhotos] = useState<PostPhoto[]>([]);
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    // const [isDragging, setIsDragging] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const fileInputRef = useRef<HTMLInputElement>(null);
    // const navigate = useNavigate();

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    // const handleDragOver = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setIsDragging(true);
    // };

    // const handleDragLeave = () => {
    //     setIsDragging(false);
    // };

    // const handleDrop = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     setIsDragging(false);
    //     const file = e.dataTransfer.files[0];
    //     if (file && file.type.startsWith('image/')) {
    //         handleImageSelect(file);
    //     }
    // };

    // const handleImageSelect = (file: File) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         const imageUrl = reader.result as string;
    //         setImagePreview(imageUrl);
    //         setPhotos(prev => [...prev, { url: imageUrl }]);
    //     };
    //     reader.readAsDataURL(file);
    // };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         handleImageSelect(file);
    //     }
    // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert date inputs to ISO format if needed
    let formattedValue = value;
    if (name === "startDate" || name === "endDate" || name === "startTime") {
        formattedValue = new Date(value).toISOString();
    }
    
  
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-8">
        <div className="pt-6 px-4 col-span-8 md:col-span-1">
          <Sidebar openCreateModal = {openCreateModal} />
        </div>
        
        <div className="col-span-8 md:col-span-7 px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
                <p className="mt-2 text-gray-600">Fill in the details to create a new event</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                {/* <div
                            className={`relative h-72 md:h-96 rounded-lg border-2 border-dashed transition-colors ${
                                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            } ${!imagePreview ? 'flex flex-col items-center justify-center' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData(prev => ({ ...prev, locationImage: "" }));
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <p className="text-gray-600 mb-2 text-center">Drag and drop your image here</p>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Select Image
                                    </button>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div> */}
                {/* Image URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event name"
                    required
                  />
                </div>
              

                {/* City Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city name"
                    required
                  />
                </div>

                {/* Country Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country name"
                    required
                  />
                </div>

                {/* State Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state name"
                    required
                  />
                </div>

                {/* Stadium Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Stadium
                  </label>
                  <input
                    type="text"
                    name="stadium"
                    value={formData.stadium}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter stadium name"
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate.split("T")[0]} // Show only "YYYY-MM-DD"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* End Date */}  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate.split("T")[0]} // Show only "YYYY-MM-DD"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>


                {/* Start date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    Start Time
                  </label>
                  <input
                    type="date"
                    name="startTime"
                    value={formData.startTime.split("T")[0]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>


                {/* Organised By Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Organised By
                  </label>
                  <input
                    type="text"
                    name="OrganisedBy"
                    value={formData.OrganisedBy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter organizer name"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
