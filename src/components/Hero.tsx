import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative gspot-bg-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-gspot gspot-logo mb-6 animate-fade-in">
          G'$pot Hangout
          <span className="block text-3xl md:text-4xl font-gspot-body italic gspot-tagline mt-2">OVERLOAD MEAL</span>
        </h1>
        <p className="text-xl text-gold-300 mb-8 max-w-2xl mx-auto animate-slide-up font-gspot-body italic gspot-text-glow">
          Taste worth repeating!
        </p>
        <div className="flex justify-center">
          <a 
            href="#menu"
            className="gspot-button-primary text-gspot-black px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 font-medium"
          >
            Explore Menu
          </a>
        </div>
        <div className="mt-6 text-sm text-gold-400 font-gspot-body italic">
          EST. 2025
        </div>
      </div>
    </section>
  );
};

export default Hero;