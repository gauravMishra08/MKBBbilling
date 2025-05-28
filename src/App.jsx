import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import AuthPage from '@/pages/AuthPage';
    import BillingPage from '@/pages/BillingPage';
    import { Toaster } from '@/components/ui/toaster';
    import { TooltipProvider } from '@/components/ui/tooltip';
    import { Loader2 } from 'lucide-react';

    const ProtectedRoute = ({ children }) => {
      const { currentUser, isLoadingAuth } = useAuth();
      
      if (isLoadingAuth) {
        return (
          <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }
      return currentUser ? children : <Navigate to="/auth" replace />;
    };

    const AuthRedirect = ({ children }) => {
      const { currentUser, isLoadingAuth } = useAuth();

      if (isLoadingAuth) {
         return (
          <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }
      return currentUser ? <Navigate to="/" replace /> : children;
    }

    function AppContent() {
      return (
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthRedirect><AuthPage /></AuthRedirect>} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              } 
            />
             <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      );
    }

    function App() {
      return (
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      );
    }

    export default App;