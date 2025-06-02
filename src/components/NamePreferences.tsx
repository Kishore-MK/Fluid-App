import { useState, useEffect } from "react";
import { X, Save, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../context/WalletContext";
import { useNameService } from "../context/NameserviceContext";

 


export default function NamePreferences({ onClose }:any) {
  const { ethAddress, strkAddress } = useWallet();
  const { set_default_chain, error, clearError } = useNameService();
  
  const [domainName, setDomainName] = useState("");
  const [ethereumAddr, setEthereumAddr] = useState("");
  const [starknetAddr, setStarknetAddr] = useState("");
  const [defaultChain, setDefaultChain] = useState<'Ethereum'|'Starknet'>("Starknet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill addresses when component mounts
  useEffect(() => {
    setEthereumAddr(ethAddress || "");
    setStarknetAddr(strkAddress || "");
  }, [ethAddress, strkAddress]);
   useEffect(() => {
    const storedDomainName = localStorage.getItem("selectedDomainName");
    if (storedDomainName) {
      setDomainName(storedDomainName); 
    }
    const storedDefaultChain = localStorage.getItem("defaultChain");
    if (storedDefaultChain === "Ethereum" || storedDefaultChain === "Starknet") {
    setDefaultChain(storedDefaultChain);
  }
  }, []);
  const handleSubmit = async () => {    
    if (!domainName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    clearError();

    try {
      const result = await set_default_chain(domainName, defaultChain);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to set addresses:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = domainName.trim() && ethereumAddr.trim() && starknetAddr.trim();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background-light border border-neutral-800 rounded-xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Name Preferences</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-green-400"
            >
              <CheckCircle size={16} />
              <span className="text-sm">Addresses updated successfully!</span>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400"
            >
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Domain Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Domain Name
              </label>
              <input
                type="text"
                value={domainName}
                
                placeholder="myname.stark"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {/* Default Chain */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Default Chain
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultChain('Ethereum')}
                  className={`p-3 rounded-lg border transition-all ${
                    defaultChain === 'Ethereum'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                  disabled={isSubmitting}
                >
                  Ethereum
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultChain('Starknet')}
                  className={`p-3 rounded-lg border transition-all ${
                    defaultChain === 'Starknet'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                  disabled={isSubmitting}
                >
                  Starknet
                </button>
              </div>
            </div>

            {/* Ethereum Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Ethereum Address
              </label>
              <input
                type="text"
                value={ethereumAddr}
                onChange={(e) => setEthereumAddr(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                disabled={isSubmitting}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Prefilled from your wallet
              </p>
            </div>

            {/* Starknet Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Starknet Address
              </label>
              <input
                type="text"
                value={starknetAddr}
                onChange={(e) => setStarknetAddr(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
                disabled={isSubmitting}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Prefilled from your wallet
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}