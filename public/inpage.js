class FluidWallet {
  get selectedAddress() {
    return window.__fluidWalletEthAddress || null;
  }

  get chainId() {
    return '11155111'; // Replace with actual chain if needed
  }

  request({ method, params }) {
    switch (method) {
      case 'eth_requestAccounts':
        return Promise.resolve(this.selectedAddress ? [this.selectedAddress] : []);
      case 'eth_accounts':
        return Promise.resolve(this.selectedAddress ? [this.selectedAddress] : []);
      case 'eth_chainId':
        return Promise.resolve(this.chainId);
      default:
        return Promise.reject(new Error(`Method ${method} not supported`));
    }
  }
}

window.ethereum = new FluidWallet();
