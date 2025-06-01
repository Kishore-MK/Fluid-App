"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Account, CallData, Contract, Provider as StarknetProvider } from "starknet";
import { useWallet } from "./WalletContext";
import { FluidABI } from "../abi/FluidABI";
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
const STARKNET_STRK_CONTRACT =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const NAMESERVICE_CONTRACT_ADDRESS =
  "0x3effdfb035c4105a1e63b31eda041dddb106fd0a167b506ac4b5947677bc32f";
const STARKNET_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";
const CACHE_TTL = 30000; // 30 seconds

const starknetProvider = new StarknetProvider({ nodeUrl: STARKNET_RPC });

interface NameServiceContextType {
  registerDomain: (name: string, durationYears: number) => Promise<boolean>;
  isAvailable: (name: string) => Promise<boolean>;
  getDomainInfo: (name: string) => Promise<DomainRecord | null>;
  setAddresses: (
    name: string,
    starknetAddress: string,
    ethereumAddress: string
  ) => Promise<boolean>;
}

const NameServiceContext = createContext<NameServiceContextType | undefined>(
  undefined
);

const account = new Account(starknetProvider,strkAddress,strkPrivateKey)
const contract = new Contract(FluidABI,NAMESERVICE_CONTRACT_ADDRESS,account)
export function NameServiceProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();

  const registerDomain = useCallback(
    async (name: string, durationYears: number):Promise<boolean> => {
      const response = contract.register_domain(name, durationYears);
      return response
    },
    []
  );

  const setAddresses = useCallback(
    async (name: string, starknetAddress: string, ethereumAddress: string) => {
      const result = await contract.set_addresses(
        name,
        starknetAddress,
        ethereumAddress
      );
      return result
    },
    []
  );

  const getDomainInfo = useCallback(
    async (name: string): Promise<DomainRecord | null> => {
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
    },
    []
  );

  // Check domain availability with caching
  const isAvailable = useCallback(async (name: string): Promise<boolean> => {
    const response = await contract!.is_available(name);
    const isAvailableResult = response ?? false;

    return isAvailableResult;
  }, []);

  const value: NameServiceContextType = {
    registerDomain,
    isAvailable,
    getDomainInfo,
    setAddresses
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
