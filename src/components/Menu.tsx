import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';
import { Facebook, MapPin } from 'lucide-react';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <MobileNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gspot-bg-gradient">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-gspot gspot-logo mb-4">Our Menu</h2>
        <p className="text-green-700 max-w-2xl mx-auto font-gspot-body italic gspot-text-glow">
        If YOU are looking for a COZY and BUDGETMEAL where “FOOD LOVERS” UNITE. 
        <br />TARA NA SA G$POT HANGOUT
        <br />  - SARAP NA BABALIK BALIKAN -
    
        </p>
      </div>

      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-16">
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-3 gspot-text-glow">{category.icon}</span>
              <h3 className="text-3xl font-gspot font-medium text-green-800 gspot-text-glow">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem =>
                  cartItem.menuItemId === item.id &&
                  !cartItem.selectedVariation &&
                  (!cartItem.selectedAddOns || cartItem.selectedAddOns.length === 0)
                );
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    cartItemId={cartItem?.id}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      </main>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Facebook Link */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-gspot font-semibold mb-4 text-green-100">Connect With Us</h3>
              <a
                href="https://www.facebook.com/GSpotHangout2025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-green-800 rounded-lg hover:bg-green-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Facebook className="h-6 w-6" fill="currentColor" />
                <span>G'$pot Hang-out Facebook Page</span>
              </a>
              <p className="text-green-200 text-sm mt-3">
                Follow us for updates, promos, and delicious content!
              </p>
            </div>

            {/* Physical Address */}
            <div className="text-center md:text-right">
              <h3 className="text-xl font-gspot font-semibold mb-4 text-green-100">Visit Us</h3>
              <div className="inline-flex items-start gap-3 text-left">
                <MapPin className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium text-lg leading-relaxed">
                    #5031 E Fredel St. Gent De Leon<br />
                    Valenzuela City
                  </p>
                  <p className="text-green-200 text-sm mt-2">
                    Come visit us and taste the difference!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-green-700 text-center">
            <p className="text-green-200 text-sm">
              © 2025 G'$pot Hang-out. All rights reserved.
            </p>
            <p className="text-green-300 text-xs mt-2 font-gspot italic">
              - SARAP NA BABALIK BALIKAN -
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Menu;
