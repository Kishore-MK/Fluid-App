import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

export default function BackupWallet() {
  const navigate = useNavigate();
  const { mnemonic } = useWallet();
  const [showPhrase, setShowPhrase] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!mnemonic) {
    navigate('/dashboard');
    return null;
  }
  
  const toggleShowPhrase = () => {
    setShowPhrase(!showPhrase);
  };
  
  const copyPhrase = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleContinue = () => {
    navigate('/dashboard');
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
        <h1 className="ml-4 text-xl font-semibold text-white">Backup Recovery Phrase</h1>
      </header>
      
      <div className="flex flex-1 flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-xl border border-warning/50 bg-warning/10 p-4"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-warning" />
            <h2 className="font-semibold text-warning">Important Warning</h2>
          </div>
          <p className="mt-2 text-sm text-warning/80">
            Never share your recovery phrase with anyone. Anyone with this phrase can take full control of your wallet.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300">
              Your Recovery Phrase
            </label>
            <button
              onClick={toggleShowPhrase}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              {showPhrase ? (
                <>
                  <EyeOff size={12} />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye size={12} />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>
          
          <div className="relative mb-2 rounded-lg border border-neutral-700 bg-background-light p-3">
            {showPhrase ? (
              <p className="break-words text-sm text-white">{mnemonic}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div 
                    key={index}
                    className="h-4 w-16 rounded bg-neutral-700"
                  ></div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={copyPhrase}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy to clipboard</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
              className="h-4 w-4 rounded border-neutral-600 bg-background text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral-300">
              I have saved my recovery phrase in a safe place
            </span>
          </label>
        </motion.div>
        
        <div className="mt-auto">
          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className={`btn w-full py-3 text-center ${
              confirmed ? 'btn-primary' : 'btn-outline opacity-50'
            }`}
          >
            Continue to Wallet
          </button>
        </div>
      </div>
    </div>
  );
}