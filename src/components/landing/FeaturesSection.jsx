// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Moon, Heart, Sparkles, Zap, Play,
//   ArrowRight, CheckCircle
// } from 'lucide-react';

// export default function FeaturesSection() {
//   const [activeFeature, setActiveFeature] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);

//   const features = [
//     {
//       emoji: "🌙",
//       icon: <Moon className="w-6 h-6" />,
//       title: "Sleep Better",
//       subtitle: "Sweet Dreams Await",
//       description: "Drift into peaceful slumber with our curated sleep stories, calming soundscapes, and guided bedtime meditations designed by sleep experts.",
//       color: "from-indigo-400 to-purple-500",
//       bgColor: "bg-indigo-50",
//       borderColor: "border-indigo-200",
//       stats: "2.1M+ sleep stories nightly",
//       metric: "87% fall asleep faster",
//       benefits: ["Reduce sleep onset by 38%", "Improve sleep quality naturally", "Wake up feeling refreshed"],
//       illustration: "🌙💤✨"
//     },
//     {
//       emoji: "🧘‍♀️",
//       icon: <Heart className="w-6 h-6" />,
//       title: "Meditate Daily",
//       subtitle: "Find Your Inner Peace",
//       description: "Transform your mind with guided meditations for every mood, from stress relief to deep focus, led by world-renowned meditation teachers.",
//       color: "from-green-400 to-blue-500",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//       stats: "5.3M+ meditations daily",
//       metric: "92% feel calmer",
//       benefits: ["Reduce stress by 60%", "Increase focus & clarity", "Build lasting mindful habits"],
//       illustration: "🧘‍♀️🌸🕉️"
//     },
//     {
//       emoji: "🌿",
//       icon: <Sparkles className="w-6 h-6" />,
//       title: "Relax Deeply",
//       subtitle: "Pure Tranquility",
//       description: "Melt away tension with nature sounds, breathing exercises, and progressive relaxation techniques that restore your natural calm.",
//       color: "from-emerald-400 to-teal-500",
//       bgColor: "bg-emerald-50",
//       borderColor: "border-emerald-200",
//       stats: "1.8M+ hours of relaxation",
//       metric: "78% less anxiety",
//       benefits: ["Lower anxiety naturally", "Improve overall mood", "Release physical tension"],
//       illustration: "🌿🌊🧘‍♂️"
//     },
//     {
//       emoji: "⚡️",
//       icon: <Zap className="w-6 h-6" />,
//       title: "Focus Better",
//       subtitle: "Unlock Your Potential",
//       description: "Supercharge your productivity with focus music, mindful work sessions, and concentration techniques that keep you in the zone.",
//       color: "from-yellow-400 to-orange-500",
//       bgColor: "bg-yellow-50",
//       borderColor: "border-yellow-200",
//       stats: "900K+ focus sessions weekly",
//       metric: "84% more productive",
//       benefits: ["Boost productivity by 40%", "Enhanced concentration power", "Eliminate distractions naturally"],
//       illustration: "⚡️🎯💡"
//     }
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveFeature((prev) => (prev + 1) % features.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [features.length]);

//   useEffect(() => {
//     const sectionElement = document.getElementById('features-section');
//     if (!sectionElement) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(sectionElement); // Optional: stop observing once visible
//         }
//       },
//       { threshold: 0.1 }
//     );
    
//     observer.observe(sectionElement);
    
//     return () => observer.disconnect();
//   }, []);

//   const currentFeature = features[activeFeature];

//   return (
//     <section id="features-section" className="py-20 bg-white relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
//         {/* Header */}
//         <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <div className="inline-flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Sparkles className="w-4 h-4 mr-2" />
//             Science-backed wellness tools
//           </div>
//           <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//             Everything you need for a
//             <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"> healthier mind</span>
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             Discover powerful tools designed by experts to help you sleep better, stress less, and live more mindfully every day
//           </p>
//         </div>

//         {/* Feature Navigation & Main Card Container */}
//         <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <div className="flex flex-wrap justify-center gap-3 mb-12">
//             {features.map((feature, index) => (
//               <button
//                 key={feature.title}
//                 onClick={() => setActiveFeature(index)}
//                 className={`group relative flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-500 transform hover:scale-105 ${
//                   activeFeature === index
//                     ? `bg-gradient-to-r ${feature.color} text-white shadow-xl scale-105`
//                     : 'bg-gray-50/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-100'
//                 }`}
//               >
//                 <span className="text-lg">{feature.emoji}</span>
//                 <div className={`p-2 rounded-xl transition-colors duration-300 ${
//                   activeFeature === index ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
//                 }`}>
//                   {feature.icon}
//                 </div>
//                 <span className="font-bold">{feature.title}</span>
//                 {activeFeature === index && (
//                   <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur-sm animate-pulse"></div>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Main Feature Card */}
//           <div key={activeFeature} className={`animate-fade-in ${currentFeature.bgColor} rounded-3xl p-6 shadow-2xl border-2 ${currentFeature.borderColor} transform transition-all duration-700 hover:scale-[1.02] relative overflow-hidden`}>
//             <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-5`}></div>
            
//             <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
//               {/* Content */}
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-4">
//                   <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${currentFeature.color} text-white shadow-xl`}>
//                     <span className="text-2xl">{currentFeature.emoji}</span>
//                   </div>
//                   <div>
//                     <h3 className="text-3xl font-bold text-gray-900">{currentFeature.title}</h3>
//                     <p className="text-lg text-gray-600 font-medium">{currentFeature.subtitle}</p>
//                   </div>
//                 </div>

