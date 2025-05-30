import { AccountInterface, Provider, uint256 } from "starknet";

import { Account, Contract } from "starknet";
// vite-compatible import

const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export const STRK_CONTRACT_ADDRESS =
  "0x28c63d834c9aa17e391f7b463fe4d71e54b24e00e2896fd6b96b18c347df20c";
const STRK_RPC_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8";

export const STRK_provider = new Provider({ nodeUrl: STRK_RPC_URL });
const Strk_abi = {
  abi: [
    {
      type: "impl",
      name: "BridgeVaultImpl",
      interface_name: "contracts::BridgeVault::IBridgeVault",
    },
    {
      type: "struct",
      name: "core::integer::u256",
      members: [
        {
          name: "low",
          type: "core::integer::u128",
        },
        {
          name: "high",
          type: "core::integer::u128",
        },
      ],
    },
    {
      type: "enum",
      name: "core::bool",
      variants: [
        {
          name: "False",
          type: "()",
        },
        {
          name: "True",
          type: "()",
        },
      ],
    },
    {
      type: "interface",
      name: "contracts::BridgeVault::IBridgeVault",
      items: [
        {
          type: "function",
          name: "lock_tokens",
          inputs: [
            {
              name: "amount",
              type: "core::integer::u256",
            },
            {
              name: "nonce",
              type: "core::integer::u256",
            },
            {
              name: "target_chain_id",
              type: "core::integer::u256",
            },
            {
              name: "to",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "unlock_tokens",
          inputs: [
            {
              name: "public_key",
              type: "core::felt252",
            },
            {
              name: "to",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "message_hash",
              type: "core::felt252",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
            {
              name: "nonce",
              type: "core::integer::u256",
            },
            {
              name: "source_chain_id",
              type: "core::integer::u256",
            },
            {
              name: "signature_r",
              type: "core::felt252",
            },
            {
              name: "signature_s",
              type: "core::felt252",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "add_liquidity",
          inputs: [
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "remove_liquidity",
          inputs: [
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "set_other_chain_contract",
          inputs: [
            {
              name: "other_chain_contract",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "get_other_chain_contract",
          inputs: [],
          outputs: [
            {
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "set_relayer_status",
          inputs: [
            {
              name: "relayer",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "authorized",
              type: "core::bool",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "pause",
          inputs: [],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "unpause",
          inputs: [],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "get_token_contract",
          inputs: [],
          outputs: [
            {
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "get_chain_id",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "get_owner",
          inputs: [],
          outputs: [
            {
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "get_available_liquidity",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "get_contract_balance",
          inputs: [],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "is_nonce_processed",
          inputs: [
            {
              name: "user",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "nonce",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "get_locked_balance",
          inputs: [
            {
              name: "user",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::integer::u256",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "is_authorized_relayer",
          inputs: [
            {
              name: "relayer",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "transfer_ownership",
          inputs: [
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
      ],
    },
    {
      type: "constructor",
      name: "constructor",
      inputs: [
        {
          name: "token",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "initial_owner",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "chain_id",
          type: "core::integer::u256",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::TokensLocked",
      kind: "struct",
      members: [
        {
          name: "user",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "amount",
          type: "core::integer::u256",
          kind: "data",
        },
        {
          name: "to",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "data",
        },
        {
          name: "nonce",
          type: "core::integer::u256",
          kind: "data",
        },
        {
          name: "chain_id",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::TokensUnlocked",
      kind: "struct",
      members: [
        {
          name: "to",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "amount",
          type: "core::integer::u256",
          kind: "data",
        },
        {
          name: "nonce",
          type: "core::integer::u256",
          kind: "data",
        },
        {
          name: "source_chain_id",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::LiquidityAdded",
      kind: "struct",
      members: [
        {
          name: "amount",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::LiquidityRemoved",
      kind: "struct",
      members: [
        {
          name: "amount",
          type: "core::integer::u256",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::RelayerStatusChanged",
      kind: "struct",
      members: [
        {
          name: "relayer",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "authorized",
          type: "core::bool",
          kind: "data",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::OwnershipTransferred",
      kind: "struct",
      members: [
        {
          name: "previous_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
        {
          name: "new_owner",
          type: "core::starknet::contract_address::ContractAddress",
          kind: "key",
        },
      ],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::Paused",
      kind: "struct",
      members: [],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::Unpaused",
      kind: "struct",
      members: [],
    },
    {
      type: "event",
      name: "contracts::BridgeVault::BridgeVault::Event",
      kind: "enum",
      variants: [
        {
          name: "TokensLocked",
          type: "contracts::BridgeVault::BridgeVault::TokensLocked",
          kind: "nested",
        },
        {
          name: "TokensUnlocked",
          type: "contracts::BridgeVault::BridgeVault::TokensUnlocked",
          kind: "nested",
        },
        {
          name: "LiquidityAdded",
          type: "contracts::BridgeVault::BridgeVault::LiquidityAdded",
          kind: "nested",
        },
        {
          name: "LiquidityRemoved",
          type: "contracts::BridgeVault::BridgeVault::LiquidityRemoved",
          kind: "nested",
        },
        {
          name: "RelayerStatusChanged",
          type: "contracts::BridgeVault::BridgeVault::RelayerStatusChanged",
          kind: "nested",
        },
        {
          name: "OwnershipTransferred",
          type: "contracts::BridgeVault::BridgeVault::OwnershipTransferred",
          kind: "nested",
        },
        {
          name: "Paused",
          type: "contracts::BridgeVault::BridgeVault::Paused",
          kind: "nested",
        },
        {
          name: "Unpaused",
          type: "contracts::BridgeVault::BridgeVault::Unpaused",
          kind: "nested",
        },
      ],
    },
  ],
};

export const STRK_contract = new Contract(
  Strk_abi.abi,
  STRK_CONTRACT_ADDRESS,
  STRK_provider
);
async function loadWallet(){

const wallet = localStorage.getItem("walletData");
if (!wallet) {
  return null
}
console.log(wallet);

const parsed = JSON.parse(wallet || "");

const STRK_ACCOUNT_ADDRESS = parsed.strkAddress;
const ETH_ADDRESS:string = parsed.ethAddress;
const STRK_PRIVATE_KEY = parsed.strkPrivateKey;
const STRK_account:AccountInterface = new Account(
  STRK_provider,
  STRK_ACCOUNT_ADDRESS!,
  STRK_PRIVATE_KEY!
);
return {STRK_account,ETH_ADDRESS}
}


const erc20Abi = [
  {
    name: "approve",
    type: "function",
    inputs: [
      {
        name: "spender",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "amount", type: "core::integer::u256" },
    ],
    outputs: [{ type: "core::bool" }],
    state_mutability: "external",
  },
];



const provider = STRK_provider;
const contract = STRK_contract;


export async function approveToken(value: any,STRK_account:any) {
    const tokenContract = new Contract(erc20Abi, STRK_TOKEN_ADDRESS, STRK_account);
  console.log("Approving BridgeVault to spend tokens...", value);
  const tx = await tokenContract.approve(STRK_CONTRACT_ADDRESS, value);
  await provider.waitForTransaction(tx.transaction_hash);
  console.log("Approved.");
}
async function getRandomNonce() {
  return BigInt(Date.now());
}

// export async function getContractBalance() {
//   const balance = await contract.get_contract_balance();
//   console.log("Contract balance:", balance);
// }

export async function lockStrkTokens(value: any) {
    const {STRK_account,ETH_ADDRESS}=await loadWallet()||{}
    if(STRK_account && ETH_ADDRESS){
STRK_contract.connect(STRK_account);
  console.log("Locking tokens...", value);
  const amount = uint256.bnToUint256(value);
  const nonce = await getRandomNonce();
  console.log(amount, nonce, 11155111, ETH_ADDRESS);
  await approveToken(amount,STRK_account);

  const tx = await contract.lock_tokens(amount, nonce, 11155111, ETH_ADDRESS);
  await provider.waitForTransaction(tx.transaction_hash);
  console.log("Tokens locked.");
  return tx.transaction_hash;
    }
    console.log("Cannot lock strk tokens");
    
}

export async function getLockedBalance(user: string) {
  const result = await contract.get_locked_balance(user);
  console.log("Locked balance:", result);
}
