import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                1: 'https://cloudflare-eth.com',
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

export async function disconnect() {
    await web3Modal.clearCachedProvider();
}
