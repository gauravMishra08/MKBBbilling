import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductSearch from './ProductSearch';
import { IndianRupee, Coins, UserPlus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const INR_TO_NPR_RATE = 1.6;

const BillingForm = ({ onBillUpdate }) => {
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerMobile, setCustomerMobile] = useState('+91');

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discountValue, setDiscountValue] = useState('');

  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  // Load customer data when mobile number changes
  useEffect(() => {
    if (customerMobile.length >= 13) { // +91 followed by 10 digits
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const existingCustomer = customers.find(c => c.mobile === customerMobile);
      
      if (existingCustomer) {
        setCustomerId(existingCustomer.id);
        setCustomerName(existingCustomer.name);
        setCustomerAddress(existingCustomer.address);
      } else {
        // Reset fields if new mobile number entered
        setCustomerId(null);
        setCustomerName('');
        setCustomerAddress('');
      }
    }
  }, [customerMobile]);

  const clearCustomerDetails = () => {
    setCustomerId(null);
    setCustomerName('');
    setCustomerAddress('');
    setCustomerMobile('+91');
  };

  const isValidIndianMobile = (mobile) => {
    // Requires full international format with +91
    const regex = /^\+91[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const saveCustomerDetails = () => {
    if (!isValidIndianMobile(customerMobile.trim())) {
      toast({ 
        variant: "destructive", 
        title: "Invalid Mobile Number", 
        description: "Enter full Indian mobile number with +91 prefix (e.g., +919876543210)" 
      });
      return;
    }
    
    if (!customerName.trim()) {
      toast({ 
        variant: "destructive", 
        title: "Missing Details", 
        description: "Customer Name is required to save." 
      });
      return;
    }

    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const newCustomer = {
      id: customerId || uuidv4(),
      name: customerName.trim(),
      address: customerAddress.trim(),
      mobile: customerMobile.trim()
    };

    if (customerId) {
      customers = customers.map(c => c.id === customerId ? newCustomer : c);
    } else {
      const existingCustomer = customers.find(c => c.mobile === newCustomer.mobile);
      if (existingCustomer) {
        // This shouldn't happen since we're checking on mobile change
        return;
      }
      customers.push(newCustomer);
      setCustomerId(newCustomer.id);
    }
    
    localStorage.setItem('customers', JSON.stringify(customers));
    toast({ 
      title: "Customer Saved!", 
      description: `${newCustomer.name}'s details have been saved.` 
    });
  };

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      toast({ 
        variant: "destructive", 
        title: "Product already added", 
        description: "Please update quantity for existing product." 
      });
      return;
    }
    setSelectedProducts(prev => [...prev, { 
      ...product, 
      quantity: 1, 
      billItemId: uuidv4() 
    }]);
  };

  const handleQuantityChange = (billItemId, quantity) => {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    setSelectedProducts(prev =>
      prev.map(p => p.billItemId === billItemId ? { ...p, quantity: newQuantity } : p)
    );
  };

  const handleRemoveProduct = (billItemId) => {
    setSelectedProducts(prev => prev.filter(p => p.billItemId !== billItemId));
    toast({ title: "Product removed" });
  };

  const calculateTotals = useCallback(() => {
    let currentSubtotal = 0;
    selectedProducts.forEach(p => {
      const price = currency === 'NPR' ? p.priceINR * INR_TO_NPR_RATE : p.priceINR;
      currentSubtotal += price * p.quantity;
    });
    setSubtotal(currentSubtotal);

    let currentDiscountAmount = parseFloat(discountValue) || 0;
    currentDiscountAmount = Math.max(0, Math.min(currentDiscountAmount, currentSubtotal));
    setDiscountAmount(currentDiscountAmount);

    setTotalAmount(currentSubtotal - currentDiscountAmount);
  }, [selectedProducts, currency, discountValue]);

  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, currency, discountValue, calculateTotals]);

  useEffect(() => {
    onBillUpdate({
      customerId,
      customerName,
      customerAddress,
      customerMobile,
      items: selectedProducts.map(p => ({
        ...p,
        price: currency === 'NPR' ? p.priceINR * INR_TO_NPR_RATE : p.priceINR,
      })),
      currency,
      paymentMethod,
      subtotal,
      discountAmount,
      totalAmount,
    });
  }, [customerId, customerName, customerAddress, customerMobile, selectedProducts, currency, paymentMethod, subtotal, discountAmount, totalAmount, onBillUpdate]);

  const currencySymbol = currency === 'INR' ? '₹' : 'रु';

  return (
    <Card className="shadow-xl bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="mr-2 h-6 w-6" /> Create New Bill
          </div>
          <Button variant="outline" size="sm" onClick={clearCustomerDetails} className="text-xs">
            <UserPlus className="mr-1.5 h-3.5 w-3.5" /> New Customer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <Label>Customer Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Label htmlFor="customerMobile">Mobile Number <span className="text-red-500">*</span></Label>
              <Input
                id="customerMobile"
                type="tel"
                value={customerMobile}
                onChange={e => setCustomerMobile(e.target.value)}
                placeholder="e.g., +919876543210"
                maxLength={13}
              />
              <p className="text-xs text-gray-500 mt-1">with country code (+91 or +977)</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g., Ram Bahadur"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="e.g., Hardi Dali"
              />
            </motion.div>
          </div>
          <Button onClick={saveCustomerDetails} size="sm" className="mt-1">Save Customer</Button>
        </section>

        <section>
          <Label>Add Products</Label>
          <ProductSearch onProductSelect={handleAddProduct} />
        </section>

        <section className="mt-4">
          <Label>Selected Products</Label>
          {selectedProducts.length === 0 && <p>No products added yet.</p>}
          <AnimatePresence>
            {selectedProducts.map(product => (
              <motion.div
                key={product.billItemId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-4 py-2 border-b border-gray-200"
              >
                <div className="flex-grow">
                  <p className="font-semibold">{product.name} ({product.unit})</p>
                  <p className="text-sm text-gray-500">
                    Price: {currencySymbol}
                    {(currency === 'NPR' ? product.priceINR * INR_TO_NPR_RATE : product.priceINR).toFixed(2)}
                  </p>
                </div>
                <Input
                  type="number"
                  min={1}
                  value={product.quantity}
                  onChange={e => handleQuantityChange(product.billItemId, e.target.value)}
                  className="w-20"
                />
                <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(product.billItemId)} title="Remove product">
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4 border-t"
        >
          <Label>Discount Amount (Optional)</Label>
          <Input
            type="number"
            placeholder="Enter discount amount"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="mt-1"
            min="0"
            step="1"
          />
          {discountValue > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Discount Applied: {currencySymbol}{discountAmount.toFixed(2)}
            </p>
          )}
        </motion.section>

        <section className="pt-6 border-t space-y-2">
          <p>Subtotal: <strong>{currencySymbol}{subtotal.toFixed(2)}</strong></p>
          {discountAmount > 0 && (
            <p>Discount: <strong>-{currencySymbol}{discountAmount.toFixed(2)}</strong></p>
          )}
          <p>Total: <strong>{currencySymbol}{totalAmount.toFixed(2)}</strong></p>
        </section>

        <section className="pt-4 border-t grid grid-cols-2 gap-4">
          <div>
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="NPR">NPR (रु)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payment Method</Label>
            <div className="flex space-x-2">
              <Button
                variant={paymentMethod === 'Cash' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('Cash')}
                className="flex-1"
              >
                Cash
              </Button>
              <Button
                variant={paymentMethod === 'UPI' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('UPI')}
                className="flex-1"
              >
                UPI
              </Button>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default BillingForm;