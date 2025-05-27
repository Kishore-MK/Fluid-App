import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

export default function CreateWallet() {
  const navigate = useNavigate();
  const { createNewWallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleCreateWallet = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Create wallet
      await createNewWallet();
      
      // Navigate to backup page to show mnemonic
      navigate('/backup');
    } catch (err) {
      console.error('Failed to create wallet:', err);
      setError('Failed to create wallet. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center border-b border-neutral-800 p-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-full p-1 hover:bg-neutral-800"
        >
          <ArrowLeft size={20} className="text-neutral-400" />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-white">Create Wallet</h1>
      </header>
      
      <div className="flex flex-1 flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-xl border border-neutral-800 bg-background-light p-4"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Secure Wallet</h2>
          </div>
          <p className="text-sm text-neutral-400">
            We'll create a secure wallet for both Ethereum and Starknet networks with a single recovery phrase. This phrase is your only backup.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 rounded-xl border border-neutral-800 bg-background-light p-4"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Important</h2>
          </div>
          <ul className="ml-4 list-disc text-sm text-neutral-400">
            <li className="mb-2">Write down your recovery phrase on paper</li>
            <li className="mb-2">Store it in a secure place</li>
            <li className="mb-2">Never share it with anyone</li>
            <li>You'll need it to recover your wallet</li>
          </ul>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
        
        <div className="mt-auto">
          <button
            onClick={handleCreateWallet}
            disabled={isCreating}
            className="btn btn-primary w-full py-3 text-center"
          >
            {isCreating ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Wallet...
              </div>
            ) : (
              'Create Wallet'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}