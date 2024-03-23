import Web3 from 'web3';

const getWeb3 = async () => {
  // Modern dapp browsers
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      return web3;
    } catch (error) {
      throw new Error('User denied account access');
    }
  }
  // Legacy dapp browsers
  else if (window.web3) {
    const web3 = new Web3(window.web3.currentProvider);
    return web3;
  }
  // Non-dapp browsers
  else {
    throw new Error('Non-Ethereum browser detected. You should use MetaMask!');
  }
};

export default getWeb3;
