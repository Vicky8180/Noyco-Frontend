// 'use client';

// import { useState, useEffect } from 'react';

// export default function TestimonialsSection() {
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);

//   const testimonials = [
//     {
//       id: 1,
//       text: "Noyco has completely transformed my evening routine. The sleep stories are like a gentle journey that carries me into the most peaceful dreams.",
//       author: "Maya Chen",
//       role: "UX Designer",
//       location: "San Francisco",
//       image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face&auto=format",
//       bgGradient: "from-blue-400/20 via-teal-300/15 to-cyan-200/20",
//       floatingElement: "🌙"
//     },
//     {
//       id: 2,
//       text: "The meditation sessions feel like having a wise friend guide me through life's challenges. I've found an inner strength I never knew existed.",
//       author: "James Rodriguez",
//       role: "Software Engineer", 
//       location: "Austin",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face&auto=format",
//       bgGradient: "from-emerald-400/20 via-green-300/15 to-teal-200/20",
//       floatingElement: "🧘‍♂️"
//     },
//     {
//       id: 3,
//       text: "Every morning with Noyco feels like opening a door to possibility. The nature sounds create my perfect sanctuary for focus and creativity.",
//       author: "Sarah Thompson",
//       role: "Creative Director",
//       location: "Portland",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face&auto=format",
//       bgGradient: "from-purple-400/20 via-indigo-300/15 to-blue-200/20",
//       floatingElement: "🌅"
//     },
//     {
//       id: 4,
//       text: "As a busy parent, Noyco gives me those precious moments of peace. It's like finding an oasis of tranquility in the beautiful chaos of family life.",
//       author: "David Park",
//       role: "Marketing Manager",
//       location: "Seattle",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face&auto=format",
//       bgGradient: "from-orange-400/20 via-amber-300/15 to-yellow-200/20",
//       floatingElement: "🏡"
//     }
//   ];

//   const quickStories = [
//     { text: "Sleep stories are magical", emoji: "✨", author: "Emma K." },
//     { text: "Anxiety melted away", emoji: "🦋", author: "Alex M." },
//     { text: "Morning meditations changed everything", emoji: "🌸", author: "Jordan L." },
//     { text: "Focus sessions boosted my productivity", emoji: "🎯", author: "Casey R." },
//     { text: "Nature sounds are pure bliss", emoji: "🌿", author: "Taylor B." },
//     { text: "Found my inner peace", emoji: "💫", author: "River P." }
//   ];

//   useEffect(() => {
//     setIsVisible(true);
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-300/10 to-teal-300/10 rounded-full blur-xl animate-float"></div>
//         <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-300/10 to-blue-300/10 rounded-full blur-xl animate-float-delayed"></div>
//         <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-300/10 to-cyan-300/10 rounded-full blur-xl animate-gentle-bounce"></div>
//         <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full blur-xl animate-float"></div>
        
//         {/* Floating particles */}
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-teal-300/40 rounded-full animate-twinkle"
//             style={{
//               top: `${Math.random() * 80 + 10}%`,
//               left: `${Math.random() * 80 + 10}%`,
//               animationDelay: `${i * 0.8}s`,
//               animationDuration: `${3 + Math.random() * 2}s`
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Animated header */}
//         <div className="text-center mb-16">
//           <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/50 shadow-lg">
//               <div className="flex -space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
//                 ))}
//               </div>
//               <span className="text-gray-700 font-medium">Join 100M+ happy members</span>
//             </div>
            
//             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
//               Stories that inspire.
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600">
//                 Lives transformed.
//               </span>
//             </h2>
            
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
//               Real people sharing how Noyco brought peace, better sleep, and mindfulness into their daily lives.
//             </p>
//           </div>
//         </div>

