import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios'; // Assuming you're using axios - you can replace with fetch if needed
import { 
  Milk, 
  ClipboardCheck, 
  Truck, 
  Syringe, 
  Calendar, 
  MapPin,
  Leaf,
  Workflow,
  Users,
  ChevronRight,
  ChevronLeft,
  ArrowLeft, 
  Droplet, 
  Thermometer, 
  CircleAlert,
  BarChart, 
  Beaker, 
  ClipboardList,
  Info,
  AlertCircle,
  Loader
} from 'lucide-react';

// Date formatting function
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Authentication util
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get user data from local storage
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Add the missing getQualityColor function
const getQualityColor = (parameter, value) => {
  // Define quality ranges for each parameter
  const ranges = {
    fat: { low: 3.0, high: 5.0 },
    protein: { low: 3.0, high: 4.0 },
    lactose: { low: 4.0, high: 5.0 },
    snf: { low: 8.0, high: 9.5 },
    temperature: { low: 2.0, high: 8.0 },
    ph: { low: 6.5, high: 6.8 }
  };

  // Default to gray if parameter not found
  if (!ranges[parameter]) {
    return "bg-gray-100";
  }

  const { low, high } = ranges[parameter];
  
  // Temperature has a different logic (we want cool milk)
  if (parameter === 'temperature') {
    if (value <= high && value >= low) {
      return "bg-green-100";
    } else if (value > high && value <= high + 2) {
      return "bg-yellow-100";
    } else {
      return "bg-red-100";
    }
  }
  
  // pH has a narrow acceptable range
  if (parameter === 'ph') {
    if (value >= low && value <= high) {
      return "bg-green-100";
    } else {
      return "bg-red-100";
    }
  }
  
  // For most parameters, higher values are generally better up to a point
  if (value < low) {
    return "bg-red-100";
  } else if (value >= low && value <= high) {
    return "bg-green-100";
  } else {
    return "bg-yellow-100"; // Values above high range
  }
};

const API_BASE_URL = 'http://localhost:3000';

