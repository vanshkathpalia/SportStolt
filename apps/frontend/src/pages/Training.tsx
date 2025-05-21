import React, { useState } from 'react';
import { fetchSportsPlaylist } from '../utils/mailer';
import { Sidebar } from '../components/StickyBars/Sidebar';
import { MobileNav } from '../components/StickyBars/MobileNav';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const Training = ({ openCreateModal }: { openCreateModal: () => void }) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [sportName, setSportName] = useState('Football');
    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [keywords, setKeywords] = useState('');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchSportsPlaylist(userName, userEmail, sportName, skillLevel, keywords);
            alert(`Email sent to ${userEmail} for ${sportName} tutorials.`);
        } catch (error) {
            console.error(error);
            alert('Failed to send email. Please try again.');
        }
    };

    return (
        <div className="min-h-screen ">
            {isMobile && <MobileNav openCreateModal={openCreateModal} />}

            <div className="flex">
                <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
                    <Sidebar openCreateModal={openCreateModal} />
                </div>

                <main className="flex-1 md:ml-16 xl:ml-52 p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg mx-auto transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Sports Tutorial Request</h2>

                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Name:</label>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"
                            placeholder="Enter your name"
                            required
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        />

                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Email:</label>
                        <input
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        />

                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Select Sport:</label>
                        <select
                            value={sportName}
                            onChange={(e) => setSportName(e.target.value)}
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        >
                            <option>Football</option>
                            <option>Basketball</option>
                            <option>Cricket</option>
                            <option>Tennis</option>
                            <option>Table Tennis</option>
                        </select>

                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Skill Level:</label>
                        <select
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>

                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Keywords (optional):</label>
                        <input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            type="text"
                            placeholder="e.g., drills, highlights"
                            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white p-3 rounded-lg"
                        >
                            Send Tutorial
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Training;
