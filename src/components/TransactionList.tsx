import { useEffect, useState } from "react";
import { Clock, ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "../context/WalletContext";

interface Transaction {
  address: string;
  amount: string;
  id: string;
  status: string;
  timestamp: string;
  type: "send" | "receive";
}

export default function TransactionList() {
  const { ethAddress, selectedNetwork, strkAddress } = useWallet();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current address based on selected network
  const getCurrentAddress = () => {
    return selectedNetwork === "ethereum" ? ethAddress : strkAddress;
  };

  // Get explorer URL based on network and transaction type
  const getExplorerUrl = (txId: string) => {
    if (selectedNetwork === "ethereum") {
      return `https://sepolia.etherscan.io/tx/${txId}`;
    } else {
      return `https://sepolia.starkscan.co/tx/${txId}`;
    }
  };

  // Get currency symbol based on network
  const getCurrencySymbol = () => {
    return selectedNetwork === "ethereum" ? "ETH" : "STRK";
  };

  // Get API endpoint based on network
  const getApiEndpoint = (address: string) => {
    const networkParam = selectedNetwork === "ethereum" ? "ethereum" : "starknet";
    // dev
    return `http://localhost:3000/api/transactions?address=${address}&network=${networkParam}`;

    // Prod

    //  return `https://fluid-server.onrender.com/api/transactions?address=${address}&network=${networkParam}`;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const currentAddress = getCurrentAddress();
      
      if (!currentAddress) {
        setTransactions([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(getApiEndpoint(currentAddress));
        const data = await res.json();
        console.log(`${selectedNetwork} transactions:`, data);

        if (data.success) {
          setTransactions(data.transactions.slice(0, 5) || []);
        } else {
          console.error(`Failed to fetch ${selectedNetwork} transactions:`, data.error);
          setTransactions([]);
        }
      } catch (error) {
        console.error(`Failed to fetch ${selectedNetwork} transactions:`, error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [ethAddress, strkAddress, selectedNetwork]);

  const currentAddress = getCurrentAddress();
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
         
      </div>

      {!currentAddress ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-700 py-8 text-center">
          <Clock size={24} className="mb-2 text-neutral-500" />
          <p className="text-neutral-400">
            No {selectedNetwork} wallet connected
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-neutral-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-neutral-400"></div>
            Loading transactions...
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-700 py-8 text-center">
          <Clock size={24} className="mb-2 text-neutral-500" />
          <p className="text-neutral-400">
            No transactions yet
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2"
        >
          {transactions.map((tx, index) => (
            <motion.div
              key={`${selectedNetwork}-${tx.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-background-light p-3 overflow-auto"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tx.type === "receive" ? "bg-success/10" : "bg-error/10"
                  }`}
                >
                  {tx.type === "receive" ? (
                    <ArrowDownLeft size={16} className="text-success" />
                  ) : (
                    <ArrowUpRight size={16} className="text-error" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {tx.type === "receive" ? "Received" : "Sent"}
                  </div>
                  <div
                    className="text-xs flex text-neutral-400 gap-2 hover:cursor-pointer group"
                    onClick={() => {
                      window.open(getExplorerUrl(tx.id), '_blank');
                    }}
                  >
                    <div className="group-hover:underline">
                      {tx.id
                        ? `${tx.id.slice(0, 8)}....${tx.id.slice(-5)}`
                        : ""}
                    </div>
                    <div>
                      <ExternalLink size={12} className="mt-[2px]" />
                    </div>
                  </div>
                  {tx.timestamp && (
                    <div className="text-xs text-neutral-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    tx.type === "receive" ? "text-success" : "text-error"
                  }`}
                >
                  {tx.type === "receive" ? "+" : "-"}
                  {tx.amount} {currencySymbol}
                </div>
                <div className="text-xs text-neutral-500 capitalize">
                  {tx.status}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}