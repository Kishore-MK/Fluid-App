import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers, isAddress } from 'ethers';
import { AccountInterface, Provider, uint256, Contract, Account } from 'starknet';

// Types
interface WalletData {
  strkAddress: string;
  ethAddress: string;
  strkPrivateKey: string;
  ethPrivateKey: string;
}

interface BridgeContextType {
  // Wallet state
  isConnected: boolean;
  walletData: WalletData | null;
  
  // Loading states
  isLockingETH: boolean;
  isLockingSTRK: boolean;
  isApproving: boolean;
  
  // Bridge functions
  lockETHTokens: (amount: string,toAddress: string) => Promise<string | null>;
  lockStrkTokens: (amount: string,toAddress: string) => Promise<string | null>;
  
   
  getAvailableLiquidity: () => Promise<string | null>;
  getContractBalance: () => Promise<string | null>;
  
  // Transaction history
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

interface Transaction {
  id: string;
  hash: string;
  type: 'lock_eth' | 'lock_strk';
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  sourceChain: 'ethereum' | 'starknet';
  targetChain: 'ethereum' | 'starknet';
}

// Constants
const BRIDGE_VAULT_ADDRESS = "0x547D7eA0270A66bc5411F35785Ed5e33674AA354";
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const STRK_CONTRACT_ADDRESS = "0x28c63d834c9aa17e391f7b463fe4d71e54b24e00e2896fd6b96b18c347df20c";
const STRK_RPC_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";
const ETH_RPC_URL = "https://sepolia.infura.io/v3/ac6e626c10c0408993e1f9dc777bbd18";

// ABIs
const ETH_ABI = [
  {
    type: "function",
    name: "lockTokens",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "targetChainId", type: "uint256", internalType: "uint256" },
      { name: "to", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getAvailableLiquidity",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getContractBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  }
];

const STRK_ABI = [
  {
    type: "function",
    name: "lock_tokens",
    inputs: [
      { name: "amount", type: "core::integer::u256" },
      { name: "nonce", type: "core::integer::u256" },
      { name: "target_chain_id", type: "core::integer::u256" },
      { name: "to", type: "core::starknet::contract_address::ContractAddress" },
    ],
    outputs: [],
    state_mutability: "external",
  },
  {
    type: "function",
    name: "get_available_liquidity",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  },
  {
    type: "function",
    name: "get_contract_balance",
    inputs: [],
    outputs: [{ type: "core::integer::u256" }],
    state_mutability: "view",
  }
];

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" },
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external",
  },
];

// Create Context
const BridgeContext = createContext<BridgeContextType | undefined>(undefined);

