import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { generateWalletMnemonic } from '../utils/wallet';
import { createWalletFromMnemonic } from '../utils/wallet';
import { NetworkType } from '../types';

interface WalletContextType {
  isInitialized: boolean | null;
  selectedNetwork: NetworkType;
  ethAddress: string | null;
  strkAddress: string | null;
  ethBalance: string;
  strkBalance: string;
  mnemonic: string | null;
  checkWalletExists: () => void;
  createNewWallet: () => Promise<string>;
  importWallet: (mnemonic: string) => Promise<boolean>;
  switchNetwork: (network: NetworkType) => void;
  getBalance: () => Promise<void>;
  addFunds: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('ethereum');
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [strkAddress, setStrkAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [strkBalance, setStrkBalance] = useState<string>('0');
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  const checkWalletExists = useCallback(async () => {
    try {
      const walletData = localStorage.getItem('walletData');
      
      if (walletData) {
        const parsed = JSON.parse(walletData);
        setEthAddress(parsed.ethAddress);
        setStrkAddress(parsed.strkAddress);
        setMnemonic(parsed.mnemonic); // For demo only
        setIsInitialized(true);
        
        getBalance();
      } else {
        setIsInitialized(false);
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      setIsInitialized(false);
    }
  }, []);

  const createNewWallet = useCallback(async () => {
    try {
      const newMnemonic = generateWalletMnemonic();
      setMnemonic(newMnemonic);
      
      const { ethAddress: newEthAddress, strkAddress: newStrkAddress } = 
        await createWalletFromMnemonic(newMnemonic);
      
      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);
      
      localStorage.setItem('walletData', JSON.stringify({
        ethAddress: newEthAddress,
        strkAddress: newStrkAddress,
        mnemonic: newMnemonic, // For demo only
      }));
      
      setIsInitialized(true);
      return newMnemonic;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }, []);

  const importWallet = useCallback(async (userMnemonic: string) => {
    try {
      const { ethAddress: newEthAddress, strkAddress: newStrkAddress } = 
        await createWalletFromMnemonic(userMnemonic);
      
      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);
      setMnemonic(userMnemonic);
      
      localStorage.setItem('walletData', JSON.stringify({
        ethAddress: newEthAddress,
        strkAddress: newStrkAddress,
        mnemonic: userMnemonic, // For demo only
      }));
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Error importing wallet:', error);
      return false;
    }
  }, []);

  const switchNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  const getBalance = useCallback(async () => {
    try {
      setEthBalance('1.25');
      setStrkBalance('150.35');
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  const addFunds = useCallback(() => {
    console.log('Add funds to', selectedNetwork === 'ethereum' ? ethAddress : strkAddress);
  }, [selectedNetwork, ethAddress, strkAddress]);

  const value = {
    isInitialized,
    selectedNetwork,
    ethAddress,
    strkAddress,
    ethBalance,
    strkBalance,
    mnemonic,
    checkWalletExists,
    createNewWallet,
    importWallet,
    switchNetwork,
    getBalance,
    addFunds,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}