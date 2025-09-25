import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>


      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>
    </div>
  );
}

export default HomePage;