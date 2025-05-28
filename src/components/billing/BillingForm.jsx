import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import ProductSearch from './ProductSearch';
import CustomerSearch from './CustomerSearch';
import { IndianRupee, Coins, UserPlus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const INR_TO_NPR_RATE = 1.6;

const BillingForm = ({ onBillUpdate }) => {
  const [customerId, setCustomerId] = useState(null);
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currency, setCurrency] = useState('INR'); // INR by default
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discountType] = useState('fixed'); // Only fixed supported
  const [discountValue, setDiscountValue] = useState(''); // Empty by default
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  // Initialize localStorage for customers and products
  useEffect(() => {
    if (!localStorage.getItem('customers')) {
      localStorage.setItem('customers', JSON.stringify([]));
    }
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify([]));
    }
  }, []);

  // Auto-fetch customer details when mobile number changes
  useEffect(() => {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const existingCustomer = customers.find(c => c.mobile === customerMobile);
    if (existingCustomer) {
      setCustomerId(existingCustomer.id);
      setCustomerName(existingCustomer.name);
      setCustomerAddress(existingCustomer.address);
    } else {
      setCustomerId(null);
      setCustomerName('');
      setCustomerAddress('');
    }
  }, [customerMobile]);

  const clearCustomerDetails = () => {
    setCustomerId(null);
    setCustomerMobile('');
    setCustomerName('');
    setCustomerAddress('');
  };

  const handleCustomerSelect = (customer) => {
    setCustomerId(customer.id);
    setCustomerMobile(customer.mobile);
    setCustomerName(customer.name);
    setCustomerAddress(customer.address);
  };

  const isValidIndianMobile = (mobile) => {
    // Accepts formats like: +919876543210
    const regex = /^\+91[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const saveCustomerDetails = () => {
    if (!customerMobile.trim()) {
      toast({ variant: "destructive", title: "Missing Details", description: "Mobile number with country code is required." });
      return;
    }
    if (!isValidIndianMobile(customerMobile.trim())) {
      toast({ variant: "destructive", title: "Invalid Mobile Number", description: "Enter a valid Indian mobile number with +91 (e.g., +919876543210)." });
      return;
    }
    if (!customerName.trim()) {
      toast({ variant: "destructive", title: "Missing Details", description: "Customer Name is required to save." });
      return;
    }

    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const newCustomer = {
      id: customerId || uuidv4(),
      mobile: customerMobile.trim(),
      name: customerName.trim(),
      address: customerAddress.trim(),
    };

    if (customerId) {
      customers = customers.map(c => c.id === customerId ? newCustomer : c);
    } else {
      const existingCustomer = customers.find(c => c.mobile === newCustomer.mobile);
      if (existingCustomer) {
        toast({ variant: "destructive", title: "Customer Exists", description: "A customer with this mobile number already exists." });
        return;
      }
      customers.push(newCustomer);
      setCustomerId(newCustomer.id);
    }
    localStorage.setItem('customers', JSON.stringify(customers));
    toast({ title: "Customer Saved!", description: `${newCustomer.name}'s details have been saved.` });
  };

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      toast({ variant: "destructive", title: "Product already added", description: "Please update quantity for existing product." });
      return;
    }
    setSelectedProducts(prev => [...prev, { ...product, quantity: 1, billItemId: uuidv4() }]);
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

    let currentDiscountAmount = 0;
    if (discountValue !== '') {
      currentDiscountAmount = parseFloat(discountValue) || 0;
    }
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
      customerMobile,
      customerName,
      customerAddress,
      items: selectedProducts.map(p => ({
        ...p,
        price: currency === 'NPR' ? p.priceINR * INR_TO_NPR_RATE : p.priceINR,
      })),
      currency,
      paymentMethod,
      subtotal,
      discountType,
      discountValue: discountValue === '' ? 0 : parseFloat(discountValue),
      discountAmount,
      totalAmount,
    });
  }, [customerId, customerMobile, customerName, customerAddress, selectedProducts, currency, paymentMethod, subtotal, discountType, discountValue, discountAmount, totalAmount, onBillUpdate]);

  const currencySymbol = currency === 'INR' ? '₹' : 'रु';
  const currencyName = currency === 'INR' ? 'INR' : 'NPR';

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
          <CustomerSearch onCustomerSelect={handleCustomerSelect} onAddNewCustomer={clearCustomerDetails} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Label htmlFor="customerMobile">Mobile Number <span className="text-red-500">*</span></Label>
              <Input
                id="customerMobile"
                type="tel"
                value={customerMobile}
                onChange={e => setCustomerMobile(e.target.value)}
                placeholder="e.g., +919876543210"
                maxLength={12}
                pattern="^\+91[6-9]\d{9}$"
              />
              <p className="text-xs text-gray-500 mt-1">Indian mobile number with +91 prefix</p>
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
                placeholder="e.g., Kathmandu, Nepal"
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
                    {(currency === 'NPR' ? product.priceINR * INR_TO_NPR_RATE : product.priceINR).toFixed(2)} / {product.unit}
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
          <Label>Discount (Fixed Amount)</Label>
          <Input
            type="number"
            placeholder="Enter discount amount"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="mt-1"
            min="0"
            step="0.01"
          />
          {discountValue !== '' && parseFloat(discountValue) > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Discount Applied: {currencySymbol}{parseFloat(discountValue).toFixed(2)} {currencyName}
            </p>
          )}
        </motion.section>

        <section className="pt-6 border-t space-y-2">
          <p>Subtotal: <strong>{currencySymbol}{subtotal.toFixed(2)}</strong></p>
          <p>Discount: <strong>{currencySymbol}{discountAmount.toFixed(2)}</strong></p>
          <p>Total: <strong>{currencySymbol}{totalAmount.toFixed(2)}</strong></p>
        </section>

        <section className="pt-4 border-t grid grid-cols-2 gap-4">
          <div>
            <Label>Currency</Label>
            <div className="flex items-center space-x-2 mt-1">
              <span>INR</span>
              <Switch
                checked={currency === 'NPR'}
                onCheckedChange={(checked) => setCurrency(checked ? 'NPR' : 'INR')}
              />
              <span>NPR</span>
            </div>
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default BillingForm;