import { Intro } from "../components/Intro"
import { FeatureCard } from '../components/FeatureCard';
import { 
  Calendar, 
  Camera, 
  ShoppingBag, 
  MessageSquareText, 
  MapPin, 
  Share2 
} from 'lucide-react';
import { Footer } from "../components/Footer";

const features = [
    {
      title: "Sports Events Publishing",
      description: "Create and discover local sports events. Share event details, location, and connect with participants in real-time.",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Social Sports Feed",
      description: "Share your sports moments with photo posts and tag sports equipment. Connect with fellow enthusiasts.",
      icon: Camera,
      color: "bg-purple-500"
    },
    {
      title: "Equipment Marketplace",
      description: "Buy and sell sports equipment in our dedicated marketplace. Find the best deals on quality gear.",
      icon: ShoppingBag,
      color: "bg-green-500"
    },
    {
      title: "AI Commentary",
      description: "Get intelligent insights and analysis for your sports content using our advanced AI technology.",
      icon: MessageSquareText,
      color: "bg-orange-500"
    },
    {
      title: "Location-Based Discovery",
      description: "Find sports events and activities happening near you. Connect with your local sports community.",
      icon: MapPin,
      color: "bg-red-500"
    },
    {
      title: "Community Engagement",
      description: "Join sports-specific communities, share tips, and participate in discussions with like-minded individuals.",
      icon: Share2,
      color: "bg-indigo-500"
    }
  ];

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Intro />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the features that make our platform the perfect place for sports enthusiasts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