//         {/* Main testimonial carousel with smooth animations */}
//         <div className="mb-20">
//           <div className="relative max-w-5xl mx-auto h-[500px]">
//             {testimonials.map((testimonial, index) => (
//               <div
//                 key={testimonial.id}
//                 className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
//                   index === currentTestimonial 
//                     ? 'opacity-100 translate-x-0 scale-100' 
//                     : index < currentTestimonial
//                       ? 'opacity-0 -translate-x-full scale-95'
//                       : 'opacity-0 translate-x-full scale-95'
//                 }`}
//               >
//                 <div className={`bg-gradient-to-br ${testimonial.bgGradient} rounded-3xl p-8 lg:p-12 h-full flex items-center border border-white/30 shadow-2xl backdrop-blur-sm relative overflow-hidden`}>
//                   {/* Floating emoji */}
//                   <div className="absolute top-8 right-8 text-6xl animate-gentle-bounce opacity-20">
//                     {testimonial.floatingElement}
//                   </div>
                  
//                   <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
//                     {/* Content */}
//                     <div className="lg:order-1">
//                       <div className="flex mb-6">
//                         {[...Array(5)].map((_, i) => (
//                           <svg key={i} className="w-5 h-5 text-yellow-400 fill-current animate-twinkle" style={{animationDelay: `${i * 0.1}s`}} viewBox="0 0 24 24">
//                             <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                           </svg>
//                         ))}
//                       </div>
                      
//                       <blockquote className="text-xl lg:text-2xl text-gray-800 leading-relaxed mb-8 font-light">
//                         "{testimonial.text}"
//                       </blockquote>
                      
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg animate-gentle-pulse">
//                           <img 
//                             src={testimonial.image} 
//                             alt={testimonial.author}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <div className="font-semibold text-gray-900 text-lg">{testimonial.author}</div>
//                           <div className="text-gray-600">{testimonial.role}</div>
//                           <div className="text-gray-500 text-sm">{testimonial.location}</div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Visual element */}
//                     <div className="lg:order-2 flex justify-center">
//                       <div className="relative">
//                         <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl animate-gentle-float">
//                           <img 
//                             src={testimonial.image} 
//                             alt={testimonial.author}
//                             className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-700"
//                           />
//                         </div>
                        
//                         {/* Floating elements around image */}
//                         <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-float">
//                           <span className="text-2xl">{testimonial.floatingElement}</span>
//                         </div>
                        
//                         <div className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg animate-float-delayed">
//                           <div className="text-sm font-semibold text-gray-800">Noyco Member</div>
//                           <div className="text-xs text-gray-600">Since 2023</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {/* Navigation indicators */}
//             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
//               {testimonials.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentTestimonial(index)}
//                   className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                     index === currentTestimonial 
//                       ? 'bg-white w-8 shadow-lg' 
//                       : 'bg-white/50 hover:bg-white/70'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

        
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           33% { transform: translateY(-10px) rotate(1deg); }
//           66% { transform: translateY(-5px) rotate(-1deg); }
//         }
        
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           33% { transform: translateY(-8px) rotate(-1deg); }
//           66% { transform: translateY(-12px) rotate(1deg); }
//         }
        
//         @keyframes gentle-bounce {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-15px); }
//         }
        
//         @keyframes gentle-float {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(-8px) scale(1.02); }
//         }
        
//         @keyframes gentle-pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.05); }
//         }
        
