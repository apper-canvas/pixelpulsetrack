import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  const HomeIcon = getIcon('home');
  const ArrowLeftIcon = getIcon('arrow-left');
  
  // Auto redirect after 10 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000);
    
    // Clean up timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 mb-8">
            <span className="text-5xl font-bold text-primary dark:text-primary-light">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
            You'll be redirected to the home page automatically in a few seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/"
              className="btn btn-primary inline-flex items-center px-6 py-3 rounded-lg w-full sm:w-auto justify-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline inline-flex items-center px-6 py-3 rounded-lg w-full sm:w-auto justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;