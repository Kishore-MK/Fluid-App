import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

// Replace with your actual availability checker


export default function NameRegistration() {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean|null>(null);
  const [error, setError] = useState<string|null>("");

  const checkAvailability = async () => {
    if (!name) {
      setError('Please enter a name');
      return;
    }
    setError(null);
    setChecking(true);
    const available = await isAvailable(name);
    setIsNameAvailable(available);
    setChecking(false);

    if (available) {
      navigate(`/backup`);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Choose Your Account Name
        </h1>

        <input
          type="text"
          placeholder="Enter your unique name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {isNameAvailable === false && (
          <p className="mt-2 text-sm text-red-500">This name is already taken.</p>
        )}

        <button
          onClick={checkAvailability}
          disabled={checking}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check Availability'}
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