//                 <p className="text-lg text-gray-700 leading-relaxed">{currentFeature.description}</p>

//                 {/* Benefits */}
//                 <div className="space-y-3">
//                   {currentFeature.benefits.map((benefit, idx) => (
//                     <div key={idx} className="flex items-center space-x-3 group">
//                       <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentFeature.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
//                         <CheckCircle className="w-5 h-5 text-white" />
//                       </div>
//                       <span className="text-gray-800 font-medium">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4 pt-2">
//                   <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
//                     <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Active Users</div>
//                     <div className="text-xl font-bold text-gray-900">{currentFeature.stats}</div>
//                   </div>
//                   <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
//                     <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Success Rate</div>
//                     <div className="text-xl font-bold text-gray-900">{currentFeature.metric}</div>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="pt-2">
//                     <button className={`group inline-flex items-center bg-gradient-to-r ${currentFeature.color} text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
//                     <Play className="w-5 h-5 mr-2 fill-current" />
//                     Try {currentFeature.title}
//                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                     </button>
//                 </div>
//               </div>

//               {/* Visual */}
//               <div className="relative hidden lg:block">
//                 <div className="bg-gray-50/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 text-center relative overflow-hidden">
//                   <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-5`}></div>
//                   <div className="relative z-10 py-8">
//                     <div className="text-6xl mb-4 animate-bounce">{currentFeature.emoji}</div>
//                     <div className="text-4xl mb-6 space-x-2">
//                       {currentFeature.illustration.split('').map((emoji, idx) => (
//                         <span key={idx} className="inline-block animate-pulse" style={{animationDelay: `${idx * 0.2}s`}}>
//                           {emoji}
//                         </span>
//                       ))}
//                     </div>
//                     <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${currentFeature.color} rounded-full flex items-center justify-center shadow-xl animate-pulse`}>
//                       <div className="w-12 h-12 text-white">
//                         {currentFeature.icon}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }











'use client';

import { useState, useEffect } from 'react';
import {
  Moon, Heart, Sparkles, Zap, Play, ArrowRight, CheckCircle
} from 'lucide-react';

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Sleep Better",
      subtitle: "Guided meditations for restful nights",
      description: "Calming practices designed by sleep experts to help you unwind, relax, and enjoy deeper, more restorative sleep.",
      benefits: ["Sleep stories", "Breathing exercises", "Gentle music"],
      stats: "1M+",
      metric: "92%",
      icon: <Moon className="w-8 h-8" />,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Mindful Living",
      subtitle: "Find calm in the chaos",
      description: "Daily mindfulness tools to help you manage stress, build resilience, and stay present in every moment.",
      benefits: ["Daily check-ins", "Mood tracking", "Mindful reminders"],
      stats: "500K+",
      metric: "89%",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Focus & Clarity",
      subtitle: "Cut through distractions",
      description: "Scientifically designed soundscapes and focus tools to improve productivity and mental clarity.",
      benefits: ["Focus music", "Productivity timer", "Brain exercises"],
      stats: "300K+",
      metric: "87%",
      icon: <Zap className="w-8 h-8" />,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Daily Inspiration",
      subtitle: "Stay motivated every day",
      description: "Start your mornings with uplifting messages and positive affirmations tailored to your journey.",
      benefits: ["Morning affirmations", "Daily quotes", "Motivational nudges"],
      stats: "750K+",
      metric: "94%",
      icon: <Sparkles className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [features.length]);

  const current = features[activeFeature];

  return (
    <section id="features-section" className="relative py-28 overflow-hidden">
      {/* Background Sky */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Soothing Sky Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Header */}
        <div className="text-center mb-24 drop-shadow-lg">
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900">
            Wellness reimagined. <br />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              The Easy way.
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Simple. Elegant. Backed by science. Discover experiences crafted to help you sleep deeper, focus better, and live more mindfully.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => setActiveFeature(i)}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-500 ${
                activeFeature === i
                  ? 'bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-400 text-white shadow-md scale-105'
                  : 'bg-white/70 backdrop-blur text-gray-700 hover:bg-white/90'
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <div className="relative rounded-3xl border border-gray-200 overflow-hidden shadow-xl bg-white/90 backdrop-blur">
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-12 lg:p-16 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r ${current.gradient} text-white shadow-lg`}>
                  {current.icon}
                </div>
                <div>
                  <h3 className="text-4xl font-semibold text-gray-900">{current.title}</h3>
                  <p className="text-lg text-gray-500">{current.subtitle}</p>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">{current.description}</p>

              {/* Benefits as badges */}
              <div className="flex flex-wrap gap-3 pt-4">
                {current.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    {b}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="p-4 rounded-2xl bg-gray-50 shadow-inner text-center">
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{current.stats}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 shadow-inner text-center">
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{current.metric}</p>
                </div>
              </div>

              {/* CTA */}
              <button className="mt-10 inline-flex items-center px-6 py-3 rounded-full 
                bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-400 
                text-white font-medium shadow-md hover:opacity-90 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Try {current.title}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Right Content - Gradient Illustration Box */}
            <div className="relative flex items-center justify-center p-12 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
              <div className="w-72 h-72 rounded-3xl bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-400 opacity-20 blur-3xl"></div>
              <div className="absolute text-center">
                <h4 className="text-3xl font-semibold text-gray-800">{current.title}</h4>
                <p className="mt-2 text-gray-600">{current.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
