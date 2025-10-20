import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, Download, Phone, MapPin, ShoppingCart, Calendar, User, X, Trash2, AlertTriangle } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

interface CustomersManagerProps {
  onBack: () => void;
}

interface CustomerInfo {
  name: string;
  contactNumber: string;
  addresses: string[];
  orderCount: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  orderIds: string[];
  serviceTypes: string[];
}

const CustomersManager: React.FC<CustomersManagerProps> = ({ onBack }) => {
  const { orders, loading, deleteOrders } = useOrders();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'orderCount' | 'totalSpent' | 'lastOrderDate'>('lastOrderDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [exporting, setExporting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [selectedCustomerKeys, setSelectedCustomerKeys] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Extract unique customers from orders
  const customers = useMemo(() => {
    const customerMap = new Map<string, CustomerInfo>();

    orders.forEach(order => {
      const key = `${order.customer_name}-${order.contact_number}`.toLowerCase();
      
      if (customerMap.has(key)) {
        const customer = customerMap.get(key)!;
        customer.orderCount += 1;
        customer.totalSpent += order.total;
        customer.orderIds.push(order.id);
        
        // Add address if delivery and not already in list
        if (order.address && !customer.addresses.includes(order.address)) {
          customer.addresses.push(order.address);
        }
        
        // Add service type if not already in list
        if (!customer.serviceTypes.includes(order.service_type)) {
          customer.serviceTypes.push(order.service_type);
        }
        
        // Update last order date if more recent
        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.created_at;
        }
        
        // Update first order date if earlier
        if (new Date(order.created_at) < new Date(customer.firstOrderDate)) {
          customer.firstOrderDate = order.created_at;
        }
      } else {
        customerMap.set(key, {
          name: order.customer_name,
          contactNumber: order.contact_number,
          addresses: order.address ? [order.address] : [],
          orderCount: 1,
          totalSpent: order.total,
          firstOrderDate: order.created_at,
          lastOrderDate: order.created_at,
          orderIds: [order.id],
          serviceTypes: [order.service_type]
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  // Filter and sort customers
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q.length === 0
      ? customers
      : customers.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.contactNumber.toLowerCase().includes(q) ||
          c.addresses.some(addr => addr.toLowerCase().includes(q))
        );
    
    const sorted = [...searched].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'orderCount':
          return (a.orderCount - b.orderCount) * dir;
        case 'totalSpent':
          return (a.totalSpent - b.totalSpent) * dir;
        case 'lastOrderDate':
        default:
          return (new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime()) * dir;
      }
    });
    
    return sorted;
  }, [customers, query, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const escapeCSVField = (field: string): string => {
    // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const handleSelectCustomer = (customerKey: string) => {
    const newSelected = new Set(selectedCustomerKeys);
    if (newSelected.has(customerKey)) {
      newSelected.delete(customerKey);
    } else {
      newSelected.add(customerKey);
    }
    setSelectedCustomerKeys(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCustomerKeys.size === filtered.length) {
      setSelectedCustomerKeys(new Set());
    } else {
      const allKeys = filtered.map(customer => `${customer.name}-${customer.contactNumber}`.toLowerCase());
      setSelectedCustomerKeys(new Set(allKeys));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCustomerKeys.size === 0) return;
    
    try {
      setDeleting(true);
      
      // Get all order IDs for selected customers
      const orderIdsToDelete: string[] = [];
      filtered.forEach(customer => {
        const key = `${customer.name}-${customer.contactNumber}`.toLowerCase();
        if (selectedCustomerKeys.has(key)) {
          orderIdsToDelete.push(...customer.orderIds);
        }
      });

      // Delete all orders for these customers
      await deleteOrders(orderIdsToDelete);
      
      setSelectedCustomerKeys(new Set());
      setShowDeleteModal(false);
      alert(`Successfully deleted ${selectedCustomerKeys.size} customer(s) and ${orderIdsToDelete.length} associated order(s)!`);
    } catch (err) {
      alert('Failed to delete customer records. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const exportToCSV = () => {
    setExporting(true);
    try {
      if (filtered.length === 0) {
        alert('No customers to export.');
        setExporting(false);
        return;
      }

      // CSV Headers
      const headers = [
        'Customer Name',
        'Contact Number',
        'Total Orders',
        'Total Spent',
        'First Order Date',
        'Last Order Date',
        'Service Types',
        'Delivery Addresses'
      ];

      // CSV Rows - properly escape all fields
      const rows = filtered.map(customer => [
        escapeCSVField(customer.name),
        escapeCSVField(customer.contactNumber),
        customer.orderCount.toString(),
        customer.totalSpent.toFixed(2),
        escapeCSVField(formatDate(customer.firstOrderDate)),
        escapeCSVField(formatDate(customer.lastOrderDate)),
        escapeCSVField(customer.serviceTypes.join('; ')),
        escapeCSVField(customer.addresses.join('; '))
      ]);

      // Create CSV content with proper line breaks
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\r\n');

      // Add BOM for Excel UTF-8 support
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // Create blob and download
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_${dateStr}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Successfully exported ${filtered.length} customer(s)!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export customers. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Calculate stats
  const totalCustomers = customers.length;
  const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
  const avgOrdersPerCustomer = totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : '0';
  const repeatCustomers = customers.filter(c => c.orderCount > 1).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-playfair font-semibold text-black">Customer Database</h1>
            </div>
            <div className="text-sm text-gray-500">
              {totalCustomers} unique customer{totalCustomers !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Orders</p>
                <p className="text-2xl font-bold text-gray-900">{avgOrdersPerCustomer}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Repeat Customers</p>
                <p className="text-2xl font-bold text-gray-900">{repeatCustomers}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search and Export */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, phone, or address"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              {selectedCustomerKeys.size > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCustomerKeys.size})
                </button>
              )}
              <button
                onClick={exportToCSV}
                disabled={exporting || filtered.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export to CSV'}
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Customers Yet</h2>
            <p className="text-gray-600">Customers will appear here when they place orders.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-center font-medium w-12">
                        <input
                          type="checkbox"
                          checked={filtered.length > 0 && selectedCustomerKeys.size === filtered.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th 
                        className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleSort('name')}
                      >
                        Customer {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left font-medium">Contact</th>
                      <th 
                        className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleSort('orderCount')}
                      >
                        Orders {sortKey === 'orderCount' && (sortDir === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleSort('totalSpent')}
                      >
                        Total Spent {sortKey === 'totalSpent' && (sortDir === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleSort('lastOrderDate')}
                      >
                        Last Order {sortKey === 'lastOrderDate' && (sortDir === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((customer, idx) => {
                      const customerKey = `${customer.name}-${customer.contactNumber}`.toLowerCase();
                      return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCustomerKeys.has(customerKey)}
                            onChange={() => handleSelectCustomer(customerKey)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-xs text-gray-500">
                                {customer.orderCount > 1 ? '⭐ Repeat Customer' : 'New Customer'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-700">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {customer.contactNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ₱{customer.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(customer.lastOrderDate)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filtered.map((customer, idx) => {
                const customerKey = `${customer.name}-${customer.contactNumber}`.toLowerCase();
                return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomerKeys.has(customerKey)}
                        onChange={() => handleSelectCustomer(customerKey)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer mt-1"
                      />
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">
                            {customer.orderCount > 1 ? '⭐ Repeat Customer' : 'New Customer'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.contactNumber}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-semibold">{customer.orderCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-semibold">₱{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Order:</span>
                      <span className="text-gray-900">{formatDate(customer.lastOrderDate)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="w-full mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Customer Details</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.contactNumber}</span>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.orderCount}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600">₱{selectedCustomer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">First Order</p>
                    <p className="text-sm font-semibold text-purple-600">{formatDate(selectedCustomer.firstOrderDate)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Last Order</p>
                    <p className="text-sm font-semibold text-orange-600">{formatDate(selectedCustomer.lastOrderDate)}</p>
                  </div>
                </div>
              </div>

              {/* Service Types */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Preferred Service Types</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.serviceTypes.map((type, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Addresses */}
              {selectedCustomer.addresses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Addresses</h4>
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((address, idx) => (
                      <div key={idx} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{address}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Average Order Value */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₱{(selectedCustomer.totalSpent / selectedCustomer.orderCount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete <strong className="text-red-600">{selectedCustomerKeys.size}</strong> selected customer{selectedCustomerKeys.size !== 1 ? 's' : ''}? 
              This action cannot be undone and will remove all associated customer data and their orders.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Customers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManager;