// Provider Component
export const BridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLockingETH, setIsLockingETH] = useState<boolean>(false);
  const [isLockingSTRK, setIsLockingSTRK] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize providers
  const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const strkProvider = new Provider({ nodeUrl: STRK_RPC_URL });

  // Load wallet data from memory on mount
  useEffect(() => {
    const stored = localStorage.getItem('walletData');
    if (stored) {
      const data = JSON.parse(stored); 
      
      setWalletData({strkAddress: data.strkAddress,
  ethAddress: data.ethAddress,
  strkPrivateKey: data.strkPrivateKey,
  ethPrivateKey: data.ethPrivateKey,});
      console.log("from bridge context ",walletData);
      setIsConnected(true);
    }
  }, []);

  // Utility functions
  const getRandomNonce = (): BigInt => {
    return BigInt(Date.now() + Math.floor(Math.random() * 1000));
  };

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  }, []);

  
 

  // Ethereum functions
  const lockETHTokens = useCallback(async (amount: string,toAddress: string): Promise<string | null> => {
    if (!walletData) {
      throw new Error('Wallet not loaded');
    }

    setIsLockingETH(true);
    try {
      const wallet = new ethers.Wallet(walletData.ethPrivateKey, ethProvider);
      const signer = wallet.connect(ethProvider);
      const bridgeVaultContract = new ethers.Contract(BRIDGE_VAULT_ADDRESS, ETH_ABI, signer);

      const nonce = getRandomNonce();
      const amountWei = ethers.parseEther(amount);

      const tx = await bridgeVaultContract.lockTokens(
        amountWei,
        nonce,
        11155111,  
        toAddress,
        { value: amountWei }
      );

      const transaction: Transaction = {
        id: Date.now().toString(),
        hash: tx.hash,
        type: 'lock_eth',
        amount,
        timestamp: Date.now(),
        status: 'pending',
        sourceChain: 'ethereum',
        targetChain: 'starknet'
      };

      addTransaction(transaction);

      console.log("Lock Tokens TX hash:", tx.hash);
      await tx.wait();
      console.log("Lock tokens transaction confirmed");

      // Update transaction status
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? { ...t, status: 'confirmed' } : t)
      );

      return tx.hash;
    } catch (error) {
      console.error('Error locking ETH tokens:', error);
      throw error;
    } finally {
      setIsLockingETH(false);
    }
  }, [walletData, ethProvider, addTransaction]);

  // Starknet functions
  const approveToken = useCallback(async (value: any, strkAccount: AccountInterface) => {
    setIsApproving(true);
    try {
      const tokenContract = new Contract(ERC20_ABI, STRK_TOKEN_ADDRESS, strkAccount);
      console.log("Approving BridgeVault to spend tokens...", value);
      const tx = await tokenContract.approve(STRK_CONTRACT_ADDRESS, value);
      await strkProvider.waitForTransaction(tx.transaction_hash);
      console.log("Token approval completed");
    } catch (error) {
      console.error('Error approving tokens:', error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, [strkProvider]);

  const lockStrkTokens = useCallback(async (amount: string,toAddress: string): Promise<string | null> => {
    if (!walletData) {
      throw new Error('Wallet not connected');
    }
    if (!isAddress(toAddress)) {
      throw new Error('Invalid ethereum address');
    }
    setIsLockingSTRK(true);
    try {
      const strkAccount: AccountInterface = new Account(
        strkProvider,
        walletData.strkAddress,
        walletData.strkPrivateKey
      );

      const strkContract = new Contract(STRK_ABI, STRK_CONTRACT_ADDRESS, strkAccount);
      
      console.log("Locking STRK tokens...", amount);
      const amountUint256 = uint256.bnToUint256(amount);
      const nonce = getRandomNonce();

      // First approve the tokens
      await approveToken(amountUint256, strkAccount);

      // Then lock the tokens
      const tx = await strkContract.lock_tokens(
        amountUint256,
        nonce,
        11155111, 
        toAddress
      );

      const transaction: Transaction = {
        id: Date.now().toString(),
        hash: tx.transaction_hash,
        type: 'lock_strk',
        amount,
        timestamp: Date.now(),
        status: 'pending',
        sourceChain: 'starknet',
        targetChain: 'ethereum'
      };

      addTransaction(transaction);

      await strkProvider.waitForTransaction(tx.transaction_hash);
      console.log("STRK tokens locked successfully");

      // Update transaction status
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? { ...t, status: 'confirmed' } : t)
      );

      return tx.transaction_hash;
    } catch (error) {
      console.error('Error locking STRK tokens:', error);
      throw error;
    } finally {
      setIsLockingSTRK(false);
    }
  }, [walletData, strkProvider, approveToken, addTransaction]);

  // Utility functions
  const getAvailableLiquidity = useCallback(async (): Promise<string | null> => {
    if (!walletData) return null;

    try {
      const wallet = new ethers.Wallet(walletData.ethPrivateKey, ethProvider);
      const bridgeVaultContract = new ethers.Contract(BRIDGE_VAULT_ADDRESS, ETH_ABI, wallet);
      const liquidity = await bridgeVaultContract.getAvailableLiquidity();
      return ethers.formatEther(liquidity);
    } catch (error) {
      console.error('Error getting available liquidity:', error);
      return null;
    }
  }, [walletData, ethProvider]);

  const getContractBalance = useCallback(async (): Promise<string | null> => {
    if (!walletData) return null;

    try {
      const wallet = new ethers.Wallet(walletData.ethPrivateKey, ethProvider);
      const bridgeVaultContract = new ethers.Contract(BRIDGE_VAULT_ADDRESS, ETH_ABI, wallet);
      const balance = await bridgeVaultContract.getContractBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting contract balance:', error);
      return null;
    }
  }, [walletData, ethProvider]);

  const contextValue: BridgeContextType = {
    // State
    isConnected,
    walletData,
    isLockingETH,
    isLockingSTRK,
    isApproving,
    
    // Functions
    lockETHTokens,
    lockStrkTokens, 
    getAvailableLiquidity,
    getContractBalance,
    
    // Transactions
    transactions,
    addTransaction
  };

  return (
    <BridgeContext.Provider value={contextValue}>
      {children}
    </BridgeContext.Provider>
  );
};

// Custom hook to use the bridge context
export const useBridge = (): BridgeContextType => {
  const context = useContext(BridgeContext);
  if (context === undefined) {
    throw new Error('useBridge must be used within a BridgeProvider');
  }
  return context;
};