//         @keyframes twinkle {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.2); }
//         }
        
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
//         .animate-gentle-bounce { animation: gentle-bounce 4s ease-in-out infinite; }
//         .animate-gentle-float { animation: gentle-float 5s ease-in-out infinite; }
//         .animate-gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
//         .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
//         .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
//       `}</style>
//     </section>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Play, Heart, Zap, Moon, Brain, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      text: "Noyco transformed my chaotic mornings into moments of pure zen. The guided breathing exercises feel like a warm hug for my soul.",
      author: "Maya Chen",
      role: "Creative Director",
      company: "Adobe",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Morning Ritual",
      icon: <Sparkles className="w-5 h-5" />,
      gradient: "from-orange-400 to-pink-400",
      bgColor: "bg-orange-50"
    },
    {
      id: 2,
      text: "The sleep stories are magical! I drift off within minutes, and wake up feeling like I've been recharged by nature itself.",
      author: "James Rodriguez",
      role: "Product Manager", 
      company: "Spotify",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Better Sleep",
      icon: <Moon className="w-5 h-5" />,
      gradient: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50"
    },
    {
      id: 3,
      text: "My anxiety melted away after just one week. Noyco gave me tools I never knew I needed – it's like therapy in my pocket.",
      author: "Sarah Thompson",
      role: "Wellness Coach",
      company: "Mindful Living",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Stress Relief",
      icon: <Heart className="w-5 h-5" />,
      gradient: "from-green-400 to-blue-500",
      bgColor: "bg-green-50"
    },
    {
      id: 4,
      text: "Focus mode is incredible! I've never been able to concentrate this deeply. It's like upgrading my brain's operating system.",
      author: "David Park",
      role: "Software Engineer",
      company: "Tesla",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Deep Focus",
      icon: <Brain className="w-5 h-5" />,
      gradient: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50"
    },
    {
      id: 5,
      text: "The energy sessions give me superpowers! I start each day feeling unstoppable and ready to conquer anything.",
      author: "Lisa Wang",
      role: "Entrepreneur",
      company: "TechFlow",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Energy Boost",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      id: 6,
      text: "Noyco is my daily dose of happiness. Each session fills me with gratitude and joy that radiates throughout my entire day.",
      author: "Michael Chen",
      role: "Life Coach",
      company: "Mindset Masters",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face&auto=format",
      rating: 5,
      category: "Daily Joy",
      icon: <Sparkles className="w-5 h-5" />,
      gradient: "from-pink-400 to-rose-400",
      bgColor: "bg-pink-50"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return result;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Loved by millions worldwide
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Life-changing stories from our
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> community</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real people sharing how Noyco transformed their daily wellness journey into something extraordinary
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}`}
                className={`group ${testimonial.bgColor} rounded-2xl p-6 relative overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                  index === 1 ? 'lg:scale-105 lg:shadow-xl' : ''
                } ${isAnimating ? 'animate-pulse' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Category Badge */}
                <div className={`inline-flex items-center bg-gradient-to-r ${testimonial.gradient} text-white px-3 py-1 rounded-full text-sm font-medium mb-6`}>
                  {testimonial.icon}
                  <span className="ml-2">{testimonial.category}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-800 mb-6 text-base leading-relaxed font-medium">
                  "{testimonial.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center`}>
                      <Play className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-12 space-x-6">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 border border-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAnimating(false), 600);
                    }
                  }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-orange-400 to-pink-400 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 border border-gray-100"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
  {[
    { number: "10M+", label: "Happy Users", icon: <Heart className="w-6 h-6" />, gradient: "from-pink-400 to-rose-400" },
    { number: "4.9★", label: "App Rating", icon: <Star className="w-6 h-6" />, gradient: "from-yellow-400 to-orange-400" },
    { number: "500M+", label: "Minutes Meditated", icon: <Brain className="w-6 h-6" />, gradient: "from-blue-400 to-indigo-400" },
    { number: "98%", label: "Feel Better", icon: <Sparkles className="w-6 h-6" />, gradient: "from-purple-400 to-pink-400" }
  ].map((stat, index) => (
    <div key={index} className="text-center group">
      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl mb-2 text-white group-hover:scale-110 transition-transform duration-300`}>
          {stat.icon}
        </div>
        <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
          {stat.number}
        </div>
        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
      </div>
    </div>
  ))}
</div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Your transformation starts today
              </h3>
              <p className="text-lg mb-6 max-w-xl mx-auto opacity-90">
                Join millions who've discovered inner peace, better sleep, and unstoppable focus with Noyco
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start Free Trial
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}