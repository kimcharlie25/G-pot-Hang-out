import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 gspot-bg-gradient min-h-screen">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-gspot font-medium text-green-800 mb-2 gspot-text-glow">Your cart is empty</h2>
          <p className="text-green-700 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="gspot-button-primary px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gspot-bg-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <button
            onClick={onContinueShopping}
            className="flex items-center space-x-2 text-green-700 hover:text-green-600 transition-colors duration-200 self-start gspot-border-glow px-4 py-2 rounded-lg bg-green-50"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex items-center justify-between sm:justify-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-gspot font-semibold text-green-800 gspot-text-glow">Your Cart</h1>
            <button
              onClick={clearCart}
              className="text-green-600 hover:text-green-500 transition-colors duration-200 text-sm sm:text-base font-medium gspot-border-glow px-4 py-2 rounded-lg bg-green-50"
            >
              Clear All
            </button>
          </div>
        </div>

      <div className="gspot-card-bg rounded-xl shadow-lg overflow-hidden mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b border-green-200' : ''}`}>
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="text-base font-gspot font-medium text-green-800 mb-1 gspot-text-glow">{item.name}</h3>
                  {item.selectedVariation && (
                    <p className="text-xs text-green-600 mb-1">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-green-600 mb-1">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-green-600 hover:text-green-500 hover:bg-green-100 rounded-full transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-green-50 rounded-xl p-1 gspot-border-glow">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <Minus className="h-3 w-3 text-green-600" />
                  </button>
                  <span className="font-semibold text-green-700 min-w-[24px] text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3 text-green-600" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-green-600">₱{item.totalPrice} each</p>
                  <p className="text-lg font-semibold text-green-700">₱{item.totalPrice * item.quantity}</p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-gspot font-medium text-green-800 mb-1 gspot-text-glow">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-green-600 mb-1">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-green-600 mb-1">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-semibold text-green-700">₱{item.totalPrice} each</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3 bg-green-50 rounded-xl p-1 gspot-border-glow">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-green-600" />
                  </button>
                  <span className="font-semibold text-green-700 min-w-[32px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-green-600" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-700">₱{item.totalPrice * item.quantity}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-green-600 hover:text-green-500 hover:bg-green-100 rounded-full transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gspot-card-bg rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between text-2xl font-gspot font-semibold text-green-800 mb-6 gspot-text-glow">
          <span>Total:</span>
          <span>₱{(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full gspot-button-primary py-4 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl"
        >
          Proceed to Checkout
        </button>
      </div>
      </div>
    </div>
  );
};

export default Cart;