import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, RefreshCw, Package, MapPin, Phone, User, Calendar, DollarSign, FileText, Search, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { OrderWithItems } from '../hooks/useOrders';

interface OrderTrackingProps {
  onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ onBack }) => {
  const [searchType, setSearchType] = useState<'orderId' | 'phone'>('orderId');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
        return 'bg-green-600 text-white border-green-600';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'preparing':
        return <RefreshCw className="h-5 w-5" />;
      case 'ready':
        return <Package className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Your order is pending confirmation.';
      case 'confirmed':
        return 'Your order has been confirmed!';
      case 'preparing':
        return 'Your order is being prepared.';
      case 'ready':
        return 'Your order is ready for pickup/delivery!';
      case 'completed':
        return 'Your order has been completed. Thank you!';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Processing your order...';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatServiceType = (serviceType: string) => {
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1).replace('-', ' ');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      if (searchType === 'orderId') {
        // Search by order ID using database function for UUID text matching
        const { data: orderData, error: orderError } = await supabase
          .rpc('search_order_by_id', { search_term: searchValue.trim() });

        if (orderError) {
          // Fallback to client-side filtering if function doesn't exist yet
          console.warn('Database function not found, using fallback method:', orderError);
          const { data, error: fetchError } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (*)
            `)
            .order('created_at', { ascending: false })
            .limit(100);

          if (fetchError) throw fetchError;
          
          const searchValueUpper = searchValue.trim().toUpperCase();
          const matchingOrder = data?.find(order => 
            order.id.slice(-8).toUpperCase().includes(searchValueUpper) ||
            order.id.toUpperCase().includes(searchValueUpper)
          );
          
          if (matchingOrder) {
            setOrder(matchingOrder as OrderWithItems);
          } else {
            setError('No order found with this ID');
          }
        } else if (orderData && orderData.length > 0) {
          // Fetch order items separately
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderData[0].id);

          if (itemsError) throw itemsError;

          setOrder({
            ...orderData[0],
            order_items: items || []
          } as OrderWithItems);
        } else {
          setError('No order found with this ID');
        }
      } else {
        // Search by phone number
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('contact_number', searchValue.trim())
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;
        
        if (data && data.length > 0) {
          setOrder(data[0] as OrderWithItems);
        } else {
          setError('No order found with this phone number');
        }
      }
    } catch (err) {
      console.error('Error searching for order:', err);
      setError('Failed to search for order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setOrder(null);
    setError(null);
  };

  return (
    <div className="min-h-screen gspot-bg-gradient">
      {/* Header */}
      <div className="gspot-card-bg shadow-lg border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-green-700 hover:text-green-600 transition-colors duration-200 gspot-border-glow px-4 py-2 rounded-lg bg-green-50"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Menu</span>
              </button>
              <h1 className="text-2xl font-gspot font-semibold text-green-800 gspot-text-glow">Track Your Order</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="gspot-card-bg rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Search Order</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSearchType('orderId')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  searchType === 'orderId'
                    ? 'gspot-button-primary border-green-500 shadow-lg'
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100'
                }`}
              >
                Order ID
              </button>
              <button
                type="button"
                onClick={() => setSearchType('phone')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  searchType === 'phone'
                    ? 'gspot-button-primary border-green-500 shadow-lg'
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100'
                }`}
              >
                Phone Number
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <input
                type={searchType === 'phone' ? 'tel' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'orderId' ? 'Enter Order ID (e.g., ABC12345)' : 'Enter phone number'}
                className="flex-1 px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-green-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 gspot-button-primary rounded-lg transition-all disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-2 disabled:border-gray-300 font-semibold whitespace-nowrap shadow-lg"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3 gspot-border-glow">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="gspot-card-bg rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-green-800">Order Status</h2>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
              </div>
              <p className="text-green-700">{getStatusMessage(order.status)}</p>
            </div>

            {/* Order Information */}
            <div className="gspot-card-bg rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Order Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Order ID</p>
                    <p className="font-semibold text-green-800">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Order Date</p>
                    <p className="font-semibold text-green-800">{formatDateTime(order.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Customer Name</p>
                    <p className="font-semibold text-green-800">{order.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Contact Number</p>
                    <p className="font-semibold text-green-800">{order.contact_number}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Service Type</p>
                    <p className="font-semibold text-green-800">{formatServiceType(order.service_type)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg gspot-border-glow">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Total Amount</p>
                    <p className="font-semibold text-green-800 text-xl gspot-text-glow">₱{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {order.address && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 mb-1">Delivery Address</p>
                  <p className="text-green-800">{order.address}</p>
                </div>
              )}

              {order.notes && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 mb-1">Special Instructions</p>
                  <p className="text-green-800">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="gspot-card-bg rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg gspot-border-glow">
                    <div className="flex-1">
                      <p className="font-medium text-green-800">{item.name}</p>
                      {item.variation && (
                        <p className="text-sm text-green-600">Size: {item.variation.name}</p>
                      )}
                      {item.add_ons && item.add_ons.length > 0 && (
                        <p className="text-sm text-green-600">
                          Add-ons: {item.add_ons.map((addon: any) => 
                            addon.quantity > 1 ? `${addon.name} x${addon.quantity}` : addon.name
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-green-700">₱{item.unit_price.toFixed(2)} x {item.quantity}</p>
                      <p className="font-semibold text-green-800 gspot-text-glow">₱{item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Again Button */}
            <div className="text-center">
              <button
                onClick={handleClearSearch}
                className="px-8 py-3 gspot-button-primary rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                Search Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

