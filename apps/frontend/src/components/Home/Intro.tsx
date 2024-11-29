



import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Intro = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-bold mb-6"
          >
            Your Ultimate Sports Community Platform
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto hover:text-gray-50"
          >
            Discover local sports events, share your athletic journey, and connect with sports enthusiasts. 
            Buy and sell equipment, get AI-powered insights, and be part of a thriving sports community.
          </motion.p>
          <Link to = "/signup">
            <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:text-blue-400 transition-colors">
                Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>  
          </Link>
        </div>
      </div>
      {/* <div className="absolute inset-0 bg-grid-white/[0.05] -z-1" /> */}
    </div>
  );
}

export default Intro

// motion.button
//             