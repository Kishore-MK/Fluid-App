import { ArrowDownToLine, Send, RotateCw, History } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

export default function ActionButtons() {
  const { selectedNetwork, addFunds } = useWallet();
  
  const handleAddFunds = () => {
    addFunds();
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.button
        variants={item}
        className="flex flex-col items-center gap-2"
        onClick={handleAddFunds}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          selectedNetwork === 'ethereum' ? 'bg-accent-eth/10' : 'bg-accent-strk/10'
        }`}>
          <ArrowDownToLine size={20} className={
            selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'
          } />
        </div>
        <span className="text-xs text-neutral-300">Receive</span>
      </motion.button>
      
      <motion.button
        variants={item}
        className="flex flex-col items-center gap-2"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          selectedNetwork === 'ethereum' ? 'bg-accent-eth/10' : 'bg-accent-strk/10'
        }`}>
          <Send size={20} className={
            selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'
          } />
        </div>
        <span className="text-xs text-neutral-300">Send</span>
      </motion.button>
      
      <motion.button
        variants={item}
        className="flex flex-col items-center gap-2"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          selectedNetwork === 'ethereum' ? 'bg-accent-eth/10' : 'bg-accent-strk/10'
        }`}>
          <RotateCw size={20} className={
            selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'
          } />
        </div>
        <span className="text-xs text-neutral-300">Swap</span>
      </motion.button>
      
      <motion.button
        variants={item}
        className="flex flex-col items-center gap-2"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
          selectedNetwork === 'ethereum' ? 'bg-accent-eth/10' : 'bg-accent-strk/10'
        }`}>
          <History size={20} className={
            selectedNetwork === 'ethereum' ? 'text-accent-eth' : 'text-accent-strk'
          } />
        </div>
        <span className="text-xs text-neutral-300">History</span>
      </motion.button>
    </motion.div>
  );
}