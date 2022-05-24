import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import createMetaMaskProvider from 'metamask-extension-provider';

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

let metaMaskProvider: ReturnType<typeof createMetaMaskProvider>;

export async function connect(force = false) {
    if (window.chrome?.runtime?.id) {
        if (!metaMaskProvider) {
            metaMaskProvider = createMetaMaskProvider();
        }

        if (force) {
            await metaMaskProvider.request({
                method: 'wallet_requestPermissions',
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
        }

        return metaMaskProvider;
    } else {
        if (force) {
            return await web3Modal.connect();
        } else {
            if (web3Modal.cachedProvider) {
                try {
                    return await web3Modal.connect();
                } catch (e) {
                    // console.log(e);
                    throw e;
                    // return null;
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
