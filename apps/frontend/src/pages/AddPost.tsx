// import { useState, useRef } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { useNavigate } from "react-router-dom";
// import { Sidebar } from "../components/StickyBars/Sidebar";
// import { Image as ImageIcon, Type, Upload, X, MessageCircle, ThumbsUp, Globe2 } from 'lucide-react';

// interface PostPhoto {
//   url: string;
// }

// export const AddPost = () => {
//     const [formData, setFormData] = useState({
//         title: "",
//         content: "",
//         published: false,
//     });
//     const [photos, setPhotos] = useState<PostPhoto[]>([]);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const navigate = useNavigate();

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
//             const imageUrl = reader.result as string;
//             setImagePreview(imageUrl);
//             setPhotos(prev => [...prev, { url: imageUrl }]);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             handleImageSelect(file);
//         }
//     };

//     const removePhoto = (index: number) => {
//         setPhotos(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async () => {
//         try {
//             setIsLoading(true);
//             await axios.post(`${BACKEND_URL}/api/v1/post`, {
//                 ...formData,
//                 PostPhoto: photos,
//             }, {
//                 headers: {
//                     Authorization: localStorage.getItem("token")
//                 }
//             });
//             navigate('/post');
//         } catch (error) {
//             console.error('Error publishing post:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const isFormValid = formData.title && formData.content;

//     return (
//         <div className="flex flex-row  bg-gray-50">
//             <div className="pt-6 px-4 md:pt-8 md:px-8">
//                 <Sidebar />
//             </div>

//             <div className="flex-1 p-4 md:p-8">
//                 <div className="max-w-3xl mx-auto">
//                     <div className="flex items-center justify-between mb-6">
//                         <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
//                         <div className="flex items-center space-x-2">
//                             <span className="text-sm text-gray-500">Status:</span>
//                             <button
//                                 onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
//                                 className={`px-3 py-1 rounded-full text-sm font-medium ${
//                                     formData.published
//                                         ? 'bg-green-100 text-green-800'
//                                         : 'bg-yellow-100 text-yellow-800'
//                                 }`}
//                             >
//                                 {formData.published ? 'Public' : 'Draft'}
//                             </button>
//                         </div>
//                     </div>
                    
//                     <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-6">
//                         {/* Title Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Type className="w-4 h-4 inline mr-1" />
//                                 Title
//                             </label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter post title"
//                             />
//                         </div>

//                         {/* Content Textarea */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <MessageCircle className="w-4 h-4 inline mr-1" />
//                                 Content
//                             </label>
//                             <textarea
//                                 name="content"
//                                 value={formData.content}
//                                 onChange={handleInputChange}
//                                 rows={6}
//                                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Write your post content..."
//                             />
//                         </div>

//                         {/* Photos Section */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 <ImageIcon className="w-4 h-4 inline mr-1" />
//                                 Photos
//                             </label>
                            
//                             {/* Photo Grid */}
//                             {photos.length > 0 && (
//                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//                                     {photos.map((photo, index) => (
//                                         <div key={index} className="relative aspect-square">
//                                             <img
//                                                 src={photo.url}
//                                                 alt={`Photo ${index + 1}`}
//                                                 className="w-full h-full object-cover rounded-lg"
//                                             />
//                                             <button
//                                                 onClick={() => removePhoto(index)}
//                                                 className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
//                                             >
//                                                 <X className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Image Preview */}
//                             {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />}

//                             {/* Upload Area */}
//                             <div
//                                 className={`relative h-48 rounded-lg border-2 border-dashed transition-colors ${
//                                     isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
//                                 } flex flex-col items-center justify-center`}
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                             >
//                                 <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                                 <p className="text-gray-600 mb-2 text-center">Drag and drop photos here</p>
//                                 <button
//                                     type="button"
//                                     onClick={() => fileInputRef.current?.click()}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                                 >
//                                     Select Photos
//                                 </button>
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                 />
//                             </div>
//                         </div>

//                         {/* Post Stats Preview */}
//                         <div className="flex items-center space-x-6 text-sm text-gray-500">
//                             <div className="flex items-center">
//                                 <ThumbsUp className="w-4 h-4 mr-1" />
//                                 <span>0 likes</span>
//                             </div>
//                             <div className="flex items-center">
//                                 <MessageCircle className="w-4 h-4 mr-1" />
//                                 <span>0 comments</span>
//                             </div>
//                             <div className="flex items-center">
//                                 <Globe2 className="w-4 h-4 mr-1" />
//                                 <span>{formData.published ? 'Public' : 'Draft'}</span>
//                             </div>
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
//                                     'Publish Post'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };