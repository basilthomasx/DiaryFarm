import React from 'react';
import Header from './Header';
import { 
  HeartIcon, 
  LeafIcon, 
  AwardIcon, 
  UsersIcon, 
  SunIcon,
  MilkIcon
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <HeartIcon className="w-8 h-8 text-blue-600 mb-4" />,
      title: "Family Values",
      description: "Caring like family."
    },
    {
      icon: <LeafIcon className="w-8 h-8 text-green-600 mb-4" />,
      title: "Sustainability",
      description: "Committed to environmental stewardship through sustainable farming practices."
    },
    {
      icon: <AwardIcon className="w-8 h-8 text-yellow-600 mb-4" />,
      title: "Quality First",
      description: "Premium dairy products through ethical farming and stringent quality controls."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "Our Beginning",
      description: "Three young innovators take the first step toward revolutionizing agriculture with their groundbreaking idea.."
    },
    {
      year: "2025",
      title: "Modernization",
      description: "Introduced the first fresh milk selling platform."
    },
    {
      year: "2018",
      title: "Organic Transition",
      description: "Our farm has been collaborating with Milma for the past six years."
    },
    {
      year: "2022",
      title: "Innovation",
      description: "Implemented a solar power farm with government support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header/>
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src="/api/placeholder/1920/600"
          alt="Dairy Farm Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-500 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">God's Own Dairy</h1>
            <p className="text-xl max-w-2xl mx-auto">
            ടെക്നോളജിയുടെ സ്പർശം, പ്രകൃതിയുടെ ശുദ്ധി! 
            Since 2018
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Our Story Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="/healthycows.jpg"
                alt="Farm History"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg font-bold text-gray-700">
              Our vision is to inspire interest in farming and promote the growth of agricultural products.
              </p>
              <p className="text-lg font-bold text-gray-700">
              We are currently implementing our vision of merging farming with technology to create diverse opportunities in the agricultural sector.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24">
                  <span className="text-xl font-bold text-blue-600">{item.year}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <MilkIcon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
            <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Happy Cows</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <SunIcon className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <div className="text-3xl font-bold text-green-600 mb-2">50%</div>
            <div className="text-gray-600">Solar Powered</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <AwardIcon className="w-8 h-8 mx-auto mb-4 text-yellow-600" />
            <div className="text-3xl font-bold text-yellow-600 mb-2">5+</div>
            <div className="text-gray-600">Awards Won</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <UsersIcon className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <div className="text-3xl font-bold text-red-600 mb-2">6+</div>
            <div className="text-gray-600">Team Members</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;