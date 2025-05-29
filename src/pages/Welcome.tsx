import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary"
        >
          <Wallet size={40} className="text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2 text-center text-3xl font-bold text-white"
        >
          Fluid Wallet
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 text-center text-neutral-400"
        >
          Secure wallet for Ethereum and Starknet
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex w-full flex-col gap-3"
        >
          <Link
            to="/create"
            className="btn btn-primary w-full py-3 text-center"
          >
            Create New Wallet
          </Link>
          
          <Link
            to="/import"
            className="btn btn-outline w-full py-3 text-center"
          >
            Import Wallet
          </Link>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-4 text-center text-xs text-neutral-500"
      >
        By continuing, you agree to our Terms of Service and Privacy Policy
      </motion.div>
    </div>
  );
}