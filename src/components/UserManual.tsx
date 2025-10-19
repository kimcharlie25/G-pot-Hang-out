import React, { useState } from 'react';
import { ArrowLeft, Book, ChevronDown, ChevronRight, Coffee, Package, CreditCard, Settings, ShoppingCart, Users, Boxes, HelpCircle } from 'lucide-react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Welcome to G'$pot Hangout Admin Dashboard</h3>
          <p className="text-gray-700">
            This admin dashboard allows you to manage your restaurant's menu, orders, inventory, customers, and settings all in one place.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-semibold text-blue-900">Quick Tips:</p>
            <ul className="mt-2 space-y-1 text-blue-800 text-sm list-disc list-inside">
              <li>Use the sidebar navigation to access different sections</li>
              <li>Changes are saved automatically to the database</li>
              <li>Always check for error messages at the top of forms</li>
              <li>You can logout anytime using the logout button at the bottom</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'menu-management',
      title: 'Menu Management',
      icon: <Coffee className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Managing Menu Items</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">Adding a New Item</h4>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>Click "Menu Items" in the sidebar</li>
                  <li>Click the "Add New Item" button (green button with + icon)</li>
                  <li>Fill in all required fields:
                    <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                      <li><strong>Item Name</strong>: The name of your dish</li>
                      <li><strong>Description</strong>: A brief description of the item</li>
                      <li><strong>Base Price</strong>: The starting price (in PHP)</li>
                      <li><strong>Category</strong>: Select from available categories</li>
                    </ul>
                  </li>
                  <li>Optional: Add an image by clicking "Upload Image"</li>
                  <li>Optional: Add variations (sizes) or add-ons (extras)</li>
                  <li>Click "Save Item" to add it to your menu</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Editing an Item</h4>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>Find the item in the menu items list</li>
                  <li>Click the "Edit" button (blue button with pencil icon)</li>
                  <li>Make your changes</li>
                  <li>Click "Save Changes"</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Deleting an Item</h4>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>Find the item you want to delete</li>
                  <li>Click the "Delete" button (red button with trash icon)</li>
                  <li>Confirm the deletion (this cannot be undone)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Adding Variations</h4>
                <p className="text-gray-700 text-sm mt-2">
                  Variations allow customers to choose different sizes or types (e.g., Small, Medium, Large).
                </p>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>In the item form, scroll to "Variations" section</li>
                  <li>Enter a variation name (e.g., "Large")</li>
                  <li>Enter the additional price for this variation</li>
                  <li>Click "Add Variation"</li>
                  <li>Repeat for other sizes</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Adding Add-ons</h4>
                <p className="text-gray-700 text-sm mt-2">
                  Add-ons are extras customers can add to their order (e.g., Extra Cheese, Bacon).
                </p>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>In the item form, scroll to "Add-ons" section</li>
                  <li>Select a category for the add-on</li>
                  <li>Enter the add-on name</li>
                  <li>Enter the price</li>
                  <li>Click "Add Add-on"</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">Setting Discount Pricing</h4>
                <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                  <li>Edit the menu item</li>
                  <li>Scroll to "Discount Pricing" section</li>
                  <li>Enter the discounted price</li>
                  <li>Set start and end dates (optional)</li>
                  <li>Check "Active" to enable the discount</li>
                  <li>Save the item</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: <Boxes className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Managing Stock Levels</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Enabling Inventory Tracking</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Go to "Inventory" in the sidebar</li>
                <li>Find the item you want to track</li>
                <li>Check the "Track Inventory" checkbox</li>
                <li>Set the current stock quantity</li>
                <li>Set a low stock threshold (e.g., 5 units)</li>
                <li>Click "Update Stock"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">How Inventory Works</h4>
              <ul className="mt-2 space-y-2 text-gray-700 text-sm list-disc list-inside">
                <li><strong>Automatic Updates</strong>: Stock decreases automatically when customers place orders</li>
                <li><strong>Low Stock Alert</strong>: Items with low stock show a warning badge</li>
                <li><strong>Auto-Disable</strong>: When stock reaches zero, the item becomes unavailable automatically</li>
                <li><strong>Re-Enable</strong>: When you restock, update the quantity and the item becomes available again</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="font-semibold text-yellow-900">Important:</p>
              <p className="text-yellow-800 text-sm mt-1">
                Once inventory tracking is enabled, make sure to update stock levels regularly to prevent overselling.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'orders',
      title: 'Order Management',
      icon: <ShoppingCart className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Managing Customer Orders</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Order Statuses</h4>
              <ul className="mt-2 space-y-2 text-gray-700 text-sm">
                <li><span className="font-semibold">Pending:</span> New order, needs confirmation</li>
                <li><span className="font-semibold">Confirmed:</span> Order has been confirmed</li>
                <li><span className="font-semibold">Preparing:</span> Food is being prepared</li>
                <li><span className="font-semibold">Ready:</span> Order is ready for pickup/delivery</li>
                <li><span className="font-semibold">Completed:</span> Order has been delivered/picked up</li>
                <li><span className="font-semibold">Cancelled:</span> Order was cancelled</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Updating Order Status</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Go to "Orders" in the sidebar</li>
                <li>Find the order you want to update</li>
                <li>Click on the order to expand details</li>
                <li>Select the new status from the dropdown</li>
                <li>The status updates automatically</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Searching Orders</h4>
              <p className="text-gray-700 text-sm mt-2">You can search orders by:</p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>Customer name</li>
                <li>Order ID (last 8 characters)</li>
                <li>Contact number</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Filtering Orders</h4>
              <p className="text-gray-700 text-sm mt-2">
                Use the filter buttons at the top to show only:
              </p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>All orders</li>
                <li>Pending orders</li>
                <li>Active orders (confirmed + preparing)</li>
                <li>Completed orders</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Exporting Orders</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Click the "Export CSV" button at the top</li>
                <li>The system will download a CSV file with all orders</li>
                <li>Open in Excel or Google Sheets for analysis</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'Category Management',
      icon: <Package className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Managing Menu Categories</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Adding a Category</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Go to "Categories" in the sidebar</li>
                <li>Click "Add New Category"</li>
                <li>Enter category name (e.g., "Desserts")</li>
                <li>Choose an emoji icon (e.g., 🍰)</li>
                <li>Set the sort order (lower numbers appear first)</li>
                <li>Click "Add Category"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Editing a Category</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Find the category in the list</li>
                <li>Click the "Edit" button</li>
                <li>Make your changes</li>
                <li>Click "Save"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Reordering Categories</h4>
              <p className="text-gray-700 text-sm mt-2">
                Categories are displayed in order based on their "Sort Order" number. Lower numbers appear first.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                Example: Category with sort order 1 appears before category with sort order 2.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Deactivating a Category</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Edit the category</li>
                <li>Uncheck the "Active" checkbox</li>
                <li>Save changes</li>
              </ol>
              <p className="text-gray-700 text-sm mt-2">
                Note: Inactive categories won't be visible to customers, but items in that category remain in the database.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: <CreditCard className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Managing Payment Options</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Adding a Payment Method</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Go to "Payment Methods" in the sidebar</li>
                <li>Click "Add New Payment Method"</li>
                <li>Enter payment method name (e.g., "GCash")</li>
                <li>Enter your account number</li>
                <li>Enter your account name</li>
                <li>Upload a QR code image (customers can scan this to pay)</li>
                <li>Set the sort order</li>
                <li>Click "Add Payment Method"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Uploading QR Code</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Click "Upload QR Code"</li>
                <li>Select your QR code image file (PNG, JPG, etc.)</li>
                <li>Wait for upload to complete</li>
                <li>The QR code will be displayed to customers during checkout</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Activating/Deactivating Payment Methods</h4>
              <p className="text-gray-700 text-sm mt-2">
                Use the "Active" toggle to enable or disable payment methods without deleting them.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900">Best Practices:</p>
              <ul className="mt-2 space-y-1 text-blue-800 text-sm list-disc list-inside">
                <li>Always keep at least one payment method active</li>
                <li>Use clear, high-quality QR code images</li>
                <li>Update account details if they change</li>
                <li>Test payments to ensure QR codes work correctly</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Managing Customer Information</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Viewing Customer Data</h4>
              <p className="text-gray-700 text-sm mt-2">
                The Customers section automatically collects customer information from orders:
              </p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>Customer name</li>
                <li>Contact number</li>
                <li>Order history</li>
                <li>Total spent</li>
                <li>Last order date</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Searching Customers</h4>
              <p className="text-gray-700 text-sm mt-2">
                Use the search bar to find customers by name or phone number.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Viewing Customer Orders</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Find the customer in the list</li>
                <li>Click to expand their details</li>
                <li>View their complete order history</li>
              </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="font-semibold text-green-900">Privacy Note:</p>
              <p className="text-green-800 text-sm mt-1">
                Customer data is stored securely and should be handled with care. Never share customer information with unauthorized parties.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Site Settings',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Configuring Your Site</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Updating Site Name</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Go to "Settings" in the sidebar</li>
                <li>Find "Site Name" field</li>
                <li>Enter your new site name</li>
                <li>Click "Update Site Name"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Uploading Site Logo</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>In Settings, find "Site Logo" section</li>
                <li>Click "Upload Logo"</li>
                <li>Select your logo image (square images work best)</li>
                <li>Wait for upload to complete</li>
                <li>The logo will appear in the header immediately</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Updating Site Description</h4>
              <p className="text-gray-700 text-sm mt-2">
                This appears as the tagline on your site. Make it catchy and descriptive!
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Changing Your Password</h4>
              <ol className="mt-2 space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Scroll to "Change Password" section</li>
                <li>Enter your current password</li>
                <li>Enter your new password (must be strong)</li>
                <li>Confirm your new password</li>
                <li>Click "Change Password"</li>
              </ol>
              <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-yellow-800 text-sm font-semibold">Password Requirements:</p>
                <ul className="mt-1 space-y-1 text-yellow-700 text-xs list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Common Issues & Solutions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Images Not Uploading</h4>
              <p className="text-gray-700 text-sm mt-2">Solutions:</p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>Check your internet connection</li>
                <li>Ensure image file is less than 10MB</li>
                <li>Try using JPG or PNG format</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Changes Not Saving</h4>
              <p className="text-gray-700 text-sm mt-2">Solutions:</p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>Check if all required fields are filled</li>
                <li>Look for error messages at the top of the form</li>
                <li>Refresh the page and try again</li>
                <li>Check your internet connection</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Can't Delete an Item</h4>
              <p className="text-gray-700 text-sm mt-2">
                Some items cannot be deleted if they are part of pending orders. Wait for those orders to complete first.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Forgot Password</h4>
              <p className="text-gray-700 text-sm mt-2">
                Contact your system administrator to reset your password.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">Orders Not Appearing</h4>
              <p className="text-gray-700 text-sm mt-2">Solutions:</p>
              <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                <li>Click the refresh button</li>
                <li>Check if filters are hiding the orders</li>
                <li>Search for the specific order</li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-semibold text-red-900">Need More Help?</p>
              <p className="text-red-800 text-sm mt-1">
                If you encounter persistent issues, contact your technical support team with:
              </p>
              <ul className="mt-2 space-y-1 text-red-700 text-xs list-disc list-inside">
                <li>Description of the problem</li>
                <li>What you were trying to do</li>
                <li>Any error messages you saw</li>
                <li>Screenshots if possible</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
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
              <h1 className="text-2xl font-semibold text-gray-900">User Manual</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-red-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard Guide</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Complete guide to managing your G'$pot Hangout restaurant
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="p-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-red-600">{section.icon}</div>
                      <span className="font-semibold text-gray-900">{section.title}</span>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedSection === section.id && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Tips for Success</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Keep menu updated:</strong> Regularly review and update your menu items and prices</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Monitor inventory:</strong> Enable tracking for popular items to avoid stockouts</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Respond to orders quickly:</strong> Update order status promptly to keep customers informed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Use high-quality images:</strong> Good photos increase sales and customer satisfaction</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Back up regularly:</strong> Export your orders and customer data periodically</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserManual;

