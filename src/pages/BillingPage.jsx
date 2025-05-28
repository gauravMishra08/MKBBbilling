
import React, { useState, useCallback } from 'react';
import BillingForm from '@/components/billing/BillingForm';
import BillPreview from '@/components/billing/BillPreview';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const BillingPage = () => {
  const [billData, setBillData] = useState(null);
  const { currentUser, signOut } = useAuth();

  const handleBillUpdate = useCallback((data) => {
    setBillData(data);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-200 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Billing Dashboard</h1>
          </motion.div>
          {(
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <Button variant="ghost" onClick={signOut} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div 
          className="lg:sticky lg:top-24 no-print" // Sticky for form on larger screens
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BillingForm onBillUpdate={handleBillUpdate} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <BillPreview billData={billData} />
        </motion.div>
      </main>
      
      <footer className="text-center py-6 text-sm text-muted-foreground no-print">
        <p>&copy; {new Date().getFullYear()} Mishra Krishi Beej Bhandar</p>
      </footer>
    </div>
  );
};

export default BillingPage;
