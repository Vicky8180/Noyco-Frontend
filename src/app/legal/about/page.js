"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Co-Founder",
      image: "/api/placeholder/150/150",
      bio: "Passionate about AI and healthcare innovation with 10+ years in tech leadership.",
      linkedin: "#"
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder", 
      image: "/api/placeholder/150/150",
      bio: "AI researcher and engineer focused on conversational AI and machine learning.",
      linkedin: "#"
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Chief Medical Officer",
      image: "/api/placeholder/150/150",
      bio: "Board-certified physician specializing in digital health and patient care.",
      linkedin: "#"
    },
    {
      name: "Emily Davis",
      role: "Head of Product",
      image: "/api/placeholder/150/150",
      bio: "Product strategist with expertise in user experience and healthcare technology.",
      linkedin: "#"
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Empathy First",
      description: "We believe in putting human connection and understanding at the center of everything we do."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Privacy & Security",
      description: "Your personal information and conversations are protected with enterprise-grade security."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Innovation",
      description: "We continuously push the boundaries of AI to create more meaningful and helpful interactions."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Accessibility",
      description: "We're committed to making our technology accessible to everyone, regardless of their circumstances."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to make AI more empathetic and human-centered."
    },
    {
      year: "2024",
      title: "First Product Launch",
      description: "Launched our AI companion platform with personalized conversation agents."
    },
    {
      year: "2024",
      title: "10K+ Users",
      description: "Reached our first major milestone with over 10,000 active users."
    },
    {
      year: "2024",
      title: "Series A Funding",
      description: "Secured funding to expand our team and enhance our AI capabilities."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
   

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-display font-mier text-gray-900 mb-8 leading-tight">
              Building the future of
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                human-AI connection
              </span>
            </h1>
            <p className="text-title-large font-mier text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              We're creating AI companions that understand, empathize, and support people in meaningful ways. 
              Our mission is to bridge the gap between technology and human connection.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "1M+", label: "Conversations" },
                { number: "24/7", label: "Availability" },
                { number: "95%", label: "Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-display font-mier text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-body font-mier text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display font-mier text-gray-900 mb-8 leading-tight">
                Our Mission
              </h2>
              <p className="text-title font-mier text-gray-700 leading-relaxed mb-8">
                At Noyco, we believe that everyone deserves to feel heard and understood. Our mission is to 
                create AI companions that provide genuine support, meaningful conversations, and personalized 
                care to help people navigate life's challenges.
              </p>
              <p className="text-body-large font-mier text-gray-600 leading-relaxed mb-8">
                We're not just building technology—we're building bridges between human needs and AI capabilities, 
                ensuring that our digital companions enhance rather than replace human connection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="text-button-large font-mier bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 px-8 py-4 rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/contact-us"
                  className="text-button-large font-mier border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 shadow-2xl border border-gray-200/50">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-title font-mier text-gray-900">Empathetic AI</h3>
                      <p className="text-body font-mier text-gray-600">Understanding human emotions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-title font-mier text-gray-900">Privacy First</h3>
                      <p className="text-body font-mier text-gray-600">Your data stays secure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-title font-mier text-gray-900">Always Improving</h3>
                      <p className="text-body font-mier text-gray-600">Continuously learning and evolving</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display font-mier text-gray-900 mb-8">
              Our Values
            </h2>
            <p className="text-title font-mier text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These core principles guide everything we do and shape how we build our products 
              to serve humanity better.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-800">
                  {value.icon}
                </div>
                <h3 className="text-title font-mier text-gray-900 mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-body font-mier text-gray-600 leading-relaxed text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display font-mier text-gray-900 mb-8">
              Our Journey
            </h2>
            <p className="text-title font-mier text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From a simple idea to a platform that's helping thousands of people every day.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="text-caption font-mier text-gray-500 mb-2 font-semibold">
                        {milestone.year}
                      </div>
                      <h3 className="text-headline font-mier text-gray-900 mb-4">
                        {milestone.title}
                      </h3>
                      <p className="text-body font-mier text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-4 h-4 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-display font-mier text-gray-900 mb-8">
              Meet Our Team
            </h2>
            <p className="text-title font-mier text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're a diverse group of engineers, designers, and healthcare professionals 
              passionate about making AI more human and accessible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-title font-mier text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-body font-mier text-gray-600 mb-4 font-medium">
                  {member.role}
                </p>
                <p className="text-body font-mier text-gray-500 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <Link
                  href={member.linkedin}
                  className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      
    </div>
  );
}