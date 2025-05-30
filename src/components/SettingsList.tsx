import { Shield, Code, Link, Lock, Settings2Icon, User } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import { deployStarknetAccount, isAccountDeployed } from "../utils/starknetwallet";

// Mock transaction data - in a real app, this would come from the blockchain
const GeneralSettings = [
  {
    id: "1",
    type: "Preferences",
    icon: <Settings2Icon />,
  },
  {
    id: "2",
    type: "Security & Recovery",
    icon: <Shield />,
  },
  {
    id: "3",
    type: "Privacy",
    icon: <Lock />,
  },
  {
    id: "4",
    type: "Authorized dapps",
    icon: <Link />,
  },
  {
    id: "5",
    type: "Advanced settings",
    icon: <Code />,
  },
];

export default function SettingsList() {
  const { selectedNetwork, ethAddress, strkAddress } = useWallet();
  const [address, setAddress] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const [isStrkDeployed, setIsStrkDeployed] = useState(false);

  useEffect(() => {
    const checkDeployment = async () => {
      if (strkAddress) {
        try {
          const deployed = await isAccountDeployed(strkAddress);
          setIsStrkDeployed(deployed);
        } catch (err) {
          console.error("Error checking deployment:", err);
          setIsStrkDeployed(false);
        }
      }
    };
    if (selectedNetwork === "ethereum") {
      setAddress(ethAddress || "");
    } else {
      setAddress(strkAddress || "");
      checkDeployment();
    }
  }, [selectedNetwork, ethAddress, strkAddress]);
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <h2 className="text-md font-semibold text-white">Account settings</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between rounded-lg border border-neutral-800 bg-background-light p-3 cursor-pointer"
          onClick={() => setShowProfile(true)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <User />
            </div>
            <div>
              {selectedNetwork == "ethereum" ? "Ethereum" : "Starknet"}
              <div className="font-medium text-white">
                {address ? `${address.slice(0, 7)}...${address.slice(-6)}` : ""}
              </div>
            </div>
          </div>
        </motion.div>

        {!isStrkDeployed && selectedNetwork == "starknet" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-background-light p-3 cursor-pointer"
            onClick={() => deployStarknetAccount()}
          >
            <div className="flex items-center gap-3"> 
              <div>
                <div className="font-medium text-white">Deploy Account</div>
              </div>
            </div>
          </motion.div>
        )}

        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </motion.div>

      <h2 className="text-md font-semibold text-white">
        General Account settings
      </h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        {GeneralSettings.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-background-light p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                {tx.icon}
              </div>
              <div>
                <div className="font-medium text-white">{tx.type}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
