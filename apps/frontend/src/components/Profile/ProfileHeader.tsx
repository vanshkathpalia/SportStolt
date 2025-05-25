import React from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile'; 
import { Tooltip } from '../ui/tooltip';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ProfileHeaderProps {
  isLoading?: boolean; 
  userId: number;     
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
  const { loading, profile } = useProfile(userId);
  const { user: currentUser } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isOwner = currentUser?.id === userId;

  if (loading || !profile) {
    return (
      <div className="flex flex-col md:flex-row items-center dark:bg-background gap-8 p-8">
        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
          <div className="flex gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse" />
          <div className="flex items-center gap-4 mt-2">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-background text-foreground">
      <img
        src={profile.profileImage}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
      />

      <div className="flex-1">
        {/* Username and Actions */}
        <div className="flex items-center gap-4 mb-2">
          {isMobile && (
            <div className="w-full flex justify-center">
              <h1 className="text-xl font-semibold">@{profile.username}</h1>
            </div>
          )}

          {!isMobile && (
            <h1 className="text-xl font-semibold">@{profile.username}</h1>
          )}
          

          {isOwner && !isMobile && (
            <>
              <Link to={`/editProfile/${userId}`}>
                <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md text-sm font-medium">
                  Edit Profile
                </button>
              </Link>

              <Link to="/setting">
                <button className="px-2 py-1.5 bg-gray-100 dark:bg-background dark:text-white rounded-md text-sm font-medium">
                  <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
                </button>
              </Link>
            </>
          )}

        </div>

        <div className="flex items-center gap-4 mb-2 w-full justify-center">
        {isOwner && isMobile && (
            <>
              <Link to={`/editProfile/${userId}`}>
                <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md text-sm font-medium ">
                  Edit Profile
                </button>
              </Link>

              <Link to="/setting">
                <button className="px-2 py-1.5 bg-gray-100 dark:bg-background dark:text-white rounded-md text-sm font-medium">
                  <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
                </button>
              </Link>
            </>
        )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-3 justify-start text-center">
          <div>
            <span className="font-semibold">{profile.postsCount}</span>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Posts</div>
          </div>
          <div>
            <span className="font-semibold">{profile.storiesCount}</span>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Stories</div>
          </div>
          <div>
            <span className="font-semibold">{profile.verifiedStoriesCount}</span>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Verified</div>
          </div>
          <div>
            <span className="font-semibold">{profile.legitimacy}</span>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Accuracy</div>
          </div>
        </div>

        {/* Bio / Location / University */}
        <div className="text-sm mb-3">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-gray-600 dark:text-gray-400">{profile.location} | {profile.university}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-1">{profile.bio}</p>
        </div>

        {/* Badges / Achievements */}
        <div className="flex items-center gap-4 mt-2">
          <span className="px-3 py-1 text-xs rounded-full bg-gray-400 text-white font-semibold">
            {profile.badge} Badge
          </span>
          <Tooltip content={0 + ' | ' + 0}>
            <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
              Followers | Following
            </span>
          </Tooltip>
          <Tooltip content={profile.achievements}>
            <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
              View Achievements
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// import React from 'react';
// import { Settings } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useProfile } from '../../hooks/useProfile';
// import { useCurrentUser } from '../../hooks/useCurrentUser'; // hypothetical hook
// import { Tooltip } from '../ui/tooltip';

// interface ProfileHeaderProps {
//   isLoading?: boolean;
//   userId: number;
// }

// export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
//   const { loading, profile } = useProfile(userId);
//   const { user: currentUser } = useCurrentUser(); // get current logged in user info

//   if (loading || !profile) {
//     return (
//       <div className="flex flex-col md:flex-row items-center dark:bg-background gap-8 p-8">
//         <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
//         <div className="flex-1 space-y-2">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//             <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//           </div>
//           <div className="flex gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
//             ))}
//           </div>
//           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse" />
//           <div className="flex items-center gap-4 mt-2">
//             <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const isOwner = currentUser?.id === userId;

//   return (
//     <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-background text-foreground">
//       <img
//         src={profile.profileImage}
//         alt="Profile"
//         className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
//       />

//       <div className="flex-1">
//         <div className="flex items-center gap-4 mb-2">
//           <h1 className="text-xl font-semibold">@{profile.username}</h1>

//           {isOwner && (
//             <>
//               <Link to={`/editProfile/${userId}`}>
//                 <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md text-sm font-medium">
//                   Edit Profile
//                 </button>
//               </Link>

//               <Link to="/setting">
//                 <button className="px-2 py-1.5 bg-gray-100 dark:bg-background dark:text-white rounded-md text-sm font-medium">
//                   <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
//                 </button>
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Stats */}
//         <div className="flex gap-6 mb-3 justify-start text-center">
//           <div>
//             <span className="font-semibold">{profile.postsCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Posts</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.storiesCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Stories</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.verifiedStoriesCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Verified</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.legitimacy}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Accuracy</div>
//           </div>
//         </div>

//         {/* Bio / Location / University */}
//         <div className="text-sm mb-3">
//           <p className="font-semibold">{profile.name}</p>
//           <p className="text-gray-600 dark:text-gray-400">{profile.location} | {profile.university}</p>
//           <p className="text-gray-700 dark:text-gray-300 mt-1">{profile.bio}</p>
//         </div>

//         {/* Badges / Achievements */}
//         <div className="flex items-center gap-4 mt-2">
//           <span className="px-3 py-1 text-xs rounded-full bg-gray-400 text-white font-semibold">
//             {profile.badge} Badge
//           </span>
//           {/* Uncomment if you add tooltip */}
//           <Tooltip content={0 + ' | ' + 0}>
//           {/* <Tooltip content={profile.followers + ' | ' + profile.following}></Tooltip> */}
//             {/* Replace 0 with actual follower and following counts */}
//             <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
//               Followers | Following
//             </span>
//           </Tooltip>
//           <Tooltip content={profile.achievements}>
//             <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
//               View Achievements
//             </span>
//           </Tooltip>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React from 'react';
// import { Settings } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useProfile } from '../../hooks/useProfile'; 
// import { Tooltip } from '../ui/tooltip';


// interface ProfileHeaderProps {
//   isLoading?: boolean; 
//   userId: number;     
// }

// export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
//   const { loading, profile } = useProfile(userId);

//   if (loading || !profile) {
//     return (
//       <div className="flex flex-col md:flex-row items-center dark:bg-background gap-8 p-8">
//         <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
//         <div className="flex-1 space-y-2">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//             <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//           </div>
//           <div className="flex gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
//             ))}
//           </div>
//           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse" />
//           <div className="flex items-center gap-4 mt-2">
//             <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-background text-foreground">
//       <img
//         src={
//           profile.profileImage
//           // || 'https://asiaiplaw.com/storage/media/image/article/7eb532aef980c36170c0b4426f082b87/banner/939314105ce8701e67489642ef4d49e8/conversions/Picture1-extra_large.jpg'
//         }
//         alt="Profile"
//         className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
//       />

//       <div className="flex-1">
//         {/* Username and Actions */}
//         <div className="flex items-center gap-4 mb-2">
//           <h1 className="text-xl font-semibold">@{profile.username}</h1>
          
//           <Link to={`/editProfile/${userId}`}>
//             {/* Edit Profile Button */}
//             <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md text-sm font-medium">
//               Edit Profile
//             </button>
//           </Link>


//           <Link to="/setting">
//             <button className="px-2 py-1.5 bg-gray-100 dark:bg-background dark:text-white rounded-md text-sm font-medium">
//               <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
//             </button>
//           </Link>
//         </div>

//         {/* Stats */}
//         <div className="flex gap-6 mb-3 justify-start text-center">
//           <div>
//             <span className="font-semibold">{profile.postsCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Posts</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.storiesCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Stories</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.verifiedStoriesCount}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Verified</div>
//           </div>
//           <div>
//             <span className="font-semibold">{profile.legitimacy}</span>
//             <div className="text-gray-500 dark:text-gray-400 text-sm">Accuracy</div>
//           </div>
//         </div>

//         {/* Bio / Location / University */}
//         <div className="text-sm mb-3">
//           <p className="font-semibold">{profile.name}</p>
//           <p className="text-gray-600 dark:text-gray-400">{profile.location} | {profile.university}</p>
//           <p className="text-gray-700 dark:text-gray-300 mt-1">{profile.bio}</p>
//         </div>

//         {/* Badges / Achievements */}
//         <div className="flex items-center gap-4 mt-2">
//           <span className="px-3 py-1 text-xs rounded-full bg-gray-400 text-white font-semibold">
//             {profile.badge} Badge
//           </span>
//           {/* Uncomment if you add tooltip */}
//           <Tooltip content={0 + ' | ' + 0}>
//           {/* <Tooltip content={profile.followers + ' | ' + profile.following}></Tooltip> */}
//             {/* Replace 0 with actual follower and following counts */}
//             <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
//               Followers | Following
//             </span>
//           </Tooltip>
//           <Tooltip content={profile.achievements}>
//             <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
//               View Achievements
//             </span>
//           </Tooltip>
//         </div>
//       </div>
//     </div>
//   );
// };


// // import React from 'react';
// // import { Settings } from 'lucide-react';
// // import { Link } from 'react-router-dom';
// // // import { Tooltip } from "@/components/ui/tooltip"; // optional, or use any tooltip lib

// // interface ProfileHeaderProps {
// //   isLoading?: boolean;
// // }

// // export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isLoading }) => {
// //   const user = {
// //     name: "Vansh Kumar",
// //     username: "vansh_",
// //     profileImage: "https://img.freepik.com/free-photo/positive-male-youngster-with-curly-hair_176532-8174.jpg",
// //     posts: 6,
// //     stories: 22,
// //     verifiedStories: 17,
// //     legitimacy: "97%",
// //     badge: "Gold",
// //     achievements: "State-Level Football Champion, TT Captain",
// //     location: "Delhi",
// //     university: "XYZ University",
// //     bio: "Athlete | TT & Football | Tech Geek",
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="flex flex-col md:flex-row items-center dark:bg-gray-800 gap-8 p-8">
// //         <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
// //         <div className="flex-1 space-y-4">
// //           <div className="flex items-center gap-4 mb-4">
// //             <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
// //             <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
// //           </div>
// //           <div className="flex gap-6">
// //             {[...Array(3)].map((_, i) => (
// //               <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
// //             ))}
// //           </div>
// //           <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
// //           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse" />
// //           <div className="flex items-center gap-4 mt-2">
// //             <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-background text-foreground">
// //       <img
// //         src={user.profileImage}
// //         alt="Profile"
// //         className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
// //       />

// //       <div className="flex-1">
// //         {/* Username and Actions */}
// //         <div className="flex items-center gap-4 mb-2">
// //           <h1 className="text-xl font-semibold">@{user.username}</h1>
// //           <Link to="/editProfile">
// //             <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-md text-sm font-medium">
// //               Edit Profile
// //             </button>
// //           </Link>
// //           <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
// //         </div>

// //         {/* Stats */}
// //         <div className="flex gap-6 mb-3 justify-start text-center">
// //           <div>
// //             <span className="font-semibold">{user.posts}</span>
// //             <div className="text-gray-500 dark:text-gray-400 text-sm">Posts</div>
// //           </div>
// //           <div>
// //             <span className="font-semibold">{user.stories}</span>
// //             <div className="text-gray-500 dark:text-gray-400 text-sm">Stories</div>
// //           </div>
// //           <div>
// //             <span className="font-semibold">{user.verifiedStories}</span>
// //             <div className="text-gray-500 dark:text-gray-400 text-sm">Verified</div>
// //           </div>
// //           <div>
// //             <span className="font-semibold">{user.legitimacy}</span>
// //             <div className="text-gray-500 dark:text-gray-400 text-sm">Accuracy</div>
// //           </div>
// //         </div>

// //         {/* Bio / Location / University */}
// //         <div className="text-sm mb-3">
// //           <p className="font-semibold">{user.name}</p>
// //           <p className="text-gray-600 dark:text-gray-400">{user.location} | {user.university}</p>
// //           <p className="text-gray-700 dark:text-gray-300 mt-1">{user.bio}</p>
// //         </div>

// //         {/* Badges / Achievements */}
// //         <div className="flex items-center gap-4 mt-2">
// //           <span className="px-3 py-1 text-xs rounded-full bg-yellow-400 text-white font-semibold">
// //             🥇 {user.badge} Badge
// //           </span>
// //           {/* <Tooltip content={user.achievements}>
// //             <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">
// //               View Achievements
// //             </span>
// //           </Tooltip> */}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };



// // // import React from 'react';
// // // import { Settings } from 'lucide-react';

// // // interface ProfileHeaderProps {
// // //   isLoading?: boolean;
// // // }

// // // export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isLoading }) => {
// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex flex-col md:flex-row items-center gap-8 p-8">
// // //         <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
// // //         <div className="flex-1 space-y-4">
// // //           <div className="flex items-center gap-4 mb-4">
// // //             <h1 className="text-xl font-semibold">Vansh</h1>
// // //             <button className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium">
// // //               Edit Profile
// // //             </button>
// // //             <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
// // //           </div>
// // //           <div className="flex gap-6 justify-center md:justify-start">
// // //             {[...Array(3)].map((_, i) => (
// // //               <div key={i} className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-1" />
// // //             ))}
// // //           </div>
// // //           <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
// // //           <div className="h-8 bg-gray-200 rounded w-72 animate-pulse" />
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex flex-col md:flex-row items-center gap-8 p-8">
// // //       <img
// // //         src="https://img.freepik.com/free-photo/positive-male-youngster-with-curly-hair_176532-8174.jpg?t=st=1733119110~exp=1733122710~hmac=87e8b61f003f99824d8bcc61eacb5ed744bb9833ac46390e3894c3af6c76b11d&w=2000"
// // //         alt="Profile"
// // //         className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
// // //       />
// // //       <div className="flex-1">
// // //         <div className="flex items-center gap-4 mb-4">
// // //           <h1 className="text-xl font-semibold">vansh_</h1>
// // //           <button className="px-4 py-1.5 bg-gray-100 rounded-md text-sm font-medium">
// // //             Edit Profile
// // //           </button>
// // //           <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
// // //         </div>
        
// // //         <div className="flex gap-8 mb-4 justify-center md:justify-start">
// // //           <div className="text-center">
// // //             <span className="font-semibold">6</span>
// // //             <span className="text-gray-500 text-sm block">Posts</span>
// // //           </div>
// // //           <div className="text-center">
// // //             <span className="font-semibold">22</span>
// // //             <span className="text-gray-500 text-sm block">Stories</span>
// // //           </div>
// // //           <div className="text-center">
// // //             <span className="font-semibold">97%</span>
// // //             <span className="text-gray-500 text-sm block">Reputation</span>
// // //           </div>
// // //         </div>
        
// // //         <div className="text-sm">
// // //           <p className="font-semibold">Vansh Kumar</p>
// // //           <p className="text-gray-600">Location | University </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };