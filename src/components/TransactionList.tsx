import { Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock transaction data - in a real app, this would come from the blockchain
const mockTransactions = [
  {
    id: '1',
    type: 'receive',
    amount: '0.125',
    address: '0x742...8A4b',
    timestamp: 'Today, 2:45 PM',
    status: 'completed'
  },
  {
    id: '2',
    type: 'send',
    amount: '0.05',
    address: '0x912...7F3c',
    timestamp: 'Yesterday, 9:30 AM',
    status: 'completed'
  },
  {
    id: '3',
    type: 'receive',
    amount: '0.8',
    address: '0x342...1D2a',
    timestamp: '2 days ago',
    status: 'completed'
  },
  {
    id: '4',
    type: 'send',
    amount: '0.25',
    address: '0x512...9B1e',
    timestamp: '3 days ago',
    status: 'pending'
  }
];

export default function TransactionList() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      
      {mockTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-700 py-8 text-center">
          <Clock size={24} className="mb-2 text-neutral-500" />
          <p className="text-neutral-400">No transactions yet</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2"
        >
          {mockTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-background-light p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  tx.type === 'receive' ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownLeft size={16} className="text-success" />
                  ) : (
                    <ArrowUpRight size={16} className="text-error" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {tx.type === 'receive' ? 'Received' : 'Sent'}
                  </div>
                  <div className="text-xs text-neutral-400">{tx.address}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  tx.type === 'receive' ? 'text-success' : 'text-error'
                }`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount} ETH
                </div>
                <div className="text-xs text-neutral-400">{tx.timestamp}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}