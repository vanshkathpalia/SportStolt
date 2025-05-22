import { useNavigate } from 'react-router-dom'; // ⬅️ import navigate
import { motion } from 'framer-motion';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/useTheme';

export const Intro = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // get navigate function

  const handleGetStarted = () => {
    navigate("/signup", { replace: true }); // replaces current history
    // navigate("/signup"); 
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-950 dark:to-gray-900 text-white transition-colors duration-300">
      {/* Toggle Theme Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 bg-white text-blue-600 p-2 rounded-full"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold mb-6"
          >
            SportStolt
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-bold mb-6"
          >
            Your Ultimate Sports Community Platform
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 mb-8 max-w-3xl mx-auto hover:text-gray-50"
          >
            Discover local sports events, share your athletic journey, and connect with sports enthusiasts. 
            <br />
            Be part of a thriving sports community.
          </motion.p>

          {/* ✅ Replace Link with navigate + replace */}
          <motion.button 
            onClick={handleGetStarted}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Intro;


// motion.button
// Discover local sports events, share your athletic journey, and connect with sports enthusiasts. 
// Buy and sell equipment, get AI-powered insights, and be part of a thriving sports community.  