import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import { ChatContextProvider } from "./context/ChatContext";
import Login from "./containers/login/Login";
import Home from "./containers/home/Home";
import SignUp from "./containers/sign_up/SignUp";
import ChatNavbar from "./containers/navBar/Navbar";
import Search from "./containers/search/Search";
import Cookies from "js-cookie";

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#111b21] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-6">
      
      {/* Loading text and spinner */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef]">
          messaging app
        </h2>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#667781] dark:text-[#8696a0] text-sm">
            Loading your conversations...
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#111b21] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#202c33] rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" className="fill-red-500">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#111b21] dark:text-[#e9edef] mb-4">
              Something went wrong
            </h2>
            <p className="text-[#667781] dark:text-[#8696a0] text-sm mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#00a884] hover:bg-[#008f72] text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");
  const userData = Cookies.get("all");
  
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const token = Cookies.get("token");
  const userData = Cookies.get("all");
  
  if (token && userData) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Network Status Component
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center space-x-2">
        <svg width="16" height="16" viewBox="0 0 24 24" className="fill-white">
          <path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>
        </svg>
        <span>No internet connection</span>
      </div>
    </div>
  );
};

// Page Title Hook
const usePageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const titles = {
      '/': 'WhatsApp Web',
      '/home': 'WhatsApp Web',
      '/signup': 'Sign Up - WhatsApp Web',
      '/search': 'Search - WhatsApp Web'
    };
    
    document.title = titles[location.pathname] || 'WhatsApp Web';
  }, [location.pathname]);
};

// App Layout Component
const AppLayout = ({ children }) => {
  usePageTitle();
  
  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#111b21]">
      <NetworkStatus />
      <ChatNavbar />
      <main className="relative">
        {children}
      </main>
    </div>
  );
};

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [appError, setAppError] = useState(null);

  // Initialize app and user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = Cookies.get("all");
        const token = Cookies.get("token");
        
        if (data && token) {
          try {
            const userData = JSON.parse(data);
            setUser(userData);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            // Clear corrupted data
            Cookies.remove("all");
            Cookies.remove("token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setAppError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle app-level errors
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAppError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error screen if app failed to initialize
  if (appError) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#111b21] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#202c33] rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" className="fill-red-500">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#111b21] dark:text-[#e9edef] mb-4">
            Failed to Load App
          </h2>
          <p className="text-[#667781] dark:text-[#8696a0] text-sm mb-6">
            There was a problem loading WhatsApp Web. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#00a884] hover:bg-[#008f72] text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <UserContextProvider>
        <ChatContextProvider user={user}>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <SignUp />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected routes */}
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <Search className="desktop-only" />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </ChatContextProvider>
      </UserContextProvider>
    </ErrorBoundary>
  );
}

export default App;