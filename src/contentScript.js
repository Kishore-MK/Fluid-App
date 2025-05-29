// src/contentScript.ts

function injectEthereumProvider() {
  if ((window).ethereum) {
    console.warn('⚠️ window.ethereum already exists. Skipping injection.');
    return;
  }

  try {
    const script = document.createElement('script');
    
    // Use dynamic base path depending on the extension API (chrome or browser)
    const extensionApi = typeof chrome !== 'undefined' ? chrome : browser;
    
    script.src = extensionApi.runtime.getURL('inpage.js'); // make sure it's .js
    script.type = 'text/javascript'; // not 'module' for max compatibility

    script.onload = () => {
      script.remove();
    };

    (document.head || document.documentElement).appendChild(script);
  } catch (error) {
    console.error('❌ Failed to inject Ethereum provider:', error);
  }
}

injectEthereumProvider();
