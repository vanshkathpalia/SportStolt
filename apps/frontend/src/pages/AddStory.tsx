import { useState, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/StickyBars/Sidebar";
import { Camera, MapPin, X, Upload, Trophy, Link as LinkIcon, FileText } from 'lucide-react';

export const AddStory = () => {
    const [formData, setFormData] = useState({
        location: "",
        image: "",
        locationImage: "",
        description: "",
        eventLink: "",
        sport: "",
        activityStarted: "",
        activityEnded: "",
        stadium: "",
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageSelect(file);
        }
    };

    const handleImageSelect = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setFormData(prev => ({ ...prev, locationImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    const handleSubmit = async () => {
        
        if (new Date(formData.activityEnded) <= new Date(formData.activityStarted)) {
            alert("Activity Ended time must be after Activity Started time.");
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${BACKEND_URL}/api/v1/story`, {
                ...formData,
                isViewed: false
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            navigate(`/post`);
        } catch (error) {
            console.error('Error publishing story:', error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.location && formData.image && formData.description && 
                       formData.sport && formData.stadium && formData.activityStarted && formData.activityEnded;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="md:pt-6 px-4 md:min-w-72 w-full md:w-auto">
                <Sidebar />
            </div>

            <div className="flex-1 p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Story</h1>
                    
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-6">
                        {/* Image Upload Section */}
                        <div
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
                        </div>

                        {/* Manual Image URL Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Camera className="w-4 h-4 inline mr-1" />
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter image URL"
                            />
                        </div>

                        {/* Location image Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Camera className="w-4 h-4 inline mr-1" />
                                Location URL
                            </label>
                            <input
                                type="text"
                                name="locationImage"
                                value={formData.locationImage}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter location URL"
                            />
                        </div>

                        {/* Location Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter location"
                            />
                        </div>

                        {/* Activity Started Input */}
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Activity Started At
                        </label>
                        <input
                            type="datetime-local"
                            name="activityStarted"
                            value={formData.activityStarted}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Activity Started"
                        />

                        {/* Activity Ended Input */}
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Camera className="w-4 h-4 inline mr-1" />
                            Activity Ended At
                        </label>
                        <input
                            type="datetime-local"
                            name="activityEnded"
                            value={formData.activityEnded}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Activity Ended"
                        />

                        {/* Sport Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Trophy className="w-4 h-4 inline mr-1" />
                                Sport
                            </label>
                            <select
                                name="sport"
                                value={formData.sport}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a sport</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Baseball">Baseball</option>
                                <option value="Tennis">Tennis</option>
                            </select>
                        </div>

                        {/* Stadium Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Stadium
                            </label>
                            <input
                                type="text"
                                name="stadium"
                                value={formData.stadium}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter stadium name"
                            />
                        </div>

                        {/* Description Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Write your story description..."
                            />
                        </div>

                        {/* Event Link Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <LinkIcon className="w-4 h-4 inline mr-1" />
                                Event Link (Optional)
                            </label>
                            <input
                                type="url"
                                name="eventLink"
                                value={formData.eventLink}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/event"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !isFormValid}
                                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </span>
                                ) : (
                                    'Publish Story'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};