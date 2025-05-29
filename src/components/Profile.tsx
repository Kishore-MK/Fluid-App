import { motion } from "framer-motion";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import { Copy, Eye, EyeOff, KeyRound, ShieldCheck, X } from "lucide-react";

export default function Profile({ onClose }: { onClose: () => void }) {
  const { mnemonic, selectedNetwork } = useWallet();

  const [privateKey, setPrivateKey] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const mnemonicWords = mnemonic ? mnemonic.trim().split(/\s+/) : [];
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const wallet = localStorage.getItem("walletData");
    const data = JSON.parse(wallet || "");
    if (selectedNetwork == "ethereum") {
      setPrivateKey(`0x${data.ethPrivateKey}`);
    } else {
      setPrivateKey(data.strkPrivateKey);
    }
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-6 rounded-xl bg-background-light border border-neutral-800 text-white shadow-lg relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Profile Details</h2>

        {/* Mnemonic */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-white" />
            <p className="text-sm font-medium">Mnemonic Phrase</p>
            <motion.button
              onClick={copyAddress}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
              title="Copy Seed Phrase"
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
            <button
              onClick={() => setShowMnemonic(!showMnemonic)}
              className="ml-auto text-neutral-400 hover:text-white"
            >
              {showMnemonic ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {mnemonicWords.map((word, idx) => (
              <div
                key={idx}
                className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-white flex items-center gap-1"
              >
                {showMnemonic ? (
                  <div>
                    <span className="text-neutral-400">{idx + 1}.</span>
                    <span>{word}</span>
                  </div>
                ) : (
                  <div className="col-span-3 italic text-center text-neutral-400">
                    ••••••••
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Private Key */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="text-white" />
            <p className="text-sm font-medium">Private Key</p>
            <motion.button
              onClick={copyAddress}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="glass-effect rounded-full p-2 text-white/90 transition-colors hover:bg-white/20"
              title="Copy Private Key"
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
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="ml-auto text-neutral-400 hover:text-white"
            >
              {showPrivateKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-white flex items-center gap-1 overflow-auto custom-scrollbar">
            {showPrivateKey ? (
              privateKey || "N/A"
            ) : (
              <span className="italic">••••••••••••••••••••</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
