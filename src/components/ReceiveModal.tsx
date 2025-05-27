import { X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const { selectedNetwork, ethAddress, strkAddress } = useWallet();
  const [copied, setCopied] = useState(false);
  
  const address = selectedNetwork === 'ethereum' ? ethAddress : strkAddress;
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-xs overflow-hidden rounded-xl border border-neutral-800 bg-background p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Receive Funds</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="mb-4 flex flex-col items-center gap-4">
          <div 
            className={`rounded-full px-3 py-1 text-sm ${
              selectedNetwork === 'ethereum' 
                ? 'bg-accent-eth/10 text-accent-eth' 
                : 'bg-accent-strk/10 text-accent-strk'
            }`}
          >
            {selectedNetwork === 'ethereum' ? 'Ethereum Network' : 'Starknet Network'}
          </div>
          
          <div className="rounded-xl bg-white p-4">
            {address && (
              <QRCode 
                value={address} 
                size={180}
                fgColor="#000000"
                bgColor="#FFFFFF"
                level="H"
              />
            )}
          </div>
          
          <div className="w-full">
            <div className="mb-1 text-sm text-neutral-400">Your {selectedNetwork} Address</div>
            <div className="flex items-center gap-2">
              <div className="w-full truncate rounded-lg bg-background-light px-3 py-2 text-sm text-white">
                {address || 'No address available'}
              </div>
              <button
                onClick={copyAddress}
                className={`rounded-lg px-3 py-2 text-sm ${
                  copied ? 'bg-success text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-background-light p-3 text-sm text-neutral-300">
          <p>
            Send only {selectedNetwork === 'ethereum' ? 'ETH' : 'STRK'} to this address. 
            Sending any other assets may result in permanent loss.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}