const StageSlider = ({ slides }) => {
  // StageSlider component remains unchanged
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState('right');

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection('right');
        setCurrentIndex(prev => prev === slides.length - 1 ? 0 : prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isAnimating]);

  const navigate = (dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrentIndex(prev => {
      if (dir === 'right') {
        return prev === slides.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? slides.length - 1 : prev - 1;
    });
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className="relative max-w-6xl mx-auto mb-24">
      <div className="flex gap-4">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ease-in-out rounded-lg overflow-hidden
              ${index === currentIndex ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          >
            <div className="bg-blue-50 p-8 h-full min-w-[800px] group">
              <div className="flex gap-8 items-start">
                <div className="w-1/3">
                  <div className="p-4 bg-white/90 rounded-full mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    {slide.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    {slide.title.split(' ')[0]}
                  </h2>
                  <div className="bg-emerald-600 text-white text-sm px-4 py-1 rounded-full inline-block">
                    Claim Every Benefit
                  </div>
                </div>

                <div className="w-2/3">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white text-xl font-semibold">
                        {slide.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full 
          hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 
          duration-300 transform -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft size={24} className="text-emerald-600" />
      </button>
      <button
        onClick={() => navigate('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full 
          hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 
          duration-300 transform translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight size={24} className="text-emerald-600" />
      </button>

      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={`h-3 rounded-full transition-all duration-300 
              ${index === currentIndex 
                ? 'bg-emerald-600 w-6' 
                : 'bg-emerald-200 hover:bg-emerald-300 w-3'
              } hover:scale-110`}
          />
        ))}
      </div>
    </div>
  );
};

function Home() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Data state
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const date = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const user = getUserData();
        setUserData(user);
      }
    };
    
    checkAuth();
    
    // Listen for storage events (for logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  // Fetch milk quality data when authenticated
  useEffect(() => {
    const fetchMilkQualityData = async () => {
      if (!isLoggedIn) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the authentication token
        const token = localStorage.getItem('token');
        
        // Set up the request with the auth token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Make the API request
        const response = await axios.get(`${API_BASE_URL}/api/milk-quality/${date}`, config);
        
        // Update state with fetched data
        setTodayData(response.data);
      } catch (err) {
        console.error('Error fetching milk quality data:', err);
        setError('Failed to load milk quality data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMilkQualityData();
  }, [isLoggedIn, date]);

  const slides = [
    {
      icon: <Milk size={32} className="font-bold text-emerald-600" />,
      image: "/milma.jpeg",
      alt: "Cow eating grass",
      title: " പാലിന്റെ മേന്മ, നാടിന്റെ നന്മ."
    },
    {
      icon: <Milk size={32} className="font-bold text-emerald-600" />,
      image: "/healthycows.jpg",
      alt: "Cow eating grass",
      title: " ആരോഗ്യമുള്ള കന്നുകാലികളിൽ നിന്നുള്ള പാൽ ശേഖരണം"
    },
    {
      icon: <ClipboardCheck size={32} className="font-bold text-teal-600" />,
      image: "/testing.jpg",
      alt: "Quality Test",
      title: " പാൽ ഗുണനിലവാര പരിശോധന"
    },
    {
      icon: <Truck size={32} className="font-bold text-emerald-600" />,
      image: "/delivery.jpg",
      alt: "Delivery",
      title: " ഡെലിവറി രാവിലെ 6 മണി മുതൽ ആരംഭിക്കുന്നു"
    },
    {
      icon: <Syringe size={32} className="font-bold text-teal-600" />,
      image: "/cowvaxination.jpg",
      alt: "Vaccination",
      title: " കന്നുകാലികൾക്ക് വാക്സിനേഷനും ആരോഗ്യവും ഉറപ്പാക്കുന്നു"
    },
    {
      icon: <MapPin size={32} className="font-bold text-teal-600" />,
      image: "/locationf1.jpg",
      alt: "location",
      title: " ഇപ്പോൾ ഡെലിവറി പാതിരിപ്പാടം പ്രദേശത്ത് മാത്രം"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/80 to-green-50">
      <div className="relative bg-fixed bg-cover bg-center">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
        <div className="relative">
          <Header/>
          
          <div className="relative w-full bg-gradient-to-b from-emerald-50/60 to-teal-50/60 pt-28">
            <div className="max-w-4xl mx-auto py-16 px-4 text-center">
              <h2 className="text-5xl font-bold text-emerald-800 mb-6 animate-fade-in">
                Welcome to God's Own Dairy
              </h2>
              <p className="text-2xl font-bold text-emerald-700 leading-relaxed">
              ശുദ്ധം. വിശ്വസ്തം. സുരക്ഷിതം!
              </p>
            </div>
          </div>

          <main className="relative mt-32 p-8 space-y-24">
            <StageSlider slides={slides} />
            

            {isLoggedIn ? (
              <div className="p-4 bg-gray-50 min-h-screen flex items-center">
  <div className="max-w-4xl mx-auto w-full">
                 
              
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-7 border-b border-gray-100">
                      <h1 className="text-3xl font-bold text-gray-800">Milk Quality </h1>
                      
                    </div>
                    
                    {/* Today's Milk Quality Display Section */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                        Today's Milk Quality
                      </h2>
                      
                      {isLoading ? (
                        <div className="text-center py-10 px-4 bg-gray-50 rounded-lg flex flex-col items-center">
                          <Loader className="w-8 h-8 text-blue-500 mb-3 animate-spin" />
                          <p className="text-gray-600">Loading milk quality data...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-10 px-4 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center">
                          <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                          <p className="text-red-600">{error}</p>
                        </div>
                      ) : todayData ? (
                        <div>
                          <div className="text-center mb-4 text-gray-600 flex justify-center items-center">
                            <Info className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">{formatDate(date)}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className={`${getQualityColor('fat', todayData.fat)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">Fat</div>
                                <Droplet className="w-5 h-5 text-blue-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.fat}%</div>
                            </div>
                            
                            <div className={`${getQualityColor('protein', todayData.protein)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">Protein</div>
                                <BarChart className="w-5 h-5 text-green-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.protein}%</div>
                            </div>
                            
                            <div className={`${getQualityColor('lactose', todayData.lactose)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">Lactose</div>
                                <Beaker className="w-5 h-5 text-purple-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.lactose}%</div>
                            </div>
                            
                            <div className={`${getQualityColor('snf', todayData.snf)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">SNF</div>
                                <BarChart className="w-5 h-5 text-yellow-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.snf}%</div>
                            </div>
                            
                            <div className={`${getQualityColor('temperature', todayData.temperature)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">Temperature</div>
                                <Thermometer className="w-5 h-5 text-red-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.temperature}°C</div>
                            </div>
                            
                            <div className={`${getQualityColor('ph', todayData.ph)} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-700">pH Level</div>
                                <CircleAlert className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">{todayData.ph}</div>
                            </div>
                          </div>
                          
                          {todayData.remarks && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="flex items-center mb-2 text-gray-700">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                <span className="font-medium">Remarks:</span>
                              </div>
                              <div className="text-gray-700">{todayData.remarks}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-10 px-4 bg-gray-50 rounded-lg flex flex-col items-center">
                          <Info className="w-8 h-8 text-blue-500 mb-3" />
                          <div className="text-gray-500 mb-2">No milk quality data recorded for today.</div>
                          {date === new Date().toISOString().split('T')[0] && 
                            <div className="text-blue-600 font-medium flex items-center mt-2">
                              <ArrowLeft className="w-4 h-4 mr-1" />
                              Use the form below to add today's data
                            </div>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto py-12">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 backdrop-blur-[3px]"></div>
                  <p className="relative font-bold text-green-700 text-2xl text-center leading-relaxed p-8 bg-green/60">
                  "Quality milk plays a vital role in daily life, providing essential nutrients for growth, strength, and overall well-being."
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: <Leaf className="font-bold text-emerald-600" size={24} />,
                  title: "പുതിയ ഉൽപ്പന്നങ്ങൾ",
                  description: "ഞങ്ങളുടെ എല്ലാ ഉൽപ്പന്നങ്ങളും പുതിയതും ഞങ്ങളുടെ ഫാമിൽ നിന്നുള്ളതും ഉയർന്ന നിലവാരം പുലർത്തുന്നതായി ഞങ്ങൾ ഉറപ്പാക്കുന്നു.."
                },
                {
                  icon: <Workflow className="font-bold text-teal-600" size={24} />,
                  title: "തൊഴിലവസരങ്ങൾ",
                  description: "തൊഴിലില്ലാത്തവർക്ക് ജോലി നൽകുകയും അവരുടെ ജീവിതനിലവാരം ഉയർത്തുകയും ചെയ്യുക."
                },
                {
                  icon: <Users className="font-bold text-emerald-600" size={24} />,
                  title: "കൃഷിയെ പ്രോത്സാഹിപ്പിക്കുന്നു",
                  description: "കർഷകരുടെ ആശയങ്ങൾ കൈമാറ്റം ചെയ്യാനും അവരുടെ വിളവെടുപ്പ് പ്രോത്സാഹിപ്പിക്കാനും കൃഷിയിൽ താൽപ്പര്യമുണ്ടാക്കാനുമുള്ള ഒരു പ്ലാറ്റ്ഫോം കൂടിയാണിത്."
                }
              ].map((feature, index) => (
                <div key={index} className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-emerald-50/60"></div>
                  <div className="relative p-6 hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full group-hover:scale-110 transition-all duration-300">
                        {feature.icon}
                      </div>
                      <p className="text-xl font-semibold text-gray-800 group-hover:text-emerald-700">{feature.title}</p>
                    </div>
                    <p className="text-gray-700 text-lg">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/40 to-teal-50/40"></div>
                <div className="relative p-8 bg-white/70">
                  <h2 className="text-3xl font-bold text-emerald-800 mb-6">Product Information</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                  "Our cattle farm products are carefully produced to ensure freshness, quality, and sustainability, supporting both healthy living and local communities."
                  </p>
                </div>
              </div>
            </div>
          </main>
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default Home;