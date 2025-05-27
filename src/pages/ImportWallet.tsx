import { useState } from 'react';
import { ArrowLeft, Download, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

export default function ImportWallet() {
  const navigate = useNavigate();
  const { importWallet } = useWallet();
  const [mnemonic, setMnemonic] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImportWallet = async () => {
    try {
      setIsImporting(true);
      setError(null);
      
      if (!mnemonic.trim()) {
        setError('Please enter a recovery phrase');
        return;
      }
      
      // Validate mnemonic (simplified for demo)
      const words = mnemonic.trim().split(/\s+/);
      if (words.length !== 12 && words.length !== 24) {
        setError('Recovery phrase must be 12 or 24 words');
        return;
      }
      
      // Import wallet
      const success = await importWallet(mnemonic.trim());
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid recovery phrase. Please check and try again.');
      }
    } catch (err) {
      console.error('Failed to import wallet:', err);
      setError('Failed to import wallet. Please try again.');
    } finally {
      setIsImporting(false);
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
        <h1 className="ml-4 text-xl font-semibold text-white">Import Wallet</h1>
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
              <Download size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Import Wallet</h2>
          </div>
          <p className="text-sm text-neutral-400">
            Enter your 12 or 24-word recovery phrase to restore your wallet for both Ethereum and Starknet networks.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <label className="mb-2 block text-sm font-medium text-neutral-300">
            Recovery Phrase
          </label>
          <textarea
            className="input min-h-[120px]"
            placeholder="Enter your recovery phrase (12 or 24 words separated by spaces)"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
          <p className="mt-2 text-xs text-neutral-500">
            Words should be separated by spaces
          </p>
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
            onClick={handleImportWallet}
            disabled={isImporting}
            className="btn btn-primary w-full py-3 text-center"
          >
            {isImporting ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Importing Wallet...
              </div>
            ) : (
              'Import Wallet'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}