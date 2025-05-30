import {
  Copy,
  ExternalLink,
  Send,
  ArrowDownToLine,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { shortenAddress, formatBalance } from "../utils/starknetwallet";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function WalletCard() {
  const {
    selectedNetwork,
    ethAddress,
    strkAddress,
    ethBalance,
    ethBalanceInISD,
    strkBalance,
    getBalance,
  } = useWallet();

  const address = selectedNetwork === "ethereum" ? ethAddress : strkAddress;
  const balance = selectedNetwork === "ethereum" ? ethBalance : strkBalance;
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getBalance(selectedNetwork);
  }, [selectedNetwork, getBalance]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>{showQR ?(
  <div className="relative inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-effect rounded-2xl p-6 text-white w-[90%] max-w-sm"
    >
      <h2 className="text-lg font-semibold mb-4 text-center">
        Receive {selectedNetwork === "ethereum" ? "ETH" : "STRK"}
      </h2>

      <div className="bg-white py-4 flex justify-center rounded-xl">
        <QRCode
          value={address || ""}
          size={182}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q" 
        />
      </div>

      <div className="mt-4 text-center text-xs text-white/70 break-all">
        {address}
        <motion.button
            onClick={copyAddress}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="glass-effect m-3 rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            title="Copy address"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-success"
              >
                ✓
              </motion.div>
            ) : (
              <Copy size={14} />
            )}
          </motion.button>
      </div>
      
      <button
        onClick={() => setShowQR(false)}
        className={`mt-6 w-full rounded-md ${
        selectedNetwork === "ethereum" ? "eth-gradient" : "strk-gradient"
      } py-2 text-sm font-medium text-white transition-colors hover:bg-white/30`}
      >
        Close
      </button>
    </motion.div>
  </div>
):
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/50 ${
        selectedNetwork === "ethereum" ? "eth-gradient" : "strk-gradient"
      } hover-scale`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div className="relative p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-white/90">
            {selectedNetwork === "ethereum"
              ? "Ethereum Wallet"
              : "Starknet Wallet"}
          </span>
          <div className="flex items-center gap-2">
             
            <motion.div
              className="h-8 w-8 rounded-full bg-white/20 p-1.5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedNetwork === "ethereum" ? (
                <svg viewBox="0 0 784.37 1277.39" className="h-full w-full">
                  <path
                    fill="currentColor"
                    d="M392.07 0l-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"
                  />
                  <path
                    fill="currentColor"
                    d="M392.07 0L0 650.54l392.07 231.75V472.33z"
                  />
                  <path
                    fill="currentColor"
                    d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z"
                  />
                  <path
                    fill="currentColor"
                    d="M392.07 1277.38V956.52L0 724.89z"
                  />
                </svg>
              ) : (
               <svg viewBox="0 0 170 170" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
  
  <circle cx="85" cy="85" r="85" fill="#0C0C4F" />
  <path d="M44.1542 60.3876L46.1043 54.3628C46.5007 53.1374 47.4678 52.1839 48.6977 51.8079L54.752 49.9461C55.59 49.6901 55.5968 48.5078 54.7656 48.2383L48.7385 46.2881C47.5154 45.8918 46.5618 44.9246 46.1836 43.6947L44.324 37.6405C44.0681 36.8047 42.8858 36.7956 42.6162 37.6291L40.6661 43.654C40.2697 44.877 39.3026 45.8306 38.0727 46.2089L32.0184 48.0684C31.1804 48.3266 31.1713 49.5067 32.0048 49.7762L38.0319 51.7263C39.255 52.1227 40.2086 53.0921 40.5868 54.322L42.4464 60.374C42.7023 61.212 43.8846 61.2211 44.1542 60.3876Z" fill="#FAFAFA"/>
  <path d="M139.848 56.881C137.352 54.09 133.457 52.5186 129.67 51.8742C125.853 51.2553 121.85 51.3127 118.082 51.9822C110.457 53.272 103.53 56.4292 97.4881 60.3241C94.3506 62.2356 91.675 64.4474 88.903 66.7C87.5674 67.8392 86.3497 69.0524 85.0815 70.2482L81.6163 73.696C77.851 77.6317 74.1398 81.2165 70.549 84.1878C66.9437 87.1454 63.573 89.3917 60.2512 90.9604C56.9315 92.5372 53.3794 93.4645 48.7495 93.6129C44.1603 93.7748 38.7307 92.9465 32.9229 91.5794C27.0839 90.2183 20.9523 88.2782 14.1004 86.6088C16.4912 93.2414 20.0914 99.1027 24.7137 104.461C29.3902 109.726 35.2297 114.524 42.7314 117.68C50.1247 120.906 59.4157 122.064 68.1031 120.317C76.8135 118.64 84.4573 114.61 90.6359 109.948C96.8304 105.239 101.842 99.8748 106.067 94.298C107.233 92.7572 107.85 91.8949 108.694 90.6906L111.027 87.2351C112.648 85.0977 114.124 82.6641 115.728 80.5464C118.874 76.1112 121.976 71.6811 125.58 67.5997C127.394 65.5296 129.307 63.5495 131.565 61.6466C132.691 60.7178 133.908 59.8088 135.256 58.99C136.624 58.1068 138.069 57.4155 139.848 56.881Z" fill="#EC796B"/>
  <circle cx="119" cy="113" r="9" fill="#EC796B"/>
</svg>

              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mb-2 text-3xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {formatBalance(balance)}{" "}
          {selectedNetwork === "ethereum" ? "ETH" : "STRK"}
        </motion.div>

        <motion.div
          className="mb-6 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ≈ ${ethBalanceInISD} USD
        </motion.div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <motion.button
            onClick={() => navigate("/dashboard/send")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Send size={16} className="mb-1 mx-auto text-red" />
            Send
          </motion.button>
          <motion.button
            onClick={() => setShowQR(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-white/10 py-2 text-center text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowDownToLine size={16} className="mb-1 mx-auto" />
            Receive
          </motion.button>
        </div>
              
        <div className="flex items-center gap-2">
          <motion.div
            className="glass-effect rounded-xl px-3 py-2 text-sm"
            whileHover={{ scale: 1.02 }}
          >
            {shortenAddress(address)}
          </motion.div>
          <motion.button
            onClick={copyAddress}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            title="Copy address"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-success"
              >
                ✓
              </motion.div>
            ) : (
              <Copy size={16} />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
            title="View in explorer"
          >
            <ExternalLink size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>}
    </>
  );

}
