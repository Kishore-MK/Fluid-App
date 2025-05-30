import { ec, hash, CallData, Account, Provider } from "starknet";
import { HDNodeWallet, Mnemonic } from "ethers";
import { STRK_provider } from "./strkbridge";

 const argentXproxyClassHash =
    "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
  const argentXaccountClassHash =
    "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

export async function GenerateMnemonic() {
  const mnemonic = HDNodeWallet.createRandom();

  console.log("Mnemonic Phrase:", mnemonic);
  return mnemonic.mnemonic?.phrase;
}

export async function CreateWallet(mnemonic: string) {
  const Newmnemonic = Mnemonic.fromPhrase(mnemonic);
  const hdWallet = HDNodeWallet.fromMnemonic(Newmnemonic, "m/44'/60'/0'/0/0");
  let privateKey = hdWallet.privateKey;
  privateKey = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;

  const { starknetaddress, starkKeyPubAX, starkPrivateKey } =
    await CreateStarknetKeys(privateKey);
  return {
    ethAddress: hdWallet.address,
    strkAddress: starknetaddress,
    strkPublicKey: starkKeyPubAX,
    ethPrivateKey: privateKey,
    strkPrivateKey: starkPrivateKey,
  };
}

export async function CreateStarknetKeys(privateKey: string) {
  const STARKNET_CURVE_ORDER = BigInt(
    "3618502788666131213697322783095070105526743751716087489154079457884512865583"
  );
  const privateKeyBigInt = BigInt("0x" + privateKey);
  const validPrivateKeyBigInt = privateKeyBigInt % STARKNET_CURVE_ORDER;
  const finalPrivateKeyBigInt =
    validPrivateKeyBigInt === 0n ? 1n : validPrivateKeyBigInt;

  const starkPrivateKey =
    "0x" + finalPrivateKeyBigInt.toString(16).padStart(64, "0");
  console.log("AX_ACCOUNT_PRIVATE_KEY=", starkPrivateKey);

  const starkKeyPubAX = ec.starkCurve.getStarkKey(starkPrivateKey);
  const starknetaddress = await PrecalculateStarknetAccount(starkKeyPubAX);
  console.log("AX_ACCOUNT_PUBLIC_KEY=", starknetaddress);
  return {
    starknetaddress,
    starkKeyPubAX,
    starkPrivateKey,
  };
}

export async function PrecalculateStarknetAccount(starkKeyPubAX: string) {
  // Calculate future address of the ArgentX account
  const AXproxyConstructorCallData = CallData.compile({
    implementation: argentXaccountClassHash,
    selector: hash.getSelectorFromName("initialize"),
    calldata: CallData.compile({ signer: starkKeyPubAX, guardian: "0" }),
  });
  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    argentXproxyClassHash,
    AXproxyConstructorCallData,
    0
  );
  console.log("Precalculated account address=", AXcontractAddress);
  return AXcontractAddress;
}

export async function deployStarknetAccount() {
  const wallet = localStorage.getItem("walletData");

  const parsed = await JSON.parse(wallet || "");

  const STRK_PUBLIC_KEY = parsed.strkPublicKey;
  const ACCOUNT_ADDRESS = parsed.strkAddress;
  const STRK_PRIVATE_KEY = parsed.strkPrivateKey;
  console.log(
    STRK_PUBLIC_KEY,
    "Account",
    ACCOUNT_ADDRESS,
    "Privatekey",
    STRK_PRIVATE_KEY
  );
  console.log("deploying account..");
  const provider = new Provider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_8",
  });
 
  const accountAX = new Account(provider, ACCOUNT_ADDRESS, STRK_PRIVATE_KEY);
  const AXproxyConstructorCallData = CallData.compile({
    implementation: argentXaccountClassHash,
    selector: hash.getSelectorFromName("initialize"),
    calldata: CallData.compile({ signer: STRK_PUBLIC_KEY, guardian: "0" }),
  });
  const deployAccountPayload = {
    classHash: argentXproxyClassHash,
    constructorCalldata: AXproxyConstructorCallData,
    contractAddress: ACCOUNT_ADDRESS,
    addressSalt: STRK_PUBLIC_KEY,
  };

  const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
    await accountAX.deployAccount(deployAccountPayload);
  console.log("✅ ArgentX wallet deployed at:", AXcontractFinalAddress);

  return AXdAth;
}
export async function isAccountDeployed(address: string): Promise<boolean> {
  try {
    await STRK_provider.getClassHashAt(address);
    return true;
  } catch (error: any) {
    if (error.message.includes("Contract not found")) {
      console.log("Not deployed");

      return false; // Not deployed
    }
    throw error; // Re-throw if it's another error
  }
}
export function shortenAddress(address: string | null) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string) {
  const num = parseFloat(balance);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}
