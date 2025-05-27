import { ChevronDown, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkType } from '../types';

export default function NetworkSelector() {
  const { selectedNetwork, switchNetwork } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleNetworkChange = (network: NetworkType) => {
    switchNetwork(network);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 rounded-lg py-2 px-3 font-medium transition-all ${
          selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'
        }`}
      >
        <div 
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            selectedNetwork === 'ethereum' ? 'bg-accent-eth/10' : 'bg-accent-strk/10'
          }`}
        >
          <Wallet size={16} className={selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'} />
        </div>
        <span className="font-medium">
          {selectedNetwork === 'ethereum' ? 'Ethereum' : 'Starknet'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-12 z-10 overflow-hidden rounded-lg border border-neutral-700 bg-background-light shadow-lg"
          >
            <button
              className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-background/80 ${
                selectedNetwork === 'ethereum' ? 'bg-background' : ''
              }`}
              onClick={() => handleNetworkChange('ethereum')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-eth/10">
                <Wallet size={16} className="text-accent-eth" />
              </div>
              <span className="font-medium text-accent-eth">Ethereum</span>
            </button>
            <button
              className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-background/80 ${
                selectedNetwork === 'starknet' ? 'bg-background' : ''
              }`}
              onClick={() => handleNetworkChange('starknet')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-strk/10">
                <Wallet size={16} className="text-accent-strk" />
              </div>
              <span className="font-medium text-accent-strk">Starknet</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}