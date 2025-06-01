"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import {
  Account,
  CallData,
  Contract,
  Provider as StarknetProvider,
  uint256,
} from "starknet";
import { useWallet } from "./WalletContext";
import { FluidABI } from "../abi/FluidABI";
import { erc20Abi, STRK_TOKEN_ADDRESS } from "../utils/strkbridge";

export interface DomainRecord {
  name: string;
  owner: string;
  registered_at: number;
  expires_at: number;
  default_chain: SupportedChain;
  starknet_address: string;
  ethereum_address: string;
}

export enum SupportedChain {
  Starknet = 0,
  Ethereum = 1,
}

const NAMESERVICE_CONTRACT_ADDRESS =
  "0x3effdfb035c4105a1e63b31eda041dddb106fd0a167b506ac4b5947677bc32f";
const STARKNET_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";
const CACHE_TTL = 30000; // 30 seconds

const starknetProvider = new StarknetProvider({ nodeUrl: STARKNET_RPC });

interface NameServiceContextType {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  registerDomain: (name: string, durationYears: number) => Promise<boolean>;
  isAvailable: (name: string) => Promise<boolean>;
  getDomainInfo: (name: string) => Promise<DomainRecord | null>;
  setAddresses: (
    name: string,
    starknetAddress: string,
    ethereumAddress: string
  ) => Promise<boolean>;
  clearError: () => void;
}

const NameServiceContext = createContext<NameServiceContextType | undefined>(
  undefined
);

// Cache for domain availability checks
interface CacheEntry {
  value: boolean;
  timestamp: number;
}

const availabilityCache = new Map<string, CacheEntry>();

export function NameServiceProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized account and contract creation
  const { account, contract, isReady } = useMemo(() => {
    if (!wallet.strkAddress || !wallet.isInitialized) {
      return { account: null, contract: null, isReady: false };
    }

    try {
      // Get private key from localStorage
      const walletData = localStorage.getItem("walletData");
      if (!walletData) {
        return { account: null, contract: null, isReady: false };
      }

      const parsed = JSON.parse(walletData);
      const strkPrivateKey = parsed.strkPrivateKey;

      if (!strkPrivateKey) {
        return { account: null, contract: null, isReady: false };
      }

      const account = new Account(
        starknetProvider,
        wallet.strkAddress,
        strkPrivateKey
      );
      const contract = new Contract(
        FluidABI,
        NAMESERVICE_CONTRACT_ADDRESS,
        account
      );
      return { account, contract, isReady: true };
    } catch (err) {
      console.error("Error creating account/contract:", err);
      return { account: null, contract: null, isReady: false };
    }
  }, [wallet.strkAddress, wallet.isInitialized]);

  // Helper function to handle errors
  const handleError = (err: any, operation: string): void => {
    console.error(`${operation} failed:`, err);
    const errorMessage = err?.message || `${operation} failed`;
    setError(errorMessage);
  };

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const registerDomain = useCallback(
    async (name: string, durationYears: number): Promise<boolean> => {
      if (!contract || !isReady) {
        setError("Wallet not ready or not connected to Starknet");
        return false;
      }

      if (!name.trim()) {
        setError("Domain name cannot be empty");
        return false;
      }

      if (durationYears < 1 || durationYears > 10) {
        setError("Duration must be between 1 and 10 years");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if domain is available first
        const available = await isAvailable(name);
        if (!available) {
          setError("Domain is not available");
          return false;
        }

        const tokenContract = new Contract(
          erc20Abi,
          STRK_TOKEN_ADDRESS,
          account
        );
        const strkAmount = BigInt(
          Math.floor(parseFloat((durationYears * 5).toString()) * 10 ** 18)
        );
        const strkAmountUint256 = uint256.bnToUint256(strkAmount);
        console.log(strkAmountUint256);

        console.log("Approving BridgeVault to spend tokens...", strkAmount);
        const tx = await tokenContract.approve(
          NAMESERVICE_CONTRACT_ADDRESS,
          strkAmountUint256
        );
        await starknetProvider.waitForTransaction(tx.transaction_hash);
        console.log("Approved.");

        const response = await contract.register_domain(name, durationYears);
        await starknetProvider.waitForTransaction(tx.transaction_hash);
        console.log("domain registered.");
        // Clear cache for this domain after registration
        availabilityCache.delete(name.toLowerCase());

        return !!response;
      } catch (err) {
        handleError(err, "Domain registration");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, isReady]
  );

  const setAddresses = useCallback(
    async (
      name: string,
      starknetAddress: string,
      ethereumAddress: string
    ): Promise<boolean> => {
      if (!contract || !isReady) {
        setError("Wallet not ready or not connected to Starknet");
        return false;
      }

      if (!name.trim()) {
        setError("Domain name cannot be empty");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await contract.set_addresses(
          name,
          starknetAddress,
          ethereumAddress
        );

        return !!result;
      } catch (err) {
        handleError(err, "Setting addresses");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, isReady]
  );

  const getDomainInfo = useCallback(
    async (name: string): Promise<DomainRecord | null> => {
      if (!contract || !isReady) {
        setError("Wallet not ready or not connected to Starknet");
        return null;
      }

      if (!name.trim()) {
        setError("Domain name cannot be empty");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await contract.get_domain_info(name);

        return {
          name: response.name,
          owner: response.owner.toString(),
          registered_at: Number(response.registered_at),
          expires_at: Number(response.expires_at),
          default_chain: response.default_chain,
          starknet_address: response.starknet_address.toString(),
          ethereum_address: response.ethereum_address.toString(),
        };
      } catch (err) {
        handleError(err, "Getting domain info");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, isReady]
  );

  // Check domain availability with caching
  const isAvailable = useCallback(
    async (name: string): Promise<boolean> => {
      if (!contract || !isReady) {
        setError("Wallet not ready or not connected to Starknet");
        return false;
      }

      if (!name.trim()) {
        setError("Domain name cannot be empty");
        return false;
      }

      const normalizedName = name.toLowerCase();
      const now = Date.now();

      // Check cache first
      const cached = availabilityCache.get(normalizedName);
      if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.value;
      }

      try {
        setError(null);
        const response = await contract.is_available(name);
        const isAvailableResult = response ?? false;

        // Update cache
        availabilityCache.set(normalizedName, {
          value: isAvailableResult,
          timestamp: now,
        });

        return isAvailableResult;
      } catch (err) {
        handleError(err, "Checking domain availability");
        return false;
      }
    },
    [contract, isReady]
  );

  // Clear cache when wallet changes
  useEffect(() => {
    availabilityCache.clear();
  }, [wallet.strkAddress]);

  const value: NameServiceContextType = {
    isReady,
    isLoading,
    error,
    registerDomain,
    isAvailable,
    getDomainInfo,
    setAddresses,
    clearError,
  };

  return (
    <NameServiceContext.Provider value={value}>
      {children}
    </NameServiceContext.Provider>
  );
}

export function useNameService() {
  const context = useContext(NameServiceContext);
  if (context === undefined) {
    throw new Error("useNameService must be used within a NameServiceProvider");
  }
  return context;
}
