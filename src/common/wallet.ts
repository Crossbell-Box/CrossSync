import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream';

// https://github.com/MetaMask/extension-provider/blob/master/config.json
function getMetaMaskId() {
    if (window.navigator.userAgent.indexOf('Firefox') > -1) {
        return 'webextension@metamask.io';
    } else {
        return 'nkbihfbeogaeaoehlefnkodbefgpgknn';
    }
}

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                3737: 'https://rpc.crossbell.io',
            },
            bridge: 'https://wcrv2.rss3.dev',
        },
    },
};

const web3Modal = new Web3Modal({
    network: 'crossbell', // optional
    cacheProvider: true, // optional
    providerOptions, // required
});

export async function connect(force = false) {
    if (chrome?.runtime?.id) {
        if (!window.ethereum) {
            const metamaskPort: any = chrome.runtime.connect(getMetaMaskId());
            const pluginStream: any = new PortStream(metamaskPort);
            initializeProvider({
                connectionStream: pluginStream,
            });
        }

        if (force) {
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
        }

        return window.ethereum;
    } else {
        if (force) {
            return await web3Modal.connect();
        } else {
            if (web3Modal.cachedProvider) {
                try {
                    return await web3Modal.connect();
                } catch (e) {
                    throw e;
                }
            }
            return null;
        }
    }
}

export async function disconnect() {
    if (!window.chrome?.runtime?.id) {
        await web3Modal.clearCachedProvider();
    }
}
