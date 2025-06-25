# Fluid Wallet 🌊

**A Cross-Chain Cryptocurrency Wallet for Ethereum and Starknet**

Fluid Wallet is a powerful, cross-chain cryptocurrency wallet designed to manage and bridge assets between Ethereum and Starknet networks seamlessly. Built as a browser extension, it provides a user-friendly interface for managing wallet addresses, executing transactions, and interacting with blockchain features.

## ✨ Features

### 🔗 Multi-Chain Support
- **Ethereum Integration**: Full support for Ethereum Sepolia testnet
- **Starknet Integration**: Native Starknet wallet functionality
- **Seamless Network Switching**: Toggle between networks with one click

### 🔐 Wallet Management
- **Create New Wallets**: Generate secure wallets with BIP39 mnemonic phrases
- **Import Existing Wallets**: Restore wallets using mnemonic phrases
- **Secure Storage**: Local encrypted storage of wallet data
- **Backup & Recovery**: Export wallet for secure backup

### 💸 Transaction Features
- **Send & Receive**: Transfer ETH and STRK tokens
- **Transaction History**: View detailed transaction logs with explorer links
- **Real-time Balances**: Live balance updates in both crypto and USD
- **Gas Estimation**: Accurate gas fee calculations

### 🌉 Cross-Chain Bridge
- **Ethereum ↔ Starknet Bridge**: Bridge assets between networks
- **Real-time Bridge Status**: Track bridge transaction progress
- **Bridge History**: Monitor all bridging activities

### 🏷️ Domain Name Service
- **Starknet Name Service Integration**: Register and manage .stark domains
- **Domain Status Display**: Visual indicators for domain registration status
- **Reverse Lookup**: Display domain names instead of addresses

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Modern web browser (Chrome, Firefox, Edge)

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone http://localhost:5173/
   cd Fluid-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

4. **Build for production**:
   ```bash
   npm run build
   ```

### Browser Extension Installation

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome/Edge**:
   - Open `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

3. **Load in Firefox**:
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `dist` folder

## 📱 Usage Guide

### Getting Started

#### Creating Your First Wallet

1. **Launch Fluid Wallet** from your browser extensions
2. Click **"Create New Wallet"**
3. **Securely save your mnemonic phrase** - this is your master key!
4. Confirm your mnemonic by entering the words in order
5. Set up wallet name and preferences

#### Importing an Existing Wallet

1. Click **"Import Wallet"** on the welcome screen
2. Enter your 12-word mnemonic phrase
3. Wallet will be restored with all associated addresses

### Core Features

#### Managing Networks

- **Switch Networks**: Click the network selector in the header
- **View Balances**: Balances update automatically when switching
- **Network Status**: Visual indicators show current network

#### Sending Transactions

1. Navigate to **Dashboard** and click **"Send"**
2. Select recipient (address or domain name)
3. Enter amount to send
4. Review gas fees and confirm transaction
5. Track status in transaction history

#### Receiving Funds

1. Click **"Receive"** on the dashboard
2. Share your address or QR code
3. Copy address to clipboard for easy sharing

#### Bridging Assets

1. Navigate to **"Bridge"** from action buttons
2. Select source and destination networks
3. Enter amount to bridge
4. Confirm bridge transaction
5. Monitor progress in bridge status panel

#### Domain Management

1. **Register Domain**: Click the warning icon next to unregistered domains
2. **Choose Duration**: Select registration period (1-5 years)
3. **Pay Fees**: Confirm STRK payment for registration
4. **Manage Domains**: View status in network selector

### Advanced Features

#### Transaction History

- **View Recent Transactions**: Dashboard shows last 5 transactions
- **Explorer Links**: Click transaction IDs to view on block explorer
- **Filter by Network**: History updates based on selected network
- **Transaction Details**: See amounts, fees, and timestamps

#### Wallet Backup

1. Go to **Settings** → **"Backup Wallet"**
2. Verify identity with password/biometric
3. Securely copy and store mnemonic phrase
4. Never share your mnemonic with anyone!

## 🔧 Configuration

### Network Endpoints

```typescript
// Ethereum Sepolia
ETH_RPC_URL = "https://sepolia.infura.io/v3/YOUR_API_KEY"

// Starknet Sepolia
STARKNET_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_8"
```

### API Configuration

```typescript
// Development
API_BASE_URL = "http://localhost:3000"

// Production
API_BASE_URL = ""
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_INFURA_API_KEY=your_infura_api_key
VITE_API_BASE_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

## 🛡️ Security

### Best Practices

- **Mnemonic Security**: Store mnemonic phrases securely offline
- **Local Storage**: Sensitive data encrypted in browser storage
- **Network Safety**: Only connect to verified RPC endpoints
- **Transaction Verification**: Always verify transaction details

### Security Features

- ✅ BIP39 compliant mnemonic generation
- ✅ Hierarchical deterministic (HD) wallet structure
- ✅ Local encryption of private keys
- ✅ Secure random number generation
- ✅ Transaction signing in isolated context

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and add tests
4. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Ensure responsive design compatibility

### Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build
```

## 🔗 Links

- **Ethereum Sepolia Explorer**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Starknet Sepolia Explorer**: [https://sepolia.starkscan.co](https://sepolia.starkscan.co)
- **Starknet Documentation**: [https://docs.starknet.io](https://docs.starknet.io)
- **Report Issues**: [GitHub Issues](https://github.com/your-repo/issues)



**⚠️ Disclaimer**: Fluid Wallet is experimental software. Always test with small amounts on testnets before using on mainnet. Never share your mnemonic phrase with anyone.

**Built with ❤️ for the decentralized web**

