import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Sidebar } from '../components/StickyBars/Sidebar';
import { MobileNav } from '../components/StickyBars/MobileNav';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Link } from 'react-router-dom';

export const SettingsPage = ({ openCreateModal }: { openCreateModal: () => void }) => {
  const [sports, setSports] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sportInput, setSportInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('No auth token found. Please log in.');
        setLoading(false);
        return;
      }

      axios
        .get(`${BACKEND_URL}/api/v1/settings/preferences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setSports(res.data.preferences?.preferredSports || []);
          setLocations(res.data.preferences?.preferredLocations || []);
        })
        .catch((err) => console.error('Failed to load preferences:', err));
      }, 1000);
  }, []);

  const addToList = (
    input: string,
    list: string[],
    setList: (l: string[]) => void,
    reset: () => void
  ) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    reset();
  };

  const removeFromList = (
    value: string,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    setList(list.filter((item) => item !== value));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('No auth token found. Please log in.');
        setLoading(false);
        return;
      }

      // Include any unadded input values
      const finalSports = sportInput.trim()
        ? [...sports, sportInput.trim()]
        : [...sports];
      const finalLocations = locationInput.trim()
        ? [...locations, locationInput.trim()]
        : [...locations];

      await axios.post(
        `${BACKEND_URL}/api/v1/settings/preferences`,
        {
          sports: finalSports,
          locations: finalLocations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state with the final lists
      setSports(finalSports);
      setLocations(finalLocations);
      setSportInput('');
      setLocationInput('');

      alert('Preferences saved successfully!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    loading ||
    (sports.length === 0 && sportInput.trim() === '') ||
    (locations.length === 0 && locationInput.trim() === '');

  return (
    <div className="min-h-screen">
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        <main className="flex-1 md:ml-16 xl:ml-52 p-8 mb-16">
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow space-y-6">
            <h2 className="text-2xl font-bold text-center dark:text-white ">Set Your Preferences</h2>

                        {/* Locations Input */}
                        <div>
              <h3 className="font-semibold mb-2 dark:text-white">Preferred Locations</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter a location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2 flex-1"
                />
                <button
                  onClick={() =>
                    addToList(
                      locationInput,
                      locations,
                      setLocations,
                      () => setLocationInput('')
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span
                    key={location}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {location}
                    <button
                      onClick={() => removeFromList(location, locations, setLocations)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sports Input */}
            <div>
              <h3 className="font-semibold mb-2 dark:text-white">Preferred Sports</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter a sport"
                  value={sportInput}
                  onChange={(e) => setSportInput(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2 flex-1"
                />
                <button
                  onClick={() =>
                    addToList(sportInput, sports, setSports, () => setSportInput(''))
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {sport}
                    <button
                      onClick={() => removeFromList(sport, sports, setSports)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`px-6 py-2 rounded-xl text-white ${
                  isSaveDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
          <div className="mt-10 text-sm text-center text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              <Link to="/privacy-policy" className="underline hover:text-blue-600">Privacy Policy</Link> |{" "}
              <Link to="/refund-policy" className="underline hover:text-blue-600">Refund Policy</Link> |{" "}
              <Link to="/shipping-policy" className="underline hover:text-blue-600">Shipping Info</Link> |{" "}
              <Link to="/contact" className="underline hover:text-blue-600">Contact Us</Link>
            </p>
          </div>
        </main>
      </div>
      
    </div>
  );
};

// // SettingsPage.tsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BACKEND_URL } from '../config';

// export const SettingsPage = () => {
//   const [sports, setSports] = useState<string[]>([]);
//   const [locations, setLocations] = useState<string[]>([]);
//   const [sportInput, setSportInput] = useState('');
//   const [locationInput, setLocationInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       alert('No auth token found. Please log in.');
//       setLoading(false);
//       return;
//     }

//     axios
//       .get(`${BACKEND_URL}/api/v1/settings/preferences`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setSports(res.data.preferences?.preferredSports || []);
//         setLocations(res.data.preferences?.preferredLocations || []);
//       })
//       .catch((err) => console.error('Failed to load preferences:', err));
//   }, []);

//   const addToList = (
//     input: string,
//     list: string[],
//     setList: (l: string[]) => void,
//     reset: () => void
//   ) => {
//     const trimmed = input.trim();
//     if (trimmed && !list.includes(trimmed)) {
//       setList([...list, trimmed]);
//     }
//     reset();
//   };

//   const removeFromList = (
//     value: string,
//     list: string[],
//     setList: (l: string[]) => void
//   ) => {
//     setList(list.filter((item) => item !== value));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         alert('No auth token found. Please log in.');
//         setLoading(false);
//         return;
//       }

//       // Include any unadded input values
//       const finalSports = sportInput.trim()
//         ? [...sports, sportInput.trim()]
//         : [...sports];
//       const finalLocations = locationInput.trim()
//         ? [...locations, locationInput.trim()]
//         : [...locations];

//       await axios.post(
//         `${BACKEND_URL}/api/v1/settings/preferences`,
//         {
//           sports: finalSports,
//           locations: finalLocations,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update state with the final lists
//       setSports(finalSports);
//       setLocations(finalLocations);
//       setSportInput('');
//       setLocationInput('');

//       alert('Preferences saved successfully!');
//     } catch (err) {
//       console.error('Error saving preferences:', err);
//       alert('Failed to save preferences.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isSaveDisabled =
//     loading ||
//     (sports.length === 0 && sportInput.trim() === '') ||
//     (locations.length === 0 && locationInput.trim() === '');

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
//       <h2 className="text-2xl font-bold text-center">Set Your Preferences</h2>

//       {/* Sports Input */}
//       <div>
//         <h3 className="font-semibold mb-2">Preferred Sports</h3>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Enter a sport"
//             value={sportInput}
//             onChange={(e) => setSportInput(e.target.value)}
//             className="border rounded px-3 py-2 flex-1"
//           />
//           <button
//             onClick={() =>
//               addToList(sportInput, sports, setSports, () => setSportInput(''))
//             }
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Add
//           </button>
//         </div>
//         <div className="mt-2 flex flex-wrap gap-2">
//           {sports.map((sport) => (
//             <span
//               key={sport}
//               className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
//             >
//               {sport}
//               <button
//                 onClick={() => removeFromList(sport, sports, setSports)}
//                 className="text-red-500 font-bold"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Locations Input */}
//       <div>
//         <h3 className="font-semibold mb-2">Preferred Locations</h3>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Enter a location"
//             value={locationInput}
//             onChange={(e) => setLocationInput(e.target.value)}
//             className="border rounded px-3 py-2 flex-1"
//           />
//           <button
//             onClick={() =>
//               addToList(
//                 locationInput,
//                 locations,
//                 setLocations,
//                 () => setLocationInput('')
//               )
//             }
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Add
//           </button>
//         </div>
//         <div className="mt-2 flex flex-wrap gap-2">
//           {locations.map((location) => (
//             <span
//               key={location}
//               className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
//             >
//               {location}
//               <button
//                 onClick={() => removeFromList(location, locations, setLocations)}
//                 className="text-red-500 font-bold"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="text-center pt-4">
//         <button
//           onClick={handleSave}
//           disabled={isSaveDisabled}
//           className={`px-6 py-2 rounded-xl text-white ${
//             isSaveDisabled
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-black hover:bg-gray-800'
//           }`}
//         >
//           {loading ? 'Saving...' : 'Save Preferences'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;