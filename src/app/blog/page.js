"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "ai", name: "AI & Technology" },
    { id: "health", name: "Mental Health" },
    { id: "product", name: "Product Updates" },
    { id: "company", name: "Company News" }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI Companions: Building Meaningful Digital Relationships",
      excerpt: "Exploring how AI companions are evolving to provide more empathetic and personalized support for mental health and well-being.",
      category: "ai",
      author: "Sarah Chen",
      date: "December 15, 2024",
      readTime: "8 min read",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Understanding Loneliness in the Digital Age",
      excerpt: "A deep dive into how modern technology affects human connection and what we can do to combat digital isolation.",
      category: "health",
      author: "Dr. Michael Rodriguez",
      date: "December 10, 2024",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Introducing Voice Conversations: Your AI Companion Can Now Talk",
      excerpt: "We're excited to announce our new voice conversation feature, making interactions with your AI companion more natural than ever.",
      category: "product",
      author: "Emily Davis",
      date: "December 5, 2024",
      readTime: "4 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Privacy-First AI: How We Protect Your Personal Conversations",
      excerpt: "Learn about our comprehensive approach to data privacy and security in AI-powered personal assistance.",
      category: "ai",
      author: "Alex Johnson",
      date: "November 28, 2024",
      readTime: "7 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Building Emotional Intelligence in AI Systems",
      excerpt: "The technical and ethical considerations behind creating AI that can understand and respond to human emotions appropriately.",
      category: "ai",
      author: "Sarah Chen",
      date: "November 20, 2024",
      readTime: "10 min read",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Noyco Raises $10M Series A to Expand AI Companion Platform",
      excerpt: "We're thrilled to announce our Series A funding round to accelerate product development and reach more users worldwide.",
      category: "company",
      author: "Alex Johnson",
      date: "November 15, 2024",
      readTime: "3 min read",
      image: "/api/placeholder/400/250"
    }
  ];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
     

      {/* Hero Section */}
      <section className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display-large font-mier text-gray-900 mb-6">
              Noyco Blog
            </h1>
            <p className="text-title-large font-mier text-gray-600 mb-12 max-w-3xl mx-auto">
              Insights on AI, mental health, technology, and the future of human-computer interaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-button font-mier px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 shadow-md"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === "all" && featuredPost && (
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50"
            >
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="relative h-64 lg:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-caption-large font-mier bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-3 py-1 rounded-full">
                      Featured
                    </span>
                    <span className="text-caption font-mier text-gray-500 uppercase tracking-wide">
                      {categories.find(cat => cat.id === featuredPost.category)?.name}
                    </span>
                  </div>
                  <h2 className="text-headline-large font-mier text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-body-large font-mier text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-body font-mier text-gray-500">
                      <span>{featuredPost.author}</span>
                      <span>•</span>
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.id}`}
                      className="text-button font-mier text-gray-900 hover:text-gray-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" ? regularPosts : filteredPosts).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-caption font-mier text-gray-500 uppercase tracking-wide">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                  
                  <h3 className="text-title font-mier text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-body font-mier text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-1">
                      <span className="text-caption-large font-mier text-gray-900">{post.author}</span>
                      <div className="flex items-center space-x-2 text-caption font-mier text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-button-small font-mier text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
}
