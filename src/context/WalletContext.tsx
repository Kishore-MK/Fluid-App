'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GenerateMnemonic , CreateWallet } from '../utils/starknetwallet';
import { NetworkType } from '../types';


interface WalletContextType {
  isInitialized: boolean | null;
  selectedNetwork: NetworkType;
  ethAddress: string | null;
  strkAddress: string | null;
  strkPublicKey:string | null;
  ethBalance: string;
  ethBalanceInISD:string,
  strkBalance: string;
  strkBalanceInISD:string,
  mnemonic: string | null;
  checkWalletExists: () => void;
  createNewWallet: () => Promise<string>;
  importWallet: (mnemonic: string) => Promise<boolean>;
  switchNetwork: (network: NetworkType) => void;
  getBalance: (selectedNetwork:string) => Promise<void>;
  addFunds: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('ethereum');
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [strkAddress, setStrkAddress] = useState<string | null>(null);
  const [strkPublicKey, setStrkPublicKey] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [ethBalanceInISD, setEthBalanceInISD] = useState<string>('0');
  const [strkBalance, setStrkBalance] = useState<string>('0');
    const [strkBalanceInISD, setStrkBalanceInISD] = useState<string>('0');
const [mnemonic, setMnemonic] = useState<string | null>(null);

  const checkWalletExists = useCallback(async () => {
  try {
    if (typeof window === 'undefined') return;

    const walletData = localStorage.getItem('walletData');
    console.log(walletData);
    
    if (walletData) {
      const parsed = JSON.parse(walletData);
       (window as any).__fluidWalletEthAddress = parsed.ethAddress;
      setEthAddress(parsed.ethAddress);
      setStrkAddress(parsed.strkAddress);
      setStrkPublicKey(parsed.strkPublicKey)
      setMnemonic(parsed.mnemonic);
      setIsInitialized(true);

      await getBalance("Ethereum"); // await this since it's async
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
      const newMnemonic =await GenerateMnemonic() || "";
      setMnemonic(newMnemonic);
      console.log(newMnemonic);
            
      const { ethAddress: newEthAddress, strkAddress: newStrkAddress ,strkPublicKey,ethPrivateKey,strkPrivateKey} = 
        await CreateWallet(newMnemonic);
      console.log("Eth address: ",newEthAddress,"Strk address: ",newStrkAddress);
      setStrkPublicKey(strkPublicKey)
      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);
      
      localStorage.setItem('walletData', JSON.stringify({
        ethAddress: newEthAddress,
        ethPrivateKey:ethPrivateKey,
        strkAddress: newStrkAddress,
        strkPrivateKey:strkPrivateKey,
        mnemonic: newMnemonic, 
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
      const { ethAddress: newEthAddress, strkAddress: newStrkAddress ,strkPublicKey,ethPrivateKey,strkPrivateKey} = 
        await CreateWallet(userMnemonic);
      console.log("Eth address: ",newEthAddress,"Strk address: ",newStrkAddress);
      
      setEthAddress(newEthAddress);
      setStrkAddress(newStrkAddress);
      setStrkPublicKey(strkPublicKey)
      localStorage.setItem('walletData', JSON.stringify({
        ethAddress: newEthAddress,
        ethPrivateKey:ethPrivateKey,
        strkAddress: newStrkAddress,
        strkPublicKey:strkPublicKey,
        strkPrivateKey:strkPrivateKey,
        mnemonic: userMnemonic, 
      }));
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Error importing wallet:', error);
      return false;
    }
  }, []);
// {"ethAddress":"0x393E15917CD21FBd3a71a5f1269334f3fd620869","strkAddress":"0x49626b8e180e55e3e675a15eff4fbb0c3d1d23c54c86ae5b447c1351a7a5d8e","mnemonic":""}
  const switchNetwork = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
  }, []);

  const getBalance = useCallback(async (selectedNetwork:string) => {
    let address:string | null= ""
    let token=null
  if (selectedNetwork=="ethereum"){
     address=ethAddress;
     token="eth"
  }
  if (selectedNetwork=="starknet"){
     address=strkAddress;
     token="strk"
  };

  try {
    const res = await fetch(`http://localhost:3000/api/get-balance?address=${address}&network=${selectedNetwork}&token=${token}`);
    const data = await res.json(); 
    setEthBalance(data.balance);
    setEthBalanceInISD(data.inUsd)
    setStrkBalance(data.balance);
     setStrkBalanceInISD(data.inUsd) // Simulated
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}, [ethAddress]);


  const addFunds = useCallback(() => {
    console.log('Add funds to', selectedNetwork === 'ethereum' ? ethAddress : strkAddress);
  }, [selectedNetwork, ethAddress, strkAddress]);

  const value = {
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