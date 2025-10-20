import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onOrderTrackingClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  selectedCategory?: string;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onOrderTrackingClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-2 text-green-800 hover:text-green-700 transition-colors duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse border-2 border-green-600" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "G'$pot Hangout"}
                className="w-10 h-10 rounded-full object-cover border-2 border-green-600"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-gspot gspot-logo">
                {loading ? (
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                ) : (
                  siteSettings?.site_name || "G'$pot Hangout"
                )}
              </h1>
              {!loading && (
                <span className="text-[10px] text-green-600 font-small tracking-wider self-end -mt-1">EST 2025</span>
              )}
            </div>
          </button>
          
          {/* Categories moved below header for all screen sizes */}

          <div className="flex items-center space-x-2">
            <button 
              onClick={onOrderTrackingClick}
              className="flex items-center gap-2 px-3 py-2 text-green-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 text-sm font-medium border-2 border-green-300"
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>
            <button 
              onClick={onCartClick}
              className="relative p-2 text-green-700 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 border-2 border-green-300"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle shadow-md">
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