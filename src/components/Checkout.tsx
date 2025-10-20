import React, { useState } from 'react';
import { ArrowLeft, Clock, Upload, X, Check, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useOrders } from '../hooks/useOrders';
import { uploadReceiptToCloudinary, compressImage } from '../lib/cloudinary';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const { createOrder, creating, error } = useOrders();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const copyOrderDetails = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setUploadError(null);
    setReceiptUrl(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptUrl(null);
    setUploadError(null);
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    let uploadedReceiptUrl = receiptUrl;

    // Upload receipt first if user selected one but hasn't uploaded yet
    if (receiptFile && !receiptUrl) {
      try {
        setUploadingReceipt(true);
        setUploadError(null);
        setUiNotice('Uploading receipt...');

        // Compress image before upload
        const compressedFile = await compressImage(receiptFile, 1200, 0.8);
        
        // Upload to Cloudinary
        uploadedReceiptUrl = await uploadReceiptToCloudinary(compressedFile);
        setReceiptUrl(uploadedReceiptUrl);
        setUiNotice('Receipt uploaded! Creating order...');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload receipt';
        setUploadError(message);
        setUiNotice(`Upload failed: ${message}. Please try again or continue without receipt.`);
        setUploadingReceipt(false);
        return; // Stop order placement if upload fails
      } finally {
        setUploadingReceipt(false);
      }
    }

    // Persist order to database
    try {
      const mergedNotes = landmark ? `${notes ? notes + ' | ' : ''}Landmark: ${landmark}` : notes;
      await createOrder({
        customerName,
        contactNumber,
        serviceType,
        address: serviceType === 'delivery' ? address : undefined,
        pickupTime: serviceType === 'pickup' ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`) : undefined,
        partySize: serviceType === 'dine-in' ? partySize : undefined,
        dineInTime: serviceType === 'dine-in' ? dineInTime : undefined,
        paymentMethod,
        referenceNumber,
        notes: mergedNotes,
        total: totalPrice,
        items: cartItems,
        receiptUrl: uploadedReceiptUrl ?? undefined,
      });
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      if (/insufficient stock/i.test(raw)) {
        setUiNotice(raw);
        return;
      }
      if (/rate limit/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else if (/missing identifiers/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      }
      return;
    }
    const timeInfo = serviceType === 'pickup' 
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';
    
    const dineInInfo = serviceType === 'dine-in' 
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`
      : '';
    
    const orderDetails = `
🛒 G'$pot Hang-out ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
  let itemDetails = `• ${item.name}`;
  if (item.selectedVariation) {
    itemDetails += ` (${item.selectedVariation.name})`;
  }
  if (item.selectedAddOns && item.selectedAddOns.length > 0) {
    itemDetails += ` + ${item.selectedAddOns.map(addOn => 
      addOn.quantity && addOn.quantity > 1 
        ? `${addOn.name} x${addOn.quantity}`
        : addOn.name
    ).join(', ')}`;
  }
  itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
  return itemDetails;
}).join('\n')}

💰 TOTAL: ₱${totalPrice}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
${uploadedReceiptUrl ? `📸 Payment Receipt: ${uploadedReceiptUrl}` : '📸 Payment Screenshot: Please attach your payment receipt screenshot'}

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing G'$pot Hang-out! 🥟
    `.trim();

    const pageId = 'GSpotHangout2025';
    const encodedMessage = encodeURIComponent(orderDetails);
    const webLink = `https://m.me/${pageId}?text=${encodedMessage}`;

    // Best effort: copy order details so user can paste in Messenger if text cannot be prefilled
    await copyOrderDetails(orderDetails);

    // Use window.location for both mobile and desktop to avoid popup blocker
    // This will navigate away from the site but ensures the link always works
    window.location.href = webLink;
    
  };

  const isDetailsValid = customerName && contactNumber && 
    (serviceType !== 'delivery' || address) && 
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="min-h-screen gspot-bg-gradient">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-green-700 hover:text-green-600 transition-colors duration-200 gspot-border-glow px-4 py-2 rounded-lg bg-green-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-3xl font-gspot font-semibold text-green-800 ml-8 gspot-text-glow">Order Details</h1>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="gspot-card-bg rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-gspot font-medium text-green-800 mb-6 gspot-text-glow">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-green-200">
                  <div>
                    <h4 className="font-medium text-green-700">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-green-600">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-green-600">
                        Add-ons: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-green-600">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-green-700">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-green-200 pt-4">
              <div className="flex items-center justify-between text-2xl font-gspot font-semibold text-green-800 gspot-text-glow">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="gspot-card-bg rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-gspot font-medium text-green-800 mb-6 gspot-text-glow">Customer Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-3">Service Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                    { value: 'pickup', label: 'Pickup', icon: '🚶' },
                    { value: 'delivery', label: 'Delivery', icon: '🛵' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        serviceType === option.value
                          ? 'gspot-button-primary border-green-500 shadow-lg'
                          : 'border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dine-in Details */}
              {serviceType === 'dine-in' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Party Size *</label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.max(1, partySize - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-green-300 flex items-center justify-center text-green-600 hover:border-green-500 hover:bg-green-100 transition-all duration-200"
                      >
                        -
                      </button>
                      <span className="text-2xl font-semibold text-green-800 min-w-[3rem] text-center">{partySize}</span>
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.min(20, partySize + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-green-300 flex items-center justify-center text-green-600 hover:border-green-500 hover:bg-green-100 transition-all duration-200"
                      >
                        +
                      </button>
                      <span className="text-sm text-green-600 ml-2">person{partySize !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Preferred Time *</label>
                    <input
                      type="datetime-local"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      required
                    />
                    <p className="text-xs text-green-600 mt-1">Please select your preferred dining time</p>
                  </div>
                </>
              )}

              {/* Pickup Time Selection */}
              {serviceType === 'pickup' && (
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-3">Pickup Time *</label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: '5-10', label: '5-10 minutes' },
                        { value: '15-20', label: '15-20 minutes' },
                        { value: '25-30', label: '25-30 minutes' },
                        { value: 'custom', label: 'Custom Time' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPickupTime(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                            pickupTime === option.value
                              ? 'gspot-button-primary border-green-500 shadow-lg'
                              : 'border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100'
                          }`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                    
                    {pickupTime === 'custom' && (
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                        placeholder="e.g., 45 minutes, 1 hour, 2:30 PM"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {serviceType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Delivery Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                      placeholder="Enter your complete delivery address"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                      placeholder="e.g., Near McDonald's, Beside 7-Eleven, In front of school"
                    />
                  </div>
                </>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-green-400"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                  isDetailsValid
                    ? 'gspot-button-primary hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="min-h-screen gspot-bg-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setStep('details')}
            className="flex items-center space-x-2 text-green-700 hover:text-green-600 transition-colors duration-200 gspot-border-glow px-4 py-2 rounded-lg bg-green-50"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Details</span>
          </button>
          <h1 className="text-3xl font-gspot font-semibold text-green-800 ml-8 gspot-text-glow">Payment</h1>
        </div>

        {uiNotice && (
          <div className="mb-4 rounded-lg border-2 border-green-400 bg-green-50 text-green-800 p-4 text-sm gspot-border-glow">
            {uiNotice}
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="gspot-card-bg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-gspot font-medium text-green-800 mb-6 gspot-text-glow">Choose Payment Method</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                  paymentMethod === method.id
                    ? 'gspot-button-primary border-green-500 shadow-lg'
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100'
                }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 gspot-border-glow">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-600">🔒</span>
                <h3 className="font-medium text-green-800">Secure Payment Details</h3>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-green-600 mb-1 font-medium">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-green-800 font-bold text-lg bg-white px-3 py-2 rounded border border-green-300">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm text-green-600 mb-3 mt-2">Account Name: <span className="font-semibold text-green-800">{selectedPaymentMethod.account_name}</span></p>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <p className="text-xl font-bold text-green-800 gspot-text-glow">Amount: ₱{totalPrice}</p>
                    <p className="text-xs text-green-600 mt-1">Please pay the exact amount</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white p-2 rounded-lg border-2 border-green-300 shadow-lg">
                    <img 
                      src={selectedPaymentMethod.qr_code_url} 
                      alt={`${selectedPaymentMethod.name} QR Code`}
                      className="w-32 h-32 rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                      }}
                    />
                  </div>
                  <p className="text-xs text-green-600 text-center mt-2 font-medium">📱 Scan to pay</p>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Upload */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              <span>📸</span>
              <span>Upload Payment Receipt</span>
              <span className="text-xs text-green-600">(Optional)</span>
            </h4>
            
            {!receiptPreview ? (
              <div>
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-white hover:bg-green-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-green-600 mb-2" />
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Click to select receipt</span> or drag and drop
                    </p>
                    <p className="text-xs text-green-600 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                    onChange={handleReceiptFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border-2 border-green-400">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={handleRemoveReceipt}
                    className="absolute top-2 right-2 p-1 bg-white text-green-600 rounded-full hover:bg-green-100 transition-colors gspot-border-glow shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {receiptUrl ? (
                  <div className="flex items-center space-x-2 text-green-700 bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">✅ Receipt ready! Will be saved with your order.</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-medium">📎 Receipt selected. Will upload when you place order.</span>
                  </div>
                )}

                {uploadError && (
                  <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-300">
                    ⚠️ {uploadError}
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-green-600 mt-3">
              {receiptFile ? 'Receipt will be uploaded automatically when you place your order.' : 'You can also attach your receipt in the Messenger conversation.'}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="gspot-card-bg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-gspot font-medium text-green-800 mb-6 gspot-text-glow">Final Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 gspot-border-glow">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <span>👤</span>
                <span>Customer Details</span>
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-green-700"><span className="font-semibold">Name:</span> {customerName}</p>
                <p className="text-sm text-green-700"><span className="font-semibold">Contact:</span> {contactNumber}</p>
                <p className="text-sm text-green-700"><span className="font-semibold">Service:</span> {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>
                {serviceType === 'delivery' && (
                  <>
                    <p className="text-sm text-green-700"><span className="font-semibold">Address:</span> {address}</p>
                    {landmark && <p className="text-sm text-green-700"><span className="font-semibold">Landmark:</span> {landmark}</p>}
                  </>
                )}
                {serviceType === 'pickup' && (
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Pickup Time:</span> {pickupTime === 'custom' ? customTime : `${pickupTime} minutes`}
                  </p>
                )}
                {serviceType === 'dine-in' && (
                  <>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Party Size:</span> {partySize} person{partySize !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">Preferred Time:</span> {dineInTime ? new Date(dineInTime).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'Not selected'}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <span>🍽️</span>
                <span>Order Items</span>
              </h4>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-green-100 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800 text-base">{item.name}</h4>
                      {item.selectedVariation && (
                        <p className="text-sm text-green-600 mt-1">Size: {item.selectedVariation.name}</p>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Add-ons: {item.selectedAddOns.map(addOn => 
                            addOn.quantity && addOn.quantity > 1 
                              ? `${addOn.name} x${addOn.quantity}`
                              : addOn.name
                          ).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-green-600 mt-1">₱{item.totalPrice} each × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-800 text-lg">₱{item.totalPrice * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-2xl font-gspot font-bold text-green-800 gspot-text-glow">
              <span>💰 Total Amount:</span>
              <span>₱{totalPrice}</span>
            </div>
            <p className="text-sm text-green-600 mt-2 text-center">Please pay the exact amount shown above</p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={creating || uploadingReceipt}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform ${creating || uploadingReceipt ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300' : 'gspot-button-primary hover:scale-105 shadow-lg hover:shadow-xl'}`}
          >
            {uploadingReceipt ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading Receipt...</span>
              </span>
            ) : creating ? (
              'Placing Order...'
            ) : (
              '🚀 Place Order via Messenger'
            )}
          </button>
          {error && !uiNotice && (
            <p className="text-sm text-red-600 text-center mt-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">⚠️ {error}</p>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-700 text-center">
              📱 You'll be redirected to Facebook Messenger to confirm your order. Don't forget to attach your payment screenshot!
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Checkout;
