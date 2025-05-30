
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

export function FeatureCard({ title, description, icon: Icon, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-start gap-4 transition-colors duration-300"
    >
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}
