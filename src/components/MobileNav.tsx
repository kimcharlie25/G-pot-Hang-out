import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-16 z-40 gspot-bg-gradient backdrop-blur-sm border-b border-neon-green/30 gspot-neon-glow">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3">
        <button
          onClick={() => onCategoryClick('all')}
          className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full mr-3 transition-all duration-200 ${
            activeCategory === 'all'
              ? 'gspot-button-primary text-gspot-black'
              : 'bg-gspot-black-light text-gold-200 hover:text-gold-400 hover:bg-gspot-black gspot-border-glow'
          }`}
        >
          <span className="text-lg">🍽️</span>
          <span className="text-sm font-medium whitespace-nowrap">All</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full mr-3 transition-all duration-200 ${
              activeCategory === category.id
                ? 'gspot-button-primary text-gspot-black'
                : 'bg-gspot-black-light text-gold-200 hover:text-gold-400 hover:bg-gspot-black gspot-border-glow'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;