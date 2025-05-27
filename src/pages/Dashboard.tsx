import { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion } from 'framer-motion';

// Components
import NetworkSelector from '../components/NetworkSelector';
import WalletCard from '../components/WalletCard';
import ActionButtons from '../components/ActionButtons';
import TransactionList from '../components/TransactionList';
import ReceiveModal from '../components/ReceiveModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getBalance } = useWallet();
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  // Refresh balances when dashboard loads
  useState(() => {
    getBalance();
  });
  
  const logout = () => {
    // In a real app, would clear wallet data
    localStorage.removeItem('walletData');
    navigate('/');
    
    // For demo, just show an alert
    alert('Logout functionality would be implemented here in a real wallet app.');
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-neutral-800 p-4">
        <NetworkSelector />
        
        <div className="flex gap-2">
          <button
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={logout}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <WalletCard />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6"
        >
          <ActionButtons />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <TransactionList />
        </motion.div>
      </main>
      
      <ReceiveModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
    </div>
  );
}