// import React, { useState } from 'react';

// type EditProfileProps = {
//   initialProfile: {
//     name: string;
//     username: string;
//     bio: string;
//     location: string;
//     profileImage?: string;
//   };
//   onSave: (updatedProfile: typeof initialProfile) => void;
//   onCancel: () => void;
// };

// export const EditProfile: React.FC<EditProfileProps> = ({ initialProfile, onSave, onCancel }) => {
//   const [profile, setProfile] = useState(initialProfile);
//   const [imagePreview, setImagePreview] = useState(profile.profileImage || '');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result as string);
//         setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = () => {
//     onSave(profile);
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md space-y-4">
//       <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

//       <div className="flex items-center space-x-4">
//         <img
//           src={imagePreview || '/default-avatar.png'}
//           alt="Profile"
//           className="w-16 h-16 rounded-full object-cover"
//         />
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </div>

//       <div className="space-y-2">
//         <label className="block">
//           <span className="text-sm font-medium">Name</span>
//           <input
//             type="text"
//             name="name"
//             value={profile.name}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm font-medium">Username</span>
//           <input
//             type="text"
//             name="username"
//             value={profile.username}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm font-medium">Bio</span>
//           <textarea
//             name="bio"
//             value={profile.bio}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//             rows={3}
//           />
//         </label>

//         <label className="block">
//           <span className="text-sm font-medium">Location</span>
//           <input
//             type="text"
//             name="location"
//             value={profile.location}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//           />
//         </label>
//       </div>

//       <div className="flex justify-end gap-3 mt-4">
//         <button
//           onClick={onCancel}
//           className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };
// <EditProfile
//   initialProfile={{
//     name: 'John Doe',
//     username: 'johnny',
//     bio: 'Web developer & coffee lover',
//     location: 'New York',
//     profileImage: ''
//   }}
//   onSave={(updatedProfile) => {
//     console.log('Updated profile:', updatedProfile);
//   }}
//   onCancel={() => {
//     console.log('Edit cancelled');
//   }}
// />