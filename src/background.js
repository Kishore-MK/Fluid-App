// background.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Fluid Wallet] Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Received message:', message);

  if (message.type === 'GET_WALLET_ADDRESS') {
    // Replace this with real logic
    const address = '0xabc123...';
    sendResponse({ address });
  }

  if (message.type === 'SIGN_TRANSACTION') {
    // Example: respond with a signed tx (mock)
    sendResponse({ tx: '0xFAKE_SIGNATURE' });
  }

  // must return true if sendResponse is async
  return true;
});
chrome.runtime.sendMessage({ type: 'GET_WALLET_ADDRESS' }, (response) => {
  console.log('Got address:', response.address);
});
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SAVE_MNEMONIC') {
    chrome.storage.local.set({ mnemonic: msg.mnemonic }, () => {
      sendResponse({ status: 'saved' });
    });
    return true;
  }

  if (msg.type === 'GET_MNEMONIC') {
    chrome.storage.local.get(['mnemonic'], (result) => {
      sendResponse({ mnemonic: result.mnemonic });
    });
    return true;
  }
});
