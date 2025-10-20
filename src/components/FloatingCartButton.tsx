import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-6 gspot-button-primary p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 z-40 md:hidden animate-bounce-gentle"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold gspot-border-glow">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;