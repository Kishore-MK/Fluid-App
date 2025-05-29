import { useEffect, useState } from "react";
import { Clock, ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "../context/WalletContext";


export default function TransactionList() {
  const { ethAddress } = useWallet();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!ethAddress) return;

      try {
        const res = await fetch(`http://localhost:3000/api/transactions?address=${ethAddress}`);
        const data = await res.json();
        console.log(data);

        if (data.success) {
          setTransactions(data.transactions);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [ethAddress]);
  // const transactions = [
  //   {
  //     address: "0xe841d59bb054b5cf81cf8bea1b74ece5a12550f2",
  //     amount: "0.00010",
  //     id: "0xbe5edb48902ea933bd4e4a787e84e5ae2ee3e8b07e61fbb3e9f6f06f43019857",
  //     status: "completed",
  //     timestamp: "5/29/2025, 8:06:00 PM",
  //     type: "send",
  //   },
  //   {
  //     address: "0xe841d59bb054b5cf81cf8bea1b74ece5a12550f2",
  //     amount: "0.01000",
  //     id: "0x3cc9ab89d8cf160fe7b34d019e2b60f0a9fb1e755395ec41da7e2d8d62a391ed",
  //     status: "completed",
  //     timestamp: "5/29/2025, 4:32:36 PM",
  //     type: "receive",
  //   },
  // ];
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>

      {loading ? (
        <p className="text-neutral-400">Loading transactions...</p>
      ) : transactions.length === 0 ? (
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
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
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
                    className="text-xs flex text-neutral-400 gap-2 hover:cursor-pointer"
                    onClick={() => {
                      window.open(`https://sepolia.etherscan.io/tx/${tx.id}`);
                    }}
                  >
                    <div className="hover:underline">
                      {tx.id
                        ? `${tx.id.slice(0, 8)}....${tx.id.slice(-5)}`
                        : ""}
                    </div>
                    <div>
                      <ExternalLink size={12} className="mt-[2px]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right ">
                <div
                  className={`font-medium ${
                    tx.type === "receive" ? "text-success" : "text-error"
                  }`}
                >
                  {tx.type === "receive" ? "+" : "-"}
                  {tx.amount} ETH
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
