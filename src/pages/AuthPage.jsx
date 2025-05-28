import React from 'react';
    import LoginForm from '@/components/auth/LoginForm';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { motion } from 'framer-motion';

    const AuthPage = () => {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary/10 text-center p-8">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <CardTitle className="text-3xl font-bold text-primary">
                    Please log in to access the billing system.
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                <LoginForm />
              </CardContent>
            </Card>
            <p className="mt-6 text-center text-sm text-white/80">
              © {new Date().getFullYear()} Mishra Krishi Beej Bhandar
            </p>
          </motion.div>
        </div>
      );
    };

    export default AuthPage;