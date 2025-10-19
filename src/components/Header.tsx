import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCategories } from '../hooks/useCategories';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onOrderTrackingClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  selectedCategory?: string;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onOrderTrackingClick, onCategoryClick, selectedCategory }) => {
  const { siteSettings, loading } = useSiteSettings();
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <header className="sticky top-0 z-50 gspot-bg-gradient backdrop-blur-sm border-b border-neon-green/30 gspot-neon-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 bg-gspot-black-light rounded-full animate-pulse gspot-border-glow" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "G'$pot Hangout"}
                className="w-10 h-10 rounded-full object-cover gspot-border-glow"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-2xl font-gspot gspot-logo">
              {loading ? (
                <div className="w-32 h-6 bg-gspot-black-light rounded animate-pulse" />
              ) : (
                siteSettings?.site_name || "G'$pot Hangout"
              )}
            </h1>
          </button>
          
          {/* Categories moved below header for all screen sizes */}

          <div className="flex items-center space-x-2">
            <button 
              onClick={onOrderTrackingClick}
              className="flex items-center gap-2 px-3 py-2 text-gold-200 hover:text-gold-400 hover:bg-gspot-black-light rounded-lg transition-all duration-200 text-sm font-medium gspot-border-glow"
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gold-200 hover:text-gold-400 hover:bg-gspot-black-light rounded-full transition-all duration-200 gspot-border-glow"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-gspot-black text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle gspot-neon-glow">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;