import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext"; 
import { useBridge } from "../context/BridgeContext"; // Add this import
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Fuel,
  ExternalLink,
  User,
  Hash,
  ArrowUpDown, // Add this for bridge indicator
} from "lucide-react";
import { ethers } from "ethers";
import { Account, CallData, Provider as StarknetProvider, uint256 } from "starknet";
import { useNameService } from "../context/NameserviceContext";

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
  isBridge?: boolean; // Add this to track bridge transactions
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
  
  // Add bridge context
  const {
    lockETHTokens,
    lockStrkTokens,
    isLockingETH,
    isLockingSTRK,
  } = useBridge();
  
  const { resolve, getDomainInfo } = useNameService();

  const [recipientInput, setRecipientInput] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [isDomainName, setIsDomainName] = useState(false);
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gasData, setGasData] = useState<any>(null);
  const [isLoadingGas, setIsLoadingGas] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const address = selectedNetwork === "ethereum" ? ethAddress : strkAddress;

  // Helper function to determine if we should use bridge
  const shouldUseBridge = () => {
    if (!resolvedAddress || !address) return false;
    
    // Normalize addresses for comparison
    const normalizedResolved = resolvedAddress.toLowerCase();
    const normalizedCurrent = address.toLowerCase();
    
    return normalizedResolved !== normalizedCurrent;
  };

  // Helper function to check if resolved address is cross-chain
  const isCrossChainTransfer = () => {
    if (!resolvedAddress) return false;
    
    const isEthAddress = ethers.isAddress(resolvedAddress);
    const isStarknetAddress = resolvedAddress.startsWith("0x") && resolvedAddress.length > 20;
    
    if (selectedNetwork === "ethereum" && isStarknetAddress) return true;
    if (selectedNetwork === "starknet" && isEthAddress) return true;
    
    return false;
  };

  // Check if input is a domain name or address
  const checkRecipientInput = async (input: string) => {
    if (!input.trim()) {
      setResolvedAddress("");
      setIsDomainName(false);
      setDomainError("");
      return;
    }

    // Check if it's already an address format
    const isEthAddress = ethers.isAddress(input);
    const isStarknetAddress = input.startsWith("0x") && input.length > 20;

    if (isEthAddress || isStarknetAddress) {
      setResolvedAddress(input);
      setIsDomainName(false);
      setDomainError("");
      return;
    }

    // Assume it's a domain name if it doesn't look like an address
    setIsDomainName(true);
    setIsResolvingDomain(true);
    setDomainError("");

    try {
      // First get domain info to check if it exists
      const resolved  = await resolve(input);
      if (!resolved) {
        setDomainError("Domain not found");
        setResolvedAddress("");
        return;
      }

      setResolvedAddress(resolved);
      setDomainError("");
    } catch (error) {
      console.error("Error resolving domain:", error);
      setDomainError("Failed to resolve domain");
      setResolvedAddress("");
    } finally {
      setIsResolvingDomain(false);
    }
  };

  // Handle recipient input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkRecipientInput(recipientInput);
    }, 500); // Debounce the resolution

    return () => clearTimeout(timeoutId);
  }, [recipientInput, selectedNetwork]);

  // Manual gas calculation function
  const calculateGasFees = async () => {
    if (!amount || !resolvedAddress || isSending) {
      return;
    }

    setIsLoadingGas(true);

    try {
      let gasEstimate;
 
      if (shouldUseBridge()) {
        if (ethers.isAddress(resolvedAddress)) {
         gasEstimate = await estimateEthGas(resolvedAddress, amount);
      } else{
        console.log("Estimating strk gas");
        gasEstimate = await estimateStrkGas(resolvedAddress, amount);
      }

      setGasData(gasEstimate);
        setIsLoadingGas(false);
        return;
      }

      if (selectedNetwork === "ethereum") {
        if (!ethers.isAddress(resolvedAddress)) {
          return;
        }
        gasEstimate = await estimateEthGas(resolvedAddress, amount);
      } else if (selectedNetwork === "starknet") {
        console.log("Estimating strk gas");
        gasEstimate = await estimateStrkGas(resolvedAddress, amount);
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
  }, [amount, resolvedAddress, selectedNetwork]);

  const handleEthereumSend = async () => {
    const walletData = localStorage.getItem("walletData");
    const parsed = JSON.parse(walletData || "");
    const privateKey = `0x${parsed.ethPrivateKey}`;

    const provider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/ac6e626c10c0408993e1f9dc777bbd18"
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
      to: resolvedAddress,
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
      to: isDomainName ? recipientInput : resolvedAddress,
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
    if (!walletData) {
      throw new Error("Wallet data not found");
    }
    const parsed = JSON.parse(walletData || "");
    const strkPrivateKey = parsed.strkPrivateKey;

    const account = new Account(starknetProvider, strkAddress!, strkPrivateKey);
    const rawAmount = BigInt(parseFloat(amount) * 1e18);
    const value = uint256.bnToUint256(rawAmount);

    const tx = {
      contractAddress: STARKNET_STRK_CONTRACT,
      entrypoint: "transfer",
      calldata: CallData.compile({
        recipient: resolvedAddress.toLowerCase(),
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
      to: isDomainName ? recipientInput : resolvedAddress,
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

  // New bridge send handlers
  const handleBridgeSend = async () => {
    try {
      let txHash: string | null = null;
      
      if (selectedNetwork === "ethereum") {
        // Bridge ETH to Starknet
        txHash = await lockETHTokens(amount, resolvedAddress);
      } else {
        // Bridge STRK to Ethereum
        txHash = await lockStrkTokens(amount, resolvedAddress);
      }

      if (txHash) {
        setTransaction({
          hash: txHash,
          status: "pending",
          network: selectedNetwork,
          amount,
          to: isDomainName ? recipientInput : resolvedAddress,
          gasUsed: "",
          gasFee: gasData?.totalFee || "",
          isBridge: true,
        });

        // For bridge transactions, we'll mark as confirmed after a short delay
        // In reality, you'd want to listen for bridge completion events
        setTimeout(() => {
          setTransaction((prev) => ({
            ...prev!,
            status: "confirmed",
          }));
        }, 30000); // 30 seconds for demo purposes
      }
    } catch (error) {
      console.error("Bridge transaction failed:", error);
      setTransaction({
        status: "failed",
        error: error instanceof Error ? error.message : "Bridge transaction failed",
        isBridge: true,
      });
    }
  };

  const handleSend = async () => {
    if (!resolvedAddress || !amount || !gasData) return;

    setIsSending(true);

    try {
      if (shouldUseBridge() || isCrossChainTransfer()) {
        // Use bridge for cross-address or cross-chain transfers
        await handleBridgeSend();
      } else {
        // Use direct transaction for same-address transfers
        if (selectedNetwork === "ethereum") {
          await handleEthereumSend();
        } else {
          await handleStarknetSend();
        }
      }

      // Reset inputs
      setRecipientInput("");
      setResolvedAddress("");
      setAmount("");
      setGasData(null);
      setIsDomainName(false);
      setDomainError("");
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

  // Check if we're currently in a loading state that should disable the button
  const isInLoadingState = isSending || isLockingETH || isLockingSTRK;

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
            <div className="flex items-center gap-2">
              {(shouldUseBridge() || isCrossChainTransfer()) && (
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <ArrowUpDown size={12} />
                  <span>Bridge</span>
                </div>
              )}
              <span className="text-xs uppercase tracking-wide">
                {selectedNetwork === "ethereum" ? "Send ETH" : "Send STRK"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/70">To:</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder={`.fluid name or address`}
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
              />
              
              {/* Show resolving status */}
              {isResolvingDomain && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock className="animate-spin" size={12} />
                  <span>Resolving domain...</span>
                </div>
              )}

              {/* Show domain error */}
              {domainError && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <XCircle size={12} />
                  <span>{domainError}</span>
                </div>
              )}

              {/* Show resolved address */}
              {resolvedAddress && !isResolvingDomain && (
                <div className="glass-effect rounded-md px-3 py-2 space-y-2">
                  {isDomainName && (
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <User size={12} />
                      <span>Domain: {recipientInput}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Hash size={12} className="text-white/50" />
                    <span className="text-white/80">Sending to:</span>
                    {(shouldUseBridge() || isCrossChainTransfer()) && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <ArrowUpDown size={10} />
                        <span className="text-xs">via Bridge</span>
                      </div>
                    )}
                  </div>
                  <div className="font-mono text-xs text-white break-all">
                    {resolvedAddress}
                  </div>
                </div>
              )}
            </div>
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
          {amount && resolvedAddress && !gasData && !isLoadingGas && !domainError && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={calculateGasFees}
              disabled={isInLoadingState}
              className="w-full glass-effect rounded-lg px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            >
              <div className="flex items-center justify-center gap-2">
                <Fuel size={16} className="text-orange-400" />
                <span>
                  {shouldUseBridge() || isCrossChainTransfer() 
                    ? "Calculate Bridge Fees" 
                    : "Calculate Gas Fees"
                  }
                </span>
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
                    {gasData?.isBridge ? "Bridge Fees" : "Gas Fees"}
                  </span>
                </div>
                {isLoadingGas ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  </div>
                ) : gasData ? (
                  <div className="space-y-2 text-sm">
                    {!gasData.isBridge ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-white/70">Gas Price:</span>
                          <span className="text-white">
                            {selectedNetwork === "ethereum"
                              ? `${gasData.gasPrice} Gwei`
                              : gasData.gasPrice}
                          </span>
                        </div>
                        {gasData.gasLimit && (
                          <div className="flex justify-between">
                            <span className="text-white/70">Gas Limit:</span>
                            <span className="text-white">
                              {gasData.gasLimit?.toLocaleString?.() || ""}
                            </span>
                          </div>
                        )}
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
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-white/70">Bridge Fee:</span>
                        <span className="text-white">~0.001 ETH</span>
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
            disabled={
              isInLoadingState || 
              !gasData || 
              !resolvedAddress || 
              !amount || 
              !!domainError ||
              isResolvingDomain
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl eth-gradient py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {shouldUseBridge() || isCrossChainTransfer() ? (
              <ArrowUpDown size={16} />
            ) : (
              <Send size={16} />
            )}
            {isInLoadingState ? "Processing..." : 
             (shouldUseBridge() || isCrossChainTransfer()) ? "Bridge" : "Send"}
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
                  {transaction.status === "pending" && 
                    (transaction.isBridge ? "Bridge Transaction Pending" : "Transaction Pending")}
                  {transaction.status === "confirmed" &&
                    (transaction.isBridge ? "Bridge Transaction Confirmed" : "Transaction Confirmed")}
                  {transaction.status === "failed" && 
                    (transaction.isBridge ? "Bridge Transaction Failed" : "Transaction Failed")}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {transaction.to && (
                  <div>
                    <span className="text-white/70">
                      {transaction.isBridge ? "Bridged to:" : "Sent to:"}
                    </span>
                    <div className="font-mono text-xs rounded px-2 py-1 mt-1 bg-white/5">
                      {transaction.to}
                    </div>
                  </div>
                )}

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