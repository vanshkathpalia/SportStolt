// src/pages/EditProfile.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileNav } from '../StickyBars/MobileNav';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Sidebar } from '../StickyBars/Sidebar';
import { BACKEND_URL } from '../../config';

// interface editporfileprops {
//     openCreateModal: () => void;
// }

export const EditProfile: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
  const { id } = useParams(); // assuming route is /editProfile/:id
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [formData, setFormData] = useState({
    image: '',
    bio: '',
    location: '',
    university: '',
    achievements: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch user data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/user/${id}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // if you're using JWT
          },
        });
        const data = await res.json();
        setFormData({
          image: data.profileImage || '',
          bio: data.bio || '',
          location: data.location || '',
          university: data.university || '',
          achievements: data.achievements || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bioTooLong = countWords(formData.bio) > 10;
    const achievementsTooLong = countWords(formData.achievements) > 10;

    if (bioTooLong || achievementsTooLong) {
        return alert('Please shorten bio or achievements');
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/${id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Profile updated successfully');
        navigate(`/profile`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

    // const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

    // const bioTooLong = countWords(bio) > 25;
    // const achievementsTooLong = countWords(achievements) > 10;

    return (
        <div className="min-h-screen ">
            {isMobile && <MobileNav openCreateModal={openCreateModal} />}

            <div className="flex">
                <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
                    <Sidebar openCreateModal={openCreateModal} />
                </div>

            <main className="flex-1 md:ml-16 xl:ml-52 p-8 mb-16">
                    
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto transition-colors duration-300"
                >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Edit profile</h2>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Profile Image URL</label>
                    <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter profile image URL"
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Bio</label>
                    <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Enter bio (max 10 words)"
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    rows={3}
                    />
                </div>

                {/* {bioTooLong && <p className="text-red-500">Bio must be 25 words or fewer</p>} */}


                <div>
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Location</label>
                    <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                        Place of study </label>
                    <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Enter your academy or university name"
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Achievements</label>
                    <input
                    type="text"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    placeholder="Athelete, Captian, etc. (if any, max 10 words)"
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                    />
                </div>

                {/* <button
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white p-3 mt-2 rounded-lg"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button> */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                    >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            </main>
            </div>
        </div>
    );
}


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
//         <label className="bloack mb-2">
//           <span className="text-sm font-medium">Name</span>
//           <input
//             type="text"
//             name="name"
//             value={profile.name}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//           />
//         </label>

//         <label className="bloack mb-2">
//           <span className="text-sm font-medium">Username</span>
//           <input
//             type="text"
//             name="username"
//             value={profile.username}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//           />
//         </label>

//         <label className="bloack mb-2">
//           <span className="text-sm font-medium">Bio</span>
//           <textarea
//             name="bio"
//             value={profile.bio}
//             onChange={handleChange}
//             className="w-full border rounded p-2 mt-1"
//             rows={3}
//           />
//         </label>

//         <label className="bloack mb-2">
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