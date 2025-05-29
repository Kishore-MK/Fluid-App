import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Fuel,
  ExternalLink,
} from "lucide-react";
import { ethers } from "ethers";

interface Transaction {
  hash?: string;
  status: "pending" | "confirmed" | "failed";
  network?: string;
  amount?: string;
  to?: string;
  gasUsed?: string;
  gasFee?: string;
  error?: string;
}

export default function SendPage() {
  const navigate = useNavigate();
  const { selectedNetwork, ethAddress, strkAddress } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gasData, setGasData] = useState<any>(null);
  const [isLoadingGas, setIsLoadingGas] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const address = selectedNetwork === "ethereum" ? ethAddress : strkAddress;
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    if (amount && recipient && !isSending) {
      calculateGasFees();
    } else {
      setGasData(null);
    }
  }, [amount, recipient, selectedNetwork]);

  const calculateGasFees = async () => {
    if (!amount || !recipient) return;
    setIsLoadingGas(true);
    try {
      const response = await fetch("http://localhost:3000/api/calculate-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: selectedNetwork,
          to: recipient,
          amount: amount,
          from: address,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGasData(data.gasData);
      }
    } catch (error) {
      console.error("Gas calculation failed:", error);
    } finally {
      setIsLoadingGas(false);
    }
  };
  const handleSend = async () => {
    const walletData = localStorage.getItem("walletData");
    console.log(walletData);
    const parsed = JSON.parse(walletData || "");
    setPrivateKey(`0x${parsed.ethPrivateKey}`);
    console.log(privateKey);

    if (!recipient || !amount || !privateKey) {
      console.log("No keys!");
    }
    setIsSending(true);

    try {
      const wallet = new ethers.Wallet(privateKey);
      const provider = new ethers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/key"
      );
      const signer = wallet.connect(provider);

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
        gasPrice: gasData
          ? ethers.parseUnits(gasData.gasPrice.toString(), "gwei")
          : undefined,
        gasLimit: gasData ? ethers.toBigInt(gasData.gasLimit) : undefined,
      });

      console.log("Transaction sent:", tx);

      setTransaction({
        hash: tx.hash,
        status: "pending",
        network: selectedNetwork,
        amount,
        to: recipient,
        gasUsed: "",
        gasFee: "",
      });

      // Wait for confirmation (optional)
      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        setTransaction((prev) => ({ ...prev!, status: "confirmed" }));
      } else {
        setTransaction((prev) => ({
          ...prev!,
          status: "failed",
          error: "Transaction reverted",
        }));
      }

      // Reset inputs
      setRecipient("");
      setAmount("");
      setGasData(null);
    } catch (err: any) {
      console.error("Send failed:", err);
      setTransaction({
        status: "failed",
        error: err?.message || "Transaction failed",
      });
    } finally {
      setIsSending(false);
    }
  };

  //   const handleSend = async () => {
  //     if (!recipient || !amount || !gasData) return;
  //     setIsSending(true);
  //     try {
  //       const response = await fetch('http://localhost:3000/api/send-transaction', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           network: selectedNetwork,
  //           to: recipient,
  //           amount: amount,
  //           from: address,
  //           gasData: gasData
  //         })
  //       });
  //       const data = await response.json();

  //       if (data.success) {
  //         setTransaction({
  //           hash: data.txHash,
  //           status: 'pending',
  //           network: selectedNetwork,
  //           amount: amount,
  //           to: recipient,
  //           gasUsed: gasData.gasLimit,
  //           gasFee: gasData.totalFee
  //         });

  //         setTimeout(() => {
  //           setTransaction(prev => ({ ...prev!, status: 'confirmed' }));
  //         }, 3000);

  //         setRecipient('');
  //         setAmount('');
  //         setGasData(null);
  //       } else {
  //         setTransaction({
  //           status: 'failed',
  //           error: data.error || 'Transaction failed'
  //         });
  //       }
  //     } catch (err) {
  //       console.error('Send failed:', err);
  //       setTransaction({
  //         status: 'failed',
  //         error: 'Network error occurred'
  //       });
  //     } finally {
  //       setIsSending(false);
  //     }
  //   };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="animate-spin text-yellow-400" size={20} />;
      case "confirmed":
        return <CheckCircle className="text-green-400" size={20} />;
      case "failed":
        return <XCircle className="text-red-400" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-400/30 bg-yellow-400/10";
      case "confirmed":
        return "border-green-400/30 bg-green-400/10";
      case "failed":
        return "border-red-400/30 bg-red-400/10";
      default:
        return "border-neutral-800/50";
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`relative mt-10 max-w-md mx-auto overflow-hidden rounded-2xl border border-neutral-800/50 ${
          selectedNetwork === "ethereum"
            ? "bg-accent-eth/10"
            : "bg-accent-strk/10"
        }`}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="relative p-6 space-y-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="glass-effect flex items-center gap-1 rounded-full px-3 py-1 text-sm text-white/80 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span className="text-xs uppercase tracking-wide">
              {selectedNetwork === "ethereum" ? "Send ETH" : "Send STRK"}
            </span>
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">From:</label>
            <div className="glass-effect rounded-md px-3 py-2 text-sm text-white overflow-auto custom-scrollbar">
              {address}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">To:</label>

            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">Amount:</label>
            <input
              type="number"
              step="any"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white"
            />
          </div>

          <AnimatePresence>
            {(gasData || isLoadingGas) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-effect rounded-lg p-4 border border-neutral-700/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Fuel size={16} className="text-orange-400" />
                  <span className="text-sm font-medium text-white/90">
                    Gas Fees
                  </span>
                </div>
                {isLoadingGas ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  </div>
                ) : gasData ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Gas Price:</span>
                      <span className="text-white">
                        {gasData.gasPrice} Gwei
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Gas Limit:</span>
                      <span className="text-white">
                        {gasData.gasLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-white/90 font-medium">
                        Total Fee:
                      </span>
                      <span className="text-white font-medium">
                        {gasData.totalFee}{" "}
                        {selectedNetwork === "ethereum" ? "ETH" : "STRK"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSending || !gasData || !recipient || !amount}
            className="flex w-full items-center justify-center gap-2 rounded-xl eth-gradient py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <Send size={16} />
            {isSending ? "Sending..." : "Send"}
          </motion.button>
        </div>
      </motion.div>

      {/* Transaction status */}
      <AnimatePresence>
        {transaction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`relative max-w-md mx-auto overflow-hidden rounded-2xl border ${getStatusColor(
              transaction.status
            )} backdrop-blur-sm`}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(transaction.status)}
                <span className="font-medium">
                  {transaction.status === "pending" && "Transaction Pending"}
                  {transaction.status === "confirmed" &&
                    "Transaction Confirmed"}
                  {transaction.status === "failed" && "Transaction Failed"}
                </span>
              </div>

              <div className="space-y-3 text-sm flex">
                {transaction.hash && (
                  <div>
                    <span className="text-white/70">Transaction Hash:</span>
                    <div
                      className="flex gap-1 cursor-pointer"
                      onClick={() => {
                        window.open(
                          `https://sepolia.etherscan.io/tx/${transaction.hash}`
                        );
                      }}
                    >
                      <div className="font-mono text-s  rounded px-2 py-1 mt-1 overflow-auto hover:underline custom-scrollbar">
                        {`${transaction.hash.slice(
                          0,
                          8
                        )}...${transaction.hash.slice(-8)}`}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20 mt-1"
                        title="View in explorer"
                      >
                        <ExternalLink size={13} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
