export type NetworkType = 'ethereum' | 'starknet';

export interface Transaction {
  hash: string;
  amount: string;
  to: string;
  from: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'send' | 'receive';
}

export interface WalletData {
  ethAddress: string;
  strkAddress: string;
  encryptedMnemonic?: string;
}