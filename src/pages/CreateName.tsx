import { useState, useEffect } from 'react';
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNameService } from '../context/NameserviceContext';

export default function NameRegistration() {
  const navigate = useNavigate();
  const { isAvailable, error: serviceError, clearError, isReady } = useNameService();
  
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  // Clear previous results when name changes
  useEffect(() => {
    setIsNameAvailable(null);
    setShowContinue(false);
    setError(null);
    if (serviceError) clearError();
  }, [name, serviceError, clearError]);

  // Validate domain name
  const validateName = (inputName: string): string | null => {
    if (!inputName.trim()) {
      return 'Please enter a name';
    }
    
    if (inputName.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    
    if (inputName.length > 20) {
      return 'Name must be 20 characters or less';
    }
    
    // Check for valid characters (alphanumeric and hyphens, no spaces)
    if (!/^[a-z0-9-]+$/.test(inputName)) {
      return 'Name can only contain letters, numbers, and hyphens';
    }
    
    // Can't start or end with hyphen
    if (inputName.startsWith('-') || inputName.endsWith('-')) {
      return 'Name cannot start or end with a hyphen';
    }
    
    return null;
  };

  const checkAvailability = async () => {
    const trimmedName = name.trim().toLowerCase();
    
    // Validate input
    const validationError = validateName(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if service is ready
    if (!isReady) {
      setError('Error creating your wallet. Please try again');
      return;
    }

    setError(null);
    setChecking(true);
    setIsNameAvailable(null);
    setShowContinue(false);

    try {
      const available = await isAvailable(trimmedName);
      setIsNameAvailable(available);
      
      if (available) {
        // Store the selected name for the next page
        localStorage.setItem('selectedDomainName', `${trimmedName}.fluid`);
        setShowContinue(true);
      }
    } catch (err) {
      setError('Failed to check availability. Please try again.');
      console.error('Availability check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  const proceedToNext = () => {
    if (isNameAvailable && name.trim()) {
      // You can pass the name as state or URL param based on your routing setup
      navigate('/backup', { 
        state: { 
          domainName: name.trim().toLowerCase() 
        } 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !checking) {
      if (showContinue) {
        proceedToNext();
      } else {
        checkAvailability();
      }
    }
  };

  // Get the current error to display
  const displayError = error || serviceError;

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-white">
            Choose Your Wallet Name
          </h1>
          <p className="text-sm text-neutral-400">
            This will be your unique identifier on the network
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your unique name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={checking}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 pr-12 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            
            {/* Status indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AnimatePresence mode="wait">
                {checking && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </motion.div>
                )}
                {isNameAvailable === true && (
                  <motion.div
                    key="available"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
                {isNameAvailable === false && (
                  <motion.div
                    key="unavailable"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Error messages */}
          <AnimatePresence>
            {displayError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-500"
              >
                {displayError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {isNameAvailable === true && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-green-500"
              >
                ✅ Great! "{name.trim().toLowerCase()}" is available
              </motion.p>
            )}
          </AnimatePresence>

          {/* Unavailable message */}
          <AnimatePresence>
            {isNameAvailable === false && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-500"
              >
                Oh no, "{name.trim().toLowerCase()}" is already taken
              </motion.p>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="space-y-3">
            {!showContinue ? (
              <button
                onClick={checkAvailability}
                disabled={checking || !name.trim() || !isReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking Availability...
                  </>
                ) : (
                  <>
                    Check Availability
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={proceedToNext}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-medium text-white transition hover:bg-green-700"
              >
                Continue with "{name.trim().toLowerCase()}.fluid"
                <ArrowRight size={18} />
              </motion.button>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}