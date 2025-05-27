import { generateMnemonic as generateMnemonicBip39, mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { privateKeyToAccount } from 'viem/accounts';
import { toHex } from 'viem';
import { wordlist } from '@scure/bip39/wordlists/english';

// This is a simplified implementation for demo purposes
// In a production wallet, you'd use more secure methods and proper key derivation paths

export async function createWalletFromMnemonic(mnemonic: string) {
  try {
    // Generate seed from mnemonic
    const seed = mnemonicToSeedSync(mnemonic, '');
    
    // Create HD wallet
    const hdkey = HDKey.fromMasterSeed(seed);
    
    // Derive Ethereum private key (using BIP44)
    // m/44'/60'/0'/0/0 is the standard derivation path for Ethereum
    const ethChild = hdkey.derive("m/44'/60'/0'/0/0");
    
    if (!ethChild.privateKey) {
      throw new Error('Failed to derive Ethereum private key');
    }
    
    const ethPrivateKey = toHex(ethChild.privateKey);
    
    // Create Ethereum account
    const ethAccount = privateKeyToAccount(ethPrivateKey);
    const ethAddress = ethAccount.address;
    
    // For Starknet, we're simplifying and using a similar approach
    // In reality, Starknet uses different key derivation
    // This is just for demonstration
    const strkChild = hdkey.derive("m/44'/9004'/0'/0/0");
    
    if (!strkChild.privateKey) {
      throw new Error('Failed to derive Starknet private key');
    }
    
    const strkPrivateKey = toHex(strkChild.privateKey);
    
    // Generate Starknet address (simplified for demo)
    const strkAddress = `0x${strkPrivateKey.slice(2, 42)}`;
    
    return {
      ethAddress,
      strkAddress,
      ethPrivateKey,
      strkPrivateKey
    };
  } catch (error) {
    console.error('Error creating wallet from mnemonic:', error);
    throw error;
  }
}

export function generateWalletMnemonic() {
  // Generate a new 12-word mnemonic phrase
  return generateMnemonicBip39(wordlist);
}

export function shortenAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
}