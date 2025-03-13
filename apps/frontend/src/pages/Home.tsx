import { Intro } from "../components/Home/Intro"
import { FeatureCard } from '../components/Home/FeatureCard';
import { Footer } from "../components/Home/Footer";
import { Features } from "../mockData/FeatureData";

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
          {Features.map((feature, index) => (
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
