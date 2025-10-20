import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3">
        <button
          onClick={() => onCategoryClick('all')}
          className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full mr-3 transition-all duration-200 ${
            activeCategory === 'all'
              ? 'gspot-button-primary text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:text-green-800 hover:bg-green-50 border-2 border-gray-300'
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
                ? 'gspot-button-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:text-green-800 hover:bg-green-50 border-2 border-gray-300'
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