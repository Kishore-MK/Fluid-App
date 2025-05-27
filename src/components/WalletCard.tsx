import { Copy, ExternalLink, Send, ArrowDownToLine, Settings } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { shortenAddress, formatBalance } from '../utils/wallet';
import { motion } from 'framer-motion';

export default function WalletCard() {
  const { selectedNetwork, ethAddress, strkAddress, ethBalance, strkBalance } = useWallet();
  const [copied, setCopied] = useState(false);

  const address = selectedNetwork === 'ethereum' ? ethAddress : strkAddress;
  const balance = selectedNetwork === 'ethereum' ? ethBalance : strkBalance;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/50 ${
        selectedNetwork === 'ethereum' ? 'eth-gradient' : 'strk-gradient'
      } hover-scale`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      
      <div className="relative p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-white/90">
            {selectedNetwork === 'ethereum' ? 'Ethereum Wallet' : 'Starknet Wallet'}
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            >
              <Settings size={16} />
            </motion.button>
            <motion.div 
              className="h-8 w-8 rounded-full bg-white/20 p-1.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedNetwork === 'ethereum' ? (
                <svg viewBox="0 0 784.37 1277.39" className="h-full w-full">
                  <path fill="currentColor" d="M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"/>
                  <path fill="currentColor" d="M392.07 0L0 650.54l392.07 231.75V472.33z"/>
                  <path fill="currentColor" d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z"/>
                  <path fill="currentColor" d="M392.07 1277.38V956.52L0 724.89z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-full w-full">
                  <path fill="currentColor" d="M21 18L13 18L13 13L16 13L16 16L21 16L21 18ZM8 16L8 13L11 13L11 18L3 18L3 16L8 16ZM16 11L13 11L13 6L21 6L21 8L16 8L16 11ZM11 6L11 11L8 11L8 8L3 8L3 6L11 6Z"/>
                </svg>
              )}
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="mb-2 text-3xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {formatBalance(balance)} {selectedNetwork === 'ethereum' ? 'ETH' : 'STRK'}
        </motion.div>
        
        <motion.div 
          className="mb-6 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ≈ ${(parseFloat(balance) * 1650).toLocaleString()} USD
        </motion.div>
        
        <div className="mb-6 flex items-center justify-between gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Send size={16} className="mb-1 mx-auto" />
            Send
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowDownToLine size={16} className="mb-1 mx-auto" />
            Receive
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div 
            className="glass-effect rounded-xl px-3 py-2 text-sm"
            whileHover={{ scale: 1.02 }}
          >
            {shortenAddress(address)}
          </motion.div>
          <motion.button
            onClick={copyAddress}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            title="Copy address"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-success"
              >
                ✓
              </motion.div>
            ) : (
              <Copy size={16} />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            title="View in explorer"
          >
            <ExternalLink size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}