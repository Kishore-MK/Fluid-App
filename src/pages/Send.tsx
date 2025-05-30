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
import { Account,  CallData, Provider as StarknetProvider, uint256 } from "starknet";

const STARKNET_STRK_CONTRACT =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const STARKNET_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";
const starknetProvider = new StarknetProvider({ nodeUrl: STARKNET_RPC });

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
  const {
    selectedNetwork,
    ethAddress,
    strkAddress,
    estimateEthGas,
    estimateStrkGas,
  } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gasData, setGasData] = useState<any>(null);
  const [isLoadingGas, setIsLoadingGas] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const address = selectedNetwork === "ethereum" ? ethAddress : strkAddress;

  // Manual gas calculation function
  const calculateGasFees = async () => {
    if (!amount || !recipient || isSending) {
      return;
    }

    setIsLoadingGas(true);

    try {
      let gasEstimate;

      if (selectedNetwork === "ethereum") {
        if(!ethers.isAddress(recipient)){
          return
        }
        gasEstimate = await estimateEthGas(recipient, amount);
      } else if (selectedNetwork === "starknet") {
        console.log("Estimating strk gas");

        gasEstimate = await estimateStrkGas(recipient, amount);
      }

      setGasData(gasEstimate);
    } catch (error) {
      console.error("Gas calculation failed:", error);
      setGasData(null);
    } finally {
      setIsLoadingGas(false);
    }
  };

  // Clear gas data when inputs change
  useEffect(() => {
    console.log(selectedNetwork);

    setGasData(null);
  }, [amount, recipient, selectedNetwork]);

  const handleEthereumSend = async () => {
    const walletData = localStorage.getItem("walletData");
    const parsed = JSON.parse(walletData || "");
    const privateKey = `0x${parsed.ethPrivateKey}`;

    const provider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/ac6e626c10c0408993e1f9dc777bbd18"
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amount),
      gasPrice: gasData?.gasPrice
        ? ethers.parseUnits(gasData.gasPrice.toString(), "gwei")
        : undefined,
      gasLimit: gasData?.gasLimit
        ? ethers.toBigInt(gasData.gasLimit)
        : undefined,
    });

    console.log("Ethereum transaction sent:", tx);

    setTransaction({
      hash: tx.hash,
      status: "pending",
      network: selectedNetwork,
      amount,
      to: recipient,
      gasUsed: "",
      gasFee: gasData?.totalFee || "",
    });

    // Wait for confirmation
    const receipt = await tx.wait();
    if (receipt?.status === 1) {
      setTransaction((prev) => ({
        ...prev!,
        status: "confirmed",
        gasUsed: receipt.gasUsed.toString(),
      }));
    } else {
      setTransaction((prev) => ({
        ...prev!,
        status: "failed",
        error: "Transaction reverted",
      }));
    }
  };

  const handleStarknetSend = async () => {
    const walletData = localStorage.getItem("walletData");
    const parsed = JSON.parse(walletData || "");
    const strkPrivateKey = parsed.strkPrivateKey;

    const account = new Account(starknetProvider, strkAddress!, strkPrivateKey);
    const rawAmount = BigInt(parseFloat(amount) * 1e18);
    const value =  uint256.bnToUint256(rawAmount);
   

    const tx = {
      contractAddress: STARKNET_STRK_CONTRACT,
      entrypoint: "transfer",
      calldata: CallData.compile({
        recipient: recipient.toLowerCase(),
        amount: value,
      }),
    };

    console.log("Sending Starknet transaction:", tx);

    const response = await account.execute(tx, {
      maxFee: gasData?.suggestedMaxFee
        ? ethers.parseUnits(gasData.suggestedMaxFee, 18)
        : undefined,
    });

    console.log("Starknet transaction sent:", response);

    setTransaction({
      hash: response.transaction_hash,
      status: "pending",
      network: selectedNetwork,
      amount,
      to: recipient,
      gasUsed: "",
      gasFee: gasData?.totalFee || "",
    });

    // Wait for confirmation
    try {
      await starknetProvider.waitForTransaction(response.transaction_hash);
      setTransaction((prev) => ({
        ...prev!,
        status: "confirmed",
      }));
    } catch (error) {
      console.error("Starknet transaction failed:", error);
      setTransaction((prev) => ({
        ...prev!,
        status: "failed",
        error: "Transaction failed or reverted",
      }));
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount || !gasData) return;

    setIsSending(true);

    try {
      if (selectedNetwork === "ethereum") {
        await handleEthereumSend();
      } else {
        await handleStarknetSend();
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

  const getExplorerUrl = (hash: string) => {
    if (selectedNetwork === "ethereum") {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      return `https://sepolia.starkscan.co/tx/${hash}`;
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
              placeholder={`Recipient ${
                selectedNetwork === "ethereum" ? "Ethereum" : "Starknet"
              } address`}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
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
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
            />
          </div>

          {/* Calculate Gas Button */}
          {amount && recipient && !gasData && !isLoadingGas && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={calculateGasFees}
              disabled={isSending}
              className="w-full glass-effect rounded-lg px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            >
              <div className="flex items-center justify-center gap-2">
                <Fuel size={16} className="text-orange-400" />
                <span>Calculate Gas Fees</span>
              </div>
            </motion.button>
          )}

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
                        {selectedNetwork === "ethereum"
                          ? `${gasData.gasPrice} Gwei`
                          : gasData.gasPrice}
                      </span>
                    </div>
                    {gasData.gasLimit&&(<div className="flex justify-between">
                      <span className="text-white/70">Gas Limit:</span>
                      <span className="text-white">
                        {gasData.gasLimit?.toLocaleString?.()||""}
                      </span>
                    </div>)}
                    {selectedNetwork === "starknet" &&
                      gasData.suggestedMaxFee && (
                        <div className="flex justify-between">
                          <span className="text-white/70">
                            Suggested Max Fee:
                          </span>
                          <span className="text-white">
                            {typeof gasData.suggestedMaxFee === "string"
                              ? parseFloat(gasData.suggestedMaxFee).toFixed(6)
                              : gasData.suggestedMaxFee.toFixed(6)}{" "}
                            STRK
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-white/90 font-medium">
                        Total Fee:
                      </span>
                      <span className="text-white font-medium">
                        {parseFloat(gasData.totalFee).toFixed(6)}{" "}
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

              <div className="space-y-3 text-sm">
                {transaction.hash && (
                  <div>
                    <span className="text-white/70">Transaction Hash:</span>
                    <div
                      className="flex gap-1 cursor-pointer"
                      onClick={() => {
                        window.open(getExplorerUrl(transaction.hash!));
                      }}
                    >
                      <div className="font-mono text-s rounded px-2 py-1 mt-1 overflow-auto hover:underline custom-scrollbar">
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

                {transaction.error && (
                  <div className="text-red-400">
                    <span className="text-white/70">Error:</span>{" "}
                    {transaction.error}
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
