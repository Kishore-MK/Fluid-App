import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { lockStrkTokens } from "../utils/strkbridge";
import { lockETHTokens } from "../utils/ethbridge";
import { parseEther } from "ethers";
import { useWallet } from "../context/WalletContext";
import { useBridge } from "../context/BridgeContext";

interface BridgeTx {
  hash?: string;
  status: "pending" | "confirmed" | "failed";
  fromNetwork: string;
  toNetwork: string;
  amount: string;
  error?: string;
}

export default function BridgePage() {
  const navigate = useNavigate();
  const {ethAddress,strkAddress}=useWallet();
  const {lockETHTokens,lockStrkTokens}=useBridge()
  const [fromNetwork, setFromNetwork] = useState("ethereum");
  const [toNetwork, setToNetwork] = useState("starknet");
  const [amount, setAmount] = useState("");
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeTx, setBridgeTx] = useState<BridgeTx | null>(null);

  const handleSwitch = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  const handleBridge = async () => {
    if (!amount) return;

    setIsBridging(true);

    try {
      if (fromNetwork == "starknet") {
        const rawAmount = BigInt(parseFloat(amount) * 1e18);
        console.log(rawAmount);
        if(ethAddress){
        const TxHash = await lockStrkTokens(rawAmount.toString(),ethAddress);
                setBridgeTx({
                  hash: TxHash||"Loading",
                  status: "pending",
                  fromNetwork,
                  toNetwork,
                  amount,
                });
        }
        
      } else { 
        if(strkAddress){
        const TxHash = await lockETHTokens(amount,strkAddress);
        setBridgeTx({
          hash: TxHash || "Loading",
          status: "pending",
          fromNetwork,
          toNetwork,
          amount,
        });
      }
    }
      // Simulate network delay
      setTimeout(() => {
        setBridgeTx((prev) => ({ ...prev!, status: "confirmed" }));
      }, 4000);

      setAmount("");
    } catch (err: any) {
      setBridgeTx({
        status: "failed",
        fromNetwork,
        toNetwork,
        amount,
        error: err?.message || "Bridge failed",
      });
    } finally {
      setIsBridging(false);
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md mx-auto mt-10 p-6 rounded-2xl border border-neutral-800/50 bg-white/5 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="glass-effect flex items-center gap-1 rounded-full px-3 py-1 text-sm text-white/80 hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="text-xs uppercase">Bridge</span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <label className="text-white/70">From</label>
              <div
                className={`glass-effect rounded px-3 py-2 ${
                  fromNetwork == "ethereum" ? "eth-gradient" : "strk-gradient"
                }`}
              >
                {fromNetwork}
              </div>
            </div>
            <div>
              <label className="text-white/70">To</label>
              <div
                className={`glass-effect rounded px-3 py-2 ${
                  toNetwork == "ethereum" ? "eth-gradient" : "strk-gradient"
                }`}
              >
                {toNetwork}
              </div>
            </div>
            <button
              onClick={handleSwitch}
              className="glass-effect rounded-full p-2 mt-6 hover:bg-white/10"
              title="Switch Networks"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Amount:</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-white/10 text-white rounded px-3 py-2 text-sm"
            />
          </div>

          <motion.button
            onClick={handleBridge}
            disabled={!amount || isBridging}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-medium text-white disabled:opacity-50"
          >
            {isBridging ? "Bridging..." : "Bridge"}
          </motion.button>
        </div>
      </motion.div>

      {/* Bridge status */}
      <AnimatePresence>
        {bridgeTx && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`relative max-w-md mx-auto p-6 rounded-2xl border ${
              bridgeTx.status === "confirmed"
                ? "border-green-400/30 bg-green-400/10"
                : bridgeTx.status === "failed"
                ? "border-red-400/30 bg-red-400/10"
                : "border-yellow-400/30 bg-yellow-400/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(bridgeTx.status)}
              <span className="font-medium">
                {bridgeTx.status === "pending" && "Bridge Pending"}
                {bridgeTx.status === "confirmed" && "Bridge Confirmed"}
                {bridgeTx.status === "failed" && "Bridge Failed"}
              </span>
            </div>

            <div className="text-sm">
              <p>
                Bridging {bridgeTx.amount} tokens from{" "}
                <b>{bridgeTx.fromNetwork}</b> to <b>{bridgeTx.toNetwork}</b>
              </p>
              {bridgeTx.hash && (
                <div>
                  <p
                    onClick={() => {
                      if (fromNetwork == "ethereum") {
                        window.open(
                          `https://sepolia.etherscan.io/tx/${bridgeTx.hash}`
                        );
                      }
                      window.open(
                        `https://sepolia.voyager.online/tx/${bridgeTx.hash}`
                      );
                    }}
                    className="mt-2 text-white/70 font-mono text-xs hover:underline cursor-pointer"
                  >
                    Tx Hash: {bridgeTx.hash.slice(0, 10)}...
                    {bridgeTx.hash.slice(-8)}
                  </p>
                  <div>
                    <ExternalLink size={12} className="mt-[2px]" />
                  </div>
                </div>
              )}
              {bridgeTx.error && (
                <p className="text-red-400 mt-2 text-xs">{bridgeTx.error}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
