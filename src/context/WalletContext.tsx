"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { GenerateMnemonic, CreateWallet } from "../utils/starknetwallet";
import { NetworkType } from "../types";
import { ethers } from "ethers";
import { Account,  CallData, Provider as StarknetProvider } from "starknet";

const STARKNET_STRK_CONTRACT =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const STARKNET_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";

const starknetProvider = new StarknetProvider({ nodeUrl: STARKNET_RPC });

interface WalletContextType {
  isInitialized: boolean | null;
  selectedNetwork: NetworkType;
  ethAddress: string | null;
  strkAddress: string | null;
  strkPublicKey: string | null;
  ethBalance: string;
  ethBalanceInISD: string;
  strkBalance: string;
  strkBalanceInISD: string;
  mnemonic: string | null;
  checkWalletExists: () => void;
  createNewWallet: () => Promise<string>;
  importWallet: (mnemonic: string) => Promise<boolean>;
  switchNetwork: (network: NetworkType) => void;
  getBalance: (selectedNetwork: string) => Promise<void>;
  addFunds: () => void;
  estimateEthGas: (to: string, amount: string) => Promise<any>;
  estimateStrkGas: (to: string, amount: string) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>("ethereum");
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [strkAddress, setStrkAddress] = useState<string | null>(null);
  const [strkPublicKey, setStrkPublicKey] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ethBalanceInISD, setEthBalanceInISD] = useState<string>("0");
  const [strkBalance, setStrkBalance] = useState<string>("0");
  const [strkBalanceInISD, setStrkBalanceInISD] = useState<string>("0");
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  const checkWalletExists = useCallback(async () => {
    try {
      if (typeof window === "undefined") return;

      const walletData = localStorage.getItem("walletData");
      if (walletData) {
        const parsed = JSON.parse(walletData);
        (window as any).__fluidWalletEthAddress = parsed.ethAddress;
        setEthAddress(parsed.ethAddress);
        setStrkAddress(parsed.strkAddress);
        setStrkPublicKey(parsed.strkPublicKey);
        setMnemonic(parsed.mnemonic);
        setIsInitialized(true);
        await getBalance("ethereum");
      } else {
        setIsInitialized(false);
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
      setIsInitialized(false);
    }
  }, []);

  const createNewWallet = useCallback(async () => {
    try {
      const newMnemonic = (await GenerateMnemonic()) || "";
      setMnemonic(newMnemonic);

      const {
        ethAddress: newEthAddress,
        strkAddress: newStrkAddress,
        strkPublicKey,
        ethPrivateKey,
        strkPrivateKey,
      } = await CreateWallet(newMnemonic);

      setStrkPublicKey(strkPublicKey);
      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);

      localStorage.setItem(
        "walletData",
        JSON.stringify({
          ethAddress: newEthAddress,
          ethPrivateKey,
          strkAddress: newStrkAddress,
          strkPublicKey,
          strkPrivateKey,
          mnemonic: newMnemonic,
        })
      );

      setIsInitialized(true);
      return newMnemonic;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }, []);

  const importWallet = useCallback(async (userMnemonic: string) => {
    try {
      const {
        ethAddress: newEthAddress,
        strkAddress: newStrkAddress,
        strkPublicKey,
        ethPrivateKey,
        strkPrivateKey,
      } = await CreateWallet(userMnemonic);

      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);
      setStrkPublicKey(strkPublicKey);

      localStorage.setItem(
        "walletData",
        JSON.stringify({
          ethAddress: newEthAddress,
          ethPrivateKey,
          strkAddress: newStrkAddress,
          strkPublicKey,
          strkPrivateKey,
          mnemonic: userMnemonic,
        })
      );

      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Error importing wallet:", error);
      return false;
    }
  }, []);

  const switchNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  const getBalance = useCallback(
    async (selectedNetwork: string) => {
      let address: string | null = "";
      let token = null;

      if (selectedNetwork === "ethereum") {
        address = ethAddress;
        token = "eth";
      } else if (selectedNetwork === "starknet") {
        address = strkAddress;
        token = "strk";
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/get-balance?address=${address}&network=${selectedNetwork}&token=${token}`
        );
        const data = await res.json();

        if (selectedNetwork === "ethereum") {
          setEthBalance(data.balance);
          setEthBalanceInISD(data.inUsd);
        } else {
          setStrkBalance(data.balance);
          setStrkBalanceInISD(data.inUsd);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    },
    [ethAddress, strkAddress]
  );

  const addFunds = useCallback(() => {
    console.log(
      "Add funds to",
      selectedNetwork === "ethereum" ? ethAddress : strkAddress
    );
  }, [selectedNetwork, ethAddress, strkAddress]);

  // ✅ Gas Estimation for Ethereum
  const estimateEthGas = useCallback(
    async (to: string, amount: string) => {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://sepolia.infura.io/v3/ac6e626c10c0408993e1f9dc777bbd18"
        );
        const feeData = await provider.getFeeData();

        const gasLimit = await provider.estimateGas({
          to,
          from: ethAddress!,
          value: ethers.parseEther(amount),
        });

        const gasPrice = feeData.gasPrice!;
        const totalFee = gasLimit * gasPrice;

        return {
          gasPrice: ethers.formatUnits(gasPrice, "gwei"),
          gasLimit: Number(gasLimit),
          totalFee: ethers.formatEther(totalFee),
          maxFeePerGas: feeData.maxFeePerGas?.toString() || null,
          maxPriorityFeePerGas:
            feeData.maxPriorityFeePerGas?.toString() || null,
        };
      } catch (error) {
        console.error("ETH gas estimate failed:", error);
        throw error;
      }
    },
    [ethAddress]
  );

  const estimateStrkGas = useCallback(
  async (to: string, amount: string) => {
    console.log("Estimating strk gas");
    try {
      if (!strkAddress) {
        throw new Error("Starknet address not available");
      }

      const walletData = localStorage.getItem("walletData");
      if (!walletData) {
        throw new Error("Wallet data not found");
      }

      const parsed = JSON.parse(walletData);
      const strkPrivateKey = parsed.strkPrivateKey;

      if (!strkPrivateKey) {
        throw new Error("Starknet private key not found");
      }
 
      const account = new Account(
        starknetProvider,
        strkAddress,
        strkPrivateKey
      ); 
      const amountInWei = ethers.parseUnits(amount, 18);
       
      const transferCall = {
        contractAddress: STARKNET_STRK_CONTRACT,
        entrypoint: "transfer",
        calldata: CallData.compile([
          to, 
          amountInWei.toString(),  
          "0"  
        ])
      };

      console.log("Transfer call:", transferCall);

      // Estimate the fee
      const feeEstimate = await account.estimateInvokeFee([transferCall]);
      
      console.log("Fee estimate result:", feeEstimate);

      // Extract fee information
      const gasConsumed = feeEstimate.l1_gas_consumed || feeEstimate.l1_gas_consumed || 0;
      const gasPrice = feeEstimate.l2_gas_price || feeEstimate.l1_gas_price || 0;
      const overallFee = feeEstimate.overall_fee || 0;
      const suggestedMaxFee = feeEstimate.suggestedMaxFee || overallFee;

      return {
        gasPrice: gasPrice.toString(),
        gasConsumed: gasConsumed.toString(),
        totalFee: ethers.formatUnits(overallFee.toString(), 18),
        suggestedMaxFee: ethers.formatUnits(suggestedMaxFee.toString(), 18),
        overallFeeWei: overallFee.toString(),
        // Additional useful info
        resourceBounds: feeEstimate.resourceBounds || null
      };

    } catch (error) {
      console.error("STRK gas estimate failed:", error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      throw error;
    }
  },
  [strkAddress]
);

  const value: WalletContextType = {
    isInitialized,
    selectedNetwork,
    ethAddress,
    strkAddress,
    strkPublicKey,
    ethBalance,
    ethBalanceInISD,
    strkBalance,
    strkBalanceInISD,
    mnemonic,
    checkWalletExists,
    createNewWallet,
    importWallet,
    switchNetwork,
    getBalance,
    addFunds,
    estimateEthGas,
    estimateStrkGas,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
