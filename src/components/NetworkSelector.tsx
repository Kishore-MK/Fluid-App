import { AlertTriangle, CheckCircle, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNameService } from "../context/NameserviceContext";
import { formatBalance } from "../utils/starknetwallet";

export default function NetworkSelector() {
  const { selectedNetwork } = useWallet();
  const { strkBalance } = useWallet(); 
  const {
    getDomainInfo,
    registerDomain,
    isAvailable,
    isLoading: nameServiceLoading,
    error: nameServiceError,
    isReady: nameServiceReady,
  } = useNameService();
   

  const [domainName, setDomainName] = useState("");
  const [isDomainRegistered, setIsDomainRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationYears, setRegistrationYears] = useState(1);
  useEffect(() => {
    const storedDomainName = localStorage.getItem("selectedDomainName");
    if (storedDomainName) {
      setDomainName(storedDomainName);
      checkDomainRegistration(storedDomainName);
    }
  }, []);

  const checkDomainRegistration = async (name: string) => {
    if (!name || !nameServiceReady) return;

    try {
      const available = await isAvailable(name);
      console.log(available);
      
      setIsDomainRegistered(!available);
    } catch (error) {
      console.error("Error checking domain registration:", error);
      setIsDomainRegistered(false);
    }
  };
  const handleDomainRegistration = async () => {
    if (!domainName || !nameServiceReady) return;

    try {
      const success = await registerDomain(domainName, registrationYears);
      if (success) {
        setIsDomainRegistered(true);
        setShowRegistrationModal(false);
        // Refresh domain info
        checkDomainRegistration(domainName);
      }
    } catch (error) {
      console.error("Domain registration failed:", error);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showRegistrationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRegistrationModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-effect rounded-2xl p-6 text-white w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Register Domain</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-2">Domain Name:</p>
                  <p className="text-lg font-medium">{domainName}</p>
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-2">
                    Registration Duration (years):
                  </label>
                  <select
                    value={registrationYears}
                    onChange={(e) =>
                      setRegistrationYears(Number(e.target.value))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                  >
                    {[1, 2, 3, 4, 5].map((year) => (
                      <option key={year} value={year} className="bg-gray-800">
                        {year} year{year > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-white/70">
                  <p>Cost: {registrationYears * 5} STRK</p>
                  <p>Your balance: {formatBalance(strkBalance)} STRK</p>
                </div>

                {nameServiceError && (
                  <p className="text-red-400 text-sm">{nameServiceError}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDomainRegistration}
                  disabled={
                    nameServiceLoading ||
                    parseFloat(strkBalance) < registrationYears * 10
                  }
                  className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {nameServiceLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className=" flex items-center justify-between">
        <button
          className={`flex items-center gap-2 rounded-lg py-2 px-3 font-medium transition-all ${
            selectedNetwork === "ethereum"
              ? "text-accent-eth"
              : "text-accent-strk"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              selectedNetwork === "ethereum"
                ? "bg-accent-eth/10"
                : "bg-accent-strk/10"
            }`}
          >
            <Wallet
              size={16}
              className={
                selectedNetwork === "ethereum"
                  ? "text-accent-eth"
                  : "text-accent-strk"
              }
            />
          </div>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-md font-medium lowercase tracking-wider text-white/90">
            <div className="flex items-center gap-2">
              <span>{domainName}</span>
              {isDomainRegistered ? (
                <CheckCircle size={14} className="text-green-400" />
              ) : (
                <motion.button
                  onClick={() => setShowRegistrationModal(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                  title="Domain not registered - Click to register"
                >
                  <AlertTriangle size={14} />
                </motion.button>
              )}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
