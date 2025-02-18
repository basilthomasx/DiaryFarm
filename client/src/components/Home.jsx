import React from 'react';
import Header from './Header';
import Footer from './Footer';
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
  ChevronLeft
} from 'lucide-react';

const StageSlider = ({ slides }) => {
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
  const slides = [
    {
      icon: <Milk size={32} className="font-bold text-emerald-600" />,
      image: "/healthycows.jpg",
      alt: "Cow eating grass",
      title: "ആരോഗ്യമുള്ള കന്നുകാലികളിൽ നിന്നുള്ള പാൽ ശേഖരണം"
    },
    {
      icon: <ClipboardCheck size={32} className="font-bold text-teal-600" />,
      image: "/milk Analyzer.jpg",
      alt: "Quality Test",
      title: "പാൽ ഗുണനിലവാര പരിശോധന"
    },
    {
      icon: <Truck size={32} className="font-bold text-emerald-600" />,
      image: "/delivery.jpg",
      alt: "Delivery",
      title: "ഡെലിവറി രാവിലെ 6 മണി മുതൽ ആരംഭിക്കുന്നു"
    },
    {
      icon: <Syringe size={32} className="font-bold text-teal-600" />,
      image: "/vaxination.jpg",
      alt: "Vaccination",
      title: "കന്നുകാലികൾക്ക് വാക്സിനേഷനും ആരോഗ്യവും ഉറപ്പാക്കുന്നു"
    },
    {
      icon: <Calendar size={32} className="font-bold text-emerald-600" />,
      image: "/Subscribtion.jpg",
      alt: "Subscription",
      title: "പാലിനുള്ള പ്രതിമാസ സബ്‌സ്‌ക്രിപ്‌ഷനുകൾ ലഭ്യമാണ്"
    },
    {
      icon: <MapPin size={32} className="font-bold text-teal-600" />,
      image: "/location.jpg",
      alt: "location",
      title: "ഇപ്പോൾ ഡെലിവറി പാതിരിപ്പാടം പ്രദേശത്ത് മാത്രം"
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
                ടെക്നോളജിയുടെ സ്പർശം, പ്രകൃതിയുടെ ശുദ്ധി!
              </p>
            </div>
          </div>

          <main className="relative mt-32 p-8 space-y-24">
            <StageSlider slides={slides} />

            <div className="max-w-3xl mx-auto py-12">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 backdrop-blur-[3px]"></div>
                <p className="relative font-bold text-green-700 text-2xl text-center leading-relaxed p-8 bg-green/60">
                  ഈ പ്ലാറ്റ്‌ഫോം ഉപഭോക്താക്കൾക്ക് സ്ഥിരത മെച്ചപ്പെടുത്തുന്നതിന് ഓരോ കർഷകനും അവരുടെ വിളവ് ഉൽപ്പന്നങ്ങൾ വാങ്ങാനും വിൽക്കാനും കഴിയും. ഇത് ഉടൻ ലഭ്യമാകും.
                </p>
              </div>
            </div>

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
                    Our products are carefully selected to ensure the highest quality and freshness. 
                    We work directly with local farmers to bring you the best seasonal produce and 
                    dairy products, maintaining strict quality control throughout our supply chain.
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